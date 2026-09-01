// lib/adminData.ts
// Source unique de données pour "Gestion & Comptabilité". Lit directement les
// tables déjà alimentées par le webhook Stripe (subscriptions, invoices,
// licenses) — aucune donnée n'est dupliquée ou recalculée artificiellement.
//
// Définition retenue pour "client" : tout utilisateur ayant au moins un
// abonnement enregistré dans `subscriptions` (donc ayant déjà payé au moins
// une fois). Un compte simplement inscrit sans jamais avoir souscrit n'est
// pas compté comme "client" dans ce tableau de bord.
//
// Le chiffre d'affaires est calculé uniquement à partir de la table
// `invoices`, qui n'est alimentée QUE sur l'événement Stripe "invoice.paid"
// (voir app/api/webhooks/stripe/route.ts) — les paiements échoués, annulés ou
// non finalisés n'y apparaissent donc jamais par construction.

import { supabaseAdmin } from "@/lib/supabase";

export interface ClientRow {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  signupDate: string | null;
  plan: string | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  stripeCustomerId: string | null;
  totalPaidEUR: number;
}

export interface InvoiceRow {
  id: string;
  userId: string;
  clientName: string;
  email: string;
  date: string;
  stripeInvoiceId: string;
  amountEUR: number;
  pdfUrl: string | null;
}

export interface SubscriptionRow {
  id: string;
  userId: string;
  clientName: string;
  email: string;
  plan: string | null;
  status: string | null;
  amountEUR: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface OverviewStats {
  totalClients: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  expiredSubscriptions: number;
  revenueThisMonthEUR: number;
  revenueThisYearEUR: number;
  paymentsCount: number;
}

async function getAuthUsersById(userIds: string[]): Promise<Record<string, { email: string; firstName: string; lastName: string; createdAt: string }>> {
  const unique = [...new Set(userIds)];
  const result: Record<string, { email: string; firstName: string; lastName: string; createdAt: string }> = {};
  await Promise.all(
    unique.map(async (id) => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      if (data?.user) {
        result[id] = {
          email: data.user.email ?? "",
          firstName: (data.user.user_metadata?.first_name as string) ?? "",
          lastName: (data.user.user_metadata?.last_name as string) ?? "",
          createdAt: data.user.created_at,
        };
      }
    })
  );
  return result;
}

function centsToEUR(cents: number | null | undefined): number {
  return Math.round(((cents ?? 0) / 100) * 100) / 100;
}

export async function getAllClients(): Promise<ClientRow[]> {
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("id, user_id, plan, status, current_period_end, created_at")
    .order("created_at", { ascending: false });
  const subsList = subs ?? [];

  const { data: profiles } = await supabaseAdmin.from("profiles").select("id, stripe_customer_id");
  const { data: invoices } = await supabaseAdmin.from("invoices").select("user_id, amount_paid");

  const subsByUser = new Map<string, (typeof subsList)[number]>();
  for (const s of subsList) {
    // On garde l'abonnement le plus récent par client (déjà trié par created_at desc).
    if (!subsByUser.has(s.user_id)) subsByUser.set(s.user_id, s);
  }

  const stripeCustomerByUser = new Map<string, string | null>();
  for (const p of profiles ?? []) stripeCustomerByUser.set(p.id, p.stripe_customer_id ?? null);

  const totalPaidByUser = new Map<string, number>();
  for (const inv of invoices ?? []) {
    totalPaidByUser.set(inv.user_id, (totalPaidByUser.get(inv.user_id) ?? 0) + (inv.amount_paid ?? 0));
  }

  const userIds = [...subsByUser.keys()];
  const authUsers = await getAuthUsersById(userIds);

  return userIds.map((userId) => {
    const sub = subsByUser.get(userId)!;
    const auth = authUsers[userId];
    return {
      userId,
      firstName: auth?.firstName ?? "",
      lastName: auth?.lastName ?? "",
      email: auth?.email ?? "",
      signupDate: auth?.createdAt ?? null,
      plan: sub.plan ?? null,
      status: sub.status ?? null,
      startDate: sub.created_at ?? null,
      endDate: sub.current_period_end ?? null,
      stripeCustomerId: stripeCustomerByUser.get(userId) ?? null,
      totalPaidEUR: centsToEUR(totalPaidByUser.get(userId) ?? 0),
    };
  });
}

