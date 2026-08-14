import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";
import PricingCTAButton from "@/components/guide/PricingCTAButton";
import { Reveal } from "@/components/Animated";

export const metadata = {
  title: "Fiscalité et obligations — Guide Qrypton",
  description: "Comprendre les grandes lignes de la fiscalité liée au trading algorithmique en France, sur compte personnel ou Prop Firm.",
};

export default function GuideFiscalite() {
  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <Link href="/guide-qrypton" className="text-sm text-muted hover:text-white transition">
            ← Retour au guide
          </Link>
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

        <Reveal delay={0.05}>
          <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10">
            <div className="mb-6 text-[12.5px] text-muted-2 leading-relaxed border border-line rounded-lg px-4 py-3 bg-bg">
              Qrypton n&apos;est ni un cabinet comptable, ni un conseiller fiscal. Les informations
              ci-dessous sont données à titre indicatif et général : elles ne remplacent pas
              l&apos;avis d&apos;un professionnel (expert-comptable, avocat fiscaliste) qui saura
              analyser votre situation personnelle.
            </div>

            <Field title="Les gains issus du trading sont-ils imposables ?">
              Oui. En France, les gains réalisés sur un compte de trading personnel (broker,
              fonds propres) sont soumis à l&apos;impôt, quel que soit l&apos;outil utilisé pour
              trader — manuel ou automatisé comme Qrypton. Le robot exécute une stratégie, mais
              ne change rien au régime fiscal applicable aux gains obtenus.
            </Field>

            <Field title="Quel régime fiscal pour un compte personnel (broker) ?">
              Les plus-values sur instruments financiers (CFD, forex, indices) réalisées par un
              particulier relèvent généralement du régime des plus-values sur biens meubles ou du
              prélèvement forfaitaire unique (PFU / « flat tax »), selon la nature exacte des
              produits tradés et le statut du broker. Le taux et les modalités exactes dépendent
              de votre situation — un professionnel pourra confirmer le régime qui s&apos;applique
              précisément à votre cas.
            </Field>

            <Field title="Et pour un compte financé via une Prop Firm ?">
              Le statut fiscal des versements reçus d&apos;une Prop Firm (souvent qualifiés de
              « partage de profits » plutôt que de plus-values de trading direct) peut différer
              d&apos;un compte personnel, notamment parce que le capital tradé n&apos;est pas le
              vôtre. Ce point mérite une attention particulière : demandez conseil à un
              professionnel avant de déclarer ce type de revenus.
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-b border-line my-6">
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

            <Field title="Faut-il déclarer même de petits gains ?">
              En principe, tout gain réalisé doit être déclaré, sans seuil minimum d&apos;exonération
              automatique pour ce type de revenus. Un professionnel pourra vous indiquer précisément
              les obligations déclaratives qui s&apos;appliquent à votre niveau d&apos;activité.
            </Field>

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
