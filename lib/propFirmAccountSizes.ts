// lib/propFirmAccountSizes.ts
// Tailles de comptes affichées à l'étape "Quel capital souhaitez-vous
// utiliser ?" du parcours Prop Firm. Volontairement séparé de
// propFirmPlans.ts (qui gère la tarification Qrypton, pas les tailles de
// comptes que propose chaque Prop Firm).
//
// Modifiable facilement : ajouter/retirer un montant ici suffit, aucune
// autre partie du code n'a besoin d'être touchée.

export const PROP_FIRM_ACCOUNT_SIZES: Record<string, number[]> = {
  ftmo: [10000, 25000, 50000, 100000, 200000],
  fundednext: [10000, 25000, 50000, 100000, 200000],
};

export function getAccountSizesForFirm(slug: string): number[] {
  return PROP_FIRM_ACCOUNT_SIZES[slug] ?? [];
}
