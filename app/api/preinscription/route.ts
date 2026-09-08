import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";

  if (!EMAIL_REGEX.test(rawEmail)) {
    return NextResponse.json({ ok: false, message: "Email invalide." }, { status: 400 });
  }

  const email = rawEmail.toLowerCase();

  const { error } = await supabaseAdmin.from("preinscriptions").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }
    return NextResponse.json({ ok: false, message: "Une erreur est survenue." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, alreadyRegistered: false });
}
