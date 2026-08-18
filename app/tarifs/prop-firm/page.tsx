import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import { Reveal } from "@/components/Animated";
import { getAllPropFirmAllocationStatuses, PropFirmAllocationStatus } from "@/lib/propFirm";
import { PROP_FIRM_PLANS } from "@/lib/propFirmPlans";

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
              Qrypton pour les Prop Firms
            </h1>
            <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
              Utilisez Qrypton sur un compte auprès d&apos;une Prop Firm compatible.
            </p>
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
              Qrypton suit ces conditions afin de respecter les règles propres à chaque Prop
              Firm.
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

        {/* Offre Prop Firm — présentation provisoire */}
        <Reveal delay={0.1}>
          <div className="max-w-[860px] mx-auto mb-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-[10.5px] font-mono uppercase tracking-wide bg-blue/15 text-blue-soft border border-blue-soft/30 mb-4">
                Offre à venir
              </span>
              <h2 className="font-display text-xl font-semibold">Formules Prop Firm</h2>
              <p className="text-muted-2 text-[12.5px] mt-2 max-w-[480px] mx-auto">
                Tarifs de travail, susceptibles d&apos;évoluer avant l&apos;ouverture officielle de
                cette offre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Object.values(PROP_FIRM_PLANS).map((plan) => (
                <div
                  key={plan.key}
                  className="relative flex flex-col border border-line-strong rounded-[20px] p-8 bg-bg-2 bg-gradient-to-b from-blue/5 to-transparent opacity-90"
                >
                  <div className="text-xs text-blue-soft font-mono uppercase tracking-wide mb-3">
                    {plan.billingMonths === 1 ? "Mensuel" : `${plan.billingMonths} mois`}
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="font-mono text-[32px] font-medium">{plan.priceEUR}€</span>
                    <span className="text-muted text-sm">
                      {plan.billingMonths === 1 ? "/ mois" : ""}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-muted mb-1">
                    {plan.includedAccounts} compte Prop Firm inclus
                  </div>
                  <div className="text-[11.5px] text-muted-2">
                    Compte supplémentaire : +{plan.extraAccountPriceEUR}€/mois
                  </div>
                  <div className="flex-1" />
                  <button
                    disabled
                    className="block w-full text-center py-3.5 rounded-[10px] font-semibold mt-6 bg-white/10 text-muted cursor-not-allowed"
                  >
                    Bientôt disponible
                  </button>
                </div>
              ))}
            </div>

            <p className="text-muted-2 text-[11.5px] text-center mt-6">
              Les conditions d&apos;utilisation peuvent varier selon la Prop Firm sélectionnée.
            </p>
          </div>
        </Reveal>

        {/* Guide Prop Firm */}
        <Reveal delay={0.12}>
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

      <div className="mb-2">
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
    </div>
  );
}
