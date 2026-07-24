import Link from "next/link";

export const metadata = { title: "Conditions Générales — Qrypton" };

export default function CGU() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-white transition">← Retour à l&apos;accueil</Link>
      <h1 className="font-display text-2xl font-semibold mt-6 mb-2">Conditions Générales d&apos;Utilisation</h1>
      <p className="text-xs text-muted-2 mb-8 border border-line rounded-lg p-4 bg-bg-2">
        ⚠️ Contenu de structure uniquement — à faire rédiger ou valider par un professionnel du
        droit avant mise en ligne réelle. Ne pas publier tel quel.
      </p>
      <div className="flex flex-col gap-6 text-sm text-muted leading-relaxed">
        <Section title="1. Objet">
          Les présentes conditions régissent l&apos;accès et l&apos;utilisation du service Qrypton,
          incluant le logiciel OPR Edge™ et l&apos;espace client associé.
        </Section>
        <Section title="2. Abonnement et résiliation">
          Décrire ici les modalités d&apos;abonnement, de facturation récurrente et de résiliation.
        </Section>
        <Section title="3. Licence d'utilisation">
          Décrire ici les droits et restrictions liés à l&apos;utilisation du robot (1 licence = 1
          compte MT5, etc.).
        </Section>
        <Section title="4. Absence de garantie de performance">
          Décrire ici l&apos;absence de garantie de résultat, conformément aux mentions affichées sur
          les pages Performance et Challenge Prop Firm.
        </Section>
        <Section title="5. Responsabilité">
          Décrire ici les limitations de responsabilité de Qrypton.
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
