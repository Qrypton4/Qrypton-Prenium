// components/tarifs/FtmoCapacityGauge.tsx
// Jauge publique de la capacité FTMO, affichée sur /tarifs/prop-firm.
// Lit la vue prop_firm_allocation_status (via lib/propFirm.ts) : elle baisse
// automatiquement à chaque compte déclaré et tient compte des réservations manuelles.

import { getPropFirmAllocationStatus } from "@/lib/propFirm";

function fmt(n: number) {
  return Math.round(n).toLocaleString("fr-FR");
}

type GaugeState = "open" | "low" | "full";

const THEMES: Record<
  GaugeState,
  { label: string; badge: string; bar: string; message: string }
> = {
  open: {
    label: "Disponible",
    badge: "text-positive bg-positive/10 border-positive/30",
    bar: "bg-positive",
    message: "La capacité FTMO est ouverte : vous pouvez souscrire dès maintenant.",
  },
  low: {
    label: "Presque complet",
    badge: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    bar: "bg-amber-400",
    message: "Il reste peu de capacité FTMO. Ne tardez pas à déclarer votre compte.",
  },
  full: {
    label: "Complet",
    badge: "text-red-400 bg-red-400/10 border-red-400/30",
    bar: "bg-red-400",
    message:
      "La capacité FTMO est atteinte : nous ne pouvons pas activer de nouveau compte pour le moment.",
  },
};

export default async function FtmoCapacityGauge() {
  const status = await getPropFirmAllocationStatus("ftmo");

  if (!status || status.allocationMax === null || status.allocationMax <= 0) {
    return null;
  }

  const max = status.allocationMax;
  const available = Math.min(max, Math.max(0, status.allocationAvailable ?? 0));
  const usedPct = Math.round(((max - available) / max) * 100);
  const state: GaugeState = available <= 0 ? "full" : usedPct >= 80 ? "low" : "open";
  const theme = THEMES[state];

  return (
    <div className="max-w-[620px] mx-auto rounded-2xl border border-line bg-bg-2 px-6 py-5 mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="font-mono text-xs text-blue-soft uppercase tracking-widest">
          Capacité FTMO
        </span>
        <span
          className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}
        >
          {theme.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-display text-[30px] font-semibold tracking-tight">
          {fmt(available)} €
        </span>
        <span className="text-muted text-[13px]">disponibles sur {fmt(max)} €</span>
      </div>

      <div
        className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={usedPct}
        aria-label="Capacité FTMO utilisée"
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${theme.bar}`}
          style={{ width: `${usedPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 mb-3">
        <span className="text-muted-2 text-[11px] font-mono">{usedPct} % utilisé</span>
        <span className="text-muted-2 text-[11px] font-mono">{fmt(max)} €</span>
      </div>

      <p className="text-[13px] text-white/80 leading-relaxed">{theme.message}</p>
    </div>
  );
}
