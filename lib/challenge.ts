import challengeData from "@/data/challenge.json";

export interface OpenPosition {
  symbol: string;
  direction: "buy" | "sell";
  volume: number;
  openPrice: number;
  currentPrice: number;
  openTime: string;
  floatingPL: number;
}

export interface ClosedTrade {
  date: string;
  symbol: string;
  direction: "buy" | "sell";
  volume: number;
  entryPrice?: number;
  exitPrice?: number;
  slPrice?: number;
  tpPrice?: number;
  profit: number;
}

export interface ChallengeSummaryStats {
  totalTrades: number;
  winRate: number | null;
  profitFactor: number | null;
  biggestWin: number | null;
  biggestLoss: number | null;
  currentDrawdownPct: number | null;
  maxDrawdownPct: number | null;
}

export interface ChallengeData {
  config: {
    brokerName: string;
    platform: string;
    robotName: string;
    accountSize: number;
    startDate: string;
    status: string;
  };
  lastUpdated: string;
  snapshot: {
    balance: number;
    equity: number;
    floatingPL: number;
    swap: number;
    commission: number;
    openPositionsCount: number;
  };
  openPositions: OpenPosition[];
  closedTrades: ClosedTrade[];
  equityCurve: { date: string; capital: number }[];
  monthly: { year: number; month: number; gainEUR: number }[];
  weekly: { weekStart: string; gainEUR: number }[];
}

export function getChallengeData(): ChallengeData {
  return challengeData as unknown as ChallengeData;
}

export function computeChallengeStats(data: ChallengeData): ChallengeSummaryStats {
  const trades = data.closedTrades;

  // Le drawdown actuel se calcule toujours (équité vs pic), même sans trade clôturé.
  let peak = data.config.accountSize;
  for (const p of data.equityCurve) {
    if (p.capital > peak) peak = p.capital;
  }
  const currentDD = Number((((peak - data.snapshot.equity) / peak) * 100).toFixed(2));

  if (!trades || trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: null,
      profitFactor: null,
      biggestWin: null,
      biggestLoss: null,
      currentDrawdownPct: currentDD,
      maxDrawdownPct: currentDD,
    };
  }

  const wins = trades.filter((t) => t.profit > 0);
  const losses = trades.filter((t) => t.profit <= 0);
  const grossWin = wins.reduce((s, t) => s + t.profit, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.profit, 0));

  let maxDD = currentDD;
  for (const p of data.equityCurve) {
    const dd = ((peak - p.capital) / peak) * 100;
    if (dd > maxDD) maxDD = dd;
  }

  return {
    totalTrades: trades.length,
    winRate: Number(((wins.length / trades.length) * 100).toFixed(2)),
    profitFactor: grossLoss > 0 ? Number((grossWin / grossLoss).toFixed(2)) : null,
    biggestWin: wins.length ? Math.max(...wins.map((t) => t.profit)) : null,
    biggestLoss: losses.length ? Math.min(...losses.map((t) => t.profit)) : null,
    currentDrawdownPct: currentDD,
    maxDrawdownPct: Number(maxDD.toFixed(2)),
  };
}
