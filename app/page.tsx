import Image from "next/image";
import Link from "next/link";
import { Reveal, CountUp } from "@/components/Animated";
import { createClient } from "@/lib/supabase-server";
import { getChallengeData } from "@/lib/challenge";
import SyncBadge from "@/components/SyncBadge";
import { RiskCardsCompact } from "@/components/RiskCards";
import RiskSimulator from "@/components/RiskSimulator";
import SiteNav from "@/components/SiteNav";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const challenge = getChallengeData();

  return (
    <>
      <SiteNav isLoggedIn={!!user} />

      {/* HERO */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-10 md:pb-14 text-center flex flex-col items-center">
        <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={88} height={88} className="mb-8 fade-up" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-line-strong rounded-full text-[12.5px] text-muted font-mono mb-4 fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-blue shadow-[0_0_8px_#3D6BFF]" />
          Nasdaq · Stratégie Opening Price Range
        </div>
        <div className="mb-7 fade-up">
          <SyncBadge date={challenge.lastUpdated} />
        </div>
        <h1 className="font-display text-[36px] md:text-[64px] font-semibold leading-[1.1] tracking-tight max-w-[900px] fade-up">
          Trading algorithmique.
          <br />
          Conçu avec{" "}
          <span className="bg-gradient-to-r from-white to-blue-soft bg-clip-text text-transparent">
            précision.
          </span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[600px] fade-up">
          Des solutions de trading algorithmique professionnelles, pensées pour une exécution
          disciplinée, une gestion du risque rigoureuse et une performance transparente.
        </p>
        <div className="flex gap-3.5 mt-9 flex-wrap justify-center fade-up">
          <Link href="/performance" className="px-6 py-3.5 rounded-lg text-[14.5px] font-semibold bg-blue text-white hover:bg-[#5279ff] hover:shadow-[0_8px_30px_-6px_rgba(61,107,255,0.35)] hover:-translate-y-px transition">
            Découvrir OPR Edge™
          </Link>
          <Link href="/challenge-prop-firm" className="px-6 py-3.5 rounded-lg text-[14.5px] font-semibold border border-line-strong hover:bg-white/5 hover:border-muted transition">
            Voir résultat en direct
          </Link>
        </div>
      </section>

      {/* WHY QRYPTON */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Pourquoi Qrypton
            </span>
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold tracking-tight">
              Un logiciel, pas des promesses.
            </h2>
            <p className="text-muted mt-3.5">
              Chaque décision de conception vise d&apos;abord à protéger le capital, et ensuite
              seulement à générer de la performance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {[
              { title: "Entièrement automatisé", desc: "Exécute les entrées, le stop-loss, le break-even et les sorties sans intervention manuelle." },
              { title: "Gestion du risque", desc: "Risque fixe de 0,5 % par trade, avec une règle stricte d'une seule position par jour." },
              { title: "Performance transparente", desc: "Backtest et résultats réels séparés et publiés intégralement — rien n'est caché." },
              { title: "Compatible MT5 & Prop Firms", desc: "Fonctionne nativement sur MetaTrader 5 et compatible avec les principales prop firms." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="bg-bg-2 p-8 hover:bg-[#111a2e] transition h-full">
                  <div className="w-9 h-9 rounded-lg border border-line-strong bg-blue/5 mb-5" />
                  <h3 className="font-semibold mb-2.5">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RISK MANAGEMENT — SECTION RÉSUMÉE, INTÉGRÉE */}
      <section className="py-24 border-t border-line">
        <div className="max-w-[1160px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Gestion du risque
            </span>
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold tracking-tight">
              Une discipline, pas un pari.
            </h2>
            <p className="text-muted mt-3.5">
              Sept règles fixes, appliquées sans exception, à chaque trade.
            </p>
          </div>
          <Reveal>
            <RiskCardsCompact />
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.05}>
              <RiskSimulator />
            </Reveal>
          </div>
         
        </div>
      </section>

      
    </>
  );
}
