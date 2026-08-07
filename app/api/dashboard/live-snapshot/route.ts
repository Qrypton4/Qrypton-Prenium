// app/api/dashboard/live-snapshot/route.ts
// Renvoie le dernier instantané (balance/equity/floating_pl/positions) du compte MT5
// lié à l'utilisateur connecté, pour affichage du P&L flottant en direct sur /mon-espace.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, mt5_account_login")
    .eq("user_id", user.id)
    .single();

  if (!license || !license.mt5_account_login) {
    return NextResponse.json({ ok: false, message: "no_account_linked" }, { status: 404 });
  }

  const { data: snapshot, error } = await supabaseAdmin
    .from("account_snapshots")
    .select("balance, equity, floating_pl, open_positions_count, captured_at")
    .eq("license_id", license.id)
    .order("captured_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !snapshot) {
    return NextResponse.json({ ok: false, message: "no_snapshot" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, snapshot });
}
