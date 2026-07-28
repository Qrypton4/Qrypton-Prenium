import FaqAccordion from "@/components/FaqAccordion";
import SiteNavContainer from "@/components/SiteNavContainer";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "FAQ — Qrypton",
  description: "Questions fréquentes sur OPR Edge™, la licence, la compatibilité MT5 et Prop Firm.",
};

export default async function Faq() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteNavContainer />
      <main className="max-w-[1000px] mx-auto px-6 md:px-12 py-16">
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">FAQ</span>
          <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
            Vos questions, nos réponses.
          </h1>
        </div>
        <FaqAccordion />
      </main>
    </>
  );
}
