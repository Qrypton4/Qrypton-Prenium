"use client";

import { useState } from "react";

export default function PreinscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "already" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/preinscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }
      setStatus(data.alreadyRegistered ? "already" : "done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" || status === "already") {
    return (
      <div className="max-w-[480px] mx-auto text-center rounded-2xl border border-blue-soft/30 bg-bg-2 px-6 py-5">
        <p className="text-sm text-white/90">
          {status === "done"
            ? "C'est fait — vous recevrez un accès anticipé 24h avant l'ouverture publique."
            : "Cette adresse est déjà préinscrite. Vous êtes prêt·e pour l'accès anticipé."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[480px] mx-auto flex flex-col sm:flex-row gap-3 rounded-2xl border border-blue-soft/30 bg-bg-2 px-5 py-5"
    >
      <input
        type="email"
        required
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent border border-line rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-2 outline-none focus:border-blue-soft"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-soft transition disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Me préinscrire"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2 sm:mt-0">Une erreur est survenue, réessayez.</p>
      )}
    </form>
  );
}
