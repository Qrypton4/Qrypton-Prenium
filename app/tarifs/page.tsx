import { redirect } from "next/navigation";

// La page /tarifs existante est désormais scindée en deux usages :
// /tarifs/fonds-propres et /tarifs/prop-firm.
// On redirige les liens existants (marque-pages, liens externes) vers
// la formule "Fonds propres", qui correspond à l'offre historique.
export default function Tarifs() {
  redirect("/tarifs/fonds-propres");
}
