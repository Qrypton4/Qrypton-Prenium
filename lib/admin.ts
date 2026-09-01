// lib/admin.ts
// Contrôle d'accès administrateur, partagé entre app/admin/page.tsx (existant)
// et toutes les nouvelles routes de "Gestion & Comptabilité". Un seul et même
// mécanisme (variable d'env ADMIN_EMAIL) — pas de second système de rôles.

import { createClient } from "@/lib/supabase-server";

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * À utiliser dans les routes API (app/api/admin/**\/route.ts).
 * Vérifie la session ET le rôle admin côté serveur — jamais côté client.
 * Retourne { ok: true, userId } ou { ok: false, status } si refusé.
 */
export async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; status: 401 | 403 }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, status: 401 };
  if (!isAdminEmail(user.email)) return { ok: false, status: 403 };

  return { ok: true, userId: user.id };
}
