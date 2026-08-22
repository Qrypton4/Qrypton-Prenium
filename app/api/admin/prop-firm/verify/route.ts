import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail.toLowerCase();
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ ok: false, message: "forbidden" }, { status: 403 });
  }

  const { accountId } = await req.json();
  if (!accountId) {
    return NextResponse.json({ ok: false, message: "missing_account_id" }, { status: 400 });
  }

  const { data: account, error: fetchError } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("capital")
    .eq("id", accountId)
    .single();

  if (fetchError || !account) {
    return NextResponse.json({ ok: false, message: "account_not_found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("prop_firm_accounts")
    .update({ status: "verified", verified: true, capital_verified: account.capital })
    .eq("id", accountId);

  if (error) {
    return NextResponse.json({ ok: false, message: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
