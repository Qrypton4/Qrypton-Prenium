import SiteNavContainer from "@/components/SiteNavContainer";
import { Reveal } from "@/components/Animated";
import { createClient } from "@/lib/supabase-server";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact — Qrypton",
  description: "Une question sur OPR Edge™ ou votre abonnement ? Contactez l'équipe Qrypton par email.",
};

export default async function Contact() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteNavContainer />

      <main className="max-w-[640px] mx-auto px-6 md:px-12 py-20 text-center">
        <Reveal>
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
            Contact
          </span>
          <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight mb-4">
            Une question ?
          </h1>
          <p className="text-muted text-[15px] leading-relaxed mb-10">
            Pour toute question sur OPR Edge™, votre abonnement ou votre licence, l&apos;équipe
            Qrypton vous répond par email.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <a
            href="mailto:contact.qrypton@gmail.com"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-xl border border-line-strong bg-bg-2 hover:border-blue-soft hover:bg-blue/5 transition group"
          >
            <span className="w-9 h-9 rounded-lg border border-line-strong bg-blue/5 flex items-center justify-center shrink-0 group-hover:border-blue-soft">
              <Mail className="w-4 h-4 text-blue-soft" strokeWidth={1.8} />
            </span>
            <span className="font-mono text-[15px] text-white">contact.qrypton@gmail.com</span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-muted-2 text-xs mt-8">
            Cliquez sur l&apos;adresse pour ouvrir votre messagerie directement.
          </p>
        </Reveal>
      </main>
    </>
  );
}
