import { PerformanceSummary } from "@/lib/performance";
import Link from "next/link";

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
        </p><div className="flex justify-end mt-5">
  <Link
    href="/#risk-simulator"
    className="px-4 py-2 rounded-lg text-[12.5px] font-medium bg-blue/10 border border-blue/20 text-blue-soft hover:bg-blue/20 hover:border-blue/40 transition"
  >
    Calculer votre risque
  </Link>
</div>
      </div>

      {/* Ce que les chiffres bruts ne montrent pas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        <div className="bg-bg-2 p-6">
          <div className="text-[10.5px] text-muted uppercase tracking-wide mb-2">Ratio de Sharpe</div>
          <div className="font-mono text-2xl font-semibold text-white">
            {s.sharpeRatio ? s.sharpeRatio.toFixed(2) : "—"}
          </div>
          <p className="text-[11.5px] text-muted-2 leading-relaxed mt-3">
            Mesure la régularité des performances par rapport au risque pris, en faisant une
            moyenne entre les périodes positives et négatives. Plus il est élevé, plus la
            performance est régulière : en dessous de 1 c&apos;est faible, autour de 2 c&apos;est
            considéré comme bon, au-dessus de 3 c&apos;est excellent.
          </p>
        </div>
        <div className="bg-bg-2 p-6">
          <div className="text-[10.5px] text-muted uppercase tracking-wide mb-2">Effet boule de neige</div>
          <div className="font-mono text-2xl font-semibold text-white">0,5 % du capital</div>
          <p className="text-[11.5px] text-muted-2 leading-relaxed mt-3">
            Le robot risque toujours 0,5 % du capital du moment, pas un montant fixe en euros.
            Résultat : plus le compte grossit, plus les gains (et les pertes) en euros grossissent
            avec lui — comme une boule de neige qui prend du volume en roulant.
          </p>
        </div>
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
