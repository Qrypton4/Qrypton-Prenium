"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "closed" | "form" | "submitted";

export default function PropFirmDeclarationForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("closed");
  const [propFirmSlug, setPropFirmSlug] = useState("ftmo");
  const [mt5Account, setMt5Account] = useState("");
  const [capital, setCapital] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const capitalNumber = Number(capital);
    if (!mt5Account.trim() || !Number.isFinite(capitalNumber) || capitalNumber <= 0) {
      setError("Merci de renseigner un numéro de compte et un capital valides.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/prop-firm-declaration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propFirmSlug,
          mt5Account: mt5Account.trim(),
          capital: capitalNumber,
          alreadyFunded: true,
        }),
      });

      if (res.status === 401) {
        router.push("/connexion?next=/tarifs/prop-firm");
        return;
      }

      const data = await res.json();
      if (!data.ok) {
        setError("Une erreur est survenue. Réessayez ou contactez le support.");
        return;
      }

      setStep("submitted");
      // Recharge les données serveur de la page (prix affichés) pour que le
      // supplément apparaisse immédiatement, sans que le client ait besoin
      // de recharger la page lui-même.
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez le support.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "closed") {
    return (
      <div className="text-center mb-4">
        <button
          onClick={() => setStep("form")}
          className="text-blue-soft text-[13px] font-medium hover:underline"
        >
          Vous avez déjà un compte Prop Firm Funded ? Déclarez-le ici →
        </button>
      </div>
    );
  }

  if (step === "submitted") {
    return (
      <div className="max-w-[520px] mx-auto border border-blue-soft/30 rounded-2xl bg-blue/5 p-6 text-center mb-10">
        <p className="text-[14px] font-medium mb-1.5">Compte déclaré ✓</p>
        <p className="text-muted-2 text-[12.5px] leading-relaxed">
          Votre tarif ci-dessous inclut automatiquement le Supplément Grande Allocation si
          applicable. Après vérification de votre compte, votre licence sera confirmée — vous
          serez informé par email en cas de correction.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[520px] mx-auto border border-line-strong rounded-2xl bg-bg-2 p-6 mb-10"
    >
      <p className="text-[14px] font-medium mb-1">Déclarer mon compte Prop Firm</p>
      <p className="text-muted-2 text-[12px] mb-5 leading-relaxed">
        Cette déclaration détermine votre tarif au paiement. Elle sera vérifiée après coup —
        toute inexactitude sera régularisée au prochain renouvellement, jamais rétroactivement.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[11.5px] text-muted-2 mb-1.5">Prop Firm</label>
          <select
            value={propFirmSlug}
            onChange={(e) => setPropFirmSlug(e.target.value)}
            className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-[13.5px]"
          >
            <option value="ftmo">FTMO</option>
            <option value="fundednext">FundedNext</option>
          </select>
        </div>

        <div>
          <label className="block text-[11.5px] text-muted-2 mb-1.5">Numéro de compte MT5</label>
          <input
            type="text"
            value={mt5Account}
            onChange={(e) => setMt5Account(e.target.value)}
            placeholder="Ex. 12345678"
            className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-[13.5px]"
          />
        </div>

        <div>
          <label className="block text-[11.5px] text-muted-2 mb-1.5">
            Capital Funded (€)
          </label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Ex. 100000"
            className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-[13.5px]"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-[12px] mt-3">{error}</p>}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={() => setStep("closed")}
          className="text-muted-2 text-[12.5px] hover:text-white transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-auto px-5 py-2.5 rounded-lg bg-white text-bg text-[13px] font-semibold hover:bg-blue-soft transition disabled:opacity-60"
        >
          {loading ? "Envoi..." : "Déclarer mon compte"}
        </button>
      </div>
    </form>
  );
}
