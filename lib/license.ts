import { createClient } from "@/lib/supabase-server";

export type LicenseStatus = {
  active: boolean;
  robotName: string | null;
  licenseKey: string | null;
  expiresAt: string | null; // ISO date (active_license_until)
};

export async function getLicenseStatus(userId: string): Promise<LicenseStatus> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("licenses")
    .select("status, active_license_until, license_key")
    .eq("user_id", userId)
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
