import SiteNav from "@/components/SiteNav";
import TradingBasicsCards from "@/components/guide/TradingBasicsCards";
import PathCard from "@/components/guide/PathCard";
import { Reveal } from "@/components/Animated";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Guide Qrypton — Comprendre l'environnement du trading automatisé",
  description: "Comprendre comment fonctionne le robot Qrypton, sur un compte personnel ou via une Prop Firm.",
};

export default async function GuideQrypton() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteNav isLoggedIn={!!user} />

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Guide Qrypton
            </span>
            <h1 className="font-display text-[30px] md:text-[40px] font-semibold tracking-tight">
              Comprendre l&apos;environnement du trading automatisé.
            </h1>
          </div>
        </Reveal>

        {/* INTRODUCTION */}
        <Reveal delay={0.05}>
          <div className="max-w-[720px] mx-auto mb-16 border border-line rounded-2xl bg-bg-2 p-7 md:p-9">
            <h2 className="font-display text-base font-semibold mb-3">L&apos;objectif de ce guide</h2>
            <p className="text-muted text-[14px] leading-relaxed mb-3.5">
              Ce guide n&apos;est pas une formation pour apprendre à trader. Son objectif est de vous
              permettre de comprendre l&apos;environnement dans lequel fonctionne le robot Qrypton,
              son mode de fonctionnement, les principes essentiels des marchés financiers et le rôle
              des Prop Firms.
            </p>
            <p className="text-muted text-[14px] leading-relaxed">
              Vous n&apos;avez pas besoin d&apos;être expert des marchés financiers. Le robot Qrypton
              exécute automatiquement une stratégie prédéfinie, tandis que ce guide vous apporte les
              connaissances nécessaires pour comprendre son fonctionnement et utiliser la solution en
              toute confiance.
            </p>
          </div>
        </Reveal>

        {/* CONCEPTS COMMUNS */}
        <section className="mb-20">
          <Reveal>
            <div className="mb-8">
              <span className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-2">
                Les bases
              </span>
              <h2 className="font-display text-xl md:text-2xl font-semibold">
                Comprendre l&apos;environnement du trading automatisé
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <TradingBasicsCards />
          </Reveal>
        </section>

        {/* CHOIX DU PARCOURS */}
        <section>
          <Reveal>
            <div className="text-center mb-8">
              <span className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-2">
                Choisissez votre parcours
              </span>
              <h2 className="font-display text-xl md:text-2xl font-semibold">
                Comment souhaitez-vous utiliser le robot ?
              </h2>
              <p className="text-muted text-[13.5px] mt-3 max-w-[520px] mx-auto">
                Broker : vous investissez votre propre capital. Prop Firm : vous tradez le capital
                d&apos;une société, après avoir réussi un challenge.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px] mx-auto">
              <PathCard
                href="/guide-qrypton/broker"
                emoji="🏦"
                title="Broker (fonds propres)"
                description="Vous utilisez votre propre capital, via un broker compatible MT5. 100% des gains vous reviennent."
              />
              <PathCard
                href="/guide-qrypton/prop-firm"
                emoji="🚀"
                title="Prop Firm"
                description="Vous tradez un capital financé par une société, après avoir réussi un challenge."
                recommended
              />
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
