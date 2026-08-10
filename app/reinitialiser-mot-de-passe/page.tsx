"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

type Status = "checking" | "ready" | "invalid";

export default function ReinitialiserMotDePasse() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setStatus("ready");
      }
    });

    async function init() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDescription = url.searchParams.get("error_description");

      if (errorDescription) {
        if (!cancelled) {
          setStatus("invalid");
          setError(errorDescription);
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setStatus("invalid");
          setError(error.message);
          return;
        }
        setStatus("ready");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setStatus("ready");
      } else {
        setTimeout(async () => {
          if (cancelled) return;
          const { data: retry } = await supabase.auth.getSession();
          if (cancelled) return;
          setStatus(retry.session ? "ready" : "invalid");
        }, 1500);
      }
    }

    init();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/connexion"), 2000);
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
        {done ? (
          <div className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8 text-center">
            <h1 className="font-display text-xl font-semibold mb-2">Mot de passe mis à jour</h1>
            <p className="text-muted text-sm">Redirection vers la connexion...</p>
          </div>
        ) : status === "checking" ? (
          <div className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8 text-center">
            <p className="text-muted text-sm">Vérification du lien...</p>
          </div>
        ) : status === "invalid" ? (
          <div className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8 text-center">
            <h1 className="font-display text-xl font-semibold mb-2">Lien invalide ou expiré</h1>
            <p className="text-muted text-sm mb-2">
              Ce lien de réinitialisation n&apos;est plus valable. Cela arrive s&apos;il a déjà été
              utilisé, s&apos;il date de plus d&apos;une heure, ou s&apos;il a été ouvert dans un
              autre navigateur que celui où la demande a été faite.
            </p>
            {error && <p className="text-muted-2 text-[11px] mb-5">({error})</p>}
            <Link
              href="/mot-de-passe-oublie"
              className="inline-block px-5 py-2.5 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8">
            <h1 className="font-display text-xl font-semibold mb-1">Nouveau mot de passe</h1>
            <p className="text-muted text-sm mb-6">Choisissez un nouveau mot de passe.</p>

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Mot de passe</label>
            <div className="mb-4">
              <PasswordInput required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Confirmer le mot de passe</label>
            <div className="mb-2">
              <PasswordInput required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full mt-4 py-3 rounded-lg bg-white text-bg font-semibold text-sm hover:bg-blue-soft transition disabled:opacity-60"
            >
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
