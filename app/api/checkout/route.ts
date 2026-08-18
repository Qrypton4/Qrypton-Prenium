import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CGV_VERSION = "2026-08-18";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { plan: planKey, cgvAccepted, rightsWaiverAccepted, cgvText, rightsWaiverText } = body;

  if (!cgvAccepted || !rightsWaiverAccepted) {
    return NextResponse.json({ ok: false, message: "consent_required" }, { status: 400 });
  }

  const plan = getPlan(planKey || "monthly");
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

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") || null;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { plan: plan.key },
    subscription_data: { metadata: { plan: plan.key } },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mon-espace?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?checkout=cancelled`,
  });

  await supabaseAdmin.from("legal_consents").insert({
    user_id: user.id,
    plan: plan.key,
    cgv_accepted: true,
    rights_waiver_accepted: true,
    cgv_text: cgvText,
    rights_waiver_text: rightsWaiverText,
    cgv_version: CGV_VERSION,
    ip_address: ip,
    user_agent: userAgent,
    stripe_session_id: session.id,
  });

  await supabaseAdmin.from("checkout_attempts").insert({
    user_id: user.id,
    stripe_session_id: session.id,
  });

  return NextResponse.json({ ok: true, url: session.url });
}

export async function GET(req: NextRequest) {
  // L'ancien accès direct est désormais bloqué : le paiement doit passer par
  // /paiement pour garantir le recueil du consentement CGV / droit de rétractation.
  const planKey = req.nextUrl.searchParams.get("plan") || "monthly";
  const url = req.nextUrl.clone();
  url.pathname = "/paiement";
  url.search = `?plan=${planKey}`;
  return NextResponse.redirect(url);
}
