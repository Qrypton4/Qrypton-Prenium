import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPlan, PlanKey } from "@/lib/plans";
import { shouldApplySupplement, PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR } from "@/lib/propFirmSupplement";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  // Cas 2 du brief Grande Allocation : si le client a déclaré un compte Prop
  // Firm déjà Funded (≥80k) avant paiement, le supplément est ajouté dès le
  // checkout, sur la même facture — pas d'étape séparée après coup. La
  // déclaration reste "verified: false" jusqu'à vérification manuelle.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceId, quantity: 1 },
  ];

  const { data: declaredAccount } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("status, capital")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let supplementApplied = false;

  if (declaredAccount && shouldApplySupplement(declaredAccount.status, Number(declaredAccount.capital))) {
    const supplementEnvVar = PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR[planKey as PlanKey];
    const supplementPriceId = process.env[supplementEnvVar];
    if (supplementPriceId) {
      lineItems.push({ price: supplementPriceId, quantity: 1 });
      supplementApplied = true;
    }
    // Si la variable d'env du supplément n'est pas encore configurée, on
    // laisse passer le checkout SANS supplément plutôt que de bloquer la
    // vente — la correction se fera après coup via /admin, comme pour
    // toute vérification manuelle.
  }

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

  // Enregistre la tentative pour permettre les relances automatiques si le
  // paiement n'est jamais finalisé (voir /api/cron/abandoned-checkout).
  await supabaseAdmin.from("checkout_attempts").insert({
    user_id: user.id,
    stripe_session_id: session.id,
  });

  return NextResponse.redirect(session.url!);
}
