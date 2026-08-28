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
              <h2 className="font-display text-base font-semibold mb-3">
                Comment fonctionne la capacité disponible ?
              </h2>

              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                Qrypton est actuellement compatible avec <strong className="text-white">FTMO</strong>.
              </p>
              <p className="text-muted-2 text-[12.5px] leading-relaxed mb-3">
                Qrypton n&apos;est ni partenaire, ni affilié, ni sponsorisé par FTMO. FTMO est une
                société indépendante et Qrypton est un service totalement indépendant.
              </p>
              <p className="text-muted text-[13.5px] leading-relaxed mb-6">
                Certaines règles de FTMO limitent l&apos;allocation de capital pouvant être
                utilisée avec une même stratégie. Comme plusieurs clients peuvent utiliser
                Qrypton, la capacité disponible est donc partagée entre les utilisateurs de
                Qrypton.
              </p>

              <h3 className="font-display text-sm font-semibold text-blue-soft mb-2">
                Votre allocation Qrypton
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                Lors de votre souscription, vous choisissez l&apos;allocation correspondant à
                votre compte FTMO :
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {["10 000 €", "20 000 €", "40 000 €"].map((amount) => (
                  <span
                    key={amount}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg border border-line bg-blue/5 text-blue-soft"
                  >
                    {amount}
                  </span>
                ))}
              </div>
              <p className="text-muted-2 text-[12.5px] leading-relaxed mb-6">
                👉 40 000 € est l&apos;allocation maximale prise en charge par abonnement Qrypton.
              </p>

              <h3 className="font-display text-sm font-semibold text-blue-soft mb-2">
                Une capacité globale de 320 000 €
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                Pour respecter la limite d&apos;allocation applicable à une même stratégie chez
                FTMO, Qrypton limite actuellement son utilisation à 320 000 € d&apos;allocation
                cumulée. Cette capacité est partagée entre les utilisateurs de Qrypton.
              </p>
              <p className="text-muted-2 text-[12.5px] mb-2">Par exemple :</p>
              <ul className="space-y-1.5 mb-3">
                <li className="text-muted text-[13px] font-mono">
                  Client A → 10 000 € → <span className="text-blue-soft">310 000 €</span> disponibles
                </li>
                <li className="text-muted text-[13px] font-mono">
                  Client B → 20 000 € → <span className="text-blue-soft">290 000 €</span> disponibles
                </li>
                <li className="text-muted text-[13px] font-mono">
                  Client C → 40 000 € → <span className="text-blue-soft">250 000 €</span> disponibles
                </li>
              </ul>
              <p className="text-muted text-[13.5px] leading-relaxed mb-6">
                La capacité disponible diminue donc au fur et à mesure des activations.
              </p>

              <h3 className="font-display text-sm font-semibold text-blue-soft mb-2">
                Vérification de votre compte
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                Après votre paiement, Qrypton procède à une vérification de votre compte FTMO
                afin de confirmer son montant et sa compatibilité avec l&apos;allocation choisie.
              </p>
              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                Si votre compte dépasse 40 000 €, Qrypton ne pourra pas trader ce compte.
              </p>
              <p className="text-muted text-[13.5px] leading-relaxed mb-6">
                La vérification permet également de s&apos;assurer que la capacité restante est
                suffisante pour votre allocation.
              </p>

              <h3 className="font-display text-sm font-semibold text-blue-soft mb-2">
                Votre compte reste totalement indépendant
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-3">
                L&apos;utilisation de Qrypton ne modifie pas la relation entre vous et FTMO.
              </p>
              <ul className="space-y-1.5 mb-3 text-muted text-[13.5px] leading-relaxed list-disc list-inside">
                <li>Votre compte FTMO reste à votre nom.</li>
                <li>Votre capital reste sous votre propre compte.</li>
                <li>Vos gains et vos pertes restent les vôtres.</li>
                <li>Vous restez responsable du respect des règles de FTMO.</li>
              </ul>
              <p className="text-muted-2 text-[12.5px] leading-relaxed mb-6">
                Qrypton fournit uniquement son logiciel de trading automatisé. Qrypton n&apos;est
                pas une Prop Firm et ne gère pas votre capital.
              </p>

              <h3 className="font-display text-sm font-semibold mb-3">En résumé</h3>
              <ul className="space-y-2">
                {[
                  "FTMO uniquement pour le moment.",
                  "10k, 20k ou 40k € d'allocation au choix.",
                  "40k € maximum par abonnement Qrypton.",
                  "320k € de capacité cumulée pour Qrypton.",
                  "Vérification du compte après paiement avant activation.",
                  "Compte supérieur à 40k € → Qrypton ne tradera pas ce compte.",
                  "Qrypton est un service indépendant et n'est pas affilié à FTMO.",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-muted text-[13px] leading-relaxed">
                    <span className="text-positive shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-line">
              <h2 className="font-display text-base font-semibold mb-2">
                Créer votre compte Prop Firm
              </h2>
              <p className="text-muted-2 text-[12.5px] mb-4">
                Étape par étape, jusqu&apos;à la réception de vos identifiants.
              </p>
              <StepList
                steps={[
                  "Choisissez une Prop Firm parmi celles proposées (par exemple FTMO ou FundedNext).",
                  "Créez votre compte sur le site de la Prop Firm choisie.",
                  "Choisissez la taille de capital souhaitée, en euros (EUR).",
                  "Choisissez votre challenge, selon les propositions de la Prop Firm.",
                  "Sélectionnez impérativement MetaTrader 5 comme plateforme — Qrypton ne fonctionne qu'avec MT5.",
                  "Finalisez l'achat de votre capital.",
                  "Récupérez vos identifiants de connexion une fois l'achat confirmé.",
                ]}
              />
              <p className="text-muted-2 text-[12px] leading-relaxed mt-4">
                Ces identifiants vous serviront dans la vidéo tuto disponible dans votre espace
                Qrypton une fois votre abonnement actif, pour connecter le robot et votre compte
                Prop Firm au marché.
              </p>
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
