// lib/propFirmPlans.ts
// Source unique de vérité pour les offres Prop Firm.
// Structure calquée sur lib/plans.ts (Fonds propres) pour que la page
// /tarifs/prop-firm affiche exactement les mêmes cartes/boutons.
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
  compareToMonthly: number | null; // prix équivalent en mensuel, pour affichage barré
  savingsEUR: number | null;
  highlight: boolean; // badge "Meilleur choix"
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
    compareToMonthly: null,
    savingsEUR: null,
    highlight: false,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_MONTHLY",
  },
  six_months: {
    key: "six_months",
    label: "Qrypton Prop Firm — 6 mois",
    priceEUR: 699,
    billingMonths: 6,
    compareToMonthly: 894,
    savingsEUR: 195,
    highlight: false,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_6M",
  },
  twelve_months: {
    key: "twelve_months",
    label: "Qrypton Prop Firm — 12 mois",
    priceEUR: 999,
    billingMonths: 12,
    compareToMonthly: 1788,
    savingsEUR: 789,
    highlight: true,
    includedAccounts: 1,
    extraAccountPriceEUR: 49,
    stripePriceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_12M",
  },
};

export function getPropFirmPlan(key: string): PropFirmPlanConfig | null {
  return key in PROP_FIRM_PLANS ? PROP_FIRM_PLANS[key as PropFirmPlanKey] : null;
}
