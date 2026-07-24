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
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-24 text-center flex flex-col items-center">
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
          <Link href="/#opr-edge" className="px-6 py-3.5 rounded-lg text-[14.5px] font-semibold bg-blue text-white hover:bg-[#5279ff] hover:shadow-[0_8px_30px_-6px_rgba(61,107,255,0.35)] hover:-translate-y-px transition">
            Découvrir OPR Edge™
          </Link>
          <Link href="/challenge-prop-firm" className="px-6 py-3.5 rounded-lg text-[14.5px] font-semibold border border-line-strong hover:bg-white/5 hover:border-muted transition">
            Voir résultat en direct
          </Link>
        </div>
      </section>

      {/* WHY QRYPTON */}
      <section className="py-24">
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
              Six règles fixes, appliquées sans exception, à chaque trade.
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
          <div className="text-center mt-10">
            <Link href="/performance" className="text-sm text-blue-soft hover:underline font-medium">
              Voir le détail complet sur la page Performance →
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="performance" className="bg-navy border-y border-line">
        <div className="max-w-[1160px] mx-auto px-6 md:px-12 pt-20">
          <div className="text-center max-w-[640px] mx-auto mb-0">
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
              Performance backtestée
            </span>
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold tracking-tight">
              2023 — 2026, en résumé.
            </h2>
            <p className="text-muted mt-3.5">Capital initial 100 000 € · US100.cash · Exécution M15</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { value: 54.29, label: "Rendement net", positive: true, suffix: " %", decimals: 2 },
            { value: 5.69, label: "Drawdown maximum", suffix: " %", decimals: 2 },
            { value: 276, label: "Trades" },
            { value: 1, label: "Trade / jour" },
          ].map((s, i) => (
            <div key={s.label} className={`text-center py-12 px-5 ${i < 3 ? "border-r border-line" : ""}`}>
              <CountUp
                value={s.value}
                suffix={s.suffix}
                decimals={s.decimals}
                className={`font-mono text-[30px] md:text-[44px] font-medium ${s.positive ? "text-positive" : "text-white"}`}
              />
              <div className="mt-2.5 text-[13px] text-muted uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center pb-8">
          <span className="inline-block font-mono text-[12.5px] text-muted-2 border border-line rounded-full px-4 py-1.5">
            Capital départ 100 000 € · Gain net <span className="text-positive font-medium">+54 286 €</span>
          </span>
        </div>

        <div className="text-center pb-10">
          <Link href="/performance" className="text-sm text-blue-soft hover:underline font-medium">
            Voir la performance complète →
          </Link>
        </div>
        <div className="text-center text-[12.5px] text-muted-2 font-mono py-9 px-5">
          Profit Factor 1,54 · Win Rate 30,43 % · Pertes consécutives max : 11 trades — Les
          performances passées ne garantissent pas les résultats futurs.
        </div>
      </section>

      {/* CHALLENGE PROP FIRM TEASER */}
      {challenge && (
        <section className="py-20 border-b border-line" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05), transparent)" }}>
          <div className="max-w-[1160px] mx-auto px-6 md:px-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "#8B5CF6" }}>
                Challenge Prop Firm en cours
              </span>
            </div>
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold tracking-tight mb-4">
              {(() => {
                const gain = challenge.closedTrades.reduce((s, t) => s + t.profit, 0);
                return `${gain >= 0 ? "+" : ""}${gain.toLocaleString("fr-FR")} € depuis le début`;
              })()}
            </h2>
            <p className="text-muted max-w-[480px] mx-auto mb-8">
              {challenge.config.brokerName} · Compte {challenge.config.accountSize.toLocaleString("fr-FR")} € · Résultats réels, distincts du backtest.
            </p>
            <Link href="/challenge-prop-firm" className="inline-block px-6 py-3.5 rounded-lg text-[14.5px] font-semibold border border-line-strong hover:bg-white/5 transition">
              Suivre le challenge en direct →
            </Link>
          </div>
        </section>
      )}

      {/* PRICING TEASER */}
      <section id="pricing" className="py-24 text-center">
        <div className="max-w-[640px] mx-auto px-6">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
            Accès
          </span>
          <h2 className="font-display text-[28px] md:text-[40px] font-semibold tracking-tight mb-4">
            79€/mois. Une formule, sans engagement.
          </h2>
          <Link
            href="/tarifs"
            className="inline-block mt-4 px-6 py-3.5 rounded-lg text-[14.5px] font-semibold bg-blue text-white hover:bg-[#5279ff] transition"
          >
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line px-6 md:px-12 py-14">
        <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-3">
          <p className="text-[12.5px] text-muted-2">© 2026 Qrypton. Tous droits réservés.</p>
          <p className="font-mono text-[12.5px] text-muted-2">Precision. Discipline. Performance.</p>
        </div>
      </footer>
    </>
  );
}
