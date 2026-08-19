import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPlan, PlanKey } from "@/lib/plans";
import { shouldApplySupplement, PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR } from "@/lib/propFirmSupplement";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const CGV_VERSION = "1.0";

// Construit les line_items Stripe pour un plan donné, en ajoutant
// automatiquement le Supplément Grande Allocation si le client a déclaré un
// compte Prop Firm Funded avec un capital >= 80 000€ (voir
// lib/propFirmSupplement.ts). Ne bloque jamais la vente si la variable d'env
// du supplément manque — la correction se fait après coup via /admin.
async function buildLineItems(
  userId: string,
  planKey: string,
  priceId: string
): Promise<{ lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]; supplementApplied: boolean }> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceId, quantity: 1 },
  ];

  const { data: declaredAccount } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("status, capital")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let supplementApplied = false;

  if (declaredAccount && shouldApplySupplement(declaredAccount.status, Number(declaredAccount.capital))) {
    const supplementEnvVar = PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR[planKey as PlanKey];
    const supplementPriceId = supplementEnvVar ? process.env[supplementEnvVar] : undefined;
    if (supplementPriceId) {
      lineItems.push({ price: supplementPriceId, quantity: 1 });
      supplementApplied = true;
    }
  }

  return { lineItems, supplementApplied };
}

// Utilisée par ConsentForm.tsx (page /paiement) : enregistre le consentement
// légal (CGV + renoncement au droit de rétractation, IP, user-agent, texte
// exact accepté) AVANT de créer la session Stripe, puis retourne l'URL de
// paiement au client.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { plan: planKey, cgvAccepted, rightsWaiverAccepted, cgvText, rightsWaiverText } = body;

  if (!cgvAccepted || !rightsWaiverAccepted) {
    return NextResponse.json(
      { ok: false, message: "consent_required" },
      { status: 400 }
    );
  }

  const plan = getPlan(planKey);
  if (!plan) {
    return NextResponse.json({ ok: false, message: "invalid_plan" }, { status: 400 });
  }

  const priceId = process.env[plan.stripePriceEnvVar];
  if (!priceId) {
    return NextResponse.json(
      { ok: false, message: `missing_env_var:${plan.stripePriceEnvVar}` },
      { status: 500 }
    );
  }

  const { lineItems, supplementApplied } = await buildLineItems(user.id, planKey, priceId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: planKey, propFirmSupplementApplied: String(supplementApplied) },
    subscription_data: { metadata: { plan: planKey, propFirmSupplementApplied: String(supplementApplied) } },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mon-espace?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?checkout=cancelled`,
  });

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  await supabaseAdmin.from("legal_consents").insert({
    user_id: user.id,
    plan: planKey,
    cgv_accepted: cgvAccepted,
    rights_waiver_accepted: rightsWaiverAccepted,
    cgv_text: cgvText ?? null,
    rights_waiver_text: rightsWaiverText ?? null,
    cgv_version: CGV_VERSION,
    ip_address: ipAddress,
    user_agent: userAgent,
    stripe_session_id: session.id,
  });

  await supabaseAdmin.from("checkout_attempts").insert({
    user_id: user.id,
    stripe_session_id: session.id,
  });

  return NextResponse.json({ ok: true, url: session.url });
}

// Conservée pour compatibilité (liens directs /api/checkout?plan=xxx sans
// passer par la page de consentement) — même logique de supplément, mais
// sans enregistrement de consentement puisqu'aucun formulaire n'est passé
// par ce chemin.
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const planKey = req.nextUrl.searchParams.get("plan") || "monthly";
  const plan = getPlan(planKey);
  if (!plan) {
    return NextResponse.json({ ok: false, message: "invalid_plan" }, { status: 400 });
  }

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", `/api/checkout?plan=${planKey}`);
    return NextResponse.redirect(url);
  }

  const priceId = process.env[plan.stripePriceEnvVar];
  if (!priceId) {
    return NextResponse.json(
      { ok: false, message: `missing_env_var:${plan.stripePriceEnvVar}` },
      { status: 500 }
    );
  }

  const { lineItems, supplementApplied } = await buildLineItems(user.id, planKey, priceId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: planKey, propFirmSupplementApplied: String(supplementApplied) },
    subscription_data: { metadata: { plan: planKey, propFirmSupplementApplied: String(supplementApplied) } },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mon-espace?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?checkout=cancelled`,
  });

  await supabaseAdmin.from("checkout_attempts").insert({
    user_id: user.id,
    stripe_session_id: session.id,
  });

  return NextResponse.redirect(session.url!);
}
