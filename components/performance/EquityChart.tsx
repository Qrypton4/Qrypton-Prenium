"use client";

import { useEffect, useRef, useState } from "react";
import { EquityPoint } from "@/lib/performance";

const W = 900;
const H = 320;
const PAD = 30;

export default function EquityChart({ points }: { points: EquityPoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setDrawn(true), { threshold: 0.3 });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  if (!points || points.length === 0) {
    return (
      <div className="border border-line rounded-2xl bg-bg-2 p-16 text-center">
        <div className="text-sm font-medium mb-2">Courbe en attente des données du backtest</div>
        <p className="text-xs text-muted max-w-[380px] mx-auto leading-relaxed">
          Dès que le rapport MetaTrader 5 est fourni, la courbe de capital réelle (01/01/2023 →
          30/06/2026) se dessinera automatiquement ici.
        </p>
      </div>
    );
  }

  const values = points.map((p) => p.capital);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (W - PAD * 2) / (points.length - 1 || 1);

  const coords = points.map((p, i) => ({
    x: PAD + i * stepX,
    y: H - PAD - ((p.capital - min) / range) * (H - PAD * 2),
  }));

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaPath = `${path} L${coords[coords.length - 1].x},${H - PAD} L${coords[0].x},${H - PAD} Z`;

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let closestDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - relX);
      if (d < closestDist) {
        closestDist = d;
        closest = i;
      }
    });
    setHover({ i: closest, x: coords[closest].x, y: coords[closest].y });
  }

  const h = hover ? points[hover.i] : null;

  return (
    <div ref={wrapRef} className="border border-line rounded-2xl bg-bg-2 p-6 relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D6BFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3D6BFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={areaPath}
          fill="url(#areaFill)"
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 1s ease 1.2s" }}
        />
        <path
          d={path}
          fill="none"
          stroke="#3D6BFF"
          strokeWidth="2"
          style={{
            strokeDasharray: 2400,
            strokeDashoffset: drawn ? 0 : 2400,
            transition: "stroke-dashoffset 1.8s cubic-bezier(.2,.7,.2,1)",
          }}
        />

        {hover && (
          <>
            <line x1={hover.x} y1={PAD} x2={hover.x} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 4" />
            <circle cx={hover.x} cy={hover.y} r={4} fill="#7FA1FF" />
          </>
        )}
      </svg>

      {h && (
        <div
          className="absolute bg-bg border border-line-strong rounded-lg px-3.5 py-2.5 text-xs pointer-events-none"
          style={{ left: `${(hover!.x / W) * 100}%`, top: 12, transform: "translateX(-50%)" }}
        >
          <div className="text-muted-2 font-mono mb-1">{new Date(h.date).toLocaleDateString("fr-FR")}</div>
          <div className="font-mono">Capital : {h.capital.toLocaleString("fr-FR")} €</div>
          <div className="font-mono text-positive">
            Profit cumulé : {h.cumulativeProfit >= 0 ? "+" : ""}
            {h.cumulativeProfit.toLocaleString("fr-FR")} €
          </div>
          <div className="font-mono text-red-400">Drawdown : {h.drawdownPct.toFixed(2)} %</div>
        </div>
      )}
    </div>
  );
}
