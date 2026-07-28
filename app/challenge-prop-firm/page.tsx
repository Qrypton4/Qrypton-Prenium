import { getChallengeData, computeChallengeStats } from "@/lib/challenge";
import { Reveal } from "@/components/Animated";
import SyncBadge from "@/components/SyncBadge";
import SiteNavContainer from "@/components/SiteNavContainer";
import PositionsTable from "@/components/challenge/PositionsTable";
import LiveStatusBadge from "@/components/challenge/LiveStatusBadge";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Challenge Prop Firm en cours — Qrypton",
  description: "Suivi du challenge Prop Firm d'OPR Edge™ — résultats réels, distincts du backtest historique.",
};

const violet = "#8B5CF6";
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

export default async function ChallengePropFirm() {
  const data = getChallengeData();
  const stats = computeChallengeStats(data);
  const hasClosedTrades = data.closedTrades.length > 0;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const gainEUR = data.closedTrades.reduce((s, t) => s + t.profit, 0);
  const gainPct = (gainEUR / data.config.accountSize) * 100;

  return (
    <>
      <SiteNavContainer />

      <header
        className="border-b border-line px-6 md:px-12 py-10"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(61,107,255,0.05))" }}
      >
        <div className="max-w-[1160px] mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: violet }}>
              Résultat en direct
            </span>
            <SyncBadge date={data.lastUpdated} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <Info label="Broker / Prop Firm" value={data.config.brokerName} />
            <Info label="Plateforme" value={data.config.platform} />
            <Info label="Robot" value={data.config.robotName} />
            <Info label="Compte" value={`${data.config.accountSize.toLocaleString("fr-FR")} €`} />
            <LiveStatusBadge />
            <Info label="Début du challenge" value={new Date(data.config.startDate).toLocaleDateString("fr-FR")} />
            <Info
              label="Jours de trading"
              value={`${Math.floor((Date.now() - new Date(data.config.startDate).getTime()) / 86400000)} jours`}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-6 md:px-12 py-10 flex flex-col gap-10">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            <StatCard label="Capital actuel" value={`${data.snapshot.balance.toLocaleString("fr-FR")} €`} />
            <StatCard label="Équité actuelle" value={`${data.snapshot.equity.toLocaleString("fr-FR")} €`} />
            <StatCard label="Performance" value={`${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)} %`} positive={gainPct >= 0} />
            <StatCard label="Gain (€)" value={`${gainEUR >= 0 ? "+" : ""}${gainEUR.toLocaleString("fr-FR")} €`} positive={gainEUR >= 0} />
            <StatCard label="Drawdown actuel" value={stats.currentDrawdownPct !== null ? `${stats.currentDrawdownPct} %` : null} />
            <StatCard label="Drawdown maximum" value={stats.maxDrawdownPct !== null ? `${stats.maxDrawdownPct} %` : null} />
            <StatCard label="Nombre de trades clôturés" value={stats.totalTrades} />
            <StatCard label="Win Rate" value={stats.winRate !== null ? `${stats.winRate} %` : null} />
            <StatCard label="Profit Factor" value={stats.profitFactor ?? null} />
            <StatCard label="Plus gros gain" value={stats.biggestWin ? `+${stats.biggestWin.toLocaleString("fr-FR")} €` : null} positive />
            <StatCard label="Plus grosse perte" value={stats.biggestLoss ? `${stats.biggestLoss.toLocaleString("fr-FR")} €` : null} />
            <StatCard label="Positions ouvertes" value={data.snapshot.openPositionsCount} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-sm text-muted mb-4">Courbe d&apos;évolution du capital</h2>
          {hasClosedTrades ? (
            <div className="border border-line rounded-2xl bg-bg-2 p-6">
              <EquityLine points={data.equityCurve} />
            </div>
          ) : (
            <EmptyBlock label="En attente du premier trade clôturé" />
          )}
        </Reveal>

        

        <Reveal delay={0.2}>
          <h2 className="text-sm text-muted mb-4">Historique des positions</h2>
          {hasClosedTrades ? (
            <PositionsTable trades={data.closedTrades} />
          ) : (
            <EmptyBlock label="Aucun trade clôturé pour le moment" />
          )}
        </Reveal>

        <Reveal delay={0.25}>
          <div className="border-t border-line pt-8 text-xs text-muted-2 leading-relaxed">
            <p className="mb-2">
              Cette page présente les résultats réels d&apos;un challenge Prop Firm en cours, distincts
              du backtest historique présenté sur la page Performance. Données mises à jour
              manuellement chaque semaine à partir des relevés du compte.
            </p>
            <p>
              Qrypton est indépendant et n&apos;est ni affilié ni approuvé par {data.config.brokerName}.
              Les performances passées ne garantissent pas les résultats futurs.
            </p>
          </div>
        </Reveal>
      </main>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted uppercase tracking-wide mb-1">{label}</div>
      <div className="font-mono text-white">{value}</div>
    </div>
  );
}

