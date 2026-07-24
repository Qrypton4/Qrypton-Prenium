
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";


export const metadata = { title: "Paiement — Qrypton" };

// Page de transition avant l'intégration Stripe. Une fois Stripe branché,
// remplacer le contenu de cette page par une redirection directe vers
// /api/checkout?plan=xxx (ou par le vrai formulaire de paiement) — le reste du
// parcours utilisateur (boutons "Commencer maintenant" sur /tarifs) n'a pas
// besoin de changer.
export default async function Paiement({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/paiement${searchParams.plan ? `?plan=${searchParams.plan}` : ""}`);
  }

 
  return redirect(`/api/checkout?plan=${searchParams.plan || "monthly"}`);
}
