import { getPerformanceData } from "@/lib/performance";
import StatCards from "@/components/performance/StatCards";
import EquityChart from "@/components/performance/EquityChart";
import MonthlyTable from "@/components/performance/MonthlyTable";
import Methodology from "@/components/performance/Methodology";
import RiskAnalysis from "@/components/performance/RiskAnalysis";
import { Reveal } from "@/components/Animated";
import SiteNav from "@/components/SiteNav";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Performance — Qrypton",
  description: "Résultats de backtest d'OPR Edge™, 01/01/2023 au 30/06/2026, capital initial 100 000 €.",
};

export default async function Performance() {
  const data = getPerformanceData();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteNav isLoggedIn={!!user} />

      <main className="max-w-[1000px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="text-center max-w-[640px] mx-auto mb-4">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Backtest {new Date(data.meta.backtestStart).getFullYear()} – {new Date(data.meta.backtestEnd).getFullYear()}
            </span>
            <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
              Performance d&apos;OPR Edge™.
            </h1>
            <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
              Capital initial de 100 000 € — résultats simulés du {new Date(data.meta.backtestStart).toLocaleDateString("fr-FR")} au 30 juin 2026.
            </p>
          </div>
        </Reveal>

        <div className="h-10" />

        <Reveal delay={0.05}>
          <StatCards s={data.summary} />
        </Reveal>

        <div className="h-10" />

        <Reveal delay={0.1}>
          <h2 className="text-sm text-muted mb-4">Courbe de capital</h2>
          <EquityChart points={data.equityCurve} />
        </Reveal>

        <div className="h-10" />

        <Reveal delay={0.15}>
          <h2 className="text-sm text-muted mb-4">Performance mensuelle</h2>
          <MonthlyTable rows={data.monthly} />
        </Reveal>

        <div className="h-10" />

        <Reveal delay={0.17}>
          <h2 className="text-sm text-muted mb-4">Gestion du risque — analyse</h2>
          <RiskAnalysis s={data.summary} />
        </Reveal>

        <div className="h-10" />

        <Reveal delay={0.2}>
          <Methodology broker={data.meta.broker} symbol={data.meta.symbol} timeframe={data.meta.timeframe} />
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-6 border border-line rounded-xl bg-bg-2 px-6 py-5 text-[12.5px] text-muted-2 leading-relaxed">
            Les performances passées ne garantissent pas les performances futures. Les résultats du
            backtest ont été obtenus sur des données historiques et servent uniquement à illustrer
            le comportement de la stratégie.
          </div>
        </Reveal>

        {!data.meta.dataComplete && (
          <p className="text-center text-xs text-muted-2 mt-10">
            Certaines données (courbe détaillée, tableau mensuel, ratio RR moyen) sont en attente
            du rapport de backtest complet.
          </p>
        )}
      </main>
    </>
  );
}
