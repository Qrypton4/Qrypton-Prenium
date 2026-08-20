import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import StepList from "@/components/guide/StepList";
import ExampleFirmsList from "@/components/guide/ExampleFirmsList";
import PricingCTAButton from "@/components/guide/PricingCTAButton";
import ChallengeSteps from "@/components/guide/ChallengeSteps";
import { Reveal } from "@/components/Animated";

export const metadata = {
  title: "Prop Firm — Guide Qrypton",
  description: "Comprendre comment utiliser le robot Qrypton via une Prop Firm et un compte financé.",
};

export default function GuidePropFirm() {
  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="mt-6 mb-10">
            <div className="w-12 h-12 rounded-xl border border-line-strong bg-blue/5 flex items-center justify-center mb-5 text-xl">
              🚀
            </div>
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3">
              Prop Firm
            </span>
            <h1 className="font-display text-[28px] md:text-[36px] font-semibold tracking-tight">
              Utiliser le robot avec un capital financé.
            </h1>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10">
            <Field title="Qu'est-ce qu'une Prop Firm ?">
              Une société qui met à disposition un capital de trading sous certaines conditions
              d&apos;utilisation et de gestion du risque. Le robot Qrypton peut être utilisé pour
              exécuter automatiquement une stratégie sur un compte financé, sans que vous ayez besoin
              de trader manuellement.
            </Field>
            
            <Field title="Si je perds le compte financé, dois-je rembourser ?">
               Non. Le capital appartient à la Prop Firm, pas à vous. En cas de
               liquidation du compte (drawdown dépassé), vous perdez simplement
             l&apos;accès à ce compte financé — vous ne devez rien à personne.
              Rien ne vous empêche ensuite de retenter un nouveau challenge.
             </Field>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-b border-line my-6">
              <div>
                <div className="text-[10.5px] text-positive uppercase tracking-wide font-mono mb-2">Avantages</div>
                <p className="text-muted text-[13.5px] leading-relaxed">
                  Accès à un capital élevé avec un coût d&apos;entrée minime — souvent 50 € à 500 €
                  pour des comptes de 10 000 € à 200 000 € ou plus, sans immobiliser une somme élevée
                  au départ.
                </p>
              </div>
              <div>
                <div className="text-[10.5px] text-muted-2 uppercase tracking-wide font-mono mb-2">Contraintes</div>
              <p className="text-muted text-[13.5px] leading-relaxed">
                  Les profits sont partagés avec la société (généralement 80 % pour vous, 20 % pour
                  la Prop Firm), et des règles de drawdown strictes doivent être respectées en
                  permanence.
                </p>
                <p className="text-muted text-[13.5px] leading-relaxed mt-3">
                  — Le challenge peut durer quelques semaines à plusieurs mois. Qrypton ne force
                  pas les trades : l&apos;objectif est atteint progressivement, dans le respect des
                  règles de la Prop Firm.
                </p>
              </div>
            </div>

            <ChallengeSteps />
            
            <div className="mt-8 pt-6 border-t border-line">
  <h2 className="font-display text-base font-semibold mb-4">
    Étapes d&apos;installation sur un compte Prop Firm
  </h2>
              <StepList
                steps={[
                  "Choisir une Prop Firm compatible MT5 et s'inscrire à un challenge.",
                  "Recevoir les identifiants du compte de démonstration fourni par la Prop Firm.",
                  "Se connecter à MT5 avec ces identifiants.",
                  "Installer le robot Qrypton sur le graphique correspondant.",
                  "Ajuster si besoin le réglage du risque selon les règles de drawdown de la société.",
                  "Une fois le challenge réussi, continuer avec le compte financé.",
                ]}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-line">
              <h2 className="font-display text-base font-semibold mb-2">
                Exemples de Prop Firms compatibles MT5
              </h2>
              <ExampleFirmsList
                items={[
                  {
                    name: "FTMO",
                    url: "https://ftmo.com",
                    description: "Comptes jusqu'à 200 000 €, compatibilité native MT5.",
                  },
                  {
                    name: "FundedNext",
                    url: "https://fundednext.com",
                    description: "Conditions de challenge flexibles, compatible MT5.",
                  },
                ]}
                note="Ces Prop Firms sont proposées à titre d'exemple uniquement. Qrypton n'est affilié à aucune d'elles et vous restez libre de choisir toute Prop Firm compatible avec MetaTrader 5."
              />
            </div>

            <div className="mt-8 pt-6 border-t border-line text-center">
              <PricingCTAButton href="/tarifs/prop-firm" />
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last-of-type:mb-0">
      <h2 className="font-display text-base font-semibold mb-2">{title}</h2>
      <p className="text-muted text-[13.5px] leading-relaxed">{children}</p>
    </div>
  );
}
