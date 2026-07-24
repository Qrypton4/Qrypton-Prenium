import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getPlan } from "@/lib/plans";

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

  const plan = getPlan(searchParams.plan || "monthly") || getPlan("monthly")!;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[440px] text-center border border-line rounded-2xl bg-bg-2 p-10">
        <div className="text-xs font-mono text-blue-soft uppercase tracking-widest mb-4">
          {plan.label} — {plan.priceEUR}€
        </div>
        <h1 className="font-display text-lg font-semibold mb-3">Paiement bientôt disponible</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Le paiement en ligne n&apos;est pas encore activé. Votre compte est prêt — dès l&apos;ouverture
          des souscriptions, vous serez parmi les premiers informés.
        </p>
        <Link href="/mon-espace" className="inline-block px-5 py-2.5 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition">
          Retour à mon espace
        </Link>
      </div>
    </div>
  );
}
