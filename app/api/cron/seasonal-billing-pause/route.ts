// app/api/cron/seasonal-billing-pause/route.ts
// À appeler une fois par jour (voir vercel.json). Ne fait quelque chose que
// deux jours dans l'année :
// - 1er août : met en pause le prélèvement Stripe des abonnés MENSUELS
// (le robot est lui-même en pause, pas de raison de facturer).
// - 1er octobre : reprend le prélèvement normalement.
// Les formules 6 et 12 mois ne sont pas concernées : leur licence est déjà
// prolongée d'autant côté code (computeLicenseEndDate), la facturation Stripe
// suit son cycle normal sans interruption pour elles.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if (month === 7 && day === 1) {
    return NextResponse.json(await pauseMonthlySubscriptions());
  }

  if (month === 9 && day === 1) {
    return NextResponse.json(await resumeMonthlySubscriptions());
  }

  return NextResponse.json({ ok: true, action: "none", message: "Pas le bon jour." });
}

async function pauseMonthlySubscriptions() {
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, stripe_subscription_id")
    .eq("plan", "monthly")
    .eq("status", "active");

  let paused = 0;
  for (const sub of subs ?? []) {
    try {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        pause_collection: { behavior: "void" },
      });
      paused++;
    } catch (err) {
      console.error("[seasonal-pause] Échec pause abonnement " + sub.stripe_subscription_id + ":", err);
    }
  }
  return { ok: true, action: "paused", count: paused };
}

async function resumeMonthlySubscriptions() {
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, stripe_subscription_id")
    .eq("plan", "monthly")
    .eq("status", "active");

  let resumed = 0;
  for (const sub of subs ?? []) {
    try {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        pause_collection: "",
      } as Stripe.SubscriptionUpdateParams);
      resumed++;
    } catch (err) {
      console.error("[seasonal-pause] Échec reprise abonnement " + sub.stripe_subscription_id + ":", err);
    }
  }
  return { ok: true, action: "resumed", count: resumed };
}
