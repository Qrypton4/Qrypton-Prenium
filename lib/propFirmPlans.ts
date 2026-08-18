// lib/propFirmPlans.ts
// Source unique de vérité pour les offres Prop Firm.
// Volontairement séparé de lib/plans.ts (Fonds propres) pour ne jamais risquer
// de modifier les prix/produits Stripe existants.
//
// IMPORTANT : stripePriceEnvVar est prévu pour la suite, mais aucune variable
// d'environnement correspondante n'existe encore et aucun checkout ne les lit.
// Les prix restent donc "de travail", modifiables ici sans toucher au reste
// du code.

export type PropFirmPlanKey = "monthly" | "six_months" | "twelve_months";

export interface PropFirmPlanConfig {
  key: PropFirmPlanKey;
  label: string;
  priceEUR: number;
  billingMonths: number;
  includedAccounts: number; // 1 compte Prop Firm inclus
  extraAccountPriceEUR: number; // +49€/mois par compte supplémentaire
  stripePriceEnvVar: string; // pas encore utilisé — préparé pour la connexion future
}

export const PROP_FIRM_PLANS: Record<PropFirmPlanKey, PropFirmPlanConfig> = {
  monthly: {
    key: "monthly",
    label: "Qrypton Prop Firm — Mensuel",
    priceEUR: 149,
    billingMonths: 1,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_MONTHLY",
  },
  six_months: {
    key: "six_months",
    label: "Qrypton Prop Firm — 6 mois",
    priceEUR: 699,
    billingMonths: 6,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_6M",
  },
  twelve_months: {
    key: "twelve_months",
    label: "Qrypton Prop Firm — 12 mois",
    priceEUR: 999,
    billingMonths: 12,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_12M",
  },
};

export function getPropFirmPlan(key: string): PropFirmPlanConfig | null {
  return key in PROP_FIRM_PLANS ? PROP_FIRM_PLANS[key as PropFirmPlanKey] : null;
}
