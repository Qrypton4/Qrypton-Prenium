// app/api/v1/trades/report/route.ts
// Appelée par le robot MT5 (OPR_LiveReport.mqh) juste après la clôture d'un trade.
// Authentification : la même license_key que celle utilisée pour /license/verify.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    license_key,
    account_login,
    symbol,
    direction,
    open_time,
    close_time,
    open_price,
    close_price,
    lot_size,
    profit,
    r_multiple,
    balance_after,
  } = body;

  if (!license_key || !account_login || profit === undefined) {
    return NextResponse.json({ ok: false, message: "missing_fields" }, { status: 400 });
  }

  // 1. Vérifier la licence (même logique que license/verify — compte doit être lié)
  const { data: license } = await supabase
    .from("licenses")
    .select("id, mt5_account_login, status")
    .eq("license_key", license_key)
    .single();

  if (!license || license.status !== "active" || license.mt5_account_login !== account_login) {
    return NextResponse.json({ ok: false, message: "invalid_license_or_account" }, { status: 403 });
  }

  // 2. Enregistrer le trade
  const { error } = await supabase.from("live_trades").insert({
    license_id: license.id,
    mt5_account_login: account_login,
    symbol,
    direction,
    open_time,
    close_time,
    open_price,
    close_price,
    lot_size,
    profit,
    r_multiple,
    balance_after,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Note : seule la licence marquée is_public_track_record=true alimente la page
// "Performance en direct" publique. Un abonné normal peut appeler cette même API
// pour son propre dashboard privé sans jamais apparaître sur la page publique.
