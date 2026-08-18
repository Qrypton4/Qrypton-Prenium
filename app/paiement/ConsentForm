"use client";

import { useState } from "react";

const CGV_TEXT =
  "J'accepte les Conditions Générales de Vente et d'Utilisation.";
const RIGHTS_WAIVER_TEXT =
  "Je demande expressément l'activation immédiate de ma licence et reconnais qu'en conséquence, conformément à la réglementation applicable, je pourrai perdre mon droit de rétractation dès l'exécution complète du service.";

export function ConsentForm({ plan }: { plan: string }) {
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [rightsWaiverAccepted, setRightsWaiverAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = cgvAccepted && rightsWaiverAccepted && !loading;

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
          cgvText: CGV_TEXT,
          rightsWaiverText: RIGHTS_WAIVER_TEXT,
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
