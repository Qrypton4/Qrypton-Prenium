"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });
    setLoading(false);
    if (error) {
      setError("Une erreur est survenue. Réessayez.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 md:px-12 py-5">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-[17px] w-fit">
          <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={28} height={28} />
          QRYPTON
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        {sent ? (
          <div className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8 text-center">
            <h1 className="font-display text-xl font-semibold mb-2">Vérifiez vos emails</h1>
            <p className="text-muted text-sm">
              Si un compte existe pour <strong className="text-white">{email}</strong>, un lien de
              réinitialisation vient d&apos;être envoyé.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8">
            <h1 className="font-display text-xl font-semibold mb-1">Mot de passe oublié</h1>
            <p className="text-muted text-sm mb-6">
              Indiquez votre email, nous vous enverrons un lien de réinitialisation.
            </p>

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-white text-sm mb-2"
            />

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full mt-4 py-3 rounded-lg bg-white text-bg font-semibold text-sm hover:bg-blue-soft transition disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>

            <p className="text-center text-xs text-muted-2 mt-5">
              <Link href="/connexion" className="text-blue-soft hover:underline">
                ← Retour à la connexion
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
