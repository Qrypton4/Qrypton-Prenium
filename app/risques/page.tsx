import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Risques et responsabilités — Qrypton" };

export default function Risques() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 md:px-12 py-5">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-[17px] w-fit">
          <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={28} height={28} />
          QRYPTON
        </Link>
      </nav>

      <main className="max-w-[720px] mx-auto px-6 md:px-12 py-14 flex-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold mb-8">
          Risques et responsabilités
        </h1>

        <div className="space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Nature du service</h2>
            <p>
              Qrypton édite et commercialise un logiciel de trading algorithmique (OPR Edge™)
              destiné à automatiser l&apos;exécution de positions sur les marchés financiers,
              selon une stratégie prédéfinie. Ce service est un outil logiciel : il ne constitue
              ni un conseil en investissement personnalisé, ni un service de gestion sous mandat,
              ni une recommandation d&apos;investissement au sens de la réglementation applicable.
              Qrypton ne fournit aucune recommandation personnalisée concernant l&apos;achat, la
              vente ou la détention d&apos;un instrument financier. La décision d&apos;utiliser le
              logiciel et de l&apos;associer à un compte de trading appartient exclusivement à
              l&apos;utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">Responsabilité de l&apos;utilisateur</h2>
            <p>
              L&apos;utilisateur conserve l&apos;entière responsabilité de l&apos;installation, de
              la configuration et de l&apos;utilisation du logiciel, ainsi que de toutes les
              décisions de trading exécutées sur son compte. Qrypton n&apos;a accès à aucun moment
              aux fonds ni aux comptes de trading des utilisateurs. L&apos;utilisateur reconnaît
              qu&apos;il reste seul responsable de son compte, du respect des règles applicables
              à son broker ou à sa Prop Firm, ainsi que des conséquences financières liées à ses
              décisions et à l&apos;utilisation du logiciel.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">Risque de perte en capital</h2>
            <p>
              Le trading sur les marchés financiers, y compris via un système automatisé, comporte
              un risque de perte en capital pouvant aller jusqu&apos;à la perte totale des sommes
              engagées. Les instruments financiers concernés (notamment les indices tels que le
              Nasdaq) peuvent connaître une forte volatilité. L&apos;utilisation d&apos;un logiciel
              automatisé ne supprime pas ce risque. Qrypton ne garantit aucun niveau de
              performance, de rentabilité ou de résultat.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">Performances passées</h2>
            <p>
              Les performances présentées sur ce site, qu&apos;elles soient issues de backtests
              historiques ou de résultats réels observés sur un compte de démonstration ou de
              challenge, sont communiquées à titre informatif uniquement. Elles ne préjugent en
              aucun cas des performances futures et ne constituent pas une garantie de résultat.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">Absence d&apos;affiliation</h2>
            <p>
              Qrypton est un éditeur de logiciel indépendant. Qrypton n&apos;est affilié à, ni
              approuvé par, aucun broker, plateforme de trading ou prop firm mentionné sur ce site.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
            <p>
              Pour toute question relative à ces informations, vous pouvez nous contacter via la{" "}
              <Link href="/contact" className="text-blue-soft hover:underline">
                page Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-line px-6 md:px-12 py-10">
        <p className="text-[12.5px] text-muted-2 max-w-[1160px] mx-auto">
          © 2026 Qrypton. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
