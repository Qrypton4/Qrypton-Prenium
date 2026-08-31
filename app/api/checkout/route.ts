import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPlan, PlanKey } from "@/lib/plans";
import { getPropFirmPlan } from "@/lib/propFirmPlans";
import { isSalesOpen, SALES_CLOSED_MESSAGE } from "@/lib/launch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const CGV_VERSION = "1.0";

// Construit les line_items Stripe pour un plan donné.
function buildLineItems(priceId: string): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return [{ price: priceId, quantity: 1 }];
}

// Utilisée par ConsentForm.tsx (page /paiement) : enregistre le consentement
// légal (CGV + renoncement au droit de rétractation, IP, user-agent, texte
// exact accepté) AVANT de créer la session Stripe, puis retourne l'URL de
// paiement au client.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isSalesOpen(user?.email)) {
    return NextResponse.json({ ok: false, message: SALES_CLOSED_MESSAGE }, { status: 403 });
  }
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

  const plan = getPlan(planKey) || getPropFirmPlan(planKey);
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

  const lineItems = buildLineItems(priceId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: planKey },
    subscription_data: { metadata: { plan: planKey } },
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
// passer par la page de consentement), sans enregistrement de consentement
// puisqu'aucun formulaire n'est passé par ce chemin.
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isSalesOpen(user?.email)) {
    return NextResponse.json({ ok: false, message: SALES_CLOSED_MESSAGE }, { status: 403 });
  }

  const planKey = req.nextUrl.searchParams.get("plan") || "monthly";
  const plan = getPlan(planKey) || getPropFirmPlan(planKey);
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

  const lineItems = buildLineItems(priceId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: planKey },
    subscription_data: { metadata: { plan: planKey } },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mon-espace?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?checkout=cancelled`,
  });

  await supabaseAdmin.from("checkout_attempts").insert({
    user_id: user.id,
    stripe_session_id: session.id,
  });

  return NextResponse.redirect(session.url!);
}
