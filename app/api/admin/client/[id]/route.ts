import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getClientDetail } from "@/lib/adminData";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: "forbidden" }, { status: auth.status });
  }

  const detail = await getClientDetail(params.id);
  return NextResponse.json({ ok: true, client: detail });
}
