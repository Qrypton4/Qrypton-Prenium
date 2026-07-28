import { createClient } from "@/lib/supabase-server";
import { getLicenseStatus } from "@/lib/license";
import SiteNav from "./SiteNav";

export default async function SiteNavContainer() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const license = user ? await getLicenseStatus(user.id) : null;
  const firstName =
    (user?.user_metadata?.first_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    null;

  return <SiteNav isLoggedIn={!!user} firstName={firstName} license={license} />;
}
