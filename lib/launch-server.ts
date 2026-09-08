import { supabaseAdmin } from "@/lib/supabase";
import { PUBLIC_LAUNCH_AT, EARLY_ACCESS_AT } from "@/lib/launch";

function isTestBypass(email: string | null | undefined): boolean {
  const bypassEmail = process.env.SALES_TEST_BYPASS_EMAIL;
  return !!bypassEmail && !!email && email.toLowerCase() === bypassEmail.toLowerCase();
}

async function isPreregistered(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const { data } = await supabaseAdmin
    .from("preinscriptions")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  return !!data;
}

// true = la personne peut s'abonner maintenant.
// N'importer ce fichier QUE depuis du code serveur (API routes, pages
// async côté serveur) — jamais depuis un composant "use client".
export async function isSalesOpen(userEmail?: string | null): Promise<boolean> {
  if (isTestBypass(userEmail)) return true;

  const now = Date.now();
  if (now >= PUBLIC_LAUNCH_AT.getTime()) return true;
  if (now >= EARLY_ACCESS_AT.getTime()) {
    return await isPreregistered(userEmail);
  }
  return false;
}
