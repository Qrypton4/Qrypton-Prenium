import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

// Nom du fichier dans le bucket Supabase Storage "tutorials" (privé).
// À adapter si tu renommes le fichier une fois uploadé.
const VIDEO_FILE = "guide-installation.mp4";
const BUCKET = "tutorials";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "not_authenticated" }, { status: 401 });
  }

  // Le bucket est privé : seule une URL signée, générée ici côté serveur pour
  // un utilisateur authentifié, permet d'accéder à la vidéo. Valable 1h,
  // largement suffisant pour visionner le tuto sans que le lien reste
  // exploitable indéfiniment s'il fuite.
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(VIDEO_FILE, 60 * 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ ok: false, message: "video_unavailable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, url: data.signedUrl });
}
