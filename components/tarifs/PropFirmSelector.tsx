"use client";

// components/tarifs/PropFirmSelector.tsx
// Parcours interactif "Choisir sa Prop Firm" → "Quel capital ?" → "Prix + durée".
// Conforme au brief : aucune information technique (MT5, installation...)
// n'est demandée ici — uniquement Prop Firm, capital, prix, durée. Le
// paiement Stripe n'est pas encore connecté (voir bouton final désactivé),
// conformément à la consigne de ne pas casser/créer les produits Stripe
// avant validation.

import { useEffect, useState } from "react";
import { getAccountSizesForFirm } from "@/lib/propFirmAccountSizes";
import { getPropFirmTier, PropFirmBillingPeriod } from "@/lib/propFirmPlans";

type FirmSlug = "ftmo" | "fundednext";

const FIRMS: { slug: FirmSlug; name: string; description: string }[] = [
  { slug: "ftmo", name: "FTMO", description: "L'une des Prop Firms les plus connues au monde." },
  {
    slug: "fundednext",
    name: "FundedNext",
    description: "Une Prop Firm en forte croissance, conditions flexibles.",
  },
];

const BILLING_LABELS: Record<PropFirmBillingPeriod, string> = {
  monthly: "Mensuel",
  six_months: "6 mois",
  twelve_months: "12 mois",
};

const STORAGE_KEY = "qrypton_propfirm_selection";

type Selection = {
  firm: FirmSlug | null;
  capital: number | null;
  billing: PropFirmBillingPeriod;
};

const DEFAULT_SELECTION: Selection = { firm: null, capital: null, billing: "monthly" };

