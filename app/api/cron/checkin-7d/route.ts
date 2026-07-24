// app/api/cron/checkin-7d/route.ts
// À appeler une fois par jour par un scheduler externe (voir vercel.json).
// Envoie un email de suivi 7 jours après l'activation d'un abonnement.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { checkIn7DaysEmail } from "@/lib/email-templates";

const DAY = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id, user_id, created_at")
    .eq("status", "active");

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const now = Date.now();
  let sent = 0;

  for (const sub of subscriptions) {
    const ageDays = (now - new Date(sub.created_at).getTime()) / DAY;
    if (ageDays < 7) continue;

    const { data: already } = await supabase
      .from("email_log")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("email_type", "checkin_7d")
      .maybeSingle();
    if (already) continue;

    const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
    const email = userData.user?.email;
    if (!email) continue;
    const firstName = (userData.user?.user_metadata?.first_name as string) || "";

    const { subject, html } = checkIn7DaysEmail(firstName);
    if (await sendEmail({ to: email, subject, html })) {
      await supabase.from("email_log").insert({ user_id: sub.user_id, email_type: "checkin_7d" });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, checked: subscriptions.length });
}
