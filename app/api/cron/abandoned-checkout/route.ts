// app/api/cron/abandoned-checkout/route.ts
// À appeler périodiquement (ex: toutes les heures) par un scheduler externe —
// voir vercel.json pour la configuration Vercel Cron. Protégée par CRON_SECRET.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { abandonedCheckout24hEmail, abandonedCheckout3dEmail } from "@/lib/email-templates";

const HOUR = 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const { data: pending } = await supabase
    .from("checkout_attempts")
    .select("*")
    .is("completed_at", null);

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  let sent24h = 0;
  let sent3d = 0;

  for (const attempt of pending) {
    const createdAt = new Date(attempt.created_at).getTime();
    const ageHours = (now - createdAt) / HOUR;

    const { data: userData } = await supabase.auth.admin.getUserById(attempt.user_id);
    const email = userData.user?.email;
    if (!email) continue;
    const firstName = (userData.user?.user_metadata?.first_name as string) || "";

    if (ageHours >= 24 && !attempt.reminder_24h_sent_at) {
      const { subject, html } = abandonedCheckout24hEmail(firstName);
      if (await sendEmail({ to: email, subject, html })) {
        await supabase
          .from("checkout_attempts")
          .update({ reminder_24h_sent_at: new Date().toISOString() })
          .eq("id", attempt.id);
        await supabase.from("email_log").insert({ user_id: attempt.user_id, email_type: "abandoned_24h" });
        sent24h++;
      }
    }

    if (ageHours >= 72 && attempt.reminder_24h_sent_at && !attempt.reminder_3d_sent_at) {
      const { subject, html } = abandonedCheckout3dEmail(firstName);
      if (await sendEmail({ to: email, subject, html })) {
        await supabase
          .from("checkout_attempts")
          .update({ reminder_3d_sent_at: new Date().toISOString() })
          .eq("id", attempt.id);
        await supabase.from("email_log").insert({ user_id: attempt.user_id, email_type: "abandoned_3d" });
        sent3d++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent24h, sent3d, checked: pending.length });
}
