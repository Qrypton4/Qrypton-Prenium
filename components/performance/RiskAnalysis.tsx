import { PerformanceSummary } from "@/lib/performance";

export default function RiskAnalysis({ s }: { s: PerformanceSummary }) {
  const worstCaseLoss = s.initialCapital * 0.005 * s.maxConsecutiveLosses;
  const worstCasePct = (worstCaseLoss / s.initialCapital) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Pourquoi 0,5% */}
      <div className="border border-line rounded-2xl bg-bg-2 p-7">
        <h3 className="font-display text-base font-semibold mb-3">Pourquoi le risque est limité à 0,5 %</h3>
        <p className="text-sm text-muted leading-relaxed">
          À 0,5 % par position, une série de {s.maxConsecutiveLosses} pertes consécutives — la pire
          observée sur l&apos;ensemble du backtest — ne représente qu&apos;environ{" "}
          <strong className="text-white">{worstCasePct.toFixed(1)} %</strong> de baisse du capital
          (soit {Math.round(worstCaseLoss).toLocaleString("fr-FR")} € sur un compte de{" "}
          {s.initialCapital.toLocaleString("fr-FR")} €). Le dimensionnement du risque n&apos;est pas
          arbitraire : il est calibré pour que même le pire scénario historique reste largement
          gérable.
        </p>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        <AnalysisStat label="Drawdown maximal" value={`${s.maxDrawdownPct} %`} sub={s.maxDrawdownEquityPct ? `${s.maxDrawdownEquityPct} % en équité` : undefined} />
        <AnalysisStat label="Pertes consécutives max" value={`${s.maxConsecutiveLosses} trades`} />
        <AnalysisStat label="Ratio rendement / risque" value={`${s.avgRiskReward?.toFixed(2)}`} sub="moyenne réalisée" />
        <AnalysisStat label="Profit Factor" value={s.profitFactor.toFixed(2)} sub={s.profitFactor > 1 ? "gains > pertes" : undefined} />
      </div>

      {/* Analyse de stabilité */}
      <div className="border border-line rounded-2xl bg-bg-2 p-7">
        <h3 className="font-display text-base font-semibold mb-3">Analyse de la stabilité</h3>
        <p className="text-sm text-muted leading-relaxed">
          Avec un Profit Factor de <strong className="text-white">{s.profitFactor.toFixed(2)}</strong>,
          la stratégie génère environ {s.profitFactor.toFixed(2)} € de gains pour chaque euro perdu sur
          l&apos;ensemble des {s.totalTrades} trades du backtest. Le drawdown maximal observé (
          {s.maxDrawdownPct} % en solde) reste contenu malgré un taux de réussite modéré (
          {s.winRate} %) — cohérent avec une stratégie à faible Win Rate mais à ratio
          rendement/risque élevé (RR moyen {s.avgRiskReward?.toFixed(2)}), où la régularité vient du
          contrôle du risque plutôt que d&apos;un taux de trades gagnants élevé.
        </p>
      </div>
    </div>
  );
}

function AnalysisStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-bg-2 p-5">
      <div className="text-[10.5px] text-muted uppercase tracking-wide mb-2">{label}</div>
      <div className="font-mono text-xl font-semibold">{value}</div>
      {sub && <div className="text-[10px] text-muted-2 mt-1">{sub}</div>}
    </div>
  );
}
