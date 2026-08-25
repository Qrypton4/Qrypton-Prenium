"use client";

// components/tarifs/FondsPropresPricingSection.tsx
// Grille de prix Fonds propres + garde-fou : la personne doit cocher une
// confirmation ("je trade avec mes propres fonds") avant que les boutons
// "Commencer maintenant" deviennent actifs. Objectif : éviter qu'un client
// Prop Firm achète par erreur l'offre Fonds propres (tarif différent).

import { useState } from "react";
import { PlanConfig } from "@/lib/plans";

type PlanEntry = {
  plan: PlanConfig;
  href: string;
};

export default function FondsPropresPricingSection({
  plans,
  salesOpen,
  salesClosedMessage,
}: {
  plans: PlanEntry[]; // dans l'ordre : monthly, six_months, twelve_months
  salesOpen: boolean;
  salesClosedMessage: string;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);

  const [monthly, sixMonths, twelveMonths] = plans;

  function handleCtaClick(e: React.MouseEvent) {
    if (!confirmed) {
      e.preventDefault();
      setTouched(true);
    }
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <label className="flex items-start gap-3 mb-6 px-1 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked);
            if (e.target.checked) setTouched(false);
          }}
          className="mt-0.5"
        />
        <span className="text-[13px] text-white/85">
          Je confirme que j&apos;utilise Qrypton pour trader avec{" "}
          <strong>mes propres fonds</strong>, et non via un compte Prop Firm.
        </span>
      </label>

      {touched && !confirmed && (
        <p className="text-[12px] text-red-400 mb-5 px-1">
          Merci de confirmer ci-dessus avant de continuer.
        </p>
      )}

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PlanCard
            plan={monthly.plan}
            href={monthly.href}
            salesOpen={salesOpen}
            salesClosedMessage={salesClosedMessage}
            confirmed={confirmed}
            onCtaClick={handleCtaClick}
          />
          <PlanCard
            plan={sixMonths.plan}
            href={sixMonths.href}
            salesOpen={salesOpen}
            salesClosedMessage={salesClosedMessage}
            confirmed={confirmed}
            onCtaClick={handleCtaClick}
          />
        </div>
        <PlanCard
          plan={twelveMonths.plan}
          href={twelveMonths.href}
          salesOpen={salesOpen}
          salesClosedMessage={salesClosedMessage}
          confirmed={confirmed}
          onCtaClick={handleCtaClick}
        />
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  href,
  salesOpen,
  salesClosedMessage,
  confirmed,
  onCtaClick,
}: {
  plan: PlanConfig;
  href: string;
  salesOpen: boolean;
  salesClosedMessage: string;
  confirmed: boolean;
  onCtaClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`relative flex flex-col border rounded-[20px] p-8 bg-bg-2 ${
        plan.highlight
          ? "border-blue-soft bg-gradient-to-b from-blue/10 to-transparent"
          : "border-line-strong bg-gradient-to-b from-blue/5 to-transparent"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10.5px] font-mono uppercase tracking-wide bg-blue text-white">
          Meilleur choix
        </span>
      )}

      <div className="text-xs text-blue-soft font-mono uppercase tracking-wide mb-3">
        {plan.label}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="font-mono text-[38px] font-medium">{plan.priceEUR}€</span>
        <span className="text-muted text-sm">
          {plan.billingMonths === 1 ? "/ mois" : `/ ${plan.billingMonths} mois`}
        </span>
      </div>

      {plan.compareToMonthly && plan.savingsEUR && (
        <div className="text-[12.5px] text-muted mb-1">
          <span className="line-through text-muted-2">{plan.compareToMonthly}€</span>{" "}
          en paiement mensuel
        </div>
      )}

      <div
        className="text-[12.5px] font-medium mb-5"
        style={{ color: plan.savingsEUR ? "#6FE3A5" : undefined }}
      >
        {plan.savingsEUR ? `Économie de ${plan.savingsEUR}€` : "Sans engagement"}
      </div>

      <div className="flex-1" />

      {salesOpen ? (
        <a
          href={confirmed ? href : undefined}
          onClick={onCtaClick}
          aria-disabled={!confirmed}
          className={`block w-full max-w-[280px] mx-auto text-center py-3.5 rounded-[10px] font-semibold transition mt-6 ${
            confirmed
              ? "bg-white text-bg hover:bg-blue-soft cursor-pointer"
              : "bg-white/25 text-white/50 cursor-not-allowed"
          }`}
        >
          Commencer maintenant
        </a>
      ) : (
        <span
          aria-disabled="true"
          className="block w-full max-w-[280px] mx-auto text-center py-3.5 rounded-[10px] font-semibold mt-6 bg-white/25 text-white/50 cursor-not-allowed select-none"
        >
          Commencer maintenant
        </span>
      )}
      <div className="text-center text-[11px] text-muted-2 font-mono mt-3">
        {salesOpen ? "Accès immédiat après validation du paiement" : salesClosedMessage}
      </div>
    </div>
  );
}
