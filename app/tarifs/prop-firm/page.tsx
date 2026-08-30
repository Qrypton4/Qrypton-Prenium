import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import SiteNavContainer from "@/components/SiteNavContainer";
import { Reveal } from "@/components/Animated";
import PropFirmConfigurator from "@/components/tarifs/PropFirmConfigurator";
import { isSalesOpen } from "@/lib/launch";

export const metadata = {
  title: "Prop Firm — Tarifs Qrypton",
  description:
    "Configurez votre licence Qrypton pour Prop Firm : choisissez votre capacité (10K, 20K ou 40K) et votre durée.",
};

async function getTarifsData(): Promise<{
  isLoggedIn: boolean;
  hasActiveSub: boolean;
  userEmail: string | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false, hasActiveSub: false, userEmail: null };
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  return {
    isLoggedIn: true,
    hasActiveSub: !!subscription,
    userEmail: user.email ?? null,
  };
}

export default async function TarifsPropFirm() {
  const { isLoggedIn, hasActiveSub, userEmail } = await getTarifsData();
  const salesOpen = isSalesOpen(userEmail);

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[900px] mx-auto px-6 md:px-12 py-16">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Tarifs · Prop Firm
            </span>
            <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
              Configurez votre licence Qrypton
            </h1>
            <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
              Utilisez Qrypton sur un compte auprès d&apos;une Prop Firm compatible.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="border border-line rounded-[26px] bg-bg-2 p-6 md:p-10">
            <PropFirmConfigurator isLoggedIn={isLoggedIn} hasActiveSub={hasActiveSub} salesOpen={salesOpen} />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="max-w-[620px] mx-auto text-center border-t border-line pt-10 mt-14 mb-6">
            <p className="text-muted text-[14px] mb-3">
              Vous ne connaissez pas encore les Prop Firms ?
            </p>
            <Link
              href="/guide-qrypton/prop-firm"
              className="inline-block px-6 py-3 rounded-lg text-[14px] font-semibold border border-blue-soft/40 text-blue-soft hover:bg-blue/10 transition"
            >
              Découvrir le guide Prop Firm →
            </Link>
          </div>
        </Reveal>

        <p className="max-w-[620px] mx-auto text-center text-muted-2 text-[11px] leading-relaxed">
          Qrypton fournit uniquement le logiciel et la licence permettant son utilisation dans les
          conditions autorisées par chaque Prop Firm. Qrypton ne fournit pas de compte Prop Firm.
        </p>
      </main>
    </>
  );
}
