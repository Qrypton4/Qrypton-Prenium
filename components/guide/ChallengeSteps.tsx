type Step = {
  emoji: string;
  title: string;
  body: React.ReactNode;
};

const STEPS: Step[] = [
  {
    emoji: "💳",
    title: "Choisissez votre compte",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Choisissez la taille de compte que vous souhaitez auprès d&apos;une Prop Firm :{" "}
        10 000 €, 50 000 €, 100 000 €, 200 000 €… Vous payez uniquement l&apos;inscription au
        challenge, généralement entre <span className="text-white font-medium">80 € et 500 €</span>.
      </p>
    ),
  },
  {
    emoji: "🤖",
    title: "Qrypton travaille pour vous",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Vous installez Qrypton et le robot exécute automatiquement sa stratégie :{" "}
        <span className="text-white font-medium">0,5 % de risque par position</span>,{" "}
        <span className="text-white font-medium">1 trade maximum par jour</span>. Aucune
        intervention manuelle n&apos;est nécessaire.
      </p>
    ),
  },
  {
    emoji: "🎯",
    title: "Atteignez l'objectif",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Le challenge demande généralement{" "}
        <span className="text-white font-medium">8 à 10 % de performance</span>, selon la Prop
        Firm. Qrypton respecte sa stratégie et ne force pas les trades pour aller plus vite.
      </p>
    ),
  },
  {
    emoji: "🏆",
    title: "Challenge réussi",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Une fois l&apos;objectif atteint et les règles respectées, la Prop Firm vous donne accès
        au compte financé. Certaines Prop Firms remboursent aussi les frais du challenge.
      </p>
    ),
  },
  {
    emoji: "💰",
    title: "Votre compte est financé",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Qrypton continue de fonctionner sur votre compte financé. Les bénéfices sont partagés
        selon les conditions de la Prop Firm, souvent{" "}
        <span className="text-white font-medium">80 % pour vous / 20 % pour la Prop Firm</span>.
      </p>
    ),
  },
  {
    emoji: "✨",
    title: "Alternative : Funded Direct",
    body: (
      <p className="text-sm text-muted leading-relaxed">
        Certaines Prop Firms proposent ponctuellement des comptes Funded Direct, financés
        directement sans challenge. Qrypton partage les offres intéressantes sur ses réseaux
        sociaux.
      </p>
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
            <div className="w-9 h-9 rounded-lg border border-line-strong bg-blue/5 flex items-center justify-center text-base mb-5">
              {s.emoji}
            </div>
            {i < 5 && (
              <div className="text-[10px] font-mono text-muted-2 uppercase tracking-widest mb-1.5">
                Étape {i + 1}
              </div>
            )}
            <h3 className="font-semibold mb-2.5">{s.title}</h3>
            {s.body}
          </div>
        ))}
      </div>

      <p className="text-muted-2 text-[11px] leading-relaxed mt-2">
        Les frais, objectifs, règles, remboursements et conditions de partage des bénéfices
        varient selon chaque Prop Firm. La réussite d&apos;un challenge et les performances
        futures ne sont pas garanties.
      </p>
    </div>
  );
}
