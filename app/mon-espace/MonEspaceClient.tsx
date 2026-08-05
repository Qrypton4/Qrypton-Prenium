"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Row, Kpi } from "./ui";
import Image from "next/image";

const TABS = [
  { id: "dashboard", label: "📊 Tableau de bord" },
  { id: "performance", label: "📈 Performances" },
  { id: "license", label: "🔑 Licence MT5" },
  { id: "robot", label: "🤖 Robot" },
  { id: "subscription", label: "💳 Abonnement & Factures" },
  { id: "guide", label: "📘 Guide de démarrage" },
  { id: "settings", label: "⚙️ Paramètres" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const BOTTOM_IDS: TabId[] = ["dashboard", "performance", "license"];

export default function MonEspaceClient({
  license,
  subscription,
  invoices,
  trades,
  hasTrades,
  netProfit,
  winRate,
  lastBalance,
  userEmail,
}: {
  license: any;
  subscription: any;
  invoices: any[];
  trades: any[];
  hasTrades: boolean;
  netProfit: number;
  winRate: string;
  lastBalance: number;
  userEmail?: string | null;
}) {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [moreOpen, setMoreOpen] = useState(false);

  const bottomTabs = TABS.filter((t) => BOTTOM_IDS.includes(t.id));
  const moreTabs = TABS.filter((t) => !BOTTOM_IDS.includes(t.id));

  function iconOf(label: string) {
    return label.split(" ")[0];
  }
  function textOf(label: string) {
    return label.split(" ").slice(1).join(" ");
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-line px-4 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/qrypton-mark.png"
            alt="Qrypton"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <h1 className="font-display font-semibold text-lg leading-tight">Mon espace</h1>
            <p className="text-muted-2 text-xs mt-0.5">
              Bienvenue dans votre espace client sécurisé.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-4 sm:px-8 py-10 pb-28">
        <div key={tab} className="tab-fade">
          {tab === "dashboard" && (
            <DashboardTab
              license={license}
              subscription={subscription}
              trades={trades}
              netProfit={netProfit}
              winRate={winRate}
              lastBalance={lastBalance}
            />
          )}
          {tab === "performance" && (
            <PerformanceTabRich
              license={license}
              subscription={subscription}
              hasTrades={hasTrades}
              trades={trades}
              netProfit={netProfit}
              winRate={winRate}
              lastBalance={lastBalance}
            />
          )}
          {tab === "license" && <LicenseTab license={license} />}
          {tab === "robot" && <RobotTab license={license} />}
          {tab === "subscription" && (
            <SubscriptionTab subscription={subscription} invoices={invoices} />
          )}
          {tab === "guide" && <GuideTab />}
          {tab === "settings" && <SettingsTab email={userEmail} />}
        </div>
      </main>

      {/* Overlay + tiroir "Menu" */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity ${
          moreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMoreOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-bg-2 border-t border-line rounded-t-2xl transition-transform duration-200 ${
          moreOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {moreTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setMoreOpen(false);
            }}
            className={`w-full text-left px-6 py-4 text-sm border-b border-line last:border-0 transition-colors ${
              tab === t.id ? "text-white bg-blue-soft/10" : "text-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => setMoreOpen(false)}
          className="w-full text-center px-6 py-4 text-sm text-muted-2"
        >
          Fermer
        </button>
      </div>

      {/* Barre de navigation du bas */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-bg-2/95 backdrop-blur border-t border-line flex justify-around px-2 py-2 pb-safe">
        {bottomTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setMoreOpen(false);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] rounded-xl transition-colors ${
              tab === t.id && !moreOpen ? "text-blue-soft" : "text-muted-2"
            }`}
          >
            <span className="text-lg leading-none">{iconOf(t.label)}</span>
            <span>{textOf(t.label)}</span>
          </button>
        ))}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] rounded-xl transition-colors ${
            moreOpen || moreTabs.some((t) => t.id === tab) ? "text-blue-soft" : "text-muted-2"
          }`}
        >
          <span className="text-lg leading-none">⋯</span>
          <span>Menu</span>
        </button>
      </nav>

      <style jsx>{`
        .tab-fade {
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function DashboardTab({ license, subscription, trades, netProfit, winRate, lastBalance }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Kpi label="Capital" value={`${Math.round(lastBalance).toLocaleString("fr-FR")} €`} />
        <Kpi label="Profit" value={`${netProfit >= 0 ? "+" : ""}${Math.round(netProfit)} €`} />
        <Kpi label="Trades" value={trades.length} />
        <Kpi label="Win Rate" value={`${winRate} %`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card title="Licence">
          <Row k="Statut" v={<span className="text-positive">{license.status}</span>} />
          <Row k="Compte MT5" v={license.mt5_account_login ?? "Pas encore activée"} />
        </Card>
        <Card title="Abonnement">
          {subscription ? (
            <>
              <Row k="Statut" v={<span className="text-positive">{subscription.status}</span>} />
              <Row
                k="Prochain renouvellement"
                v={
                  subscription.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString("fr-FR")
                    : "À confirmer"
                }
              />
            </>
          ) : (
            <p className="text-muted text-sm">Aucun abonnement actif.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------- Nouvelle page Performances (design riche) ---------- */

function PerformanceTabRich({
  license,
  subscription,
  hasTrades,
  trades,
  netProfit,
  winRate,
  lastBalance,
}: any) {
  if (!hasTrades) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xs text-muted uppercase tracking-wide">Performances</h2>
        <div className="border border-line rounded-2xl bg-bg-2 p-12 text-center">
          <div className="text-base font-semibold mb-2">Aucun trade pour le moment</div>
          <p className="text-muted text-sm max-w-[380px] mx-auto leading-relaxed">
            Dès que votre robot commencera à trader, vos statistiques (capital, profit,
            historique) apparaîtront ici automatiquement.
          </p>
        </div>
      </div>
    );
  }

  const startCapital = lastBalance - netProfit;
  const perfPct = startCapital > 0 ? (netProfit / startCapital) * 100 : 0;
  const perfPositive = netProfit >= 0;

  // Points de la mini-courbe : balance_after de chaque trade, du plus ancien au plus récent
  const chrono = [...trades].reverse();
  const balances: number[] = chrono.map((t: any) => Number(t.balance_after ?? lastBalance));
  const firstDate = chrono[0]?.close_time;

  const wins = trades.filter((t: any) => Number(t.profit) > 0).length;
  const losses = trades.length - wins;

  const recentTrades = trades.slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xs text-muted uppercase tracking-wide">Performances</h2>

      {/* Hero */}
      <div className="rounded-[22px] p-6 border border-blue-soft/25 bg-gradient-to-br from-[#101B33] to-[#0A0D14] relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-soft/10 border border-blue-soft/30 flex items-center justify-center text-blue-soft text-xl">
              📈
            </div>
            <div>
              <div className="font-semibold text-[15px]">OPR Edge™</div>
              <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-blue-soft bg-blue-soft/10 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-soft" />
                {license.status === "active" ? "Robot actif" : "Robot inactif"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted uppercase tracking-wide">
              Performance totale
            </div>
            <div className={`text-[26px] font-bold mt-0.5 ${perfPositive ? "text-positive" : "text-red-400"}`}>
              {perfPositive ? "+" : ""}
              {perfPct.toFixed(2)} %
            </div>
          </div>
        </div>

        <MiniSpark values={balances} positive={perfPositive} />

        <div className="flex justify-between items-center mt-3 text-[11px] text-muted relative z-10">
          <span>
            {firstDate
              ? `Depuis le ${new Date(firstDate).toLocaleDateString("fr-FR")}`
              : "Historique de trading"}
          </span>
          <span className="text-blue-soft font-medium">Voir le détail →</span>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3">
        <KpiRich label="Capital" value={`${Math.round(lastBalance).toLocaleString("fr-FR")} €`} sub="Compte connecté" />
        <KpiRich
          label="Profit total"
          value={`${netProfit >= 0 ? "+" : ""}${Math.round(netProfit).toLocaleString("fr-FR")} €`}
          valueClass={netProfit >= 0 ? "text-positive" : "text-red-400"}
          sub={`${perfPositive ? "+" : ""}${perfPct.toFixed(2)} %`}
          subClass={perfPositive ? "text-positive" : "text-red-400"}
        />
        <KpiRich label="Trades" value={trades.length} sub="Depuis l'activation" />
        <KpiRich label="Win rate" value={`${winRate} %`} sub={`${wins} gagnants / ${losses} perdants`} />
      </div>

      {/* État du robot */}
      <Card title="État du robot">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusItem
            label={license.status === "active" ? "Robot actif" : "Robot inactif"}
            sub="Marché surveillé : NAS100"
            positive={license.status === "active"}
          />
          <StatusItem
            label={license.mt5_account_login ? "Connecté à MT5" : "Non connecté"}
            sub={license.mt5_account_login ? `Compte : ${license.mt5_account_login}` : "—"}
            positive={!!license.mt5_account_login}
          />
          <StatusItem
            label="Statut"
            sub={license.status === "active" ? "Connecté" : license.status}
            positive={license.status === "active"}
          />
        </div>
      </Card>

      {/* Activité récente */}
      <Card title="Activité récente">
        <div className="flex flex-col">
          {recentTrades.map((t: any) => {
            const win = Number(t.profit) >= 0;
            return (
              <div
                key={t.id}
                className="flex justify-between items-center py-3.5 border-t border-line first:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                      win ? "bg-positive/10 text-positive" : "bg-red-400/10 text-red-400"
                    }`}
                  >
                    {win ? "↗" : "↘"}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">Trade clôturé</div>
                    <div className="text-[11.5px] text-muted-2 mt-0.5">
                      {t.symbol} · {t.direction === "buy" ? "Achat" : "Vente"} · {t.lot_size} lot
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${win ? "text-positive" : "text-red-400"}`}>
                    {win ? "+" : ""}
                    {Number(t.profit).toFixed(2)} €
                  </div>
                  <div className="text-[10.5px] text-muted-2 mt-0.5">
                    {new Date(t.close_time).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function KpiRich({
  label,
  value,
  sub,
  valueClass = "",
  subClass = "text-muted-2",
}: {
  label: string;
  value: string | number;
  sub?: string;
  valueClass?: string;
  subClass?: string;
}) {
  return (
    <div className="bg-bg-2 border border-line rounded-[17px] p-[19px]">
      <div className="text-[10.5px] text-muted uppercase tracking-wide mb-1.5">{label}</div>
      <div className={`font-mono text-[19px] font-semibold ${valueClass}`}>{value}</div>
      {sub && <div className={`text-[11px] mt-1 ${subClass}`}>{sub}</div>}
    </div>
  );
}

function StatusItem({
  label,
  sub,
  positive,
}: {
  label: string;
  sub: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
          positive ? "bg-positive" : "bg-muted-2"
        }`}
      />
      <div>
        <div className={`text-[12.5px] font-semibold ${positive ? "text-positive" : ""}`}>
          {label}
        </div>
        <div className="text-[11px] text-muted-2 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function MiniSpark({ values, positive }: { values: number[]; positive: boolean }) {
  if (!values || values.length < 2) return null;
  const W = 386;
  const H = 80;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = W / (values.length - 1);
  const coords = values.map((v, i) => ({
    x: i * stepX,
    y: H - ((v - min) / range) * (H - 8) - 4,
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  const color = positive ? "#3DDC8A" : "#FF5C6C";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="mt-4 relative z-10">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="3.5" fill={color} />
    </svg>
  );
}

/* ---------- Onglets inchangés ---------- */

function LicenseTab({ license }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleReset() {
    if (
      !window.confirm(
        "Ça va déconnecter ton compte MT5 actuel de cette licence. Tu pourras ensuite l'activer sur un nouveau compte. Continuer ?"
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/license/reset", { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        setMessage("Compte MT5 réinitialisé. Tu peux maintenant activer ta licence sur un nouveau compte.");
        setTimeout(() => window.location.reload(), 1500);
      } else if (data.message === "already_unlinked") {
        setMessage("Aucun compte MT5 n'est actuellement lié à ta licence.");
      } else {
        setMessage("Une erreur est survenue. Réessaie ou contacte le support.");
      }
    } catch {
      setMessage("Une erreur est survenue. Réessaie ou contacte le support.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Ma licence">
      <Row k="Clé de licence" v={license.license_key} />
      <Row k="Compte MT5 lié" v={license.mt5_account_login ?? "Pas encore activée"} />
      {license.mt5_account_login && (
        <button
          onClick={handleReset}
          disabled={loading}
          className="mt-4 text-sm text-blue-soft hover:underline disabled:opacity-50"
        >
          {loading ? "Réinitialisation..." : "Réinitialiser mon compte MT5"}
        </button>
      )}
      {message && <p className="text-muted text-xs mt-3">{message}</p>}
    </Card>
  );
}

function RobotTab({ license }: any) {
  return (
    <Card title="Robot">
      {license.status === "active" ? (
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">OPR Edge™</div>
            <div className="text-xs text-muted-2 mt-1">
              Voir le changelog pour la dernière version
            </div>
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
  );
}

function SubscriptionTab({ subscription, invoices }: any) {
  return (
    <Card title="Abonnement & Factures">
      {subscription ? (
        <>
          <Row k="Statut" v={<span className="text-positive">{subscription.status}</span>} />
          <Row
            k="Prochain renouvellement"
            v={
              subscription.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString("fr-FR")
                : "À confirmer"
            }
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

      {invoices && invoices.length > 0 && (
        <div className="mt-6 pt-6 border-t border-line">
          <h3 className="text-sm font-semibold mb-3">Factures</h3>
          <div className="flex flex-col gap-3">
            {invoices.map((inv: any) => (
              <div
                key={inv.id}
                className="flex justify-between items-center text-sm border-b border-line pb-3 last:border-0"
              >
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
        </div>
      )}
    </Card>
  );
}

function GuideTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card title="Guide de démarrage">
        <Link href="/guide-demarrage" className="text-blue-soft text-sm hover:underline">
          Ouvrir le guide →
        </Link>
      </Card>
      <Card title="Tutoriels">
        <p className="text-muted text-sm">Bientôt disponible.</p>
      </Card>
      <Card title="FAQ">
        <Link href="/faq" className="text-blue-soft text-sm hover:underline">
          Consulter la FAQ →
        </Link>
      </Card>
    </div>
  );
}

function SettingsTab({ email }: { email?: string | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card title="Profil">
        <Row k="Adresse email" v={email ?? "—"} />
      </Card>
      <Card title="Sécurité">
        <Link
          href="/mot-de-passe-oublie"
          className="text-blue-soft text-sm hover:underline block mb-4"
        >
          Changer mon mot de passe →
        </Link>
        <form action="/api/auth/signout" method="post">
          <button className="text-sm text-red-400 hover:underline">Déconnexion</button>
        </form>
      </Card>
    </div>
  );
}
