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

  // Recalcule gainPct de chaque mois à partir du capital réel cumulé
  let capital = raw.summary.initialCapital;
  const monthly: MonthlyRow[] = sortedMonthly.map((r) => {
    const gainPct = (r.gainEUR / capital) * 100;
    capital += r.gainEUR;
    return { ...r, gainPct: Math.round(gainPct * 100) / 100 };
  });

  const finalCapital = Math.round(capital * 100) / 100;
  const netProfitEUR =
    Math.round((finalCapital - raw.summary.initialCapital) * 100) / 100;
  const netProfitPct =
    Math.round((finalCapital / raw.summary.initialCapital - 1) * 100 * 100) / 100;

  return {
    ...raw,
    summary: { ...raw.summary, finalCapital, netProfitEUR, netProfitPct },
    monthly,
  };
}
