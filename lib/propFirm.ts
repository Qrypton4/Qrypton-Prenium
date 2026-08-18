// lib/propFirm.ts
// Lecture de l'allocation Prop Firm, calculée en base via la vue
// prop_firm_allocation_status (voir database/migration_002_prop_firm.sql).
// Ce fichier ne fait que lire — aucune écriture, aucune logique de réservation
// ici (viendra dans une étape séparée, une fois le schéma validé en prod).

import { supabaseAdmin } from "@/lib/supabase";

export type PropFirmAllocationStatus = {
  slug: string;
  name: string;
  allocationMax: number | null; // null = règle non confirmée (ex. FundedNext)
  allocationUsed: number;
  allocationAvailable: number | null; // null si allocationMax est null
  isFull: boolean;
};

export async function getPropFirmAllocationStatus(
  slug: string
): Promise<PropFirmAllocationStatus | null> {
  const { data, error } = await supabaseAdmin
    .from("prop_firm_allocation_status")
    .select("prop_firm_id, name, slug, allocation_max, allocation_used, allocation_available")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  const allocationMax = data.allocation_max as number | null;
  const allocationAvailable = data.allocation_available as number | null;

  return {
    slug: data.slug,
    name: data.name,
    allocationMax,
    allocationUsed: Number(data.allocation_used ?? 0),
    allocationAvailable,
    isFull: allocationMax !== null && (allocationAvailable ?? 0) <= 0,
  };
}

export async function getAllPropFirmAllocationStatuses(): Promise<PropFirmAllocationStatus[]> {
  const { data, error } = await supabaseAdmin
    .from("prop_firm_allocation_status")
    .select("prop_firm_id, name, slug, allocation_max, allocation_used, allocation_available");

  if (error || !data) return [];

  return data.map((row) => {
    const allocationMax = row.allocation_max as number | null;
    const allocationAvailable = row.allocation_available as number | null;
    return {
      slug: row.slug,
      name: row.name,
      allocationMax,
      allocationUsed: Number(row.allocation_used ?? 0),
      allocationAvailable,
      isFull: allocationMax !== null && (allocationAvailable ?? 0) <= 0,
    };
  });
}
