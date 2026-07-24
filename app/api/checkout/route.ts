import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";

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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: planKey },
    subscription_data: { metadata: { plan: planKey } },
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
