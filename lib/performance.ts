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
  return performanceData as unknown as PerformanceData;
}
