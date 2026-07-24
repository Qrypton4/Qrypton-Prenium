"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MonthlyRow } from "@/lib/performance";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function MonthlyTable({ rows }: { rows: MonthlyRow[] }) {
  const currentYear = new Date().getFullYear();
  const [openYear, setOpenYear] = useState<number | null>(currentYear);

  if (!rows || rows.length === 0) {
    return (
      <div className="border border-line rounded-2xl bg-bg-2 p-12 text-center">
        <div className="text-sm font-medium mb-2">Tableau mensuel en attente</div>
        <p className="text-xs text-muted max-w-[380px] mx-auto leading-relaxed">
          Il sera rempli automatiquement dès que le rapport MetaTrader 5 sera fourni.
        </p>
      </div>
    );
  }

  const years = Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-3">
      {years.map((year) => {
        const yearRows = rows.filter((r) => r.year === year).sort((a, b) => a.month - b.month);
        const isOpen = openYear === year;
      const isCurrentYear = year === currentYear;
     const totalEUR = yearRows.reduce((sum, r) => sum + r.gainEUR, 0);
     const totalPct = (yearRows.reduce((acc, r) => acc * (1 + r.gainPct / 100), 1) - 1) * 100;

        return (
          <div
            key={year}
            className={`border rounded-2xl bg-bg-2 overflow-hidden transition-colors ${
              isOpen ? "border-blue-soft" : "border-line"
            }`}
          >
            <button
              onClick={() => setOpenYear(isOpen ? null : year)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`font-display text-[15px] font-semibold ${isOpen ? "text-white" : "text-muted"}`}>
                  {year}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-soft" : ""}`}
                strokeWidth={2}
              />
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="overflow-x-auto border-t border-line">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="text-muted-2 text-xs uppercase border-b border-line">
                        <th className="text-left font-normal p-3.5 pl-6">Mois</th>
                        <th className="text-left font-normal p-3.5">Gain (€)</th>
                        <th className="text-left font-normal p-3.5">Gain (%)</th>
                        <th className="text-left font-normal p-3.5 pr-6">Drawdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearRows.map((r) => (
                        <tr key={`${r.year}-${r.month}`} className="border-b border-line last:border-0">
                          <td className="p-3.5 pl-6">{MONTHS[r.month - 1]}</td>
                          <td className={`p-3.5 font-mono ${r.gainEUR >= 0 ? "text-positive" : "text-red-400"}`}>
                            {r.gainEUR >= 0 ? "+" : ""}
                            {r.gainEUR.toLocaleString("fr-FR")} €
                          </td>
                          <td className={`p-3.5 font-mono ${r.gainPct >= 0 ? "text-positive" : "text-red-400"}`}>
                            {r.gainPct >= 0 ? "+" : ""}
                            {r.gainPct.toFixed(2)} %
                          </td>
                          <td className="p-3.5 pr-6 font-mono text-muted">{r.drawdownPct.toFixed(2)} %</td>
                        </tr>
                      ))}
                      {!isCurrentYear && (
  <tr className="border-t-2 border-line font-semibold">
    <td className="p-3.5 pl-6">Total {year}</td>
    <td className={`p-3.5 font-mono ${totalEUR >= 0 ? "text-positive" : "text-red-400"}`}>
      {totalEUR >= 0 ? "+" : ""}
      {totalEUR.toLocaleString("fr-FR")} €
    </td>
    <td className={`p-3.5 font-mono ${totalPct >= 0 ? "text-positive" : "text-red-400"}`}>
      {totalPct >= 0 ? "+" : ""}
      {totalPct.toFixed(2)} %
    </td>
    <td className="p-3.5 pr-6"></td>
  </tr>
)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
