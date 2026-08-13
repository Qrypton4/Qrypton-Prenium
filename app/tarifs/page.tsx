import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import SiteNavContainer from "@/components/SiteNavContainer";
import { PLANS, PlanKey } from "@/lib/plans";

export const metadata = {
  title: "Tarifs — Qrypton",
  description: "OPR Edge™ à partir de 79€/mois. Formules mensuelle, 6 mois et 12 mois.",
};

async function getTarifsData(): Promise<{ isLoggedIn: boolean; hasActiveSub: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false, hasActiveSub: false };
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  return { isLoggedIn: true, hasActiveSub: !!subscription };
}

function ctaHrefFor(planKey: PlanKey, isLoggedIn: boolean, hasActiveSub: boolean): string {
  if (!isLoggedIn) return `/inscription?next=/tarifs&plan=${planKey}`;
  if (hasActiveSub) return "/mon-espace";
  return `/paiement?plan=${planKey}`;
}

export default async function Tarifs() {
  const { isLoggedIn, hasActiveSub } = await getTarifsData();

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <div className="text-center max-w-[620px] mx-auto mb-14">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">Tarifs</span>
          <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
            Un robot, trois formules.
          </h1>
          <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
            Même robot, même licence, mêmes mises à jour et le même support — seule la durée
            d&apos;engagement change, avec une économie à la clé pour un paiement anticipé.
          </p>
        </div>
        <div className="max-w-[620px] mx-auto rounded-2xl border border-blue-soft/30 px-5 py-3 text-center mb-8">
  <p className="text-sm text-white/80">
    Le robot nécessite un PC allumé de 15h30 à 18h00.{" "}
    <Link href="/faq#mobile-tablette" className="text-blue-soft hover:underline">
      En savoir plus →
    </Link>
  </p>
</div>

        <div className="max-w-[720px] mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PlanCard plan={PLANS.monthly} href={ctaHrefFor("monthly", isLoggedIn, hasActiveSub)} />
            <PlanCard plan={PLANS.six_months} href={ctaHrefFor("six_months", isLoggedIn, hasActiveSub)} />
          </div>
          <PlanCard plan={PLANS.twelve_months} href={ctaHrefFor("twelve_months", isLoggedIn, hasActiveSub)} />
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
      </main>
    </>
  );
}

function PlanCard({
  plan,
  href,
}: {
  plan: (typeof PLANS)[PlanKey];
  href: string;
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

      <div className="text-[12.5px] font-medium mb-5" style={{ color: plan.savingsEUR ? "#6FE3A5" : undefined }}>
        {plan.savingsEUR ? `Économie de ${plan.savingsEUR}€` : "Sans engagement"}
      </div>

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
