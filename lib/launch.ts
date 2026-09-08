import { supabaseAdmin } from "@/lib/supabase";

// Ouverture publique des abonnements Qrypton — inchangé.
export const PUBLIC_LAUNCH_AT = new Date("2026-09-22T00:00:00+02:00");

// Les personnes préinscrites peuvent s'abonner 24h avant tout le monde,
// donc à partir du 21 septembre minuit.
export const EARLY_ACCESS_AT = new Date(PUBLIC_LAUNCH_AT.getTime() - 24 * 60 * 60 * 1000);

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
export async function isSalesOpen(userEmail?: string | null): Promise<boolean> {
  if (isTestBypass(userEmail)) return true;

  const now = Date.now();
  if (now >= PUBLIC_LAUNCH_AT.getTime()) return true;
  if (now >= EARLY_ACCESS_AT.getTime()) {
    return await isPreregistered(userEmail);
  }
  return false;
}

export const SALES_CLOSED_MESSAGE =
  "Les abonnements ouvrent le 22 septembre 2026. Les personnes préinscrites peuvent s'abonner dès le 21 septembre, 24h avant tout le monde — inscrivez-vous gratuitement ci-dessous.";
