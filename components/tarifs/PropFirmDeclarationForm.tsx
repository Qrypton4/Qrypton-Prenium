"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "closed" | "form" | "submitted";

export default function PropFirmDeclarationForm({
  redirectPath = "/tarifs/prop-firm",
  startOpen = false,
  onDone,
}: {
  redirectPath?: string;
  startOpen?: boolean;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(startOpen ? "form" : "closed");
  const propFirmSlug = "ftmo";
  const [mt5Account, setMt5Account] = useState("");
  const [capital, setCapital] = useState("");
  const CAPITAL_OPTIONS = [10000, 20000, 40000];
  const [alreadyFunded, setAlreadyFunded] = useState(true);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [certified, setCertified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const capitalNumber = Number(capital);
    if (!mt5Account.trim() || !Number.isFinite(capitalNumber) || capitalNumber <= 0) {
      setError("Merci de renseigner un numéro de compte et de choisir un capital.");
      return;
    }
    if (!proofFile) {
      setError("Merci d'ajouter une capture d'écran de votre compte.");
      return;
    }
    if (!certified) {
      setError("Merci de cocher la certification avant de continuer.");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("propFirmSlug", propFirmSlug);
      body.append("mt5Account", mt5Account.trim());
      body.append("capital", String(capitalNumber));
      body.append("alreadyFunded", String(alreadyFunded));
      body.append("certified", String(certified));
      body.append("proof", proofFile);

      const res = await fetch("/api/prop-firm-declaration", { method: "POST", body });

      if (res.status === 401) {
        router.push(`/connexion?next=${redirectPath}`);
        return;
      }

      const data = await res.json();
      if (!data.ok) {
        if (data.message === "allocation_exceeded") {
          setError(
            `Capacité insuffisante : il ne reste que ${Number(data.available).toLocaleString("fr-FR")}€ disponibles pour cette Prop Firm.`
          );
        } else if (data.message === "duplicate_account") {
          setError("Ce compte a déjà été déclaré.");
        } else {
          setError("Une erreur est survenue. Réessayez ou contactez le support.");
        }
        return;
      }

      setStep("submitted");
      router.refresh();
      onDone?.();
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez le support.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "closed") {
    return (
      <button
        onClick={() => setStep("form")}
        className="block w-full max-w-[520px] mx-auto mb-10 text-left border border-blue-soft/30 rounded-2xl bg-blue/5 hover:bg-blue/10 hover:border-blue-soft/50 transition p-5"
      >
        <p className="text-white text-[14px] font-semibold mb-1">
          Vous avez déjà un compte Prop Firm ?
        </p>
        <p className="text-muted-2 text-[12.5px] leading-relaxed">
          Déclarez-le avant l&apos;achat (challenge ou Funded) — votre tarif ci-dessous sera
          ajusté automatiquement si nécessaire.
        </p>
        <span className="inline-block mt-3 text-blue-soft text-[12.5px] font-medium">
          Déclarer mon compte →
        </span>
      </button>
    );
  }

  if (step === "submitted") {
    return (
      <div className="max-w-[520px] mx-auto border border-blue-soft/30 rounded-2xl bg-blue/5 p-6 text-center mb-10">
        <p className="text-[14px] font-medium mb-1.5">Compte déclaré ✓</p>
        <p className="text-muted-2 text-[12.5px] leading-relaxed">
          {alreadyFunded
            ? "Votre tarif ci-dessous inclut automatiquement le Supplément Grande Allocation si applicable. Après vérification de votre compte, votre licence sera confirmée — vous serez informé par email en cas de correction."
            : "Votre compte en challenge est enregistré. Dès qu'il passera en Funded, revenez dans votre espace pour le déclarer comme tel."}
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
          <label className="block text-[11.5px] text-muted-2 mb-1.5">Statut du compte</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAlreadyFunded(false)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-[12.5px] font-medium border transition ${
                !alreadyFunded ? "border-blue-soft bg-blue/10 text-white" : "border-line-strong text-muted-2 hover:text-white"
              }`}
            >
              En challenge
            </button>
            <button
              type="button"
              onClick={() => setAlreadyFunded(true)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-[12.5px] font-medium border transition ${
                alreadyFunded ? "border-blue-soft bg-blue/10 text-white" : "border-line-strong text-muted-2 hover:text-white"
              }`}
            >
              Déjà Funded
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] text-muted-2 mb-1.5">Prop Firm</label>
          <div className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-[13.5px] text-muted-2">
            FTMO
          </div>
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
            {alreadyFunded ? "Capital Funded" : "Capital de départ du challenge"}
          </label>
          <div className="flex gap-2">
            {CAPITAL_OPTIONS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setCapital(String(amount))}
                className={`flex-1 rounded-lg px-3 py-2.5 text-[12.5px] font-medium border transition ${
                  capital === String(amount)
                    ? "border-blue-soft bg-blue/10 text-white"
                    : "border-line-strong text-muted-2 hover:text-white"
                }`}
              >
                {amount.toLocaleString("fr-FR")} €
              </button>
            ))}
          </div>
        </div>

        <div className="border border-line-strong rounded-lg p-4 bg-bg">
          <label className="block text-[12.5px] font-medium text-white mb-2">
            Capture d&apos;écran de votre compte
          </label>
          <p className="text-muted-2 text-[11.5px] leading-relaxed mb-3">
            Une capture montrant à la fois : <strong className="text-white">le numéro de votre
            compte</strong>, <strong className="text-white">le solde actuel</strong>, et{" "}
            <strong className="text-white">le nom de votre Prop Firm</strong>. Ça peut être votre
            espace client chez votre Prop Firm, ou directement l&apos;écran de MetaTrader.
          </p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            className="w-full text-[12.5px] text-muted-2 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-soft/20 file:text-blue-soft file:text-[12px] file:font-medium"
          />
          <p className="text-muted-2 text-[10.5px] mt-3">
            🔒 Confidentiel — vu uniquement par l&apos;équipe Qrypton pour vérifier votre compte.
          </p>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            className="mt-1"
          />
          <span className="text-[12px] text-muted-2 leading-relaxed">
            Je certifie que ce compte Prop Firm m&apos;appartient et que les informations
            renseignées sont exactes.
          </span>
        </label>
      </div>

      {error && <p className="text-red-400 text-[12px] mt-3">{error}</p>}

      <div className="flex gap-3 mt-5">
        {!startOpen && (
          <button
            type="button"
            onClick={() => setStep("closed")}
            className="text-muted-2 text-[12.5px] hover:text-white transition"
          >
            Annuler
          </button>
        )}
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
