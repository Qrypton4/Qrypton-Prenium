// lib/propFirmPlans.ts
// Source unique de vérité pour les licences Prop Firm : 3 capacités (10K / 20K
// / 40K) × 3 durées (mensuel / 6 mois / 12 mois) = 9 combinaisons.
//
// Séparé volontairement de lib/plans.ts (Fonds propres), qui garde son propre
// tarif à capacité unique. Aucun fichier ne dépendait de PROP_FIRM_PLANS avant
// cette mise à jour — la réécriture ne casse donc rien d'existant.
//
// Chaque combinaison référence une variable d'environnement distincte pour
// son price_id Stripe. Tant que la variable n'existe pas, le paiement échoue
// proprement avec un message explicite (voir app/api/checkout/route.ts) —
// jamais de prix codé en dur envoyé à Stripe.

export type PropFirmCapacityKey = "10k" | "20k" | "40k";
export type PropFirmDurationKey = "monthly" | "six_months" | "twelve_months";
export type PropFirmPlanKey = `${PropFirmCapacityKey}_${PropFirmDurationKey}`;

export interface PropFirmCapacityInfo {
  key: PropFirmCapacityKey;
  amountLabel: string; // "10K"
  title: string; // "Licence 10K"
  capitalEUR: number; // 10000
  description: string; // "Compatible avec un capital total jusqu'à 10 000 €"
}

export interface PropFirmDurationInfo {
  key: PropFirmDurationKey;
  label: string; // "Mensuel"
  months: number; // 1, 6, 12
  badge: string;
  highlight: boolean; // "Meilleur tarif — recommandé"
}

export interface PropFirmPlanConfig {
  key: PropFirmPlanKey;
  capacity: PropFirmCapacityKey;
  duration: PropFirmDurationKey;
  label: string; // "Qrypton 20K — 12 mois"
  priceEUR: number;
  billingMonths: number;
  activeMonths: number;
  bonusMonths: number;
  compareToMonthly: number | null;
  savingsEUR: number | null;
  stripePriceEnvVar: string;
}

export const PROP_FIRM_CAPACITIES: PropFirmCapacityInfo[] = [
  {
    key: "10k",
    amountLabel: "10K",
    title: "Licence 10K",
    capitalEUR: 10000,
    description: "Compatible avec un capital total jusqu'à 10 000 €",
  },
  {
    key: "20k",
    amountLabel: "20K",
    title: "Licence 20K",
    capitalEUR: 20000,
    description: "Compatible avec un capital total jusqu'à 20 000 €",
  },
  {
    key: "40k",
    amountLabel: "40K",
    title: "Licence 40K",
    capitalEUR: 40000,
    description: "Compatible avec un capital total jusqu'à 40 000 €",
  },
];

export const PROP_FIRM_DURATIONS: PropFirmDurationInfo[] = [
  { key: "monthly", label: "Mensuel", months: 1, badge: "Sans engagement", highlight: false },
  { key: "six_months", label: "6 mois", months: 6, badge: "", highlight: false },
  { key: "twelve_months", label: "12 mois", months: 12, badge: "Meilleur tarif · recommandé", highlight: true },
];

// priceEUR par capacité et par durée — seule source de vérité pour les montants affichés.
const PRICE_TABLE: Record<PropFirmCapacityKey, Record<PropFirmDurationKey, number>> = {
  "10k": { monthly: 39, six_months: 199, twelve_months: 299 },
  "20k": { monthly: 59, six_months: 299, twelve_months: 499 },
  "40k": { monthly: 79, six_months: 399, twelve_months: 699 },
};

function envVarFor(capacity: PropFirmCapacityKey, duration: PropFirmDurationKey): string {
  const cap = capacity.toUpperCase(); // "10K"
  const dur = duration === "monthly" ? "MONTHLY" : duration === "six_months" ? "6M" : "12M";
  return `NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_${cap}_${dur}`;
}

function buildPlan(capacity: PropFirmCapacityKey, duration: PropFirmDurationKey): PropFirmPlanConfig {
  const capacityInfo = PROP_FIRM_CAPACITIES.find((c) => c.key === capacity)!;
  const durationInfo = PROP_FIRM_DURATIONS.find((d) => d.key === duration)!;
  const priceEUR = PRICE_TABLE[capacity][duration];
  const monthlyPrice = PRICE_TABLE[capacity].monthly;
  const compareToMonthly = durationInfo.months > 1 ? monthlyPrice * durationInfo.months : null;
  const savingsEUR = compareToMonthly !== null ? compareToMonthly - priceEUR : null;

  return {
    key: `${capacity}_${duration}`,
    capacity,
    duration,
    label: `Qrypton ${capacityInfo.amountLabel} — ${durationInfo.label}`,
    priceEUR,
    billingMonths: durationInfo.months,
    activeMonths: durationInfo.months,
    bonusMonths: 0,
    compareToMonthly,
    savingsEUR,
    stripePriceEnvVar: envVarFor(capacity, duration),
  };
}

export const PROP_FIRM_PLANS: Record<PropFirmPlanKey, PropFirmPlanConfig> = Object.fromEntries(
  PROP_FIRM_CAPACITIES.flatMap((c) =>
    PROP_FIRM_DURATIONS.map((d) => [`${c.key}_${d.key}`, buildPlan(c.key, d.key)])
  )
) as Record<PropFirmPlanKey, PropFirmPlanConfig>;

export function getPropFirmPlan(key: string): PropFirmPlanConfig | null {
  return key in PROP_FIRM_PLANS ? PROP_FIRM_PLANS[key as PropFirmPlanKey] : null;
}

/** Prix mensuel équivalent, pour l'affichage ("41,58 € / mois"). */
export function getPropFirmMonthlyEquivalent(plan: PropFirmPlanConfig): number {
  return plan.priceEUR / plan.billingMonths;
}
