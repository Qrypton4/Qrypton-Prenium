import { supabaseAdmin } from "@/lib/supabase";

export type LicenseStatus = {
  active: boolean;
  robotName: string | null;
  licenseKey: string | null;
  expiresAt: string | null; // ISO date (active_license_until)
};

export async function getLicenseStatus(userId: string): Promise<LicenseStatus> {
  const supabase = supabaseAdmin;

  // .order + .limit(1) plutôt que .maybeSingle() seul : un utilisateur peut
  // avoir plusieurs lignes dans `licenses` au fil de ses abonnements
  // successifs (résiliations, renouvellements, tests). On ne veut toujours
  // que la plus récente — .maybeSingle() seul renvoie une erreur dès qu'il y
  // a plus d'une ligne, ce qui affichait "inactive" à tort.
  const { data, error } = await supabase
    .from("licenses")
    .select("status, active_license_until, license_key")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { active: false, robotName: null, licenseKey: null, expiresAt: null };
  }

  return {
    active: data.status === "active",
    robotName: "Qrypton NAS100",
    licenseKey: data.license_key ?? null,
    expiresAt: data.active_license_until ?? null,
  };
}
