"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function TradeRow({ t }: { t: any }) {
  const win = Number(t.profit) >= 0;
  return (
    <div className="flex justify-between items-center py-3.5 border-t border-line first:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
            win ? "bg-positive/10 text-positive" : "bg-red-400/10 text-red-400"
          }`}
        >
          {win ? "↗" : "↘"}
        </div>
        <div>
          <div className="text-[13px] font-medium">Trade clôturé</div>
          <div className="text-[11.5px] text-muted-2 mt-0.5">
            {t.symbol} · {t.direction === "buy" ? "Achat" : "Vente"} · {t.lot_size} lot
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold ${win ? "text-positive" : "text-red-400"}`}>
          {win ? "+" : ""}
          {Number(t.profit).toFixed(2)} €
        </div>
        <div className="text-[10.5px] text-muted-2 mt-0.5">
          {new Date(t.close_time).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

// Regroupe une liste de trades (déjà triée, plus récent en premier) par année
// puis par mois, pour l'affichage en accordéon.
function groupByYearAndMonth(trades: any[]) {
  const byYear = new Map<number, Map<number, any[]>>();
  for (const t of trades) {
    const d = new Date(t.close_time);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    if (!byYear.has(year)) byYear.set(year, new Map());
    const byMonth = byYear.get(year)!;
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month)!.push(t);
  }
  return byYear;
}

export default function RecentActivityAccordion({ trades }: { trades: any[] }) {
  const currentYear = new Date().getFullYear();
  const [openYear, setOpenYear] = useState<number | null>(currentYear);

  if (!trades || trades.length === 0) {
    return (
      <div className="text-sm text-muted py-4 text-center">
        Aucun trade pour le moment.
      </div>
    );
  }

  const grouped = groupByYearAndMonth(trades);
  const years = Array.from(grouped.keys()).sort((a, b) => b - a); // plus récent en premier

  return (
    <div className="flex flex-col gap-3">
      {years.map((year) => {
        const isOpen = openYear === year;
        const byMonth = grouped.get(year)!;
        const months = Array.from(byMonth.keys()).sort((a, b) => b - a); // plus récent en premier
        const yearTrades = Array.from(byMonth.values()).flat();
        const yearCount = yearTrades.length;
        const yearProfit = yearTrades.reduce((s, t) => s + Number(t.profit), 0);

        return (
          <div
            key={year}
            className={`border rounded-2xl overflow-hidden transition-colors ${
              isOpen ? "border-blue-soft" : "border-line"
            }`}
          >
            <button
              onClick={() => setOpenYear(isOpen ? null : year)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`font-display text-[14px] font-semibold ${isOpen ? "text-white" : "text-muted"}`}>
                  {year}
                </span>
                <span className="text-[11px] text-muted-2">
                  {yearCount} trade{yearCount > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[12.5px] font-mono font-semibold ${yearProfit >= 0 ? "text-positive" : "text-red-400"}`}>
                  {yearProfit >= 0 ? "+" : ""}
                  {yearProfit.toFixed(2)} €
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-soft" : ""}`}
                  strokeWidth={2}
                />
              </div>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="border-t border-line px-5">
                  {months.map((m) => (
                    <div key={m}>
                      <div className="text-[11px] text-muted-2 uppercase tracking-wide pt-4 pb-1">
                        {MONTHS[m]}
                      </div>
                      {byMonth.get(m)!.map((t) => (
                        <TradeRow key={t.id} t={t} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
