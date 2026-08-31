"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  PROP_FIRM_CAPACITIES,
  PROP_FIRM_DURATIONS,
  PROP_FIRM_PLANS,
  PropFirmCapacityKey,
  PropFirmDurationKey,
  PropFirmDurationInfo,
  PropFirmPlanConfig,
} from "@/lib/propFirmPlans";
import { SALES_CLOSED_MESSAGE } from "@/lib/launch";

function formatEUR(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: n % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

function ctaHrefFor(planKey: string, isLoggedIn: boolean, hasActiveSub: boolean): string {
  if (!isLoggedIn) return `/inscription?next=/tarifs/prop-firm&plan=${planKey}`;
  if (hasActiveSub) return "/mon-espace";
  return `/paiement?plan=${planKey}&context=propfirm`;
}

function getAdvantage(d: PropFirmDurationInfo, plan: PropFirmPlanConfig): { icon: string; text: string } {
  if (d.key === "monthly") return { icon: "✓", text: "Sans engagement" };
  if (d.key === "six_months") return { icon: "", text: `${formatEUR(plan.savingsEUR ?? 0)} € économisés` };
  return { icon: "⭐", text: "Meilleur tarif" };
}

function DurationCard({
  d,
  plan,
  selected,
  onClick,
}: {
  d: PropFirmDurationInfo;
  plan: PropFirmPlanConfig;
  selected: boolean;
  onClick: () => void;
}) {
  const advantage = getAdvantage(d, plan);
  const perMonth = plan.priceEUR / plan.billingMonths;

  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-xl border p-5 transition-all duration-200 ${
        selected
          ? "border-blue-soft bg-gradient-to-b from-blue/10 to-transparent shadow-[0_0_0_1px_rgba(127,161,255,0.6),0_0_24px_-8px_rgba(127,161,255,0.45)]"
          : "border-line-strong bg-bg-2 hover:border-blue-soft/50"
      }`}
    >
      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all ${
          selected ? "bg-blue border-blue text-white scale-100 opacity-100" : "border-line-strong opacity-0 scale-75"
        }`}
      >
        ✓
      </div>

      <div className="text-[13.5px] font-semibold mb-3">{d.label}</div>

      <div className="font-display text-[24px] font-bold mb-0.5">
        {plan.priceEUR} <span className="text-muted text-xs font-medium">€</span>
      </div>
      <div className="font-mono text-[11.5px] text-muted-2 mb-3">
        {formatEUR(perMonth)} € / mois
      </div>

      <div className="text-[11.5px] font-medium text-blue-soft flex items-center gap-1.5">
        {advantage.icon && <span>{advantage.icon}</span>}
        <span>{advantage.text}</span>
      </div>
    </button>
  );
}

