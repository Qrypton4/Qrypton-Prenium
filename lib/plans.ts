// lib/plans.ts
// Source unique de vérité pour les 3 formules OPR Edge™.
// Chaque bouton d'achat référence une clé de prix Stripe distincte — à renseigner
// dans les variables d'environnement une fois les prix créés dans le dashboard Stripe.

export type PlanKey = "monthly" | "six_months" | "twelve_months";

export interface PlanConfig {
  key: PlanKey;
  label: string;
  priceEUR: number;
  billingMonths: number; // fréquence de facturation Stripe (tous les combien de mois)
  activeMonths: number; // mois d'utilisation active garantis (hors pause saisonnière)
  bonusMonths: number; // mois offerts en plus (uniquement l'offre 12 mois)
  compareToMonthly: number | null; // prix équivalent en mensuel, pour affichage barré
  savingsEUR: number | null;
  highlight: boolean; // badge "Meilleur choix"
  stripePriceEnvVar: string; // nom de la variable d'env contenant le price_id Stripe
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  monthly: {
    key: "monthly",
    label: "OPR Edge™ — Mensuel",
    priceEUR: 79,
    billingMonths: 1,
    activeMonths: 1,
    bonusMonths: 0,
    compareToMonthly: null,
    savingsEUR: null,
    highlight: false,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY",
  },
  six_months: {
    key: "six_months",
    label: "OPR Edge™ — 6 mois",
    priceEUR: 399,
    billingMonths: 6,
    activeMonths: 6,
    bonusMonths: 0,
    compareToMonthly: 474,
    savingsEUR: 75,
    highlight: false,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_6M",
  },
  twelve_months: {
    key: "twelve_months",
    label: "OPR Edge™ — 12 mois",
    priceEUR: 699,
    billingMonths: 12,
    activeMonths: 12,
    bonusMonths: 0,
    compareToMonthly: 948,
    savingsEUR: 249,
    highlight: true,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_12M",
  },
};

export function getPlan(key: string): PlanConfig | null {
  return key in PLANS ? PLANS[key as PlanKey] : null;
}

/**
 * Calcule la date de fin de licence (mois actifs + mois de facturation).
 */
export function computeLicenseEndDate(startDate: Date, plan: PlanConfig): Date {
  return addMonths(new Date(startDate), plan.activeMonths + plan.bonusMonths);
}
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
