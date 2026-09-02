// app/api/license/reset/route.ts
// Permet à un client connecté de délier sa propre licence de son compte MT5
// actuel, pour pouvoir l'activer sur un nouveau compte (ex: après l'échec
// d'un challenge prop firm). N'affecte jamais que la licence de l'utilisateur
// connecté — jamais celle d'un autre client.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  // .order + .limit(1) plutôt que .single() seul — même correctif que pour
  // lib/license.ts, app/mon-espace/page.tsx et live-snapshot/route.ts.
  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, mt5_account_login, reset_count")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!license) {
    return NextResponse.json({ ok: false, message: "no_license" }, { status: 404 });
  }

  if (!license.mt5_account_login) {
    return NextResponse.json({ ok: false, message: "already_unlinked" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("licenses")
    .update({
      mt5_account_login: null,
      mt5_broker: null,
      activated_at: null,
      reset_count: (license.reset_count ?? 0) + 1,
    })
    .eq("id", license.id);

  if (error) {
    return NextResponse.json({ ok: false, message: "reset_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
