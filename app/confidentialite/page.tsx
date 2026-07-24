import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — Qrypton" };

export default function Confidentialite() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-white transition">← Retour à l&apos;accueil</Link>
      <h1 className="font-display text-2xl font-semibold mt-6 mb-2">Politique de confidentialité</h1>
      <p className="text-xs text-muted-2 mb-8 border border-line rounded-lg p-4 bg-bg-2">
        ⚠️ Contenu de structure uniquement — à faire rédiger ou valider par un professionnel du
        droit (RGPD) avant mise en ligne réelle. Ne pas publier tel quel.
      </p>
      <div className="flex flex-col gap-6 text-sm text-muted leading-relaxed">
        <Section title="1. Données collectées">
          Décrire ici les données collectées : identité, email, données de connexion MT5, données
          de facturation Stripe.
        </Section>
        <Section title="2. Finalité du traitement">
          Décrire ici l&apos;usage fait des données (fourniture du service, facturation, support).
        </Section>
        <Section title="3. Hébergement et sous-traitants">
          Mentionner ici Supabase (base de données) et Stripe (paiement), avec leur localisation.
        </Section>
        <Section title="4. Droits des utilisateurs">
          Décrire ici les droits d&apos;accès, de rectification et de suppression (RGPD).
        </Section>
        <Section title="5. Contact">
          Indiquer ici une adresse de contact pour toute question relative aux données
          personnelles.
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
