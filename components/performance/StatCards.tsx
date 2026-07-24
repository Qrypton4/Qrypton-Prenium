"use client";

import { CountUp } from "@/components/Animated";
import { PerformanceSummary } from "@/lib/performance";

export default function StatCards({ s }: { s: PerformanceSummary }) {
  const cards: {
    label: string;
    value: number | null;
    suffix?: string;
    decimals?: number;
    positive?: boolean;
    note?: string;
  }[] = [
    { label: "Capital initial", value: s.initialCapital, suffix: " €", decimals: 0 },
    { label: "Capital final", value: s.finalCapital, suffix: " €", decimals: 0, positive: true },
    { label: "Gain total", value: s.netProfitEUR, suffix: " €", decimals: 0, positive: true },
    { label: "Gain total", value: s.netProfitPct, suffix: " %", decimals: 2, positive: true },
    { label: "Profit Factor", value: s.profitFactor, decimals: 2 },
    { label: "Win Rate", value: s.winRate, suffix: " %", decimals: 2 },
    { label: "Trades", value: s.totalTrades, decimals: 0 },
    {
      label: "Drawdown max (solde)",
      value: s.maxDrawdownPct,
      suffix: " %",
      decimals: 2,
      note: s.maxDrawdownEquityPct ? `${s.maxDrawdownEquityPct.toFixed(2)} % en équité` : undefined,
    },
    { label: "Pertes consécutives max", value: s.maxConsecutiveLosses, decimals: 0 },
    { label: "Ratio risque/rendement moyen", value: s.avgRiskReward, decimals: 2 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line rounded-2xl overflow-hidden">
      {cards.map((c) => (
        <div key={c.label} className="bg-bg-2 p-6">
          <div className="text-[10.5px] text-muted uppercase tracking-wide mb-2">{c.label}</div>
          {c.value === null ? (
            <div className="font-mono text-lg text-muted-2">—</div>
          ) : (
            <>
              <CountUp
                value={c.value}
                suffix={c.suffix}
                decimals={c.decimals}
                className={`font-mono text-2xl font-semibold ${c.positive ? "text-positive" : "text-white"}`}
              />
              {c.note && <div className="text-[10px] text-muted-2 mt-1">{c.note}</div>}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
