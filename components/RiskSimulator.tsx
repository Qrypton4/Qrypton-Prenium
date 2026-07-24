"use client";

import { useEffect, useRef, useState } from "react";

const RISK_PCT = 0.005;
const RR = 3;
const MIN_CAPITAL = 10000;
const MAX_CAPITAL = 500000;

function useSmoothNumber(target: number, duration = 350) {
  const [display, setDisplay] = useState(target);
  const raf = useRef<number>();
  const from = useRef(target);

  useEffect(() => {
    from.current = display;
    const start = performance.now();
    const startValue = from.current;

    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(startValue + (target - startValue) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current)cancelAnimationFrame(raf.current); }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

export default function RiskSimulator() {
  const [capital, setCapital] = useState(100000);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(capital));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commitInput() {
    const parsed = Math.round(Number(inputValue.replace(/[^\d]/g, "")));
    if (!isNaN(parsed)) {
      setCapital(Math.min(MAX_CAPITAL, Math.max(MIN_CAPITAL, parsed)));
    }
    setEditing(false);
  }

  const riskPerTrade = capital * RISK_PCT;
  const gainRR3 = riskPerTrade * RR;

  const dCapital = useSmoothNumber(capital);
  const dRisk = useSmoothNumber(riskPerTrade);
  const dGain = useSmoothNumber(gainRR3);

  const pct = ((capital - MIN_CAPITAL) / (MAX_CAPITAL - MIN_CAPITAL)) * 100;

  return (
    <div className="border border-line-strong rounded-[20px] p-7 md:p-9 bg-gradient-to-b from-blue/5 to-transparent bg-bg-2">
      <div className="text-center mb-8">
        <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-2">
          Simulateur de risque
        </span>
        <h3 className="font-display text-xl md:text-2xl font-semibold">Simulateur de risque</h3>
        <p className="text-muted text-sm mt-2 max-w-[440px] mx-auto">
          Visualisez instantanément le risque du robot selon la taille de votre compte.
        </p>
      </div>

      {/* SLIDER */}
      <div className="mb-9">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-xs text-muted uppercase tracking-wide">💰 Capital sélectionné</span>
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={commitInput}
              onKeyDown={(e) => e.key === "Enter" && commitInput()}
              className="font-mono text-2xl font-semibold tabular-nums bg-bg border border-blue-soft rounded-lg px-2 py-0.5 w-40 text-right text-white outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setInputValue(String(capital));
                setEditing(true);
              }}
              className="font-mono text-2xl font-semibold tabular-nums hover:text-blue-soft transition cursor-text border-b border-dashed border-transparent hover:border-blue-soft"
              title="Cliquer pour saisir un montant précis"
            >
              {fmt(dCapital)}
            </button>
          )}
        </div>
        <input
          type="range"
          min={MIN_CAPITAL}
          max={MAX_CAPITAL}
          step={1000}
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          className="w-full accent-blue"
          style={{
            background: `linear-gradient(to right, #3D6BFF ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-muted-2 font-mono mt-2">
          <span>10 000 €</span>
          <span>500 000 €</span>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-2 gap-4 max-w-[420px] mx-auto">
        <ResultCard icon="⚖️" label="Risque / trade" value={fmt(dRisk)} sub="0,5 % du capital" />
        <ResultCard icon="✅" label="Trade gagnant" value={`+${fmt(dGain)}`} sub="RR 3:1" positive />
      </div>

      <p className="text-[11.5px] text-muted-2 leading-relaxed mt-7 text-center max-w-[560px] mx-auto">
        Le robot applique automatiquement un risque fixe de 0,5 % du capital sur chaque position.
        Les montants affichés sont donnés à titre indicatif et s&apos;adaptent automatiquement au
        capital sélectionné.
      </p>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  sub,
  positive,
  negative,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="border border-line rounded-xl bg-bg p-5 text-center">
      <div className="text-xl mb-2">{icon}</div>
      <div
        className={`font-mono text-lg md:text-xl font-semibold tabular-nums ${
          positive ? "text-positive" : negative ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-muted uppercase tracking-wide mt-2">{label}</div>
      <div className="text-[10px] text-muted-2 mt-0.5">{sub}</div>
    </div>
  );
}
