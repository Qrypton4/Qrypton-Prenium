import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const metadata = { title: "Mon espace — Qrypton" };

export default async function MonEspace() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <EmptyPage title="Session expirée" text="Merci de vous reconnecter." />;
  }

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, license_key, status, mt5_account_login")
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
      <EmptyPage
        title="Aucun abonnement actif"
        text="Souscrivez à OPR Edge™ pour accéder à votre espace : dashboard, licence et téléchargement du robot."
        cta={{ href: "/tarifs", label: "Voir les tarifs" }}
      />
    );
  }

  const { data: trades } = await supabaseAdmin
    .from("live_trades")
    .select("*")
    .eq("license_id", license.id)
    .order("close_time", { ascending: false })
    .limit(20);

  const hasTrades = trades && trades.length > 0;
  const netProfit = hasTrades ? trades.reduce((s, t) => s + Number(t.profit), 0) : 0;
  const winRate = hasTrades ? ((trades.filter((t) => t.profit > 0).length / trades.length) * 100).toFixed(1) : "0";
  const lastBalance = hasTrades ? trades[0]?.balance_after ?? 0 : 0;

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-line px-8 py-5 flex justify-between items-center">
        <h1 className="font-display font-semibold text-lg">Mon espace — OPR Edge™</h1>
        <div className="flex items-center gap-4">
          <Link href="/guide-demarrage" className="text-sm text-blue-soft hover:underline">
            📘 Guide de démarrage
          </Link>
          <span className="font-mono text-xs text-positive border border-line-strong rounded-full px-3 py-1">
            ● Licence {license.status === "active" ? "active" : license.status}
          </span>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm text-muted hover:text-white transition">Déconnexion</button>
          </form>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-8 py-10 flex flex-col gap-10">
        {/* --- DASHBOARD : vue par défaut --- */}
        <section>
          <h2 className="text-xs text-muted uppercase tracking-wide mb-4">Performance</h2>
          {!hasTrades ? (
            <div className="border border-line rounded-2xl bg-bg-2 p-12 text-center">
              <div className="text-base font-semibold mb-2">Aucun trade pour le moment</div>
              <p className="text-muted text-sm max-w-[380px] mx-auto leading-relaxed">
                Dès que votre robot commencera à trader, vos statistiques (capital, profit,
                historique) apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden mb-6">
                <Kpi label="Capital" value={`${Math.round(lastBalance).toLocaleString("fr-FR")} €`} />
                <Kpi label="Profit" value={`${netProfit >= 0 ? "+" : ""}${Math.round(netProfit)} €`} />
                <Kpi label="Trades" value={trades.length} />
                <Kpi label="Win Rate" value={`${winRate} %`} />
              </div>
              <div className="border border-line rounded-2xl bg-bg-2 overflow-hidden">
                <h3 className="text-sm text-muted p-6 pb-2">Historique des trades</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {trades.map((t) => (
                      <tr key={t.id} className="border-b border-line last:border-0">
                        <td className="p-4 font-mono text-muted">
                          {new Date(t.close_time).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4">{t.symbol}</td>
                        <td className={`p-4 font-mono ${t.profit >= 0 ? "text-positive" : "text-red-400"}`}>
                          {t.profit >= 0 ? "+" : ""}
                          {t.profit} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* --- LICENCE, ABONNEMENT, ROBOT, FACTURES --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Ma licence">
            <Row k="Clé de licence" v={license.license_key} />
            <Row k="Compte MT5 lié" v={license.mt5_account_login ?? "Pas encore activée"} />
            <button className="mt-4 text-sm text-blue-soft hover:underline">
              Réinitialiser mon compte MT5
            </button>
          </Card>

          <Card title="Abonnement">
            {subscription ? (
              <>
                <Row k="Statut" v={<span className="text-positive">{subscription.status}</span>} />
                <Row
                  k="Prochain renouvellement"
                  v={new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
                />
                <a
                  href="/api/stripe/portal"
                  className="inline-block mt-4 px-5 py-2.5 rounded-lg border border-line-strong text-sm hover:border-blue-soft hover:bg-blue/10 transition"
                >
                  Gérer mon abonnement (Stripe)
                </a>
              </>
            ) : (
              <p className="text-muted text-sm">Aucun abonnement actif.</p>
            )}
          </Card>

          <Card title="Robot">
            {license.status === "active" ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">OPR Edge™</div>
                  <div className="text-xs text-muted-2 mt-1">Voir le changelog pour la dernière version</div>
                </div>
                <a
                  href="/downloads/opr-edge-latest.ex5"
                  className="px-5 py-2.5 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition"
                >
                  Télécharger
                </a>
              </div>
            ) : (
              <p className="text-muted text-sm">Le téléchargement est disponible après souscription.</p>
            )}
          </Card>

          <Card title="Factures">
            {invoices && invoices.length > 0 ? (
              <div className="flex flex-col gap-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center text-sm border-b border-line pb-3 last:border-0">
                    <span className="font-mono text-muted">
                      {new Date(inv.issued_at).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="font-mono">{(inv.amount_paid / 100).toFixed(2)} €</span>
                    <a href={inv.pdf_url} className="text-blue-soft hover:underline">
                      PDF
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">Aucune facture pour le moment.</p>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line rounded-2xl bg-bg-2 p-7">
      <h3 className="text-sm text-muted uppercase tracking-wide mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <span className="text-muted text-sm">{k}</span>
      <span className="font-mono text-white">{v}</span>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-2 p-5">
      <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">{label}</div>
      <div className="font-mono text-lg text-white">{value}</div>
    </div>
  );
}

function EmptyPage({
  title,
  text,
  cta,
}: {
  title: string;
  text: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[440px] text-center border border-line rounded-2xl bg-bg-2 p-10">
        <h1 className="font-display text-lg font-semibold mb-3">{title}</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">{text}</p>
        {cta && (
          <Link href={cta.href} className="inline-block px-5 py-2.5 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition">
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
