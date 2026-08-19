import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import SiteNavContainer from "@/components/SiteNavContainer";
import { Reveal } from "@/components/Animated";
import { PLANS, PlanKey } from "@/lib/plans";
import { getAllPropFirmAllocationStatuses, PropFirmAllocationStatus } from "@/lib/propFirm";
import {
  shouldApplySupplement,
  getSupplementAmount,
  PROP_FIRM_SUPPLEMENT_THRESHOLD_EUR,
} from "@/lib/propFirmSupplement";
import PropFirmDeclarationForm from "@/components/tarifs/PropFirmDeclarationForm";

export const metadata = {
  title: "Prop Firm — Tarifs Qrypton",
  description:
    "Utilisez Qrypton sur un compte auprès d'une Prop Firm compatible (FTMO, FundedNext). Mêmes tarifs que Fonds propres.",
};

const FIRM_DESCRIPTIONS: Record<string, string> = {
  ftmo: "Utilisez Qrypton sur un compte FTMO compatible.",
  fundednext: "Utilisez Qrypton sur un compte FundedNext compatible.",
};

const FIRM_ORDER = ["ftmo", "fundednext"];

async function getTarifsData(): Promise<{
  isLoggedIn: boolean;
  hasActiveSub: boolean;
  supplementActive: boolean;
  declaredCapital: number | null;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false, hasActiveSub: false, supplementActive: false, declaredCapital: null };
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  // Même requête que le checkout : dernière déclaration Prop Firm du client,
  // pour savoir si le Supplément Grande Allocation doit s'afficher ICI, sur
  // la page tarifs — pas seulement au moment du paiement Stripe.
  const { data: declaredAccount } = await supabaseAdmin
    .from("prop_firm_accounts")
    .select("status, capital")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const supplementActive = declaredAccount
    ? shouldApplySupplement(declaredAccount.status, Number(declaredAccount.capital))
    : false;

  return {
    isLoggedIn: true,
    hasActiveSub: !!subscription,
    supplementActive,
    declaredCapital: declaredAccount ? Number(declaredAccount.capital) : null,
  };
}

// Même logique de CTA que /tarifs/fonds-propres : même produit, même abonnement,
// juste utilisable sur un compte Prop Firm. Le "next" pointe vers cette page
// pour que le client revienne bien ici après inscription.
function ctaHrefFor(planKey: PlanKey, isLoggedIn: boolean, hasActiveSub: boolean): string {
  if (!isLoggedIn) return `/inscription?next=/tarifs/prop-firm&plan=${planKey}`;
  if (hasActiveSub) return "/mon-espace";
  return `/paiement?plan=${planKey}`;
}

export default async function TarifsPropFirm() {
  const { isLoggedIn, hasActiveSub, supplementActive, declaredCapital } = await getTarifsData();
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

        {/* Capacités d'allocation FTMO / FundedNext */}
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

        {/* Tarifs — identiques à /tarifs/fonds-propres, mêmes boutons, même paiement */}
        <Reveal delay={0.08}>
          <PropFirmDeclarationForm />

          {supplementActive && (
            <div className="max-w-[720px] mx-auto mb-8 border border-blue-soft/30 rounded-2xl bg-blue/5 p-5">
              <p className="text-white/90 text-[13.5px] font-medium mb-1.5">
                🔵 Supplément Grande Allocation appliqué
              </p>
              <p className="text-muted-2 text-[12px] leading-relaxed">
                Votre compte déclaré ({declaredCapital?.toLocaleString("fr-FR")}€) atteint le seuil
                de {PROP_FIRM_SUPPLEMENT_THRESHOLD_EUR.toLocaleString("fr-FR")}€. Qrypton mobilise
                une capacité d&apos;allocation renforcée pour respecter les conditions fixées par
                votre Prop Firm — les prix ci-dessous incluent déjà ce supplément.
              </p>
            </div>
          )}

          <div className="max-w-[720px] mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PlanCard
                plan={PLANS.monthly}
                href={ctaHrefFor("monthly", isLoggedIn, hasActiveSub)}
                supplementActive={supplementActive}
              />
              <PlanCard
                plan={PLANS.six_months}
                href={ctaHrefFor("six_months", isLoggedIn, hasActiveSub)}
                supplementActive={supplementActive}
              />
            </div>
            <PlanCard
              plan={PLANS.twelve_months}
              href={ctaHrefFor("twelve_months", isLoggedIn, hasActiveSub)}
              supplementActive={supplementActive}
            />
          </div>

          <div className="max-w-[720px] mx-auto mt-14 border-t border-line pt-10 text-center">
            <h2 className="font-display text-base font-semibold mb-4">Incluses dans les 3 formules</h2>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13.5px] text-muted">
              {["Robot OPR Edge™", "Licence personnelle", "Mises à jour du logiciel", "Support utilisateur"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-blue-soft">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Explication de la capacité */}
        <Reveal delay={0.12}>
          <div className="max-w-[720px] mx-auto border border-line rounded-2xl bg-bg-2 p-8 md:p-10 mt-14 mb-14">
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

function PlanCard({
  plan,
  href,
  supplementActive,
}: {
  plan: (typeof PLANS)[PlanKey];
  href: string;
  supplementActive: boolean;
}) {
  const supplement = getSupplementAmount(plan.key);
  const displayedPrice = supplementActive ? plan.priceEUR + supplement : plan.priceEUR;

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
        {supplementActive && (
          <span className="font-mono text-[18px] text-muted-2 line-through">{plan.priceEUR}€</span>
        )}
        <span className="font-mono text-[38px] font-medium">{displayedPrice}€</span>
        <span className="text-muted text-sm">
          {plan.billingMonths === 1 ? "/ mois" : `/ ${plan.billingMonths} mois`}
        </span>
      </div>

      {supplementActive ? (
        <div className="text-[12px] font-medium mb-5 text-blue-soft">
          dont +{supplement}€ Supplément Grande Allocation
        </div>
      ) : (
        <>
          {plan.compareToMonthly && plan.savingsEUR && (
            <div className="text-[12.5px] text-muted mb-1">
              <span className="line-through text-muted-2">{plan.compareToMonthly}€</span>{" "}
              en paiement mensuel
            </div>
          )}
          <div className="text-[12.5px] font-medium mb-5" style={{ color: plan.savingsEUR ? "#6FE3A5" : undefined }}>
            {plan.savingsEUR ? `Économie de ${plan.savingsEUR}€` : "Sans engagement"}
          </div>
        </>
      )}

      <div className="flex-1" />

      <Link
        href={href}
        className="block w-full max-w-[280px] mx-auto text-center py-3.5 rounded-[10px] font-semibold transition mt-6 bg-white text-bg hover:bg-blue-soft"
      >
        Commencer maintenant
      </Link>
      <div className="text-center text-[11px] text-muted-2 font-mono mt-3">
        Accès immédiat après validation du paiement
      </div>
    </div>
  );
}
 
