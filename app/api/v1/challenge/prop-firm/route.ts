// app/api/v1/challenge/prop-firm/route.ts
// Agrège tout ce qu'affiche /challenge-prop-firm : config statique, dernier instantané
// balance/équité (heartbeat), et statistiques calculées à partir des trades clôturés.
// Chaque section a un flag *Available — la page affiche un état "en attente" tant que
// la donnée réelle correspondante n'existe pas. Aucune valeur n'est jamais inventée.

import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  const { data: challenge } = await supabase
    .from("prop_challenges")
    .select("*, licenses(id)")
    .eq("is_public", true)
    .single();

  if (!challenge) {
    return NextResponse.json({ configAvailable: false });
  }

  const licenseId = challenge.license_id;

  const { data: snapshot } = await supabase
    .from("account_snapshots")
    .select("*")
    .eq("license_id", licenseId)
    .order("captured_at", { ascending: false })
    .limit(1)
    .single();

  const { data: trades } = await supabase
    .from("live_trades")
    .select("*")
    .eq("license_id", licenseId)
    .order("close_time", { ascending: true });

  const daysElapsed = Math.floor(
    (Date.now() - new Date(challenge.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const base = {
    configAvailable: true,
    config: {
      brokerName: challenge.broker_name,
      platform: challenge.platform,
      robotName: challenge.robot_name,
      accountSize: challenge.account_size,
      startDate: challenge.start_date,
      status: challenge.status,
      daysElapsed,
    },
    snapshotAvailable: !!snapshot,
    snapshot: snapshot
      ? {
          balance: snapshot.balance,
          equity: snapshot.equity,
          floatingPL: snapshot.floating_pl,
          openPositionsCount: snapshot.open_positions_count,
          capturedAt: snapshot.captured_at,
        }
      : null,
    tradesAvailable: !!trades && trades.length > 0,
  };

  if (!trades || trades.length === 0) {
    return NextResponse.json({ ...base, stats: null, equityCurve: [], monthly: [], weekly: [], trades: [] });
  }

  const wins = trades.filter((t) => t.profit > 0);
  const losses = trades.filter((t) => t.profit <= 0);
  const grossWin = wins.reduce((s, t) => s + Number(t.profit), 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + Number(t.profit), 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : null;
  const winRate = (wins.length / trades.length) * 100;
  const biggestWin = wins.length > 0 ? Math.max(...wins.map((t) => Number(t.profit))) : null;
  const biggestLoss = losses.length > 0 ? Math.min(...losses.map((t) => Number(t.profit))) : null;

  let peak = challenge.account_size;
  const equityCurve = trades.map((t) => {
    const bal = Number(t.balance_after);
    if (bal > peak) peak = bal;
    const drawdownPct = ((peak - bal) / peak) * 100;
    return {
      date: t.close_time,
      capital: bal,
      cumulativeProfit: bal - Number(challenge.account_size),
      drawdownPct: Number(drawdownPct.toFixed(2)),
    };
  });

  const currentDrawdownPct = snapshot
    ? Number((((peak - snapshot.equity) / peak) * 100).toFixed(2))
    : null;
  const maxDrawdownPct = Math.max(...equityCurve.map((p) => p.drawdownPct));

  // Agrégation mensuelle
  const monthlyMap = new Map<string, { year: number; month: number; gainEUR: number }>();
  for (const t of trades) {
    const d = new Date(t.close_time);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const entry = monthlyMap.get(key) || { year: d.getFullYear(), month: d.getMonth() + 1, gainEUR: 0 };
    entry.gainEUR += Number(t.profit);
    monthlyMap.set(key, entry);
  }
  const monthly = Array.from(monthlyMap.values());

  // Agrégation hebdomadaire
  const weeklyMap = new Map<string, { weekStart: string; gainEUR: number }>();
  for (const t of trades) {
    const d = new Date(t.close_time);
    const day = d.getDay();
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - day);
    const key = weekStart.toISOString().slice(0, 10);
    const entry = weeklyMap.get(key) || { weekStart: key, gainEUR: 0 };
    entry.gainEUR += Number(t.profit);
    weeklyMap.set(key, entry);
  }
  const weekly = Array.from(weeklyMap.values());

  return NextResponse.json({
    ...base,
    stats: {
      totalTrades: trades.length,
      winRate: Number(winRate.toFixed(2)),
      profitFactor: profitFactor !== null ? Number(profitFactor.toFixed(2)) : null,
      biggestWin,
      biggestLoss,
      currentDrawdownPct,
      maxDrawdownPct: Number(maxDrawdownPct.toFixed(2)),
    },
    equityCurve,
    monthly,
    weekly,
    trades: trades.slice(-30).reverse(),
  });
}
