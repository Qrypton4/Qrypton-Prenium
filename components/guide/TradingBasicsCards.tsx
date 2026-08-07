import { ShieldAlert, Target, ShieldCheck, Scale, Percent, TrendingUp, Activity, Wallet } from "lucide-react";

const CAPITAL_CARD = {
  icon: Wallet,
  title: "Quel capital prévoir ?",
  text: "Pour une utilisation avec vos fonds propres, nous recommandons un capital de référence de 10 000 € minimum afin de conserver une cohérence entre le capital utilisé et le coût de la licence Qrypton.\n\nAvec une Prop Firm, un compte de 10 000 € peut généralement être accessible pour environ 80 à 150 €, selon la société et les conditions du challenge.",
  example: "Ces montants sont indicatifs. Les conditions varient selon chaque Prop Firm.",
  highlight: true,
};

const BASICS = [
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
          <p className="text-[13px] text-muted leading-relaxed mb-2.5 whitespace-pre-line">{b.text}</p>
          <p className="text-[12px] text-muted-2 leading-relaxed border-t border-line pt-2.5">{b.example}</p>
        </div>
      ))}
    </div>
  );
}
