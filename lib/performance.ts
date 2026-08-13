import performanceData from "@/data/performance.json";

export interface EquityPoint {
  date: string;
  capital: number;
  cumulativeProfit: number;
  drawdownPct: number;
}

export interface MonthlyRow {
  year: number;
  month: number; // 1-12
  gainEUR: number;
  gainPct: number;
  drawdownPct: number;
}

export interface PerformanceSummary {
  initialCapital: number;
  finalCapital: number;
  netProfitEUR: number;
  netProfitPct: number;
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  maxDrawdownPct: number;
  maxDrawdownEquityPct?: number;
  maxConsecutiveLosses: number;
  avgRiskReward: number | null;
  sharpeRatio?: number;
}

export interface PerformanceData {
  meta: {
    backtestStart: string;
    backtestEnd: string;
    lastUpdated: string;
    dataComplete: boolean;
    sourceReport?: string;
    broker?: string;
    symbol?: string;
    timeframe?: string;
  };
  summary: PerformanceSummary;
  equityCurve: EquityPoint[];
  monthly: MonthlyRow[];
}

export function getPerformanceData(): PerformanceData {
  const raw = performanceData as unknown as PerformanceData;

  const sortedMonthly = [...raw.monthly].sort(
    (a, b) => a.year - b.year || a.month - b.month
  );

  // Recalcule gainPct de chaque mois + génère la courbe de capital automatiquement
  let capital = raw.summary.initialCapital;
  const monthly: MonthlyRow[] = [];
  const equityCurve: EquityPoint[] = [
    {
      date: `${raw.meta.backtestStart}`,
      capital: raw.summary.initialCapital,
      cumulativeProfit: 0,
      drawdownPct: 0,
    },
  ];

  for (const r of sortedMonthly) {
    const gainPct = (r.gainEUR / capital) * 100;
    capital += r.gainEUR;

    monthly.push({ ...r, gainPct: Math.round(gainPct * 100) / 100 });

    const lastDay = new Date(r.year, r.month, 0).getDate();
    const dateStr = `${r.year}-${String(r.month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    equityCurve.push({
      date: dateStr,
      capital: Math.round(capital * 100) / 100,
      cumulativeProfit:
        Math.round((capital - raw.summary.initialCapital) * 100) / 100,
      drawdownPct: r.drawdownPct,
    });
  }

  const finalCapital = Math.round(capital * 100) / 100;
  const netProfitEUR =
    Math.round((finalCapital - raw.summary.initialCapital) * 100) / 100;
  const netProfitPct =
    Math.round((finalCapital / raw.summary.initialCapital - 1) * 100 * 100) / 100;

  return {
    ...raw,
    summary: { ...raw.summary, finalCapital, netProfitEUR, netProfitPct },
    monthly,
    equityCurve,
  };
}
