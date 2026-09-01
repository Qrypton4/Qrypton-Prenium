export const metadata = { title: "Mentions légales – Qrypton" };

export default function MentionsLegales() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 md:px-12 py-5">
        <a href="/" className="flex items-center gap-2.5 font-semibold text-[17px] w-fit">
          QRYPTON
        </a>
      </nav>
      <div className="flex-1 px-6 md:px-12 py-10 max-w-[720px] mx-auto text-sm leading-7 text-muted-2">
        <h1 className="font-display text-2xl font-semibold text-white mb-8">Mentions légales</h1>

       <h2 className="text-white font-semibold mt-6 mb-2">Éditeur du site</h2>
        <p>
          Le site qryptonedge.com est édité par Rémi Laly, exerçant sous le nom
          commercial Qrypton Edge, entreprise individuelle (micro-entrepreneur),
          immatriculée au Registre du Commerce et des Sociétés de Valenciennes sous le
          numéro SIREN 108 731 670 (SIRET 108 731 670 00015),
          dont l&apos;établissement est situé 12 Résidence Simone Veil, 59138 Bachant, France.
        </p>
        <p>Contact : contact.qrypton@gmail.com</p>
        <p>TVA non applicable, article 293 B du Code général des impôts (franchise en base de TVA).</p>

        <h2 className="text-white font-semibold mt-6 mb-2">Directeur de la publication</h2>
        <p>Rémi Laly</p>

        <h2 className="text-white font-semibold mt-6 mb-2">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        </p>

        <h2 className="text-white font-semibold mt-6 mb-2">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, logo, code, visuels) est la
          propriété exclusive de Qrypton, sauf mention contraire. Toute reproduction, même
          partielle, est interdite sans autorisation préalable.
        </p>

        <h2 className="text-white font-semibold mt-6 mb-2">Données personnelles</h2>
        <p>
          Le traitement de vos données personnelles est décrit dans notre{" "}
          <a href="/confidentialite" className="text-blue-soft hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
}
