import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import StepList from "@/components/guide/StepList";
import ExampleFirmsList from "@/components/guide/ExampleFirmsList";
import PricingCTAButton from "@/components/guide/PricingCTAButton";
import { Reveal } from "@/components/Animated";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Broker (fonds propres) — Guide Qrypton",
  description: "Comprendre comment utiliser le robot Qrypton avec votre propre capital, via un broker compatible MT5.",
};

export default async function GuideBroker() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="mt-6 mb-10">
            <div className="w-12 h-12 rounded-xl border border-line-strong bg-blue/5 flex items-center justify-center mb-5 text-xl">
              🏦
            </div>
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3">
              Broker (fonds propres)
            </span>
            <h1 className="font-display text-[28px] md:text-[36px] font-semibold tracking-tight">
              Utiliser le robot avec votre propre capital.
            </h1>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10">
            <Field title="Qu'est-ce qu'un broker ?">
              Un broker est un intermédiaire financier qui vous permet d&apos;accéder aux marchés
              (indices, forex, matières premières...) via une plateforme comme MetaTrader 5. Vous
              ouvrez un compte, déposez votre propre capital, et tradez directement avec cet argent.
            </Field>

            <Field title="Comment fonctionne un compte personnel MT5 ?">
              Après ouverture du compte, vous recevez des identifiants de connexion (login, mot de
              passe, serveur) qui permettent de connecter MetaTrader 5 à votre compte. Le robot
              Qrypton s&apos;installe ensuite sur ce compte comme sur n&apos;importe quel compte MT5.
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-b border-line my-6">
              <div>
                <div className="text-[10.5px] text-positive uppercase tracking-wide font-mono mb-2">Avantages</div>
                <p className="text-muted text-[13.5px] leading-relaxed">
                  100% des gains vous reviennent. Aucune règle de drawdown imposée par un tiers, et
                  une liberté totale sur le capital utilisé et le rythme d&apos;utilisation.
                </p>
              </div>
              <div>
                <div className="text-[10.5px] text-muted-2 uppercase tracking-wide font-mono mb-2">Contraintes</div>
                <p className="text-muted text-[13.5px] leading-relaxed">
                  Le capital de départ est le vôtre — les pertes, bien que limitées par la gestion
                  du risque intégrée au robot, restent à votre charge.
                </p>
              </div>
            </div>

            <Field title="Comment commencer avec son propre capital ?">
              Choisissez un broker compatible MT5, ouvrez un compte (démo pour tester, réel pour
              trader), déposez le montant de votre choix, et installez le robot Qrypton.
            </Field>

            <div>
              <h2 className="font-display text-base font-semibold mb-4">
                Étapes d&apos;installation sur un compte personnel
              </h2>
              <StepList
                steps={[
                  "Installer MetaTrader 5, téléchargé depuis le site du broker choisi.",
                  "Ouvrir un compte de trading chez ce broker (démo ou réel).",
                  "Se connecter à MT5 avec les identifiants reçus par email.",
                  "Installer le robot Qrypton sur le graphique correspondant, depuis votre espace client.",
                  "Renseigner votre clé de licence et activer le trading algorithmique.",
                ]}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-line">
              <h2 className="font-display text-base font-semibold mb-2">
                Exemples de brokers compatibles MT5
              </h2>
              <ExampleFirmsList
                items={[
                  {
                    name: "IC Markets",
                    url: "https://www.icmarkets.com",
                    description: "Spreads serrés, exécution rapide — utilisé par les traders algorithmiques.",
                  },
                  {
                    name: "Pepperstone",
                    url: "https://pepperstone.com",
                    description: "Régulé par plusieurs autorités financières, compatible MT5.",
                  },
                ]}
                note="Ces brokers sont proposés à titre d'exemple uniquement. Qrypton n'est affilié à aucun d'eux et vous restez libre de choisir le broker de votre choix, du moment qu'il est compatible avec MetaTrader 5."
              />
            </div>

            <div className="mt-8 pt-6 border-t border-line text-center">
              <PricingCTAButton />
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
