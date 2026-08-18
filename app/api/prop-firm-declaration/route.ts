// app/api/prop-firm-declaration/route.ts
// Permet à un client connecté de déclarer un compte Prop Firm AVANT paiement
// (Cas 2 du brief : nouveau client déjà Funded). Cette déclaration détermine
// le prix affiché au checkout, mais reste "verified: false" jusqu'à
// vérification manuelle par l'admin — voir /admin et sync-prop-firm-subscription.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  const { propFirmSlug, mt5Account, capital, alreadyFunded } = await req.json();

  if (!propFirmSlug || !mt5Account || !Number.isFinite(capital) || capital <= 0) {
    return NextResponse.json({ ok: false, message: "invalid_input" }, { status: 400 });
  }

  const { data: firm, error: firmError } = await supabaseAdmin
    .from("prop_firms")
    .select("id")
    .eq("slug", propFirmSlug)
    .maybeSingle();

  if (firmError || !firm) {
    return NextResponse.json({ ok: false, message: "unknown_prop_firm" }, { status: 400 });
  }

  const status = alreadyFunded ? "active" : "pending_verification";

  const { data: account, error: insertError } = await supabaseAdmin
    .from("prop_firm_accounts")
    .insert({
      user_id: user.id,
      prop_firm_id: firm.id,
      mt5_account: mt5Account,
      capital,
      status,
      verified: false, // toujours à vérifier manuellement, même si déclaré Funded
      funded_at: alreadyFunded ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (insertError || !account) {
    return NextResponse.json({ ok: false, message: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accountId: account.id });
}
