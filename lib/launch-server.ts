import { supabaseAdmin } from "@/lib/supabase";
import { PUBLIC_LAUNCH_AT, EARLY_ACCESS_AT } from "@/lib/launch";

function isTestBypass(email: string | null | undefined): boolean {
  const bypassEmail = process.env.SALES_TEST_BYPASS_EMAIL;
  return !!bypassEmail && !!email && email.toLowerCase() === bypassEmail.toLowerCase();
}

// "Préinscrit" = a créé son compte Qrypton avant le début de l'accès anticipé.
async function isPreregistered(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("created_at")
    .eq("id", userId)
    .maybeSingle();
  if (!data?.created_at) return false;
  return new Date(data.created_at).getTime() < EARLY_ACCESS_AT.getTime();
}

// true = la personne peut s'abonner maintenant.
export async function isSalesOpen(
  user?: { id?: string | null; email?: string | null } | null
): Promise<boolean> {
  if (isTestBypass(user?.email)) return true;

  const now = Date.now();
  if (now >= PUBLIC_LAUNCH_AT.getTime()) return true;
  if (now >= EARLY_ACCESS_AT.getTime()) {
    return await isPreregistered(user?.id);
  }
  return false;
}
