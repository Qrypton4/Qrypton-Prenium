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

  // .order + .limit(1) plutôt que .single() seul : un utilisateur peut avoir
  // plusieurs lignes dans `licenses`/`subscriptions` au fil de ses tests ou
  // renouvellements successifs — .single() plante dès qu'il y en a plus
  // d'une. On prend systématiquement la plus récente.
  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, license_key, status, mt5_account_login, active_license_until, last_verified_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: invoices } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  // Comptes Prop Firm du client — lecture seule, ne conditionne rien d'autre
  // sur cette page. Vide pour l'instant tant qu'aucun compte n'a été créé
  // (le parcours de paiement Prop Firm n'est pas encore branché).
  const { data: propFirmAccounts } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("id, mt5_account, capital, status, verified, created_at, prop_firms(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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

 // On n'affiche que les trades du compte MT5 actuellement lié à la licence.
  // L'historique de l'ancien compte reste en base (pour les admins/archives)
  // mais disparaît de l'affichage client dès qu'il reset/change de compte.
  const tradesQuery = supabaseAdmin
    .from("live_trades")
    .select("*")
    .eq("license_id", license.id)
    .order("close_time", { ascending: false });

  const { data: trades } = license.mt5_account_login
    ? await tradesQuery.eq("mt5_account_login", license.mt5_account_login)
    : { data: [] };
   // Historique de TOUS les comptes MT5 jamais liés à cette licence (y compris
  // ceux resetés), pour que le client retrouve ses performances passées.
  const { data: allTrades } = await supabaseAdmin
    .from("live_trades")
    .select("mt5_account_login, profit, close_time")
    .eq("license_id", license.id);

  const accountGroups = new Map<
    string,
    { profit: number; count: number; wins: number; firstTrade: string | null; lastTrade: string | null }
  >();
  for (const t of allTrades ?? []) {
    const acc = t.mt5_account_login ?? "inconnu";
    const g = accountGroups.get(acc) ?? { profit: 0, count: 0, wins: 0, firstTrade: null, lastTrade: null };
    g.profit += Number(t.profit);
    g.count += 1;
    if (Number(t.profit) > 0) g.wins += 1;
    if (!g.firstTrade || t.close_time < g.firstTrade) g.firstTrade = t.close_time;
    if (!g.lastTrade || t.close_time > g.lastTrade) g.lastTrade = t.close_time;
    accountGroups.set(acc, g);
  }
  const accountHistory = Array.from(accountGroups.entries())
    .map(([account, g]) => ({
      account,
      netProfit: g.profit,
      tradeCount: g.count,
      winRate: g.count ? ((g.wins / g.count) * 100).toFixed(1) : "0",
      firstTrade: g.firstTrade,
      lastTrade: g.lastTrade,
      isCurrent: license.mt5_account_login === account,
    }))
    .sort((a, b) => (b.lastTrade ?? "").localeCompare(a.lastTrade ?? ""));
Nouveau
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
      propFirmAccounts={propFirmAccounts ?? []}
   accountHistory={accountHistory}   
      />
  </>
);
}
