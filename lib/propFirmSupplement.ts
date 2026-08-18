// lib/propFirmSupplement.ts
// Logique centralisée du "Supplément Grande Allocation".
//
// Principe : le tarif Qrypton reste le tarif standard (79€/399€/699€) tant
// que le client n'a pas de compte Prop Firm réellement FUNDED avec un
// capital >= 80 000 €. Dès que c'est le cas, un supplément fixe s'ajoute à
// son abonnement Stripe existant (même produit, un item en plus), pour la
// même durée que son abonnement. Il ne dépend jamais des performances, des
// gains, ni du prix payé pour le challenge.
//
// Ne JAMAIS dupliquer ce seuil ou ces montants ailleurs — tout calcul de
// supplément doit passer par les fonctions de ce fichier.

import { PlanKey } from "@/lib/plans";

export const PROP_FIRM_SUPPLEMENT_THRESHOLD_EUR = 80000;

export const PROP_FIRM_SUPPLEMENT_EUR: Record<PlanKey, number> = {
  monthly: 20,
  six_months: 100,
  twelve_months: 200,
};

// Price IDs Stripe du supplément — à créer dans le dashboard Stripe puis
// renseigner ces variables d'environnement. Tant qu'elles sont absentes,
// syncPropFirmSubscription() refuse d'agir plutôt que d'échouer en silence.
export const PROP_FIRM_SUPPLEMENT_STRIPE_ENV_VAR: Record<PlanKey, string> = {
  monthly: "STRIPE_PRICE_ID_SUPPLEMENT_MONTHLY",
  six_months: "STRIPE_PRICE_ID_SUPPLEMENT_6M",
  twelve_months: "STRIPE_PRICE_ID_SUPPLEMENT_12M",
};

/** Le capital atteint-il le seuil de grande allocation ? */
export function isBigAllocation(capital: number): boolean {
  return capital >= PROP_FIRM_SUPPLEMENT_THRESHOLD_EUR;
}

/**
 * Le supplément doit-il s'appliquer à ce compte Prop Firm ?
 * status doit être exactement "active" (funded confirmé) — jamais pendant
 * le challenge ("pending_verification"), ni sur un compte suspendu/clôturé.
 */
export function shouldApplySupplement(status: string, capital: number): boolean {
  return status === "active" && isBigAllocation(capital);
}

export function getSupplementAmount(planKey: PlanKey): number {
  return PROP_FIRM_SUPPLEMENT_EUR[planKey];
}

export function getEffectivePriceEUR(
  basePriceEUR: number,
  planKey: PlanKey,
  supplementActive: boolean
): number {
  return supplementActive ? basePriceEUR + getSupplementAmount(planKey) : basePriceEUR;
}
