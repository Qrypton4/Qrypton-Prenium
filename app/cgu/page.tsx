import Link from "next/link";

export const metadata = { title: "Conditions Générales de Vente et d'Utilisation — Qrypton" };

export default function CGU() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-white transition">← Retour à l&apos;accueil</Link>
      <h1 className="font-display text-2xl font-semibold mt-6 mb-2">Conditions Générales de Vente et d&apos;Utilisation</h1>
      <p className="text-xs text-muted-2 mb-8 border border-line rounded-lg p-4 bg-bg-2">
        Dernière mise à jour : 01/09/2026. Édité par Rémi Laly — Qrypton Edge,
        micro-entrepreneur, SIREN 108 731 670 (SIRET 108 731 670 00015), 12 Résidence Simone Veil, 59138 Bachant.
      </p>
      <div className="flex flex-col gap-6 text-sm text-muted leading-relaxed">
        <Section title="1. Objet">
          Les présentes Conditions Générales de Vente et d&apos;Utilisation (CGV/CGU) régissent l&apos;accès
          et l&apos;utilisation du service Qrypton, incluant le logiciel OPR Edge™ (Expert Advisor pour
          la plateforme MetaTrader 5) et l&apos;espace client associé, édités par Qrypton Edge. Toute
          souscription à un abonnement Qrypton implique l&apos;acceptation pleine et entière des
          présentes CGV/CGU.
        </Section>

        <Section title="2. Description du service">
          Qrypton propose la mise à disposition, sous forme d&apos;abonnement (SaaS), d&apos;un logiciel de
          trading automatisé (Expert Advisor) destiné à être installé et exécuté par le client
          directement sur son propre compte de trading, auprès de son propre courtier. Qrypton
          n&apos;a à aucun moment accès aux fonds, comptes ou instruments financiers du client, ne
          fournit aucun conseil en investissement personnalisé et n&apos;exerce aucune activité de
          gestion de portefeuille pour compte de tiers. Le service se limite à la conception, au
          développement, à la licence d&apos;utilisation et à la vente d&apos;un outil logiciel.
        </Section>

        <Section title="3. Compte client et souscription">
          L&apos;accès au service nécessite la création d&apos;un compte client sur qryptonedge.com et la
          souscription à l&apos;une des formules d&apos;abonnement proposées. Le client s&apos;engage à fournir
          des informations exactes et à jour, et à ne pas partager ses identifiants d&apos;accès.
        </Section>

        <Section title="4. Tarifs, paiement et facturation">
          Les abonnements sont proposés aux tarifs affichés sur le site au moment de la
          souscription (facturation mensuelle, semestrielle ou annuelle). Le paiement s&apos;effectue
          par carte bancaire via notre prestataire Stripe, avec reconduction automatique à
          échéance de la période souscrite, sauf résiliation préalable par le client. Les prix sont
          indiqués toutes taxes comprises ; Qrypton Edge bénéficie de la franchise en base de TVA
          (article 293 B du CGI), la TVA n&apos;est donc pas applicable.
        </Section>

        <Section title="5. Droit de rétractation">
          Conformément à l&apos;article L221-18 du Code de la consommation, le client consommateur
          dispose d&apos;un délai de 14 jours à compter de la souscription pour exercer son droit de
          rétractation, sauf s&apos;il a expressément demandé et accepté le commencement immédiat de
          l&apos;exécution du service avant l&apos;expiration de ce délai, auquel cas ce droit ne peut plus
          être exercé une fois le service pleinement exécuté (accès effectif au logiciel).
        </Section>

        <Section title="6. Résiliation">
          Le client peut résilier son abonnement à tout moment depuis son espace client
          (portail de gestion Stripe) ou en contactant le support. La résiliation prend effet à
          la fin de la période d&apos;abonnement en cours ; aucun remboursement au prorata n&apos;est
          effectué pour la période déjà entamée, sauf disposition légale contraire. Qrypton se
          réserve le droit de suspendre ou résilier un compte en cas de manquement du client aux
          présentes CGV/CGU (notamment usage frauduleux, partage de licence, ingénierie inverse
          du logiciel).
        </Section>

        <Section title="7. Licence d'utilisation">
          Qrypton concède au client un droit d&apos;utilisation personnel, non exclusif et non
          cessible du logiciel OPR Edge™, limité à un compte de trading MT5 par licence active, et
          pour la durée de l&apos;abonnement. Toute reproduction, décompilation, revente, sous-licence
          ou mise à disposition à un tiers du logiciel est strictement interdite. La licence est
          liée à l&apos;abonnement : elle cesse automatiquement à l&apos;expiration ou à la résiliation de
          celui-ci.
        </Section>

        <Section title="8. Absence de garantie de performance et risques liés au trading">
          Le trading sur produits dérivés et sur indices (dont le NAS100/US100) comporte un risque
          de perte en capital pouvant être total. Les performances passées, backtests et
          simulations présentés sur le site ne constituent en aucun cas une garantie de résultats
          futurs. Qrypton ne garantit aucun rendement, gain ou absence de perte et décline toute
          responsabilité quant aux résultats de trading obtenus par le client sur son compte
          personnel. Le client reconnaît avoir pris connaissance des avertissements sur les
          risques figurant sur la page{" "}
          <Link href="/risques" className="text-blue-soft hover:underline">
            Risques
          </Link>{" "}
          du site, et déclare agir en toute connaissance de cause et sous sa seule responsabilité.
        </Section>

        <Section title="9. Obligations et responsabilité du client">
          Le client est seul responsable de la configuration de son compte de trading, du choix
          de son courtier, de la gestion de son risque (taille de position, effet de levier,
          capital engagé) et de la surveillance de son compte. Qrypton ne saurait être tenu
          responsable d&apos;un dysfonctionnement lié à la plateforme MetaTrader 5, au courtier du
          client, à sa connexion internet, ou à toute cause extérieure au logiciel lui-même.
        </Section>

        <Section title="10. Limitation de responsabilité">
          La responsabilité de Qrypton, en tant qu&apos;éditeur du logiciel, ne saurait être engagée
          qu&apos;en cas de faute prouvée directement imputable à un défaut du logiciel, et est en
          tout état de cause limitée au montant des sommes versées par le client au titre de son
          abonnement au cours des douze derniers mois. Qrypton ne pourra en aucun cas être tenu
          responsable des pertes financières résultant de l&apos;utilisation du logiciel sur le
          compte de trading du client.
        </Section>

        <Section title="11. Propriété intellectuelle">
          Le logiciel OPR Edge™, le code source, la marque Qrypton, le contenu et les visuels du
          site sont la propriété exclusive de Qrypton Edge. Toute reproduction ou utilisation non
          autorisée constitue une contrefaçon.
        </Section>

        <Section title="12. Données personnelles">
          Le traitement des données personnelles du client est décrit dans la{" "}
          <Link href="/confidentialite" className="text-blue-soft hover:underline">
            politique de confidentialité
          </Link>{" "}
          du site.
        </Section>

        <Section title="13. Droit applicable et litiges">
          Les présentes CGV/CGU sont soumises au droit français. En cas de litige, une solution
          amiable sera recherchée en priorité. À défaut d&apos;accord, les tribunaux français
          compétents seront seuls saisis, sous réserve des règles impératives applicables aux
          consommateurs.
        </Section>

        <Section title="14. Contact">
          Pour toute question relative aux présentes CGV/CGU : contact.qrypton@gmail.com
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-white font-semibold mb-1.5">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