function StatCard({ label, value, positive }: { label: string; value: string | number | null; positive?: boolean }) {
  return (
    <div className="bg-bg-2 p-5">
      <div className="text-[10px] text-muted uppercase tracking-wide mb-2">{label}</div>
      {value === null || value === undefined ? (
        <div className="font-mono text-lg text-muted-2">—</div>
      ) : (
        <div className={`font-mono text-lg font-semibold ${positive ? "text-positive" : "text-white"}`}>{value}</div>
      )}
    </div>
  );
}

function EmptyBlock({ label }: { label?: string }) {
  return (
    <div className="border border-line rounded-2xl bg-bg-2 p-12 text-center">
      <p className="text-sm text-muted">{label || "En attente de données"}</p>
    </div>
  );
}

function EquityLine({ points }: { points: { date: string; capital: number }[] }) {
  if (!points.length) return null;
  const W = 900, H = 220;
  const values = points.map((p) => p.capital);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const step = W / (points.length - 1 || 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${H - ((p.capital - min) / range) * H}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-52">
      <path d={path} fill="none" stroke={violet} strokeWidth="2" />
    </svg>
  );
}

function MonthlyCalendar({ monthly }: { monthly: { year: number; month: number; gainEUR: number }[] }) {
  return (
    <div className="border border-line rounded-2xl bg-bg-2 p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {monthly.map((m) => (
        <div
          key={`${m.year}-${m.month}`}
          className={`rounded-lg p-4 text-center ${m.gainEUR >= 0 ? "bg-positive/10" : "bg-red-400/10"}`}
        >
          <div className="text-[10px] text-muted-2">{MONTHS[m.month - 1]} {m.year}</div>
          <div className={`font-mono text-sm mt-1 ${m.gainEUR >= 0 ? "text-positive" : "text-red-400"}`}>
            {m.gainEUR >= 0 ? "+" : ""}{m.gainEUR.toFixed(2)} €
          </div>
        </div>
      ))}
    </div>
  );
}

function WeeklyResults({ weekly }: { weekly: { weekStart: string; gainEUR: number }[] }) {
  return (
    <div className="border border-line rounded-2xl bg-bg-2 p-6 flex flex-col gap-3">
      {weekly.map((w) => (
        <div key={w.weekStart} className="flex justify-between items-center text-sm border-b border-line pb-3 last:border-0 last:pb-0">
          <span className="text-muted font-mono text-xs">Semaine du {new Date(w.weekStart).toLocaleDateString("fr-FR")}</span>
          <span className={`font-mono ${w.gainEUR >= 0 ? "text-positive" : "text-red-400"}`}>
            {w.gainEUR >= 0 ? "+" : ""}{w.gainEUR.toFixed(2)} €
          </span>
        </div>
      ))}
    </div>
  );
}
