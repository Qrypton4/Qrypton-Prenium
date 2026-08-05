import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { EmptyPage } from "./ui";
import MonEspaceClient from "./MonEspaceClient";
import SiteNavContainer from "@/components/SiteNavContainer";

export const metadata = { title: "Mon espace — Qrypton" };

export default async function MonEspace() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
  <>
    <SiteNavContainer />
    <EmptyPage title="Session expirée" text="Merci de vous reconnecter." />
  </>
);
  }

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, license_key, status, mt5_account_login, active_license_until, last_verified_at")
    .eq("user_id", user.id)
    .single();

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  const { data: invoices } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  if (!license) {
  return (
    <>
      <SiteNavContainer />
      <EmptyPage
        title="Aucun abonnement actif"
        text="Souscrivez à OPR Edge™ pour accéder à votre espace : dashboard, licence et téléchargement du robot."
        cta={{ href: "/tarifs", label: "Voir les tarifs" }}
      />
    </>
  );
}

  const { data: trades } = await supabaseAdmin
    .from("live_trades")
    .select("*")
    .eq("license_id", license.id)
    .order("close_time", { ascending: false })
    .limit(20);

  const hasTrades = !!(trades && trades.length > 0);
  const netProfit = hasTrades ? trades!.reduce((s, t) => s + Number(t.profit), 0) : 0;
  const winRate = hasTrades
    ? ((trades!.filter((t) => t.profit > 0).length / trades!.length) * 100).toFixed(1)
    : "0";
  const lastBalance = hasTrades ? trades![0]?.balance_after ?? 0 : 0;

  return (
  <>
    <SiteNavContainer />
    <MonEspaceClient
      license={license}
      subscription={subscription}
      invoices={invoices ?? []}
      trades={trades ?? []}
      hasTrades={hasTrades}
      netProfit={netProfit}
      winRate={winRate}
      lastBalance={lastBalance}
      userEmail={user.email}
    />
  </>
);
}
