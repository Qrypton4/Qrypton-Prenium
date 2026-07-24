// app/api/v1/account/heartbeat/route.ts
// Appelée automatiquement par le robot (OPR_Heartbeat.mqh) toutes les X minutes,
// pour que la balance/équité affichées soient réellement en temps réel — pas seulement
// mises à jour à la clôture d'un trade.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { license_key, account_login, balance, equity, floating_pl, open_positions_count } = body;

  if (!license_key || !account_login || balance === undefined || equity === undefined) {
    return NextResponse.json({ ok: false, message: "missing_fields" }, { status: 400 });
  }

  const { data: license } = await supabase
    .from("licenses")
    .select("id, mt5_account_login, status")
    .eq("license_key", license_key)
    .single();

  if (!license || license.status !== "active" || license.mt5_account_login !== account_login) {
    return NextResponse.json({ ok: false, message: "invalid_license_or_account" }, { status: 403 });
  }

  const { error } = await supabase.from("account_snapshots").insert({
    license_id: license.id,
    balance,
    equity,
    floating_pl,
    open_positions_count,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
