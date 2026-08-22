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

  const { error: accountError } = await supabaseAdmin
    .from("prop_firm_accounts")
    .update({ status: "rejected" })
    .eq("id", accountId);

  if (accountError) {
    return NextResponse.json({ ok: false, message: "update_failed" }, { status: 500 });
  }

  const { error: reservationError } = await supabaseAdmin
    .from("allocation_reservations")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("prop_firm_account_id", accountId)
    .eq("status", "active");

  if (reservationError) {
    return NextResponse.json({ ok: false, message: "release_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
