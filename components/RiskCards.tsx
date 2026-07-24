import { Percent, CalendarClock, ShieldCheck, Target, Ban, Bot, Pause } from "lucide-react";

export const RISK_POINTS = [
  {
    icon: Percent,
    title: "Risque fixe",
    value: "0,5 % par trade",
  },
  {
    icon: CalendarClock,
    title: "Discipline",
    value: "1 position maximum / jour",
  },
  {
    icon: ShieldCheck,
    title: "Protection automatique",
    value: "Break-even à 50 % de l'objectif",
  },
  {
    icon: Target,
    title: "Objectif fixe",
    value: "Take Profit — RR 3",
  },
  {
    icon: Ban,
    title: "Aucun overtrading",
    value: "Zéro exception",
  },
  {
    icon: Bot,
    title: "Exécution",
    value: "100 % automatique",
  },
  {
    icon: Pause,
    title: "Période de trading",
    value: "Pause en août - septembre",
    desc: "Aucun trade en août et en septembre.",
  },
];

// Version condensée — homepage uniquement (la page Performance a sa propre analyse détaillée
// dans components/performance/RiskAnalysis.tsx, pour éviter toute répétition)
export function RiskCardsCompact() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {RISK_POINTS.map((p) => (
        <div key={p.title} className="border border-line rounded-xl bg-bg-2 p-5">
          <p.icon className="w-5 h-5 text-blue-soft mb-3" strokeWidth={1.6} />
          <div className="text-[13px] font-semibold mb-1">{p.value}</div>
          <div className="text-[11px] text-muted uppercase tracking-wide">{p.title}</div>
          {p.desc && (
            <p className="text-[11px] text-muted-2 leading-relaxed mt-2 normal-case tracking-normal">
              {p.desc}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
