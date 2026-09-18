"use client";

import { useState } from "react";

const CGV_TEXT =
  "J'accepte les Conditions Générales de Vente et d'Utilisation.";
const RIGHTS_WAIVER_TEXT =
  "Je demande expressément l'activation immédiate de ma licence et reconnais qu'en conséquence, conformément à la réglementation applicable, je pourrai perdre mon droit de rétractation dès l'exécution complète du service.";
const RISK_WARNING_TEXT =
  "Je reconnais avoir été informé(e) que le trading et l'utilisation d'un robot algorithmique comportent un risque de perte en capital, pouvant aller d'une perte minime jusqu'à la perte totale des fonds engagés. Je reconnais que les performances passées (backtests ou résultats réels) ne préjugent en rien des performances futures, et que Qrypton ne garantit ni ne promet aucun pourcentage de gain, aucun résultat ni aucune performance, quelle qu'elle soit. Je reconnais être seul(e) responsable de mes décisions d'utilisation et de leurs conséquences financières. OPR Edge™ est un outil logiciel et ne constitue ni un conseil en investissement ni une garantie de gain.";

export function ConsentForm({ plan }: { plan: string }) {
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [rightsWaiverAccepted, setRightsWaiverAccepted] = useState(false);
  const [riskWarningAccepted, setRiskWarningAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = cgvAccepted && rightsWaiverAccepted && riskWarningAccepted && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          cgvAccepted,
          rightsWaiverAccepted,
          riskWarningAccepted,
          cgvText: CGV_TEXT,
          rightsWaiverText: RIGHTS_WAIVER_TEXT,
          riskWarningText: RISK_WARNING_TEXT,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.message || "Une erreur est survenue, réessayez.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
        <span aria-hidden="true">⚠️</span>
        <span>
          Le trading algorithmique comporte un risque de perte en capital, pouvant aller
          jusqu'à la perte totale des fonds engagés. Les performances passées ne préjugent
          pas des performances futures. Qrypton ne garantit ni ne promet aucun pourcentage
          de gain.
        </span>
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-2 cursor-pointer">
        <input
          type="checkbox"
          checked={cgvAccepted}
          onChange={(e) => setCgvAccepted(e.target.checked)}
          className="mt-1"
        />
        <span>
          {CGV_TEXT}{" "}
          <a href="/cgu" target="_blank" className="text-blue-soft hover:underline">
            (lire les CGV/CGU)
          </a>
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-muted-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rightsWaiverAccepted}
          onChange={(e) => setRightsWaiverAccepted(e.target.checked)}
          className="mt-1"
        />
        <span>{RIGHTS_WAIVER_TEXT}</span>
      </label>

      <label className="flex items-start gap-3 text-sm text-muted-2 cursor-pointer">
        <input
          type="checkbox"
          checked={riskWarningAccepted}
          onChange={(e) => setRiskWarningAccepted(e.target.checked)}
          className="mt-1"
        />
        <span>{RISK_WARNING_TEXT}</span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-4 w-full py-3 rounded-lg bg-blue-soft text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Redirection..." : "Continuer vers le paiement"}
      </button>
    </div>
  );
}
