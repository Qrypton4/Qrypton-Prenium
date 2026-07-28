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
  { id: "subscription", label: "💳 Abonnement" },
  { id: "invoices", label: "📄 Factures" },
  { id: "guide", label: "📚 Guide de démarrage" },
  { id: "settings", label: "⚙️ Paramètres" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeLabel = TABS.find((t) => t.id === tab)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="border-b border-line px-4 sm:px-8 py-3 sm:py-0">
        <div className="relative sm:hidden" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border bg-bg-2 text-sm font-medium transition-shadow duration-200 ${
              menuOpen
                ? "border-blue-soft shadow-[0_0_0_3px_rgba(59,130,246,0.18)]"
                : "border-blue-soft/30"
            }`}
          >
            <span>{activeLabel}</span>
            <span
              className={`text-blue-soft transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          <div
            className={`absolute z-20 mt-2 w-full rounded-xl border border-blue-soft/30 bg-bg-2 overflow-hidden origin-top transition-all duration-200 ${
              menuOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  tab === t.id
                    ? "bg-blue-soft/10 text-white"
                    : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="hidden sm:block overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-blue-soft text-white"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <main className="max-w-[1160px] mx-auto px-4 sm:px-8 py-10">
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
            <PerformanceTab
              hasTrades={hasTrades}
              trades={trades}
              netProfit={netProfit}
              winRate={winRate}
              lastBalance={lastBalance}
            />
          )}
          {tab === "license" && <LicenseTab license={license} />}
          {tab === "robot" && <RobotTab license={license} />}
          {tab === "subscription" && <SubscriptionTab subscription={subscription} />}
          {tab === "invoices" && <InvoicesTab invoices={invoices} />}
          {tab === "guide" && <GuideTab />}
          {tab === "settings" && <SettingsTab email={userEmail} />}
        </div>
      </main>

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

function PerformanceTab({ hasTrades, trades, netProfit, winRate, lastBalance }: any) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xs text-muted uppercase tracking-wide">Performances</h2>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Kpi label="Capital" value={`${Math.round(lastBalance).toLocaleString("fr-FR")} €`} />
            <Kpi label="Profit" value={`${netProfit >= 0 ? "+" : ""}${Math.round(netProfit)} €`} />
            <Kpi label="Trades" value={trades.length} />
            <Kpi label="Win Rate" value={`${winRate} %`} />
          </div>
          <div className="border border-line rounded-2xl bg-bg-2 overflow-hidden">
            <h3 className="text-sm text-muted p-6 pb-2">Historique des trades</h3>
            <table className="w-full text-sm">
              <tbody>
                {trades.map((t: any) => (
                  <tr key={t.id} className="border-b border-line last:border-0">
                    <td className="p-4 font-mono text-muted">
                      {new Date(t.close_time).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4">{t.symbol}</td>
                    <td
                      className={`p-4 font-mono ${
                        t.profit >= 0 ? "text-positive" : "text-red-400"
                      }`}
                    >
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
    </div>
  );
}

function LicenseTab({ license }: any) {
  return (
    <Card title="Ma licence">
      <Row k="Clé de licence" v={license.license_key} />
      <Row k="Compte MT5 lié" v={license.mt5_account_login ?? "Pas encore activée"} />
      <button className="mt-4 text-sm text-blue-soft hover:underline">
        Réinitialiser mon compte MT5
      </button>
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

function SubscriptionTab({ subscription }: any) {
  return (
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
  );
}

function InvoicesTab({ invoices }: any) {
  return (
    <Card title="Factures">
      {invoices && invoices.length > 0 ? (
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
      ) : (
        <p className="text-muted text-sm">Aucune facture pour le moment.</p>
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
