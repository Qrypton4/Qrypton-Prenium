"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PROP_FIRM_CAPACITIES,
  PROP_FIRM_DURATIONS,
  PROP_FIRM_PLANS,
  PropFirmCapacityKey,
  PropFirmDurationKey,
  getPropFirmMonthlyEquivalent,
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
  const [howOpen, setHowOpen] = useState(false);

  const selectedPlan = capacity && duration ? PROP_FIRM_PLANS[`${capacity}_${duration}`] : null;
  const selectedCapacityInfo = capacity ? PROP_FIRM_CAPACITIES.find((c) => c.key === capacity)! : null;
  const selectedDurationInfo = duration ? PROP_FIRM_DURATIONS.find((d) => d.key === duration)! : null;

  const steps = [
    { n: 1, label: "Capacité", done: !!capacity, active: !capacity },
    { n: 2, label: "Durée", done: !!duration, active: !!capacity && !duration },
    { n: 3, label: "Validation", done: false, active: !!capacity && !!duration },
  ];

  return (
    <div>
      {/* Indicateur de progression */}
      <div className="flex items-center justify-center gap-2.5 mb-10">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-semibold transition-all ${
                  s.done
                    ? "bg-positive border-positive text-bg"
                    : s.active
                    ? "bg-blue border-blue text-white shadow-[0_0_0_4px_rgba(61,107,255,0.18)]"
                    : "border-line-strong text-muted-2"
                }`}
              >
                {s.done ? "✓" : s.n}
              </div>
              <span className={`text-[12.5px] ${s.active || s.done ? "text-white font-medium" : "text-muted-2"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-9 h-px bg-line-strong" />}
          </div>
        ))}
      </div>

      {/* Étape 1 — capacité */}
      <div className="mb-3">
        <h2 className="font-display text-base font-semibold mb-1">1. Choisissez votre capacité</h2>
        <p className="text-muted-2 text-[12.5px] mb-5">
          Choisissez la capacité maximale correspondant au capital que vous souhaitez utiliser avec
          Qrypton.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-2">
        {PROP_FIRM_CAPACITIES.map((c) => {
          const selected = capacity === c.key;
          return (
            <button
              key={c.key}
              onClick={() => {
                setCapacity(c.key);
                setDuration(null);
              }}
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
              <div className="font-display text-[26px] font-bold mb-1.5">{c.amountLabel}</div>
              <div className="text-blue-soft text-[12.5px] font-semibold mb-2">{c.title}</div>
              <p className="text-muted text-[12px] leading-relaxed">{c.description}</p>
            </button>
          );
        })}
      </div>
      <p className="text-muted-2 text-[11px] text-center mb-10">
        Qrypton ne fournit aucun compte de trading. La licence définit uniquement le capital maximum
        compatible avec le robot.
      </p>

      {/* Étape 2 — durée */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          capacity ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <h2 className="font-display text-base font-semibold mb-1">2. Choisissez votre durée</h2>
        <p className="text-muted-2 text-[12.5px] mb-5">
          Le prix et l&apos;équivalent mensuel se mettent à jour automatiquement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-10">
          {capacity &&
            PROP_FIRM_DURATIONS.map((d) => {
              const plan = PROP_FIRM_PLANS[`${capacity}_${d.key}`];
              const selected = duration === d.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setDuration(d.key)}
                  className={`text-left rounded-xl border p-5 transition-all duration-200 ${
                    selected
                      ? "border-blue-soft bg-gradient-to-b from-blue/10 to-transparent shadow-[0_0_0_1px_rgba(127,161,255,0.6)]"
                      : "border-line-strong bg-bg-2 hover:border-blue-soft/50"
                  }`}
                >
                  <span
                    className={`inline-block text-[9.5px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md mb-2.5 ${
                      d.highlight
                        ? "bg-positive/15 text-positive"
                        : d.key === "six_months"
                        ? "bg-blue/15 text-blue-soft"
                        : "bg-white/[0.06] text-muted-2"
                    }`}
                  >
                    {d.badge}
                  </span>
                  <div className="text-[13.5px] font-semibold mb-2">{d.label}</div>
                  <div className="font-display text-[22px] font-bold">
                    {plan.priceEUR} <span className="text-muted text-xs font-medium">€</span>
                  </div>
                  {d.months > 1 && (
                    <div className="font-mono text-[11px] text-muted-2 mt-0.5">
                      soit {formatEUR(getPropFirmMonthlyEquivalent(plan))} € / mois
                    </div>
                  )}
                  {plan.savingsEUR ? (
                    <div className="text-[11px] text-positive font-medium mt-1.5">
                      Économie de {formatEUR(plan.savingsEUR)} €
                    </div>
                  ) : null}
                </button>
              );
            })}
        </div>
      </div>

      {/* Étape 3 — récapitulatif */}
      <div
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
                  Capacité maximale
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

            <div className="font-display text-[34px] font-bold mb-0.5">
              {selectedPlan.priceEUR} <span className="text-muted text-base font-medium">€</span>
            </div>
            <div className="text-muted text-[12.5px] mb-6">
              {selectedPlan.billingMonths > 1
                ? `Équivalent : ${formatEUR(getPropFirmMonthlyEquivalent(selectedPlan))} € / mois`
                : "Facturé chaque mois, sans engagement"}
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

      {/* Bas de page */}
      <ul className="max-w-[440px] mx-auto flex flex-col gap-2 mb-2">
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

      <button
        onClick={() => setHowOpen(true)}
        className="block mx-auto mt-4 text-[12.5px] text-blue-soft underline underline-offset-4 hover:text-white transition"
      >
        Comment fonctionne la capacité de licence ?
      </button>

      {howOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-5"
          onClick={() => setHowOpen(false)}
        >
          <div
            className="max-w-[420px] w-full bg-bg-2 border border-line-strong rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHowOpen(false)}
              className="absolute top-3.5 right-3.5 text-muted-2 hover:text-white text-lg leading-none"
              aria-label="Fermer"
            >
              ✕
            </button>
            <h3 className="font-display text-base font-semibold mb-3">
              Comment fonctionne la capacité de licence ?
            </h3>
            <p className="text-muted text-[13px] leading-relaxed mb-2.5">
              La capacité de votre licence correspond au capital maximum autorisé pour
              l&apos;utilisation de Qrypton.
            </p>
            <p className="text-muted text-[13px] leading-relaxed mb-2.5">
              Exemple : une licence 20K permet d&apos;utiliser Qrypton sur un capital total allant
              jusqu&apos;à 20 000 €.
            </p>
            <p className="text-muted-2 text-[12px] leading-relaxed">
              Qrypton ne fournit aucun compte de trading et ne garantit aucun résultat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
