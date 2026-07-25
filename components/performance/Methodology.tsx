export default function Methodology({
  broker,
  symbol,
  timeframe,
}: {
  broker?: string;
  symbol?: string;
  timeframe?: string;
}) {
  const points = [
    `Backtest réalisé sur MetaTrader 5${broker ? ` (${broker})` : ""}.`,
    "Modélisation Every Tick, basée sur les ticks réels.",
    "Capital initial de 100 000 €.",
    "Risque fixe de 0,5 % par position.",
    "Une seule position ouverte par jour.",
    "Robot entièrement automatique — aucune intervention manuelle.",
    ...(symbol ? [`Instrument : ${symbol}${timeframe ? ` — unité de temps ${timeframe}` : ""}.`] : []),
  ];
  return (
    <div className="border border-line rounded-2xl bg-bg-2 p-8">
      <h3 className="font-display text-base font-semibold mb-5">Méthodologie</h3>
      <ul className="flex flex-col gap-3 mb-6">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
            <span className="text-blue-soft mt-0.5">—</span>
            {p}
          </li>
        ))}
      </ul>
      
    </div>
  );
}
