import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const propFirmSlug = formData.get("propFirmSlug") as string;
  const mt5Account = (formData.get("mt5Account") as string)?.trim();
  const capital = Number(formData.get("capital"));
  const alreadyFunded = formData.get("alreadyFunded") === "true";
  const certified = formData.get("certified") === "true";
  const proof = formData.get("proof") as File | null;

  if (!propFirmSlug || !mt5Account || !Number.isFinite(capital) || capital <= 0) {
    return NextResponse.json({ ok: false, message: "invalid_input" }, { status: 400 });
  }
  if (!certified) {
    return NextResponse.json({ ok: false, message: "certification_required" }, { status: 400 });
  }
  if (!proof || proof.size === 0) {
    return NextResponse.json({ ok: false, message: "proof_required" }, { status: 400 });
  }

  const ext = proof.name.split(".").pop() || "jpg";
  const proofPath = `${user.id}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("prop-firm-proofs")
    .upload(proofPath, proof, { contentType: proof.type });

  if (uploadError) {
    return NextResponse.json({ ok: false, message: "upload_failed" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin.rpc("declare_prop_firm_account", {
    p_user_id: user.id,
    p_prop_firm_slug: propFirmSlug,
    p_mt5_account: mt5Account,
    p_capital: capital,
    p_already_funded: alreadyFunded,
    p_proof_path: proofPath,
  });

  if (error || !data?.ok) {
    await supabaseAdmin.storage.from("prop-firm-proofs").remove([proofPath]);

    const message = data?.message || "insert_failed";
    if (message === "allocation_exceeded") {
      return NextResponse.json(
        { ok: false, message: "allocation_exceeded", available: data.available },
        { status: 409 }
      );
    }
    if (message === "duplicate_account") {
      return NextResponse.json({ ok: false, message: "duplicate_account" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accountId: data.accountId });
}
