"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Row, Kpi } from "./ui";
import Image from "next/image";
import PWAInstallSettingsCard from "@/components/PWAInstallSettingsCard";

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

 function textOf(label: string) {
    return label.split(" ").slice(1).join(" ");
  }

  function BottomIcon({ id }: { id: TabId }) {
    const common = {
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };
    if (id === "dashboard") {
      return (
        <svg {...common}>
          <path d="m3 12 9-9 9 9" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    }
    if (id === "performance") {
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      );
    }
    return (
      <svg {...common}>
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="m11 12 8.5-8.5" />
        <path d="m16.5 6.5 2 2" />
        <path d="m14.5 8.5 2 2" />
      </svg>
    );
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

      <nav className="hidden sm:block border-b border-line px-4 sm:px-8">
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

      <main className="max-w-[1160px] mx-auto px-4 sm:px-8 pt-10 pb-28 sm:pb-10">
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
        className={`sm:hidden fixed inset-0 z-30 bg-black/60 transition-opacity ${
          moreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMoreOpen(false)}
      />
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-2 border-t border-line rounded-t-2xl transition-transform duration-200 ${
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
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-bg-2 backdrop-blur border-t border-line-strong shadow-[0_-8px_24px_rgba(0,0,0,0.45)] flex justify-around px-2 py-2 pb-safe">
        {bottomTabs.map((t) => {
          const active = tab === t.id && !moreOpen;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] transition-colors ${
                active ? "text-blue-soft" : "text-muted"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  active
                    ? "bg-blue-soft/15 shadow-[0_0_16px_2px_rgba(61,107,255,0.35)] border border-blue-soft/30"
                    : "border border-transparent"
                }`}
              >
                <BottomIcon id={t.id} />
              </span>
              <span>{textOf(t.label)}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] transition-colors ${
            moreOpen || moreTabs.some((t) => t.id === tab) ? "text-blue-soft" : "text-muted"
          }`}
        >
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              moreOpen || moreTabs.some((t) => t.id === tab)
                ? "bg-blue-soft/15 shadow-[0_0_16px_2px_rgba(61,107,255,0.35)] border border-blue-soft/30"
                : "border border-transparent"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
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

function StatCard({ icon, label, value, sub, valueClass, subClass }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  valueClass?: string; subClass?: string;
}) {
  return (
    <div className="rounded-2xl p-5 border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent bg-[#0B1120] transition-all duration-300 hover:border-blue-400/25 hover:shadow-[0_0_30px_-10px_rgba(59,130,255,0.35)]">
      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-3">
        {icon}
      </div>
      <div className="text-[10px] text-muted uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${valueClass ?? "text-white"}`}>{value}</div>
      <div className={`text-xs mt-1 ${subClass ?? "text-muted"}`}>{sub}</div>
    </div>
  );
}

