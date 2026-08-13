import { ShieldAlert, Target, ShieldCheck, Scale, Percent, TrendingUp, Activity, Wallet, LucideIcon } from "lucide-react";
import Link from "next/link";

type BasicCard = {
  icon: LucideIcon;
  title: string;
  text: string;
  example: string;
  highlight?: boolean;
  linkHref?: string;
  linkLabel?: string;
  stats?: { label: string; value: string }[];
  callout?: string;
};

const CAPITAL_CARD: BasicCard = {
  icon: Wallet,
  title: "Quel capital prévoir ?",
  text: "",
  stats: [
    { label: "Fonds propres", value: "10 000 €" },
    { label: "Prop Firm", value: "10 000 € à 200 000 €" },
  ],
  callout: "💡 Avec environ 1 000 €, vous pouvez combiner 1 an de Qrypton + un challenge 10 000 €.",
  example: "Tarifs indicatifs. Les conditions et tailles de comptes varient selon la Prop Firm. La réussite d'un challenge n'est pas garantie.",
  highlight: true,
  linkHref: "/guide-qrypton/prop-firm",
  linkLabel: "Qu'est-ce qu'une Prop Firm ?",
};

  linkLabel: "Qu'est-ce qu'une Prop Firm ?",
};

const BASICS: BasicCard[] = [
  {
    icon: ShieldAlert,
    title: "Le Stop Loss (SL)",
    text: "Le niveau de prix qui déclenche la clôture automatique d'une position en cas d'évolution défavorable, pour limiter la perte à un montant défini à l'avance.",
    example: "C'est une sécurité intégrée au fonctionnement du robot — pas un échec.",
  },
  {
    icon: Target,
    title: "Le Take Profit (TP)",
    text: "Le niveau de prix qui déclenche la clôture automatique d'une position une fois l'objectif de gain atteint.",
    example: "Le gain est sécurisé automatiquement, sans surveillance manuelle nécessaire.",
  },
  {
    icon: ShieldCheck,
    title: "Le Break Even (BE)",
    text: "Un ajustement automatique qui déplace le Stop Loss au niveau du prix d'entrée dès qu'une position est suffisamment en profit.",
    example: "Le risque de perte devient nul sur cette position — géré entièrement par le système.",
  },
  {
    icon: Scale,
    title: "Pourquoi la gestion du risque est essentielle",
    text: "Une seule position ne détermine jamais le résultat global. Ce qui compte sur le long terme, c'est la constance de l'exécution.",
    example: "La gestion du risque est intégrée au fonctionnement du robot Qrypton, sur chaque position, sans exception.",
  },
  {
    icon: Percent,
    title: "Pourquoi un risque fixe de 0,5 %",
    text: "0,5 % du capital, ni plus ni moins, sur chaque position — un paramètre appliqué automatiquement par le robot, quelle que soit la configuration de marché.",
    example: "Même après plusieurs positions perdantes d'affilée, le capital reste protégé.",
  },
  {
    icon: TrendingUp,
    title: "Le ratio Risque/Rendement (RR)",
    text: "Il compare le gain visé à la perte potentielle sur une position.",
    example: "Le robot Qrypton vise un RR de 3 : un gain potentiel 3 fois supérieur au risque pris.",
  },
  {
    icon: Activity,
    title: "Le Drawdown",
    text: "La baisse du capital depuis son plus haut niveau atteint — un indicateur surveillé en continu par le système.",
    example: "Un drawdown maîtrisé est un signe de robustesse — bien plus qu'un rendement spectaculaire mais irrégulier.",
  },
];

export default function TradingBasicsCards() {
  const cards = [CAPITAL_CARD, ...BASICS];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((b) => (
        <div
          key={b.title}
          className={
            b.highlight
              ? "border border-blue/25 rounded-2xl bg-bg-2 p-6 relative"
              : "border border-line rounded-2xl bg-bg-2 p-6"
          }
        >
          <div
            className={
              b.highlight
                ? "w-10 h-10 rounded-lg border border-blue/30 bg-blue/10 flex items-center justify-center mb-4"
                : "w-10 h-10 rounded-lg border border-line-strong bg-blue/5 flex items-center justify-center mb-4"
            }
          >
            <b.icon className="w-5 h-5 text-blue-soft" strokeWidth={1.6} />
          </div>
         <h3 className="text-[15px] font-semibold mb-2">{b.title}</h3>
              {b.text && (
                <p className="text-[13px] text-muted leading-relaxed mb-2.5 whitespace-pre-line">{b.text}</p>
              )}
              {b.stats && (
                <div className="flex flex-col gap-1.5 mb-3">
                  {b.stats.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-3">
                      <span className="text-[12.5px] text-muted">{s.label}</span>
                      <span className="text-[14px] font-semibold font-mono text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {b.callout && (
                <div className="text-[12.5px] font-medium text-blue-soft bg-blue/10 border border-blue/20 rounded-lg px-3 py-2.5 mb-2.5 leading-relaxed">
                  {b.callout}
                </div>
              )}
              <p className="text-[11.5px] text-muted-2 leading-relaxed border-t border-line pt-2.5">{b.example}</p>
          {b.linkHref && (
            <div className="flex justify-end mt-3">
              <Link
                href={b.linkHref}
                className="group text-blue-soft text-[12px] font-medium hover:underline inline-flex items-center gap-1"
              >
                {b.linkLabel}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
