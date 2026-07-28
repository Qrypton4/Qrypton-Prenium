// app/api/webhooks/stripe/route.ts
// Reçoit les événements Stripe et synchronise abonnements + licences.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import {
  paymentConfirmationEmail,
  renewalUpcomingEmail,
  renewalConfirmedEmail,
  paymentFailedEmail,
  cancellationEmail,
} from "@/lib/email-templates";
import { getPlan, computeLicenseEndDate, PlanKey } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await activateNewSubscription(session);
      await markCheckoutCompleted(session.id);
      await sendPaymentConfirmationEmail(session.client_reference_id!);
      break;
    }

    case "invoice.upcoming": {
      const invoice = event.data.object as Stripe.Invoice;
      await sendRenewalUpcomingEmail(invoice);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await recordInvoice(invoice);
      await setLicenseStatusBySubscription(invoice.subscription as string, "active");
      // "subscription_cycle" = renouvellement automatique ; "subscription_create" = 1er paiement
      // (déjà couvert par checkout.session.completed, on évite d'envoyer 2 emails)
      if (invoice.billing_reason === "subscription_cycle") {
        await sendRenewalConfirmedEmail(invoice);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      // Selon la version de l'API Stripe, ce champ peut se trouver soit sur
      // l'abonnement directement, soit sur sa première ligne (items.data[0]).
      const rawPeriodEnd =
        sub.current_period_end ?? (sub as any).items?.data?.[0]?.current_period_end;
      const periodEndISO =
        typeof rawPeriodEnd === "number" ? new Date(rawPeriodEnd * 1000).toISOString() : null;

      const updatePayload: Record<string, unknown> = {
        status: sub.status,
        cancel_at_period_end: sub.cancel_at_period_end,
      };
      if (periodEndISO) updatePayload.current_period_end = periodEndISO;

      await supabase.from("subscriptions").update(updatePayload).eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
      await setLicenseStatusBySubscription(sub.id, "revoked");
      await sendCancellationEmail(sub.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // Période de grâce gérée côté Stripe (retry settings) ;
      // on suspend la licence si le statut Stripe passe à past_due.
      await setLicenseStatusBySubscription(invoice.subscription as string, "suspended");
      await sendPaymentFailedEmail(invoice);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function getUserContact(userId: string): Promise<{ email: string; firstName: string } | null> {
  const { data } = await supabase.auth.admin.getUserById(userId);
  if (!data.user?.email) return null;
  return {
    email: data.user.email,
    firstName: (data.user.user_metadata?.first_name as string) || "",
  };
}

async function sendPaymentConfirmationEmail(userId: string) {
  const contact = await getUserContact(userId);
  if (!contact) return;
  const { subject, html } = paymentConfirmationEmail(contact.firstName, "OPR Edge™", "79,00 €");
  const sent = await sendEmail({ to: contact.email, subject, html });
  if (sent) await supabase.from("email_log").insert({ user_id: userId, email_type: "payment_confirmation" });
}

async function sendRenewalUpcomingEmail(invoice: Stripe.Invoice) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", invoice.subscription as string)
    .single();
  if (!sub) return;
  const contact = await getUserContact(sub.user_id);
  if (!contact) return;
  const renewalDate = new Date(invoice.period_end * 1000).toLocaleDateString("fr-FR");
  const amount = `${(invoice.amount_due / 100).toFixed(2)} €`;
  const { subject, html } = renewalUpcomingEmail(contact.firstName, renewalDate, amount);
  const sent = await sendEmail({ to: contact.email, subject, html });
  if (sent) await supabase.from("email_log").insert({ user_id: sub.user_id, email_type: "renewal_upcoming" });
}

async function sendRenewalConfirmedEmail(invoice: Stripe.Invoice) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id, current_period_end")
    .eq("stripe_subscription_id", invoice.subscription as string)
    .single();
  if (!sub) return;
  const contact = await getUserContact(sub.user_id);
  if (!contact) return;
  const nextDate = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("fr-FR")
    : "prochaine échéance";
  const { subject, html } = renewalConfirmedEmail(contact.firstName, nextDate);
  const sent = await sendEmail({ to: contact.email, subject, html });
  if (sent) await supabase.from("email_log").insert({ user_id: sub.user_id, email_type: "renewal_confirmed" });
}

async function sendPaymentFailedEmail(invoice: Stripe.Invoice) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", invoice.subscription as string)
    .single();
  if (!sub) return;
  const contact = await getUserContact(sub.user_id);
  if (!contact) return;
  const { subject, html } = paymentFailedEmail(contact.firstName);
  const sent = await sendEmail({ to: contact.email, subject, html });
  if (sent) await supabase.from("email_log").insert({ user_id: sub.user_id, email_type: "payment_failed" });
}

