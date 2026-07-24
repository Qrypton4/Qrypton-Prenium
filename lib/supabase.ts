import { createClient } from "@supabase/supabase-js";

// Client côté serveur uniquement (clé service_role) — utilisé dans les routes API.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
