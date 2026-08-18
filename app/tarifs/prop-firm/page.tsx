import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import { Reveal } from "@/components/Animated";
import { getAllPropFirmAllocationStatuses, PropFirmAllocationStatus } from "@/lib/propFirm";
import { PROP_FIRM_TIERS } from "@/lib/propFirmPlans";
import PropFirmSelector from "@/components/tarifs/PropFirmSelector";

export const metadata = {
  title: "Prop Firm — Tarifs Qrypton",
  description:
    "Utilisez Qrypton sur un compte auprès d'une Prop Firm compatible (FTMO, FundedNext).",
};

const FIRM_DESCRIPTIONS: Record<string, string> = {
  ftmo: "Utilisez Qrypton sur un compte FTMO compatible.",
  fundednext: "Utilisez Qrypton sur un compte FundedNext compatible.",
};

const FIRM_ORDER = ["ftmo", "fundednext"];

export default async function TarifsPropFirm() {
  const statuses = await getAllPropFirmAllocationStatuses();
  const firms = FIRM_ORDER.map((slug) =>
    statuses.find((s) => s.slug === slug)
  ).filter((s): s is PropFirmAllocationStatus => !!s);

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Tarifs · Prop Firm
            </span>
            <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
              Choisissez votre Prop Firm
            </h1>
            <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
              Vous n&apos;avez pas encore de compte ? Aucun problème, Qrypton vous accompagne.
            </p>
          </div>
        </Reveal>

        {/* Parcours interactif : Prop Firm → capital → prix/durée */}
        <Reveal delay={0.04}>
          <div className="mb-16">
            <PropFirmSelector />
          </div>
        </Reveal>

        {/* Prop Firms compatibles — capacité disponible */}
        <Reveal delay={0.05}>
          <h2 className="font-display text-base font-semibold text-center mb-6 text-muted-2">
            Capacité disponible par Prop Firm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[860px] mx-auto mb-14">
            {firms.map((firm) => (
              <FirmCardView
                key={firm.slug}
                firm={firm}
                description={FIRM_DESCRIPTIONS[firm.slug] ?? ""}
              />
            ))}
          </div>
        </Reveal>

        {/* Explication de la capacité */}
        <Reveal delay={0.08}>
          <div className="max-w-[720px] mx-auto border border-line rounded-2xl bg-bg-2 p-8 md:p-10 mb-14">
            <h2 className="font-display text-lg font-semibold mb-4">
              Pourquoi une capacité disponible ?
            </h2>
            <p className="text-muted text-[13.5px] leading-relaxed mb-3">
              Certaines Prop Firms appliquent des limites de capital lorsqu&apos;une même
              stratégie automatisée est utilisée par plusieurs traders.
            </p>
            <p className="text-muted text-[13.5px] leading-relaxed mb-3">
              Qrypton suit ces conditions afin de respecter les règles de chaque Prop Firm.
            </p>
            <p className="text-muted text-[13.5px] leading-relaxed mb-3">
              La capacité affichée correspond au montant de capital que Qrypton peut actuellement
              prendre en charge auprès de cette Prop Firm.
            </p>
            <p className="text-muted text-[13.5px] leading-relaxed">
              Cette capacité ne limite pas le capital de votre propre compte.
            </p>
          </div>
        </Reveal>

        {/* Exemples ludiques */}
        <Reveal delay={0.12}>
          <div className="max-w-[860px] mx-auto mb-14">
            <h2 className="font-display text-lg font-semibold text-center mb-6">
              Vous ne savez pas quelle formule choisir ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {EXAMPLES.map((ex) => {
                const tier = tierForCapital(ex.capital);
                return (
                  <div
                    key={ex.capital}
                    className="border border-line rounded-xl bg-bg-2 p-5 text-center"
                  >
                    <div className="text-[13px] text-muted mb-1">Compte de</div>
                    <div className="font-mono text-[18px] font-medium mb-3">
                      {ex.capital.toLocaleString("fr-FR")} €
                    </div>
                    <div className="text-blue-soft text-[12px] mb-1">→ {tier.label}</div>
                    <div className="font-mono text-[15px]">{tier.prices.monthly}€/mois</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Guide Prop Firm */}
        <Reveal delay={0.14}>
          <div className="max-w-[620px] mx-auto text-center border-t border-line pt-10 mb-6">
            <p className="text-muted text-[14px] mb-3">
              Vous ne connaissez pas encore les Prop Firms ?
            </p>
            <Link
              href="/guide-qrypton/prop-firm"
              className="inline-block px-6 py-3 rounded-lg text-[14px] font-semibold border border-blue-soft/40 text-blue-soft hover:bg-blue/10 transition"
            >
              Découvrir le guide Prop Firm →
            </Link>
          </div>
        </Reveal>

        <p className="max-w-[620px] mx-auto text-center text-muted-2 text-[11px] leading-relaxed">
          Qrypton fournit uniquement le logiciel et la licence permettant son utilisation dans les
          conditions autorisées par chaque Prop Firm. Qrypton ne fournit pas de compte Prop Firm.
        </p>
      </main>
    </>
  );
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

const EXAMPLES = [
  { capital: 10000 },
  { capital: 50000 },
  { capital: 100000 },
  { capital: 200000 },
];

function tierForCapital(capital: number) {
  return (
    PROP_FIRM_TIERS.find(
      (t) => capital >= t.capitalMin && (t.capitalMax === null || capital <= t.capitalMax)
    ) ?? PROP_FIRM_TIERS[PROP_FIRM_TIERS.length - 1]
  );
}

function FirmCardView({
  firm,
  description,
}: {
  firm: PropFirmAllocationStatus;
  description: string;
}) {
  const capacityKnown = firm.allocationMax !== null;
  const percentUsed =
    capacityKnown && firm.allocationMax
      ? Math.min(100, (firm.allocationUsed / firm.allocationMax) * 100)
      : 0;

  return (
    <div className="relative border border-line-strong rounded-2xl bg-bg-2 p-8 hover:border-blue-soft transition">
      <h3 className="font-display text-lg font-semibold mb-2.5">{firm.name}</h3>
      <p className="text-muted text-[13.5px] leading-relaxed mb-5">{description}</p>

      <div className="mb-6">
        <div className="flex items-center justify-between text-[11.5px] font-mono uppercase tracking-wide text-muted-2 mb-2">
          <span>Capacité disponible</span>
          <span>
            {capacityKnown ? `${formatUSD(firm.allocationAvailable ?? 0)} $` : "—"}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-soft/60"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        {!capacityKnown && (
          <p className="text-muted-2 text-[11px] mt-2">Capacité communiquée prochainement.</p>
        )}
        {capacityKnown && firm.isFull && (
          <div className="mt-3 rounded-lg border border-blue-soft/30 bg-blue/5 px-3 py-2.5">
            <p className="text-white/85 text-[12.5px] font-medium mb-0.5">
              Capacité momentanément complète
            </p>
            <p className="text-muted-2 text-[11.5px] leading-relaxed">
              La capacité actuelle de Qrypton pour cette Prop Firm est temporairement atteinte.
            </p>
            <button
              disabled
              className="mt-2 text-[11.5px] text-blue-soft font-medium hover:underline cursor-not-allowed opacity-80"
            >
              Être informé lorsqu&apos;une place se libère
            </button>
          </div>
        )}
      </div>

      <span className="inline-block text-blue-soft text-sm font-medium hover:underline cursor-default">
        En savoir plus →
      </span>
    </div>
  );
}
