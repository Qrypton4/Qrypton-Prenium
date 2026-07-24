"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

function InscriptionForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/mon-espace";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!accepted) {
      setError("Merci d'accepter les Conditions Générales et la Politique de confidentialité.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/connexion?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user) {
      // Envoi de l'email de bienvenue — best-effort, ne bloque jamais l'inscription
      fetch("/api/emails/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, email, firstName }),
      }).catch(() => {});
    }
    setDone(true);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
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
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        {done ? (
          <div className="w-full max-w-[380px] border border-line-strong rounded-2xl bg-bg-2 p-8 text-center">
  <h1 className="font-display text-xl font-semibold mb-2">Vérifiez vos emails</h1>
  <p className="text-muted text-sm mb-5">
    Un lien de confirmation vient d&apos;être envoyé à{" "}
    <strong className="text-white">{email}</strong>. Cliquez dessus pour activer votre
    compte.
  </p>
  <p className="text-muted text-xs mb-5">
    Si vous ouvrez le lien sur un autre appareil, revenez ici et connectez-vous
    ci-dessous une fois votre compte confirmé.
  </p>
  <Link
    href="/connexion"
    className="inline-block w-full py-3 rounded-lg bg-white text-bg font-semibold text-sm hover:bg-blue-soft transition"
  >
    Se connecter
  </Link>
</div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-[400px] border border-line-strong rounded-2xl bg-bg-2 p-8">
            <h1 className="font-display text-xl font-semibold mb-1">Créer un compte</h1>
            <p className="text-muted text-sm mb-6">Accès à OPR Edge™ après souscription.</p>

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

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Prénom</label>
                <input
                  type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Nom</label>
                <input
                  type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-white text-sm"
                />
              </div>
            </div>

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-line-strong rounded-lg px-3 py-2.5 text-white text-sm mb-4"
            />

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Mot de passe</label>
            <div className="mb-4">
              <PasswordInput required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Confirmer le mot de passe</label>
            <div className="mb-4">
              <PasswordInput required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>

            <label className="flex items-start gap-2.5 mb-2 cursor-pointer">
              <input
                type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 accent-blue"
              />
              <span className="text-xs text-muted leading-relaxed">
                J&apos;accepte les{" "}
                <Link href="/cgu" className="text-blue-soft hover:underline">Conditions Générales</Link>{" "}
                et la{" "}
                <Link href="/confidentialite" className="text-blue-soft hover:underline">Politique de confidentialité</Link>.
              </span>
            </label>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full mt-4 py-3 rounded-lg bg-white text-bg font-semibold text-sm hover:bg-blue-soft transition disabled:opacity-60"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>

            <p className="text-center text-xs text-muted-2 mt-5">
              Déjà client ?{" "}
              <Link href="/connexion" className="text-blue-soft hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
export default function InscriptionPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <InscriptionForm />
    </Suspense>
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
