import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ConsentForm } from "./ConsentForm";
import { getPlan } from "@/lib/plans";

export const metadata = { title: "Paiement — Qrypton" };

export default async function Paiement({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const planKey = searchParams.plan || "monthly";

  if (!user) {
    redirect(`/connexion?next=/paiement${searchParams.plan ? `?plan=${searchParams.plan}` : ""}`);
  }

  const plan = getPlan(planKey);
  if (!plan) {
    redirect("/tarifs");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-[520px] w-full">
        <h1 className="font-display text-2xl font-semibold text-white mb-2">
          Dernière étape avant votre abonnement
        </h1>
        <p className="text-sm text-muted-2 mb-8">
          Formule sélectionnée : <span className="text-white">{plan.label}</span>
        </p>
        <ConsentForm plan={planKey} />
      </div>
    </div>
  );
}
