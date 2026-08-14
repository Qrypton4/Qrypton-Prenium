type Step = {
  emoji: string;
  title: string;
  accent: "blue" | "gold" | "positive";
  body: React.ReactNode;
};

const ACCENT_RING: Record<Step["accent"], string> = {
  blue: "border-blue/40 bg-blue/10 text-blue-soft",
  gold: "border-[#E8B754]/40 bg-[#E8B754]/10 text-[#E8B754]",
  positive: "border-positive/40 bg-positive/10 text-positive",
};

const STEPS: Step[] = [
  {
    emoji: "💳",
    title: "Choisissez votre compte",
    accent: "gold",
    body: (
      <>
        <p className="text-muted text-[13px] leading-relaxed">
          Choisissez la taille de compte que vous souhaitez auprès d&apos;une Prop Firm :{" "}
          <span className="text-white font-medium">10 000 €, 50 000 €, 100 000 €, 200 000 €…</span>
        </p>
        <p className="text-muted text-[13px] leading-relaxed mt-2.5">
          Vous payez uniquement l&apos;inscription au challenge — à titre indicatif, comptez
          généralement environ{" "}
          <span className="text-[#E8B754] font-semibold font-mono">80 € à 500 €</span>, selon la
          taille du compte, la Prop Firm et l&apos;offre choisie.
        </p>
        <div className="mt-3 text-[11.5px] text-muted-2 leading-relaxed border border-line rounded-lg px-3 py-2.5 bg-bg">
          Exemple : vous choisissez un challenge sur un compte de{" "}
          <span className="text-white font-medium">10 000 €</span> proposé à{" "}
          <span className="text-[#E8B754] font-medium">80 €</span> → vous payez 80 € pour
          commencer le challenge.
        </div>
      </>
    ),
  },
  {
    emoji: "🤖",
    title: "Qrypton travaille pour vous",
    accent: "blue",
    body: (
      <>
        <p className="text-muted text-[13px] leading-relaxed">
          Vous installez Qrypton et le robot exécute automatiquement sa stratégie pendant le
          challenge.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-[11.5px] font-mono font-medium text-blue-soft bg-blue/10 border border-blue/25 rounded-full px-3 py-1.5">
            0,5 % de risque par position
          </span>
          <span className="text-[11.5px] font-mono font-medium text-blue-soft bg-blue/10 border border-blue/25 rounded-full px-3 py-1.5">
            1 trade maximum / jour
          </span>
        </div>
        <p className="text-muted text-[13px] leading-relaxed mt-3">
          Vous n&apos;avez pas besoin d&apos;intervenir manuellement dans les trades.
        </p>
      </>
    ),
  },
  {
    emoji: "🎯",
    title: "Atteignez l'objectif",
    accent: "gold",
    body: (
      <>
        <p className="text-muted text-[13px] leading-relaxed">
          Le challenge demande généralement autour de{" "}
          <span className="text-[#E8B754] font-semibold font-mono">8 à 10 %</span> de performance,
          selon la Prop Firm.
        </p>
        <p className="text-muted-2 text-[12px] leading-relaxed mt-2">
          Exemple : sur un capital de 10 000 €, cela représente environ{" "}
          <span className="text-[#E8B754] font-medium font-mono">800 € à 1 000 €</span> de
          performance.
        </p>
        <div className="mt-3 text-[11.5px] text-muted-2 leading-relaxed border border-line rounded-lg px-3 py-2.5 bg-bg">
          Les gains réalisés pendant cette phase servent à atteindre l&apos;objectif du challenge.
          Ils ne sont pas encore des bénéfices retirables.
        </div>
        <p className="text-muted text-[13px] leading-relaxed mt-3">
          ⏱️ La durée du challenge ne peut pas être prédite. Qrypton respecte sa stratégie et ne
          force pas les trades pour aller plus vite.
        </p>
      </>
    ),
  },
  {
    emoji: "🏆",
    title: "Challenge réussi",
    accent: "positive",
    body: (
      <>
        <p className="text-muted text-[13px] leading-relaxed">
          Une fois l&apos;objectif atteint et toutes les règles respectées, la Prop Firm vous donne
          accès au{" "}
          <span className="text-positive font-medium">compte financé</span>, selon ses conditions.
        </p>
        <p className="text-muted-2 text-[12px] leading-relaxed mt-2.5">
          Certaines Prop Firms peuvent également rembourser les frais du challenge après sa
          réussite.
        </p>
      </>
    ),
  },
  {
    emoji: "💰",
    title: "Votre compte est financé",
    accent: "positive",
    body: (
      <>
        <p className="text-muted text-[13px] leading-relaxed">
          Qrypton peut continuer à fonctionner sur votre compte financé.
        </p>
        <p className="text-muted text-[13px] leading-relaxed mt-2.5">
          Les bénéfices générés peuvent alors être distribués selon les conditions de la Prop
          Firm, avec un partage souvent autour de{" "}
          <span className="text-positive font-bold font-mono text-[15px]">80 % pour vous</span> /
          20 % pour la Prop Firm.
        </p>
      </>
    ),
  },
];

