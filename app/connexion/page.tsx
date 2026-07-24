"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

export default function Connexion() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(params.get("next") || "/mon-espace");
    router.refresh();
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${params.get("next") || "/mon-espace"}` },
    });
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
        <form onSubmit={handleSubmit} className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8">
          <h1 className="font-display text-xl font-semibold mb-1">Connexion</h1>
          <p className="text-muted text-sm mb-6">Accédez à votre espace Qrypton.</p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-line-strong text-sm font-medium hover:bg-white/5 transition mb-5 disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirection..." : "Continuer avec Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-muted-2">ou</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <label className="text-xs text-muted uppercase tracking-wide block mb-2">Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-white text-sm mb-4"
          />

          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted uppercase tracking-wide">Mot de passe</label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-blue-soft hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="mb-2">
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full mt-4 py-3 rounded-lg bg-white text-bg font-semibold text-sm hover:bg-blue-soft transition disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-xs text-muted-2 mt-5">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-blue-soft hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 40.6 16.3 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C41.7 35.9 45 30.4 45 24c0-1.4-.1-2.5-.4-3.5z" />
    </svg>
  );
}

