// app/api/admin/sync-prop-firm-subscription/route.ts
// Recalcule si le Supplément Grande Allocation doit s'appliquer à un compte
// Prop Firm donné, et synchronise l'abonnement Stripe du client en
// conséquence (ajoute/retire l'item, prorata géré nativement par Stripe).
//
// Action manuelle déclenchée depuis /admin — tant que la vérification MT5
// automatique n'existe pas, c'est l'admin qui constate qu'un compte est
// Funded (ou qu'un capital a changé) et déclenche cette synchronisation.
// Idempotent : peut être rappelée sans risque, elle ne fait qu'aligner
// Stripe sur l'état actuel de la base.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { PlanKey, getPlan } from "@/lib/plans";
import { sendEmail } from "@/lib/email";
import { propFirmSupplementChangedEmail } from "@/lib/email-templates";
import {
  shouldApplySupplement,
  PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR,
  getSupplementAmount,
} from "@/lib/propFirmSupplement";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail.toLowerCase();
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ ok: false, message: "forbidden" }, { status: 403 });
  }

  const { accountId } = await req.json();
  if (!accountId) {
    return NextResponse.json({ ok: false, message: "missing_account_id" }, { status: 400 });
  }

  const { data: account, error: accountError } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("id, user_id, status, capital")
    .eq("id", accountId)
    .single();

  if (accountError || !account) {
    return NextResponse.json({ ok: false, message: "account_not_found" }, { status: 404 });
  }

  const { data: subscription, error: subError } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_subscription_id, plan, current_period_end")
    .eq("user_id", account.user_id)
    .eq("status", "active")
    .maybeSingle();

  if (subError || !subscription) {
    return NextResponse.json(
      { ok: false, message: "no_active_subscription_for_user" },
      { status: 404 }
    );
  }

  const planKey = subscription.plan as PlanKey;
  const supplementEnvVar = PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR[planKey];
  const supplementPriceId = process.env[supplementEnvVar];

  const needSupplement = shouldApplySupplement(account.status, Number(account.capital));

  if (needSupplement && !supplementPriceId) {
    return NextResponse.json(
      { ok: false, message: `missing_env_var:${supplementEnvVar}` },
      { status: 500 }
    );
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripe_subscription_id
  );

  const existingItem = supplementPriceId
    ? stripeSubscription.items.data.find((i) => i.price.id === supplementPriceId)
    : undefined;

  let action: "added" | "removed" | "unchanged" = "unchanged";

  if (needSupplement && !existingItem) {
    await stripe.subscriptionItems.create({
      subscription: subscription.stripe_subscription_id,
      price: supplementPriceId!,
      // "none" : le client garde son prix jusqu'à la fin de la période en
      // cours. Le supplément n'est facturé qu'à partir du PROCHAIN
      // renouvellement — jamais de prorata immédiat, jamais de facture
      // surprise en cours de période payée.
      proration_behavior: "none",
    });
    action = "added";
  } else if (!needSupplement && existingItem) {
    await stripe.subscriptionItems.del(existingItem.id, {
      proration_behavior: "none",
    });
    action = "removed";
  }

  // Notifie le client uniquement si quelque chose a réellement changé —
  // jamais de mail si l'état était déjà correct (idempotence).
  if (action === "added" || action === "removed") {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(account.user_id);
    const email = userData?.user?.email;
    const firstName = (userData?.user?.user_metadata?.first_name as string) || "";
    const basePlan = getPlan(planKey);

    if (email && basePlan) {
      const newTotal = action === "added"
        ? basePlan.priceEUR + getSupplementAmount(planKey)
        : basePlan.priceEUR;
      const renewalDate = subscription.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString("fr-FR")
        : "votre prochain renouvellement";

      const { subject, html } = propFirmSupplementChangedEmail(
        firstName,
        action === "added",
        `${Number(account.capital).toLocaleString("fr-FR")} €`,
        `${newTotal}€`,
        renewalDate
      );

      await sendEmail({ to: email, subject, html });
    }
  }

  return NextResponse.json({ ok: true, needSupplement, action });
}