export default function ChallengeSteps() {
  return (
    <div className="mt-8 pt-6 border-t border-line">
      <div className="mb-7">
        <h2 className="font-display text-lg font-semibold">
          🚀 Comment fonctionne un challenge Prop Firm ?
        </h2>
      </div>

      {/* Desktop — horizontal */}
      <div className="hidden md:flex items-start gap-0">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center text-center px-2 flex-1">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl mb-3.5 ${ACCENT_RING[s.accent]}`}
              >
                {s.emoji}
              </div>
              <div className="text-[10px] font-mono text-muted-2 uppercase tracking-widest mb-1">
                Étape {i + 1}
              </div>
              <h3 className="text-[13.5px] font-semibold mb-2.5">{s.title}</h3>
              <div className="text-left w-full">{s.body}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-line-strong mt-6 shrink-0 relative top-0" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile — vertical */}
      <div className="md:hidden flex flex-col">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-lg ${ACCENT_RING[s.accent]}`}
              >
                {s.emoji}
              </div>
              {i < STEPS.length - 1 && <div className="w-px flex-1 bg-line-strong my-2" />}
            </div>
            <div className="pb-7 flex-1">
              <div className="text-[10px] font-mono text-muted-2 uppercase tracking-widest mb-1">
                Étape {i + 1}
              </div>
              <h3 className="text-[14px] font-semibold mb-2.5">{s.title}</h3>
              {s.body}
            </div>
          </div>
        ))}
      </div>

      {/* Funded Direct */}
      <div className="mt-8 border border-blue-soft/25 rounded-2xl bg-gradient-to-br from-blue/[0.06] to-transparent p-6">
        <h3 className="font-display text-[14.5px] font-semibold mb-2.5 flex items-center gap-2">
          ✨ Alternative : Funded Direct
        </h3>
        <p className="text-muted text-[13px] leading-relaxed">
          Certaines Prop Firms proposent ponctuellement des comptes{" "}
          <span className="text-white font-medium">Funded Direct</span> : le compte est
          directement financé, sans passer de challenge.
        </p>
        <p className="text-muted text-[13px] leading-relaxed mt-2.5">
          Ces offres dépendent des conditions et promotions disponibles au moment de
          l&apos;inscription.
        </p>
        <p className="text-blue-soft text-[12.5px] leading-relaxed mt-3 font-medium">
          📲 Qrypton partage les offres intéressantes disponibles sur ses réseaux sociaux.
        </p>
      </div>

      {/* Mention de sécurité */}
      <p className="text-muted-2 text-[11px] leading-relaxed mt-6">
        Les frais, objectifs, règles, remboursements et conditions de partage des bénéfices
        varient selon chaque Prop Firm. La réussite d&apos;un challenge et les performances
        futures ne sont pas garanties.
      </p>
    </div>
  );
}
