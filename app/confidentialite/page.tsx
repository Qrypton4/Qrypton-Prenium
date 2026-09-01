import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — Qrypton" };

export default function Confidentialite() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-white transition">← Retour à l&apos;accueil</Link>
      <h1 className="font-display text-2xl font-semibold mt-6 mb-2">Politique de confidentialité</h1>
      <p className="text-xs text-muted-2 mb-8">Dernière mise à jour : 28 juillet 2026</p>

      <div className="flex flex-col gap-6 text-sm text-muted leading-relaxed">
        <Section title="1. Qui sommes-nous">
          Qrypton édite et exploite le logiciel de trading algorithmique OPR Edge™, distribué via abonnement sur ce site. Contact : contact.qrypton@gmail.com
        </Section>
        <Section title="2. Données collectées">
          Données de compte (email, identifiant de connexion via email/mot de passe ou connexion Google), données de connexion Google (email et nom via OAuth, jamais le mot de passe), données de paiement (gérées exclusivement par Stripe, aucune donnée de carte stockée chez nous), données d&apos;utilisation techniques (IP, navigateur, pages consultées), et données liées à l&apos;abonnement (statut, historique, licence OPR Edge™).
        </Section>
        <Section title="3. Finalité du traitement">
          Créer et gérer votre compte, vous permettre d&apos;accéder à OPR Edge™ selon votre abonnement, traiter les paiements via Stripe, vous contacter en cas de besoin, et assurer la sécurité du service.
        </Section>
        <Section title="4. Bases légales des traitements">
          Création et gestion du compte, fourniture du logiciel et gestion de l&apos;abonnement : exécution du contrat. Paiement : exécution du contrat. Facturation et obligations comptables : obligation légale. Sécurité et prévention de la fraude : intérêt légitime. Cookies ou technologies non essentielles, le cas échéant : consentement.
        </Section>
        <Section title="5. Hébergement et sous-traitants">
          Supabase (base de données et authentification), Google (authentification OAuth), Stripe (paiements), Vercel (hébergement). Ces prestataires peuvent héberger ou traiter certaines données hors Union européenne, selon leur infrastructure ; ces transferts sont encadrés par les garanties prévues par la réglementation applicable (clauses contractuelles types ou équivalent).
        </Section>
        <Section title="6. Durée de conservation">
          Vos données de compte sont conservées pendant la durée de votre abonnement puis pendant une durée nécessaire aux obligations légales et à la gestion d&apos;éventuels litiges. Les données de facturation sont conservées pendant la durée imposée par les obligations légales et comptables applicables. Les données techniques et de sécurité sont conservées pendant une durée limitée et proportionnée aux besoins de sécurité.
        </Section>
        <Section title="7. Droits des utilisateurs (RGPD)">
          Droit d&apos;accès, de rectification, d&apos;effacement, de limitation, de portabilité et d&apos;opposition. Pour exercer ces droits : contact.qrypton@gmail.com. Vous pouvez aussi saisir l&apos;autorité de contrôle compétente, notamment la CNIL (www.cnil.fr).
        </Section>
        <Section title="8. Cookies">
          Le site utilise uniquement des cookies strictement nécessaires (session, authentification). Aucun cookie publicitaire tiers.
        </Section>
        <Section title="9. Contact">
          Pour toute question relative à cette politique : contact.qrypton@gmail.com
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