export async function getClientDetail(userId: string) {
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("id, plan, status, current_period_end, cancel_at_period_end, created_at, stripe_subscription_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: invoices } = await supabaseAdmin
    .from("invoices")
    .select("id, stripe_invoice_id, amount_paid, pdf_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: licenses } = await supabaseAdmin
    .from("licenses")
    .select("license_key, status, mt5_account_login, active_license_until")
    .eq("user_id", userId);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

  return {
    email: authUser?.user?.email ?? "",
    firstName: (authUser?.user?.user_metadata?.first_name as string) ?? "",
    lastName: (authUser?.user?.user_metadata?.last_name as string) ?? "",
    signupDate: authUser?.user?.created_at ?? null,
    stripeCustomerId: profile?.stripe_customer_id ?? null,
    subscriptions: subs ?? [],
    invoices: (invoices ?? []).map((i) => ({
      id: i.id,
      date: i.created_at,
      stripeInvoiceId: i.stripe_invoice_id,
      amountEUR: centsToEUR(i.amount_paid),
      pdfUrl: i.pdf_url,
    })),
    licenses: licenses ?? [],
  };
}

export async function getAllSubscriptions(): Promise<SubscriptionRow[]> {
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("id, user_id, plan, status, current_period_end, created_at")
    .order("created_at", { ascending: false });

  const userIds = (subs ?? []).map((s) => s.user_id);
  const authUsers = await getAuthUsersById(userIds);

  return (subs ?? []).map((s) => {
    const auth = authUsers[s.user_id];
    return {
      id: s.id,
      userId: s.user_id,
      clientName: auth ? `${auth.firstName} ${auth.lastName}`.trim() || auth.email : s.user_id,
      email: auth?.email ?? "",
      plan: s.plan ?? null,
      status: s.status ?? null,
      amountEUR: null,
      startDate: s.created_at ?? null,
      endDate: s.current_period_end ?? null,
    };
  });
}

export async function getAllInvoices(): Promise<InvoiceRow[]> {
  const { data: invoices } = await supabaseAdmin
    .from("invoices")
    .select("id, user_id, stripe_invoice_id, amount_paid, pdf_url, created_at")
    .order("created_at", { ascending: false });

  const userIds = (invoices ?? []).map((i) => i.user_id);
  const authUsers = await getAuthUsersById(userIds);

  return (invoices ?? []).map((i) => {
    const auth = authUsers[i.user_id];
    return {
      id: i.id,
      userId: i.user_id,
      clientName: auth ? `${auth.firstName} ${auth.lastName}`.trim() || auth.email : i.user_id,
      email: auth?.email ?? "",
      date: i.created_at,
      stripeInvoiceId: i.stripe_invoice_id,
      amountEUR: centsToEUR(i.amount_paid),
      pdfUrl: i.pdf_url,
    };
  });
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const clients = await getAllClients();
  const { data: invoices } = await supabaseAdmin.from("invoices").select("amount_paid, created_at");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let revenueThisMonth = 0;
  let revenueThisYear = 0;
  for (const inv of invoices ?? []) {
    const d = new Date(inv.created_at);
    if (d >= yearStart) revenueThisYear += inv.amount_paid ?? 0;
    if (d >= monthStart) revenueThisMonth += inv.amount_paid ?? 0;
  }

  const activeStatuses = new Set(["active", "trialing"]);
  const canceledStatuses = new Set(["canceled"]);

  let active = 0;
  let canceled = 0;
  let expired = 0;
  for (const c of clients) {
    if (c.status && activeStatuses.has(c.status)) {
      const stillWithinPeriod = c.endDate ? new Date(c.endDate) > now : true;
      if (stillWithinPeriod) active++;
      else expired++;
    } else if (c.status && canceledStatuses.has(c.status)) {
      canceled++;
    } else {
      expired++;
    }
  }

  return {
    totalClients: clients.length,
    activeSubscriptions: active,
    canceledSubscriptions: canceled,
    expiredSubscriptions: expired,
    revenueThisMonthEUR: centsToEUR(revenueThisMonth),
    revenueThisYearEUR: centsToEUR(revenueThisYear),
    paymentsCount: (invoices ?? []).length,
  };
}

/**
 * Convertit un tableau d'objets en CSV compatible Excel (UTF-8 avec BOM,
 * séparateur point-virgule — convention française pour Excel).
 */
export function toCSV(headers: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    if (s.includes(";") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.map(escape).join(";"), ...rows.map((r) => r.map(escape).join(";"))];
  return "\uFEFF" + lines.join("\r\n");
}