async function sendCancellationEmail(stripeSubId: string) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", stripeSubId)
    .single();
  if (!sub) return;
  const contact = await getUserContact(sub.user_id);
  if (!contact) return;
  const { subject, html } = cancellationEmail(contact.firstName);
  const sent = await sendEmail({ to: contact.email, subject, html });
  if (sent) await supabase.from("email_log").insert({ user_id: sub.user_id, email_type: "cancellation" });
}

async function markCheckoutCompleted(stripeSessionId: string) {
  await supabase
    .from("checkout_attempts")
    .update({ completed_at: new Date().toISOString() })
    .eq("stripe_session_id", stripeSessionId);
}

async function activateNewSubscription(session: Stripe.Checkout.Session) {
  // Récupère user_id via session.client_reference_id (passé lors de la création du Checkout)
  const userId = session.client_reference_id!;
  const stripeSubId = session.subscription as string;
  const planKey = (session.metadata?.plan as PlanKey) || "monthly";
  const plan = getPlan(planKey) || getPlan("monthly")!;

  await supabase.from("profiles").update({ stripe_customer_id: session.customer as string }).eq("id", userId);

  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      stripe_subscription_id: stripeSubId,
      status: "active",
      plan: planKey,
    })
    .select()
    .single();

  if (subError || !subscription) {
    console.error("[webhook] Échec insertion subscriptions:", subError);
    throw new Error(`subscription_insert_failed: ${subError?.message}`);
  }

  // Pour les offres 6 et 12 mois, la licence dure plus longtemps que la simple
  // période de facturation Stripe, pour compenser la pause saisonnière
  // août/septembre. Reste NULL pour le mensuel (renouvellement Stripe suffit).
  const activeLicenseUntil =
    plan.billingMonths > 1 ? computeLicenseEndDate(new Date(), plan).toISOString() : null;

  const licenseKey = generateLicenseKey();
  const { error: licError } = await supabase.from("licenses").insert({
    user_id: userId,
    subscription_id: subscription.id,
    license_key: licenseKey,
    status: "active",
    active_license_until: activeLicenseUntil,
  });

  if (licError) {
    console.error("[webhook] Échec insertion licenses:", licError);
    throw new Error(`license_insert_failed: ${licError.message}`);
  }
}

async function setLicenseStatusBySubscription(
  stripeSubId: string,
  status: "active" | "suspended" | "revoked"
) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", stripeSubId)
    .single();
  if (!sub) return;
  await supabase.from("licenses").update({ status }).eq("subscription_id", sub.id);
}

async function recordInvoice(invoice: Stripe.Invoice) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", invoice.subscription as string)
    .single();

  if (!sub) {
    console.error("[webhook] Impossible de trouver user_id pour la facture", invoice.id);
    return;
  }

  await supabase.from("invoices").insert({
    user_id: sub.user_id,
    stripe_invoice_id: invoice.id,
    amount_paid: invoice.amount_paid,
    pdf_url: invoice.invoice_pdf,
  });
}

function generateLicenseKey(): string {
  const block = () => Math.random().toString(16).slice(2, 6).toUpperCase();
  return `QTV-OPR-${block()}-${block()}-${block()}`;
}