export default function PropFirmSelector() {
  const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);
  const [hydrated, setHydrated] = useState(false);

  // Mémorise le choix du client : au retour sur la page, il ne repart pas de zéro.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setSelection({ ...DEFAULT_SELECTION, ...parsed });
        }
      }
    } catch {
      // localStorage indisponible (navigation privée, etc.) — on continue sans mémorisation.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // silencieux
    }
  }, [selection, hydrated]);

  if (!hydrated) {
    // Évite un flash "étape 1" avant que la mémorisation locale soit lue.
    return <div className="min-h-[240px]" />;
  }

  const step = !selection.firm ? "firm" : selection.capital === null ? "capital" : "recap";

  return (
    <div className="max-w-[820px] mx-auto">
      <StepIndicator step={step} />

      {step === "firm" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {FIRMS.map((firm) => (
            <button
              key={firm.slug}
              onClick={() => setSelection((s) => ({ ...s, firm: firm.slug }))}
              className="text-left border border-line-strong rounded-2xl bg-bg-2 p-7 hover:border-blue-soft hover:bg-white/[0.02] transition group"
            >
              <h3 className="font-display text-xl font-semibold mb-2">{firm.name}</h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-5">{firm.description}</p>
              <span className="inline-flex items-center gap-1.5 text-blue-soft text-sm font-medium">
                Choisir
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {step === "capital" && selection.firm && (
        <div className="mt-8">
          <button
            onClick={() => setSelection((s) => ({ ...s, firm: null }))}
            className="text-muted-2 text-[12.5px] hover:text-white transition mb-6"
          >
            ← Changer de Prop Firm
          </button>
          <h2 className="font-display text-lg font-semibold text-center mb-1">
            Quel capital souhaitez-vous utiliser ?
          </h2>
          <p className="text-muted-2 text-[12.5px] text-center mb-8">
            {FIRMS.find((f) => f.slug === selection.firm)?.name}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {getAccountSizesForFirm(selection.firm).map((size) => (
              <button
                key={size}
                onClick={() => setSelection((s) => ({ ...s, capital: size }))}
                className="border border-line-strong rounded-xl bg-bg-2 py-5 text-center hover:border-blue-soft hover:bg-white/[0.02] transition"
              >
                <span className="font-mono text-[16px] font-medium">
                  {size >= 1000 ? `${size / 1000}k` : size}
                </span>
                <span className="block text-muted-2 text-[10.5px] mt-1">€</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "recap" && selection.firm && selection.capital !== null && (
        <RecapStep
          firm={selection.firm}
          capital={selection.capital}
          billing={selection.billing}
          onChangeBilling={(billing) => setSelection((s) => ({ ...s, billing }))}
          onChangeCapital={() => setSelection((s) => ({ ...s, capital: null }))}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: "firm" | "capital" | "recap" }) {
  const steps: { key: typeof step; label: string }[] = [
    { key: "firm", label: "Prop Firm" },
    { key: "capital", label: "Capital" },
    { key: "recap", label: "Prix" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium transition ${
              i <= currentIndex
                ? "bg-blue-soft/15 text-blue-soft border border-blue-soft/30"
                : "text-muted-2 border border-line"
            }`}
          >
            <span>{i + 1}</span>
            <span>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <span className={`w-4 h-px ${i < currentIndex ? "bg-blue-soft/40" : "bg-line"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RecapStep({
  firm,
  capital,
  billing,
  onChangeBilling,
  onChangeCapital,
}: {
  firm: FirmSlug;
  capital: number;
  billing: PropFirmBillingPeriod;
  onChangeBilling: (b: PropFirmBillingPeriod) => void;
  onChangeCapital: () => void;
}) {
  const firmName = FIRMS.find((f) => f.slug === firm)?.name ?? firm;
  const tier = getPropFirmTier(capital);
  const price = tier.prices[billing];

  return (
    <div className="mt-8">
      <button
        onClick={onChangeCapital}
        className="text-muted-2 text-[12.5px] hover:text-white transition mb-6"
      >
        ← Changer de capital
      </button>

      <div className="border border-blue-soft/25 rounded-2xl bg-gradient-to-b from-blue/[0.06] to-transparent p-7 mb-6">
        <div className="text-xs text-blue-soft font-mono uppercase tracking-wide mb-4">
          Votre formule Qrypton
        </div>
        <div className="grid grid-cols-2 gap-4 mb-1">
          <div>
            <div className="text-muted-2 text-[11.5px] mb-1">Prop Firm</div>
            <div className="font-medium text-[15px]">{firmName}</div>
          </div>
          <div>
            <div className="text-muted-2 text-[11.5px] mb-1">Capital sélectionné</div>
            <div className="font-mono font-medium text-[15px]">
              {capital.toLocaleString("fr-FR")} €
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-line">
          <div className="text-muted-2 text-[11.5px] mb-1">Formule</div>
          <div className="font-medium text-[15px] text-blue-soft">{tier.label}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {(["monthly", "six_months", "twelve_months"] as PropFirmBillingPeriod[]).map((b) => {
          const months = b === "six_months" ? 6 : b === "twelve_months" ? 12 : 1;
          const equivalentMonthlyTotal = tier.prices.monthly * months;
          const savings = equivalentMonthlyTotal - tier.prices[b];
          const selected = billing === b;

          return (
            <button
              key={b}
              onClick={() => onChangeBilling(b)}
              className={`relative flex flex-col items-center border rounded-xl py-5 px-3 text-center transition ${
                selected
                  ? "border-blue-soft bg-blue-soft/10"
                  : "border-line-strong bg-bg-2 hover:border-blue-soft/40"
              }`}
            >
              {b === "twelve_months" && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9.5px] font-mono uppercase tracking-wide bg-blue text-white">
                  Meilleur choix
                </span>
              )}
              <div className="text-[11.5px] text-muted-2 mb-2 uppercase tracking-wide">
                {BILLING_LABELS[b]}
              </div>
              <div className="font-mono text-[22px] font-medium mb-1">{tier.prices[b]}€</div>
              {months > 1 ? (
                <>
                  <div className="text-[11px] text-muted-2 mb-0.5">
                    <span className="line-through">{equivalentMonthlyTotal}€</span> en mensuel
                  </div>
                  <div className="text-[11.5px] font-medium" style={{ color: "#6FE3A5" }}>
                    Économie de {savings}€
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-muted-2">Sans engagement</div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-muted-2 text-[11.5px] text-center mb-6 leading-relaxed">
        Votre tarif dépend uniquement du capital nominal de votre compte Prop Firm — le même
        barème s&apos;applique quelle que soit la Prop Firm.
      </p>

     <button
        disabled
        className="block w-full max-w-[320px] mx-auto text-center py-3.5 rounded-[10px] font-semibold text-[15px] bg-white text-bg opacity-90 cursor-not-allowed transition"
      >
        Activer Qrypton — {price}€{billing === "monthly" ? "/mois" : ""}
      </button>
      <div className="text-center text-[11px] text-muted-2 font-mono mt-3">
        Ouverture des paiements Prop Firm très prochainement
      </div>
    </div>
  );
}
