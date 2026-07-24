// app/api/v1/license/verify/route.ts
// Endpoint appelé par le robot MT5 (OPR_LicenseCheck.mqh) pour valider la licence.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";


export async function POST(req: NextRequest) {
  const { license_key, account_login, account_broker, ea_version } = await req.json();

  if (!license_key || !account_login) {
    return NextResponse.json({ valid: false, message: "missing_fields" }, { status: 400 });
  }

  // 1. Récupérer la licence + statut de l'abonnement lié
  const { data: license } = await supabase
    .from("licenses")
    .select("*, subscriptions(status), products(slug)")
    .eq("license_key", license_key)
    .single();

  if (!license) {
    return NextResponse.json({ valid: false, message: "unknown_license" }, { status: 404 });
  }

  // 2. Abonnement actif ?
  const subActive = license.subscriptions?.status === "active";
  if (!subActive || license.status !== "active") {
    await logCheck(license.id, account_login, req, "invalid");
    return NextResponse.json({ valid: false, message: "subscription_inactive" });
  }

  // 3. Binding MT5 : 1 licence = 1 seul compte
  if (!license.mt5_account_login) {
    // première activation → on lie le compte
    await supabase
      .from("licenses")
      .update({
        mt5_account_login: account_login,
        mt5_broker: account_broker,
        activated_at: new Date().toISOString(),
        last_verified_at: new Date().toISOString(),
      })
      .eq("id", license.id);
  } else if (license.mt5_account_login !== account_login) {
    await logCheck(license.id, account_login, req, "mismatch");
    return NextResponse.json({
      valid: false,
      message: "license_bound_to_another_account",
    });
  } else {
    await supabase
      .from("licenses")
      .update({ last_verified_at: new Date().toISOString() })
      .eq("id", license.id);
  }

  await logCheck(license.id, account_login, req, "valid");

  return NextResponse.json({
    valid: true,
    product: license.products?.slug,
    revalidate_after_hours: 24,
  });
}

async function logCheck(
  licenseId: string,
  accountLogin: string,
  req: NextRequest,
  result: "valid" | "invalid" | "mismatch"
) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  await supabase.from("license_checks").insert({
    license_id: licenseId,
    mt5_account_login: accountLogin,
    ip_address: ip,
    result,
  });
}

// Rate limiting recommandé au niveau du edge/middleware :
// max ~10 requêtes / heure / license_key (une vérification par jour suffit en usage normal).
