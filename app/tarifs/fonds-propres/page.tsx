import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import SiteNavContainer from "@/components/SiteNavContainer";
import { PLANS, PlanKey } from "@/lib/plans";
import { isSalesOpen, SALES_CLOSED_MESSAGE } from "@/lib/launch";
import FondsPropresPricingSection from "@/components/tarifs/FondsPropresPricingSection";

export const metadata = {
  title: "Fonds propres — Tarifs Qrypton",
  description: "OPR Edge™ à partir de 79€/mois pour trader avec vos propres fonds. Formules mensuelle, 6 mois et 12 mois.",
};

async function getTarifsData(): Promise<{ isLoggedIn: boolean; hasActiveSub: boolean; userEmail: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false, hasActiveSub: false, userEmail: null };
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  return { isLoggedIn: true, hasActiveSub: !!subscription, userEmail: user.email ?? null };

}

function ctaHrefFor(planKey: PlanKey, isLoggedIn: boolean, hasActiveSub: boolean): string {
  if (!isLoggedIn) return `/inscription?next=/tarifs/fonds-propres&plan=${planKey}`;
  if (hasActiveSub) return "/mon-espace";
  return `/paiement?plan=${planKey}`;
}

export default async function TarifsFondsPropres() {
  const { isLoggedIn, hasActiveSub, userEmail } = await getTarifsData();
    const salesOpen = isSalesOpen(userEmail);

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <div className="text-center max-w-[620px] mx-auto mb-14">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
            Tarifs · Fonds propres
          </span>
          <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
            Qrypton pour vos fonds propres
          </h1>
          <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
            Utilisez Qrypton pour automatiser votre stratégie sur votre propre compte de trading.
          </p>
        </div>
        <div className="text-center max-w-[620px] mx-auto -mt-8 mb-14">
          <p className="text-muted-2 text-[13px]">
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

        <div className="max-w-[620px] mx-auto rounded-2xl border border-line-strong bg-bg-2 px-5 py-4 text-center mb-8">
  <p className="text-sm text-white/85 font-medium mb-1">
    Vous tradez sur un compte Prop Firm (FTMO, FundedNext…) ?
  </p>
  <p className="text-muted-2 text-[12.5px] leading-relaxed mb-3">
    Cette page concerne uniquement un trading avec vos propres fonds. Les Prop Firms suivent des
    règles d&apos;allocation différentes — le tarif applicable n&apos;est pas le même.
  </p>
  <Link
    href="/tarifs/prop-firm"
    className="inline-block text-blue-soft text-[13px] font-semibold hover:underline"
  >
    Voir l&apos;offre Prop Firm →
  </Link>
</div>


        <FondsPropresPricingSection
          plans={[
            { plan: PLANS.monthly, href: ctaHrefFor("monthly", isLoggedIn, hasActiveSub) },
            { plan: PLANS.six_months, href: ctaHrefFor("six_months", isLoggedIn, hasActiveSub) },
            { plan: PLANS.twelve_months, href: ctaHrefFor("twelve_months", isLoggedIn, hasActiveSub) },
          ]}
          salesOpen={salesOpen}
          salesClosedMessage={SALES_CLOSED_MESSAGE}
        />
       
        <div className="max-w-[720px] mx-auto mt-14 border-t border-line pt-10 text-center">
          <h2 className="font-display text-base font-semibold mb-4">Incluses dans les 3 formules</h2>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13.5px] text-muted">
            {["Robot OPR Edge™", "Licence personnelle", "Guide d'installation", "Mises à jour du logiciel", "Support utilisateur"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-blue-soft">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-[620px] mx-auto mt-10 text-center">
          <p className="text-muted-2 text-[12.5px]">
            Vous tradez avec un compte Prop Firm ?{" "}
            <Link href="/tarifs/prop-firm" className="text-blue-soft hover:underline">
              Voir l&apos;offre Prop Firm →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
