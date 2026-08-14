import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import PricingCTAButton from "@/components/guide/PricingCTAButton";
import { Reveal } from "@/components/Animated";

export const metadata = {
  title: "Fiscalité et obligations — Guide Qrypton",
  description: "Comprendre les obligations fiscales liées au trading algorithmique, sur compte personnel ou Prop Firm.",
};

function ExampleFlow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col items-center gap-1.5 my-5">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="font-mono text-[13.5px] text-white bg-bg border border-line rounded-lg px-4 py-2 text-center">
            {s}
          </div>
          {i < steps.length - 1 && <span className="text-muted-2 text-sm">↓</span>}
        </div>
      ))}
    </div>
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

export default function GuideFiscalite() {
  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="mt-6 mb-10">
            <div className="w-12 h-12 rounded-xl border border-line-strong bg-blue/5 flex items-center justify-center mb-5 text-xl">
              📋
            </div>
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3">
              Fiscalité et obligations
            </span>
            <h1 className="font-display text-[28px] md:text-[36px] font-semibold tracking-tight">
              Ce qu&apos;il faut savoir avant de déclarer vos gains.
            </h1>
          </div>
        </Reveal>

        {/* Questions générales */}
        <Reveal delay={0.05}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10 mb-6">
            <div className="mb-6 text-[12.5px] text-muted-2 leading-relaxed border border-line rounded-lg px-4 py-3 bg-bg">
              Qrypton n&apos;est ni un cabinet comptable, ni un conseiller fiscal, en investissement
              ou juridique. Les informations ci-dessous sont données à titre indicatif et général :
              elles ne remplacent pas l&apos;avis d&apos;un professionnel (expert-comptable, avocat
              fiscaliste) qui saura analyser votre situation personnelle.
            </div>

            <Field title="Les gains issus du trading sont-ils imposables ?">
              Oui. En France, les gains réalisés sur un compte de trading (broker ou Prop Firm)
              sont soumis à l&apos;impôt, quel que soit l&apos;outil utilisé pour trader — manuel
              ou automatisé comme Qrypton. Le robot exécute une stratégie, mais ne change rien à
              l&apos;obligation de déclarer les gains obtenus.
            </Field>

            <Field title="Faut-il déclarer même de petits gains ?">
              En principe, tout gain réalisé doit être déclaré, sans seuil minimum d&apos;exonération
              automatique pour ce type de revenus. Un professionnel pourra vous indiquer précisément
              les obligations déclaratives qui s&apos;appliquent à votre niveau d&apos;activité.
            </Field>
          </div>
        </Reveal>

       {/* Broker — Fonds propres */}
        <Reveal delay={0.08}>
          <div className="text-[10.5px] text-muted-2 uppercase tracking-widest font-mono mb-3 px-1">
            Exemples chiffrés
          </div>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10 mb-6"> 
            <h2 className="font-display text-base font-semibold mb-1">💼 Broker — Fonds propres</h2>
            <p className="text-muted-2 text-[12.5px] mb-2">Vous utilisez votre propre capital</p>

            <ExampleFlow steps={["10 000 € de capital", "+ 2 000 € de gains", "12 000 €"]} />

            <p className="text-muted text-[13.5px] leading-relaxed">
              ➡️ Vos gains peuvent être soumis à l&apos;impôt et doivent être déclarés selon les
              règles fiscales applicables à votre situation.
            </p>

            <div className="mt-5 text-[12.5px] text-muted-2 leading-relaxed border-t border-line pt-4">
              <span className="text-white font-medium">À retenir : </span>
              vous investissez votre propre argent → pensez à déclarer vos gains.
            </div>
          </div>
        </Reveal>

        {/* Prop Firm */}
        <Reveal delay={0.11}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10 mb-6">
            <h2 className="font-display text-base font-semibold mb-1">🏆 Prop Firm</h2>
            <p className="text-muted-2 text-[12.5px] mb-2">Vous tradez dans le cadre d&apos;une Prop Firm</p>

            <ExampleFlow steps={["10 000 € de capital attribué", "+ 2 000 € de performance", "Payout reçu"]} />

            <p className="text-muted text-[13.5px] leading-relaxed">
              ➡️ Les payouts reçus doivent être déclarés conformément aux règles fiscales
              applicables à votre situation.
            </p>

            <div className="mt-5 text-[12.5px] text-muted-2 leading-relaxed border-t border-line pt-4">
              <span className="text-white font-medium">À retenir : </span>
              vous recevez un payout → renseignez-vous sur les obligations qui s&apos;appliquent à
              votre situation.
            </div>
          </div>
        </Reveal>

        {/* Bonnes pratiques / À anticiper */}
        <Reveal delay={0.14}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <div className="text-[10.5px] text-positive uppercase tracking-wide font-mono mb-2">
                  Bonnes pratiques
                </div>
                <p className="text-muted text-[13.5px] leading-relaxed">
                  Conservez l&apos;historique complet de vos trades et relevés de compte (broker
                  ou Prop Firm). Ces documents seront nécessaires pour établir votre déclaration
                  et justifier vos montants en cas de contrôle.
                </p>
              </div>
              <div>
                <div className="text-[10.5px] text-muted-2 uppercase tracking-wide font-mono mb-2">
                  À anticiper
                </div>
                <p className="text-muted text-[13.5px] leading-relaxed">
                  Les règles fiscales évoluent et varient selon les pays. Si vous résidez hors de
                  France, ou envisagez une activité de trading régulière, renseignez-vous sur le
                  cadre applicable à votre situation.
                </p>
              </div>
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