function IconTrend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" />
    </svg>
  );
}
function IconDollar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5" />
    </svg>
  );
}
function IconBars() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="20" x2="6" y2="12" /><line x1="12" y1="20" x2="12" y2="8" /><line x1="18" y1="20" x2="18" y2="4" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
} 
function isMarketOpen() {
  const day = new Date().getDay();
  return day !== 0 && day !== 6;
}
function PerformanceTabRich({
  license,
  subscription,
  hasTrades,
  trades,
  netProfit,
  winRate,
  lastBalance,
}: any) {
  const [liveSnapshot, setLiveSnapshot] = useState<{
    balance: number;
    equity: number;
    floating_pl: number;
    open_positions_count: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSnapshot() {
      try {
        const res = await fetch("/api/dashboard/live-snapshot");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.ok) {
          setLiveSnapshot(data.snapshot);
        }
      } catch {
        // silencieux : on retentera au prochain cycle
      }
    }

    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
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

  const chrono = [...trades].reverse();
  const balances: number[] = chrono.map((t: any) => Number(t.balance_after ?? lastBalance));
  const firstDate = chrono[0]?.close_time;

  const wins = trades.filter((t: any) => Number(t.profit) > 0).length;
  const losses = trades.length - wins;

  const recentTrades = trades.slice(0, 3);

  return (
      <div className="flex flex-col gap-5 tab-fade">
        <h2 className="text-xs text-muted uppercase tracking-wide">Performances</h2>

        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-[28px] p-6 sm:p-8 border border-blue-400/15 bg-gradient-to-br from-[#0B1226] via-[#0A0F1F] to-[#060912] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/20 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />

          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 17 9 11 13 15 21 7" />
                  <polyline points="14 7 21 7 21 14" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[16px] text-white">OPR Edge™</div>
                <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-blue-300 bg-blue-500/10 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {license.status === "active" && isMarketOpen() ? "Robot actif" : "Robot inactif"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted uppercase tracking-wide">Performance totale</div>
              <div className={`text-[30px] font-bold mt-0.5 ${perfPositive ? "text-blue-300" : "text-red-400"}`}>
                {perfPositive ? "+" : ""}{perfPct.toFixed(2)} %
              </div>
              <div className="text-[10px] text-muted mt-0.5">{firstDate
              ? `Depuis le ${new Date(firstDate).toLocaleDateString("fr-FR")}`
              : "Depuis l'activation"}</div>
            </div>
          </div>

          <MiniSpark values={balances} dates={dates} positive={perfPositive} />


         <div className="flex items-center justify-between mt-3 text-[11px] text-muted relative z-10">
            {liveSnapshot && liveSnapshot.open_positions_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted uppercase tracking-wide">
                    Position{liveSnapshot.open_positions_count > 1 ? "s" : ""} ouverte{liveSnapshot.open_positions_count > 1 ? "s" : ""}
                    {liveSnapshot.open_positions_count > 1 ? ` (${liveSnapshot.open_positions_count})` : ""}
                  </span>
                  <span
                    className={`font-semibold text-[13px] ${
                      liveSnapshot.floating_pl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {liveSnapshot.floating_pl >= 0 ? "+" : ""}
                    {liveSnapshot.floating_pl.toFixed(2)} €
                  </span>
                </span>
              )}
          </div>
        </div>

        {/* 4 CARTES STATS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard
            icon={<IconTrend />}
            label="Capital"
            value={`${Math.round(lastBalance).toLocaleString("fr-FR")} €`}
            sub="Compte connecté"
          />
          <StatCard
            icon={<IconDollar />}
            label="Profit total"
            value={`${netProfit >= 0 ? "+" : ""}${Math.round(netProfit).toLocaleString("fr-FR")} €`}
            valueClass={perfPositive ? "text-blue-300" : "text-red-400"}
            sub={`${perfPositive ? "+" : ""}${perfPct.toFixed(2)} %`}
            subClass={perfPositive ? "text-blue-300" : "text-red-400"}
          />
          <StatCard
            icon={<IconBars />}
            label="Trades"
            value={String(trades.length)}
            sub="Depuis l'activation"
          />
          <StatCard
            icon={<IconTarget />}
            label="Win rate"
            value={`${winRate} %`}
            sub={`${wins} gagnants / ${losses} perdants`}
          />
        </div>

      <Card title="État du robot">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusItem
            label={license.status === "active" && isMarketOpen() ? "Robot actif" : "Robot inactif"}
            sub="Marché surveillé : NAS100"
            positive={license.status === "active" && isMarketOpen()}
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

function MiniSpark({
  values,
  dates,
  positive,
}: {
  values: number[];
  dates: string[];
  positive: boolean;
}) {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

  if (!values || values.length < 2) return null;
  const W = 386;
  const H = 110;
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
  const color = "#3B82FF";

  function updateHoverFromClientX(clientX: number, rect: DOMRect) {
    const relX = ((clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let closestDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - relX);
      if (d < closestDist) {
        closestDist = d;
        closest = i;
      }
    });
    setHover({ i: closest, x: coords[closest].x, y: coords[closest].y });
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    updateHoverFromClientX(e.clientX, e.currentTarget.getBoundingClientRect());
  }

  function handleTouchMove(e: React.TouchEvent<SVGSVGElement>) {
    const touch = e.touches[0];
    if (!touch) return;
    updateHoverFromClientX(touch.clientX, e.currentTarget.getBoundingClientRect());
  }

  const h = hover ? { value: values[hover.i], date: dates[hover.i] } : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        className="mt-4 relative z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setHover(null)}
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sparkGrad)" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(59,130,255,0.55))" }}
        />
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="3.5" fill={color} />

        {hover && (
          <>
            <line x1={hover.x} y1={0} x2={hover.x} y2={H} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 4" />
            <circle cx={hover.x} cy={hover.y} r={4} fill="#7FA1FF" />
          </>
        )}
      </svg>

      {h && (
        <div
          className="absolute bg-bg border border-line-strong rounded-lg px-3.5 py-2.5 text-xs pointer-events-none z-20"
          style={{
            left: `${(hover!.x / W) * 100}%`,
            top: 0,
            transform:
              hover!.x / W > 0.7 ? "translateX(-100%)" : hover!.x / W < 0.3 ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          <div className="text-muted-2 font-mono mb-1">
            {h.date ? new Date(h.date).toLocaleDateString("fr-FR") : "—"}
          </div>
          <div className="font-mono">Solde : {Math.round(h.value).toLocaleString("fr-FR")} €</div>
        </div>
      )}
    </div>
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
      <Card title="Application">
              <PWAInstallSettingsCard />
     </Card>
    </div>
  );
}
