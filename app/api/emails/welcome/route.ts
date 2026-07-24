// app/api/emails/welcome/route.ts
// Appelée depuis app/inscription/page.tsx juste après un signUp() réussi.
// Alternative plus robuste en production : un Database Webhook Supabase sur
// l'insertion dans auth.users (évite de dépendre du client pour déclencher l'email).

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const { userId, email, firstName } = await req.json();

  if (!userId || !email) {
    return NextResponse.json({ ok: false, message: "missing_fields" }, { status: 400 });
  }

  // Évite les doublons si l'appel est déclenché deux fois
  const { data: already } = await supabaseAdmin
    .from("email_log")
    .select("id")
    .eq("user_id", userId)
    .eq("email_type", "welcome")
    .maybeSingle();

  if (already) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { subject, html } = welcomeEmail(firstName || "");
  const sent = await sendEmail({ to: email, subject, html });

  if (sent) {
    await supabaseAdmin.from("email_log").insert({ user_id: userId, email_type: "welcome" });
  }

  return NextResponse.json({ ok: sent });
}