export default function PropFirmConfigurator({
  isLoggedIn,
  hasActiveSub,
  salesOpen,
}: {
  isLoggedIn: boolean;
  hasActiveSub: boolean;
  salesOpen: boolean;
}) {
  const [capacity, setCapacity] = useState<PropFirmCapacityKey | null>(null);
  const [duration, setDuration] = useState<PropFirmDurationKey | null>(null);
  const recapRef = useRef<HTMLDivElement>(null);

  function selectDuration(key: PropFirmDurationKey) {
    setDuration(key);
    setTimeout(() => {
      recapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }

  const selectedPlan = capacity && duration ? PROP_FIRM_PLANS[`${capacity}_${duration}`] : null;
  const selectedCapacityInfo = capacity ? PROP_FIRM_CAPACITIES.find((c) => c.key === capacity)! : null;
  const selectedDurationInfo = duration ? PROP_FIRM_DURATIONS.find((d) => d.key === duration)! : null;

  const steps = [
    { n: 1, label: "Capacité", done: !!capacity, active: !capacity },
    { n: 2, label: "Durée", done: !!duration, active: !!capacity && !duration },
    { n: 3, label: "Validation", done: false, active: !!capacity && !!duration },
  ];

  function toggleCapacity(key: PropFirmCapacityKey) {
    if (capacity === key) {
      setCapacity(null);
      setDuration(null);
    } else {
      setCapacity(key);
      setDuration(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-10 px-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[10px] sm:text-[11px] font-semibold shrink-0 transition-all ${
                  s.done
                    ? "bg-positive border-positive text-bg"
                    : s.active
                    ? "bg-blue border-blue text-white shadow-[0_0_0_4px_rgba(61,107,255,0.18)]"
                    : "border-line-strong text-muted-2"
                }`}
              >
                {s.done ? "✓" : s.n}
              </div>
              <span className={`text-[11px] sm:text-[12.5px] whitespace-nowrap ${s.active || s.done ? "text-white font-medium" : "text-muted-2"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px bg-line-strong shrink-0" />}
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-semibold mb-1">1. Quel est le capital de votre compte Prop Firm ?</h2>
      <p className="text-muted-2 text-[12.5px] mb-5">
        Sélectionnez le capital du compte que vous possédez déjà et sur lequel vous souhaitez
        utiliser Qrypton.
      </p>

      <div className="sm:hidden flex flex-col gap-3 mb-2">
        {PROP_FIRM_CAPACITIES.map((c) => {
          const selected = capacity === c.key;
          return (
            <div
              key={c.key}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                selected
                  ? "border-blue-soft bg-gradient-to-b from-blue/10 to-transparent shadow-[0_0_0_1px_rgba(127,161,255,0.6)]"
                  : "border-line-strong bg-gradient-to-b from-blue/5 to-transparent hover:border-blue-soft/50"
              }`}
            >
              <button onClick={() => toggleCapacity(c.key)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <div className="flex items-center gap-4">
                  <div className="font-display text-[22px] font-bold shrink-0">
                    {c.capitalEUR.toLocaleString("fr-FR")} €
                  </div>
                  <div className="text-blue-soft text-[12px] font-semibold uppercase tracking-wide">Balance</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] shrink-0 transition-transform duration-200 ${
                    selected ? "bg-blue border-blue text-white rotate-180" : "border-line-strong text-muted-2"
                  }`}
                >
                  ▾
                </div>
              </button>

              <div
                className={`transition-all duration-400 overflow-hidden ${
                  selected ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 pt-1 border-t border-line">
                  <p className="text-muted-2 text-[12px] mb-4 mt-3">
                    Sélectionnez la formule qui vous convient. Plus la durée de votre licence est
                    longue, plus votre tarif est avantageux.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {PROP_FIRM_DURATIONS.map((d) => (
                      <DurationCard
                        key={d.key}
                        d={d}
                        plan={PROP_FIRM_PLANS[`${c.key}_${d.key}`]}
                        selected={duration === d.key}
                        onClick={() => selectDuration(d.key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:grid grid-cols-3 gap-3.5 mb-2">
        {PROP_FIRM_CAPACITIES.map((c) => {
          const selected = capacity === c.key;
          return (
            <button
              key={c.key}
              onClick={() => toggleCapacity(c.key)}
              className={`relative text-center rounded-2xl border p-6 transition-all duration-200 ${
                selected
                  ? "border-blue-soft bg-gradient-to-b from-blue/10 to-transparent shadow-[0_0_0_1px_rgba(127,161,255,0.6),0_16px_30px_-14px_rgba(61,107,255,0.55)] -translate-y-0.5"
                  : "border-line-strong bg-gradient-to-b from-blue/5 to-transparent hover:border-blue-soft/50 hover:-translate-y-0.5"
              }`}
            >
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all ${
                  selected ? "bg-blue border-blue text-white scale-100 opacity-100" : "border-line-strong opacity-0 scale-75"
                }`}
              >
                ✓
              </div>
              <div className="font-display text-[24px] font-bold mb-1.5">
                {c.capitalEUR.toLocaleString("fr-FR")} €
              </div>
              <div className="text-blue-soft text-[11px] font-semibold uppercase tracking-wide">Balance</div>
            </button>
          );
        })}
      </div>

      <p className="text-muted-2 text-[11px] text-center mt-4 mb-6">
        Votre licence définit uniquement le capital maximal compatible avec Qrypton. Qrypton ne
        fournit aucun compte de trading.
      </p>

      <div className="max-w-[440px] mx-auto border border-line rounded-xl bg-bg/40 px-5 py-4 text-center mb-10">
        <p className="text-muted-2 text-[11.5px] leading-relaxed mb-2">
          Vous n&apos;avez pas encore de compte Prop Firm ? Obtenez votre compte, puis revenez
          sélectionner la licence correspondant à son capital.
        </p>
        <p className="text-muted-2 text-[11.5px] mb-2.5">
          Vous pouvez découvrir notre Prop Firm recommandée :
        </p>
        <a
          href="https://ftmo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[12px] font-semibold text-blue-soft hover:text-white transition mb-3"
        >
          Découvrir FTMO →
        </a>
        <p className="text-muted-2 text-[10px] leading-relaxed">
          Qrypton est un service indépendant et n&apos;est pas affilié à FTMO. Qrypton ne fournit
          aucun compte de trading.
        </p>
      </div>

      <div className="hidden sm:block">
        <div
          className={`transition-all duration-500 overflow-hidden ${
            capacity ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <h2 className="font-display text-base font-semibold mb-1">2. Choisissez votre durée</h2>
          <p className="text-muted-2 text-[12.5px] mb-5">
            Sélectionnez la formule qui vous convient. Plus la durée de votre licence est longue,
            plus votre tarif est avantageux.
          </p>
          <div className="grid grid-cols-3 gap-3.5 mb-10">
            {capacity &&
              PROP_FIRM_DURATIONS.map((d) => (
                <DurationCard
                  key={d.key}
                  d={d}
                  plan={PROP_FIRM_PLANS[`${capacity}_${d.key}`]}
                  selected={duration === d.key}
                  onClick={() => selectDuration(d.key)}
                />
              ))}
          </div>
        </div>
      </div>

      <div
        ref={recapRef}
        className={`transition-all duration-500 overflow-hidden ${
          selectedPlan ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {selectedPlan && selectedCapacityInfo && selectedDurationInfo && (
          <div className="border border-line-strong rounded-2xl bg-gradient-to-b from-blue/[0.08] to-bg-2 p-7 md:p-8 text-center mb-8">
            <div className="font-mono text-[11px] text-blue-soft uppercase tracking-widest mb-2">
              Votre licence Qrypton
            </div>
            <h3 className="font-display text-xl font-bold mb-5">
              Qrypton {selectedCapacityInfo.amountLabel}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-5 text-left">
              <div className="border border-line rounded-xl bg-bg px-4 py-3">
                <div className="font-mono text-[10px] text-muted-2 uppercase tracking-wide mb-1">
                  Capital maximal
                </div>
                <div className="text-[15px] font-semibold">
                  {selectedCapacityInfo.capitalEUR.toLocaleString("fr-FR")} €
                </div>
              </div>
              <div className="border border-line rounded-xl bg-bg px-4 py-3">
                <div className="font-mono text-[10px] text-muted-2 uppercase tracking-wide mb-1">Durée</div>
                <div className="text-[15px] font-semibold">{selectedDurationInfo.label}</div>
              </div>
            </div>

            <div className="font-display text-[34px] font-bold mb-6">
              {selectedPlan.priceEUR} <span className="text-muted text-base font-medium">€</span>
            </div>

            {salesOpen ? (
              <Link
                href={ctaHrefFor(selectedPlan.key, isLoggedIn, hasActiveSub)}
                className="inline-block px-8 py-3.5 rounded-xl font-semibold text-[14.5px] bg-white text-bg hover:bg-blue-soft transition"
              >
                Choisir cette licence →
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-block px-8 py-3.5 rounded-xl font-semibold text-[14.5px] bg-white/25 text-white/50 cursor-not-allowed select-none"
              >
                {SALES_CLOSED_MESSAGE}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="max-w-[440px] mx-auto flex flex-col gap-2">
        {[
          "Même robot Qrypton pour toutes les licences",
          "La licence définit uniquement la capacité maximale autorisée",
          "Mises à jour incluses pendant toute la durée de la licence",
          "Guide d'installation inclus",
          "Support inclus",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2 text-muted text-[12.5px]">
            <span className="text-positive">✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
