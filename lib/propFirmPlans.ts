// lib/propFirmPlans.ts
// Source unique de vérité pour la tarification Qrypton Prop Firm.
//
// Principe (brief tarification Prop Firm) : le prix dépend UNIQUEMENT du
// capital nominal du compte Prop Firm utilisé — jamais du nom de la Prop
// Firm, des frais qu'elle facture, ni des performances/solde du compte.
// La même tranche s'applique donc pour FTMO, FundedNext, ou toute autre
// Prop Firm ajoutée plus tard.
//
// Toute la logique de tarification est centralisée ici, dans une seule
// fonction (getPropFirmPricing), pour ne jamais dupliquer les seuils
// ailleurs dans le code.
//
// IMPORTANT : les stripePriceEnvVar sont préparés pour la connexion future.
// Aucune variable d'environnement correspondante n'existe encore et aucun
// checkout ne les lit — conformément à la consigne de ne pas créer les
// produits Stripe avant validation finale.

export type PropFirmBillingPeriod = "monthly" | "six_months" | "twelve_months";

export interface PropFirmTierConfig {
  key: string; // ex. "25k", "50k", "100k", "200k" — utilisé pour les env vars Stripe
  label: string; // ex. "Jusqu'à 25 000 €"
  capitalMin: number; // borne basse incluse (en €)
  capitalMax: number | null; // borne haute incluse (en €), null = pas de plafond
  prices: {
    monthly: number;
    six_months: number;
    twelve_months: number;
  };
  stripePriceEnvVars: {
    monthly: string;
    six_months: string;
    twelve_months: string;
  };
}

// Bornes strictes (voir §9 du brief) :
// ≤ 25 000 € -> tranche 25k
// 25 001 - 50 000 € -> tranche 50k
// 50 001 - 100 000 € -> tranche 100k
// > 100 000 € -> tranche 200k (illimité vers le haut)
export const PROP_FIRM_TIERS: PropFirmTierConfig[] = [
  {
    key: "25k",
    label: "Jusqu'à 25 000 €",
    capitalMin: 0,
    capitalMax: 25000,
    prices: { monthly: 29, six_months: 149, twelve_months: 299 },
    stripePriceEnvVars: {
      monthly: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_25K_MONTHLY",
      six_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_25K_6M",
      twelve_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_25K_12M",
    },
  },
  {
    key: "50k",
    label: "25 001 € — 50 000 €",
    capitalMin: 25001,
    capitalMax: 50000,
    prices: { monthly: 49, six_months: 249, twelve_months: 499 },
    stripePriceEnvVars: {
      monthly: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_50K_MONTHLY",
      six_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_50K_6M",
      twelve_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_50K_12M",
    },
  },
  {
    key: "100k",
    label: "50 001 € — 100 000 €",
    capitalMin: 50001,
    capitalMax: 100000,
    prices: { monthly: 79, six_months: 399, twelve_months: 799 },
    stripePriceEnvVars: {
      monthly: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_100K_MONTHLY",
      six_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_100K_6M",
      twelve_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_100K_12M",
    },
  },
  {
    key: "200k",
    label: "Plus de 100 000 €",
    capitalMin: 100001,
    capitalMax: null,
    prices: { monthly: 119, six_months: 599, twelve_months: 1199 },
    stripePriceEnvVars: {
      monthly: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_200K_MONTHLY",
      six_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_200K_6M",
      twelve_months: "NEXT_PUBLIC_STRIPE_PRICE_ID_PROPFIRM_200K_12M",
    },
  },
];

export const PROP_FIRM_INCLUDED_ACCOUNTS = 1;
export const PROP_FIRM_EXTRA_ACCOUNT_PRICE_EUR = 49; // +49€/mois par compte supplémentaire

export function getPropFirmTier(capital: number): PropFirmTierConfig {
  if (!Number.isFinite(capital) || capital < 0) {
    throw new Error(`Capital Prop Firm invalide : ${capital}`);
  }

  const tier = PROP_FIRM_TIERS.find(
    (t) => capital >= t.capitalMin && (t.capitalMax === null || capital <= t.capitalMax)
  );

  if (!tier) {
    throw new Error(`Aucune tranche Prop Firm trouvée pour un capital de ${capital} €`);
  }

  return tier;
}

export function getPropFirmPricing(capital: number, billing: PropFirmBillingPeriod) {
  const tier = getPropFirmTier(capital);
  return {
    tier,
    priceEUR: tier.prices[billing],
    billing,
  };
}

export function isPropFirmSubscriptionCompliant(capital: number, subscribedTierKey: string): boolean {
  const requiredTier = getPropFirmTier(capital);
  return requiredTier.key === subscribedTierKey;
}
