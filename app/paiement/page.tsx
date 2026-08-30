import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ConsentForm } from "./ConsentForm";
import { PaiementGate } from "./PaiementGate";
import { getPlan } from "@/lib/plans";
import { getPropFirmPlan } from "@/lib/propFirmPlans";
import { isSalesOpen } from "@/lib/launch";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Paiement — Qrypton" };

export default async function Paiement({
  searchParams,
}: {
  searchParams: { plan?: string; context?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isSalesOpen(user?.email)) {
    redirect("/tarifs/fonds-propres");
  }

  const planKey = searchParams.plan || "monthly";
  const isPropFirmContext = searchParams.context === "propfirm";

  if (!user) {
    redirect(`/connexion?next=/paiement${searchParams.plan ? `?plan=${searchParams.plan}` : ""}`);
  }

const plan = getPlan(planKey) || getPropFirmPlan(planKey);
  if (!plan) {
    redirect("/tarifs");
  } 

  let hasDeclaredAccount = false;
  if (isPropFirmContext) {
    const { data: existingAccount } = await supabaseAdmin
      .from("prop_firm_accounts")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    hasDeclaredAccount = !!existingAccount;
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
        {isPropFirmContext ? (
          <PaiementGate hasDeclaredAccount={hasDeclaredAccount} plan={planKey} />
        ) : (
          <ConsentForm plan={planKey} />
        )}
      </div>
    </div>
  );
}
