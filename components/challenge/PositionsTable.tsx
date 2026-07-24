"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ClosedTrade } from "@/lib/challenge";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export default function PositionsTable({ trades }: { trades: ClosedTrade[] }) {
  const groups = new Map<string, { year: number; month: number; trades: ClosedTrade[] }>();
  for (const t of trades) {
    const key = monthKey(t.date);
    const d = new Date(t.date);
    if (!groups.has(key)) {
      groups.set(key, { year: d.getFullYear(), month: d.getMonth() + 1, trades: [] });
    }
    groups.get(key)!.trades.push(t);
  }

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    const [ya, ma] = a.split("-").map(Number);
    const [yb, mb] = b.split("-").map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });

  // Le mois le plus récent disponible est ouvert par défaut
  const mostRecentKey = sortedKeys[sortedKeys.length - 1] ?? null;
  const [openMonth, setOpenMonth] = useState<string | null>(mostRecentKey);

  return (
    <div className="flex flex-col gap-3">
      {sortedKeys.map((key) => {
        const group = groups.get(key)!;
        const isOpen = openMonth === key;
        return (
          <MonthRow
            key={key}
            label={`${MONTHS[group.month - 1]} ${group.year}`}
            trades={group.trades}
            isOpen={isOpen}
            onToggle={() => setOpenMonth(isOpen ? null : key)}
          />
        );
      })}
    </div>
  );
}

function MonthRow({
  label,
  trades,
  isOpen,
  onToggle,
}: {
  label: string;
  trades: ClosedTrade[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ widthPct: 33, leftPct: 0 });
  const monthTotal = trades.reduce((s, t) => s + t.profit, 0);
  const isPositive = monthTotal >= 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;

    function update() {
      const { scrollLeft, scrollWidth, clientWidth } = el!;
      if (scrollWidth <= clientWidth) {
        setThumb({ widthPct: 100, leftPct: 0 });
        return;
      }
      const widthPct = Math.max(15, (clientWidth / scrollWidth) * 100);
      const maxLeftPct = 100 - widthPct;
      const leftPct = (scrollLeft / (scrollWidth - clientWidth)) * maxLeftPct;
      setThumb({ widthPct, leftPct });
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isOpen]);

  return (
    <div
      className={`border rounded-2xl bg-bg-2 overflow-hidden transition-colors ${
        isOpen ? "border-blue-soft" : "border-line"
      }`}
    >
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className={`font-display text-[14.5px] font-semibold ${isOpen ? "text-white" : "text-muted"}`}>
            {label}
          </span>
          <span className={`font-mono text-[12px] ${isPositive ? "text-positive" : "text-red-400"}`}>
            {isPositive ? "+" : ""}
            {monthTotal.toFixed(2)} €
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
          <div className="px-6 pb-5 border-t border-line pt-3">
            <div className="md:hidden h-[3px] w-full bg-line rounded-full overflow-hidden mb-2.5 relative">
              <div
                className="absolute top-0 h-full bg-blue-soft rounded-full"
                style={{ width: `${thumb.widthPct}%`, left: `${thumb.leftPct}%`, transition: "left 60ms linear" }}
              />
            </div>

            <div ref={scrollRef} className="border border-line rounded-xl overflow-hidden overflow-x-auto bg-bg">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="text-muted-2 text-xs uppercase border-b border-line">
                    <th className="text-left font-normal p-3">Date</th>
                    <th className="text-left font-normal p-3">Actif</th>
                    <th className="text-left font-normal p-3">Sens</th>
                    <th className="text-left font-normal p-3">Taille</th>
                    <th className="text-left font-normal p-3">Résultat</th>
                    <th className="text-left font-normal p-3">Entrée</th>
                    <th className="text-left font-normal p-3">SL</th>
                    <th className="text-left font-normal p-3">TP</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t, i) => (
                    <tr key={i} className={`border-b border-line last:border-0 ${t.profit >= 0 ? "bg-positive/5" : "bg-red-400/5"}`}>
                      <td className="p-3 font-mono text-muted">{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                      <td className="p-3">{t.symbol}</td>
                      <td className="p-3 capitalize">{t.direction === "sell" ? "Vente" : "Achat"}</td>
                      <td className="p-3 font-mono text-muted">{t.volume}</td>
                      <td className={`p-3 font-mono ${t.profit >= 0 ? "text-positive" : "text-red-400"}`}>
                        {t.profit >= 0 ? "+" : ""}
                        {t.profit.toFixed(2)} €
                      </td>
                      <td className="p-3 font-mono text-muted-2">{t.entryPrice ?? "—"}</td>
                      <td className="p-3 font-mono text-red-400">{t.slPrice ?? "—"}</td>
                      <td className="p-3 font-mono text-positive">{t.tpPrice ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
