const STEPS = [
  { label: "Développement de la stratégie", status: "done" as const },
  { label: "Backtest terminé", status: "done" as const },
  { label: "Robot finalisé", status: "done" as const },
  { label: "Début du Challenge Prop Firm", status: "done" as const },
  { label: "Challenge en cours", status: "current" as const },
  { label: "Compte financé", status: "upcoming" as const },
  // Pour ajouter une étape future : { label: "...", status: "upcoming" },
];

export default function Timeline() {
  return (
    <div className="max-w-[720px] mx-auto">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                s.status === "done"
                  ? "bg-positive"
                  : s.status === "current"
                  ? "bg-blue animate-pulse"
                  : "bg-line-strong"
              }`}
            />
            {i < STEPS.length - 1 && (
              <span className={`w-px flex-1 my-1 ${s.status === "done" ? "bg-positive/40" : "bg-line"}`} />
            )}
          </div>
          <div className="pb-8">
            <span
              className={`text-[14.5px] ${
                s.status === "upcoming" ? "text-muted-2" : s.status === "current" ? "text-white font-medium" : "text-muted"
              }`}
            >
              {s.label}
            </span>
            {s.status === "current" && (
              <span className="ml-2 text-[10px] font-mono text-blue-soft uppercase tracking-wide">En cours</span>
            )}
            {s.status === "upcoming" && (
              <span className="ml-2 text-[10px] font-mono text-muted-2 uppercase tracking-wide">À venir</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
