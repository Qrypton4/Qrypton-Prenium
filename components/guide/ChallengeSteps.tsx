type Accent = "blue" | "gold" | "positive";

const ACCENT_BOX: Record<Accent, string> = {
  blue: "border-blue/30 bg-blue/10",
  gold: "border-[#E8B754]/30 bg-[#E8B754]/10",
  positive: "border-positive/30 bg-positive/10",
};

type Step = {
  emoji: string;
  title: string;
  accent: Accent;
  body: React.ReactNode;
};

const STEPS: Step[] = [
  {
    emoji: "💳",
    title: "Choisissez votre compte",
    accent: "gold",
    body: (
      <>
        <p className="text-sm text-muted leading-relaxed">
          Choisissez la taille de compte que vous souhaitez auprès d&apos;une Prop Firm :{" "}
          <span className="text-white font-medium">10 000 €, 50 000 €, 100 000 €, 200 000 €…</span>
        </p>
        <p className="text-sm text-muted leading-relaxed mt-2.5">
          Vous payez uniquement l&apos;inscription au challenge — à titre indicatif, comptez
          généralement environ{" "}
          <span className="text-[#E8B754] font-semibold font-mono">80 € à 500 €</span>, selon la
          taille du compte, la Prop Firm et l&apos;offre choisie.
        </p>
        <div className="mt-3 text-[12px] text-muted-2 leading-relaxed border-t border-line pt-2.5">
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
        <p className="text-sm text-muted leading-relaxed">
          Vous installez Qrypton et le robot exécute automatiquement sa stratégie pendant le
          challenge.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-[11px] font-mono font-medium text-blue-soft bg-blue/10 border border-blue/25 rounded-full px-2.5 py-1">
            0,5 % de risque par position
          </span>
          <span className="text-[11px] font-mono font-medium text-blue-soft bg-blue/10 border border-blue/25 rounded-full px-2.5 py-1">
            1 trade maximum / jour
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed mt-3">
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
        <p className="text-sm text-muted leading-relaxed">
          Le challenge demande généralement autour de{" "}
          <span className="text-[#E8B754] font-semibold font-mono">8 à 10 %</span> de performance,
          selon la Prop Firm.
        </p>
        <p className="text-[12px] text-muted-2 leading-relaxed mt-2">
          Exemple : sur un capital de 10 000 €, cela représente environ{" "}
          <span className="text-[#E8B754] font-medium font-mono">800 € à 1 000 €</span> de
          performance.
        </p>
        <div className="mt-3 text-[12px] text-muted-2 leading-relaxed border-t border-line pt-2.5">
          Les gains réalisés pendant cette phase servent à atteindre l&apos;objectif du challenge.
          Ils ne sont pas encore des bénéfices retirables.
        </div>
        <p className="text-sm text-muted leading-relaxed mt-3">
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
        <p className="text-sm text-muted leading-relaxed">
          Une fois l&apos;objectif atteint et toutes les règles respectées, la Prop Firm vous donne
          accès au{" "}
          <span className="text-positive font-medium">compte financé</span>, selon ses conditions.
        </p>
        <p className="text-[12px] text-muted-2 leading-relaxed mt-2.5">
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
        <p className="text-sm text-muted leading-relaxed">
          Qrypton peut continuer à fonctionner sur votre compte financé.
        </p>
        <p className="text-sm text-muted leading-relaxed mt-2.5">
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
      <h2 className="font-display text-base font-semibold mb-4">
        🚀 Comment fonctionne un challenge Prop Firm ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {STEPS.map((s, i) => (
          <div key={s.title} className="bg-bg-2 p-8 h-full flex flex-col">
            <div
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base mb-5 ${ACCENT_BOX[s.accent]}`}
            >
              {s.emoji}
            </div>
            <div className="text-[10px] font-mono text-muted-2 uppercase tracking-widest mb-1.5">
              Étape {i + 1}
            </div>
            <h3 className="font-semibold mb-2.5">{s.title}</h3>
            {s.body}
          </div>
        ))}

        {/* Funded Direct */}
        <div className="bg-bg-2 p-8 h-full flex flex-col">
          <div className="w-9 h-9 rounded-lg border border-blue-soft/30 bg-blue/10 flex items-center justify-center text-base mb-5">
            ✨
          </div>
          <h3 className="font-semibold mb-2.5">Alternative : Funded Direct</h3>
          <p className="text-sm text-muted leading-relaxed">
            Certaines Prop Firms proposent ponctuellement des comptes{" "}
            <span className="text-white font-medium">Funded Direct</span> : le compte est
            directement financé, sans passer de challenge.
          </p>
          <p className="text-sm text-muted leading-relaxed mt-2.5">
            Ces offres dépendent des conditions et promotions disponibles au moment de
            l&apos;inscription.
          </p>
          <p className="text-blue-soft text-[12.5px] leading-relaxed mt-3 font-medium">
            📲 Qrypton partage les offres intéressantes disponibles sur ses réseaux sociaux.
          </p>
        </div>
      </div>

      {/* Mention de sécurité */}
      <p className="text-muted-2 text-[11px] leading-relaxed mt-5">
        Les frais, objectifs, règles, remboursements et conditions de partage des bénéfices
        varient selon chaque Prop Firm. La réussite d&apos;un challenge et les performances
        futures ne sont pas garanties.
      </p>
    </div>
  );
}
