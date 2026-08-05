// app/api/cron/seasonal-notice/route.ts
// Envoie le mail d'information estivale (août/septembre) une fois par an,
// le 31 juillet à 10h (heure française), à tous les utilisateurs ayant
// une licence active à cette date. Voir vercel.json pour la planification.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { seasonalNoticeEmail } from "@/lib/email-templates";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const year = new Date().getFullYear();
  const emailType = `seasonal_notice_${year}`;

  const { data: licenses } = await supabase
    .from("licenses")
    .select("id, user_id, active_license_until")
    .eq("status", "active");

  if (!licenses || licenses.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const now = new Date();
  let sent = 0;

  for (const lic of licenses) {
    // Licence toujours active à ce jour (pas de date de fin dépassée)
    if (lic.active_license_until && new Date(lic.active_license_until) < now) continue;

    const { data: already } = await supabase
      .from("email_log")
      .select("id")
      .eq("user_id", lic.user_id)
      .eq("email_type", emailType)
      .maybeSingle();
    if (already) continue;

    const { data: userData } = await supabase.auth.admin.getUserById(lic.user_id);
    const email = userData.user?.email;
    if (!email) continue;
    const firstName = (userData.user?.user_metadata?.first_name as string) || "";

    const { subject, html } = seasonalNoticeEmail(firstName);
    if (await sendEmail({ to: email, subject, html })) {
      await supabase.from("email_log").insert({ user_id: lic.user_id, email_type: emailType });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, checked: licenses.length });
}
