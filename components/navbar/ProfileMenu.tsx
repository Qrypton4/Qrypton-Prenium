"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { LicenseStatus } from "@/lib/license";
import {User} from "lucide-react";

type ProfileMenuProps = {
  firstName: string;
  license: LicenseStatus | null;
};

export function ProfileMenu({ firstName, license }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const active = license?.active ?? false;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const expiresLabel = license?.expiresAt
    ? new Date(license.expiresAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <div className="relative justify-self-end" ref={menuRef}>
      <button
  onClick={() => setOpen((v) => !v)}
  aria-label="Mon compte"
  className="relative w-9 h-9 flex items-center justify-center rounded-full border border-line-strong hover:border-blue-soft hover:bg-blue/10 transition"
>
  <User className="w-4 h-4" strokeWidth={1.8} />
  <span
    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg ${
      active ? "bg-emerald-400" : "bg-amber-400"
    }`}
  />
</button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-bg-2 shadow-xl shadow-black/40 z-[80]">
          <div className="border-b border-line p-4">
            <p className="text-sm font-medium text-white/90">{firstName}</p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                active ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-amber-400"}`} />
              {active ? "Licence active" : "Licence inactive"}
            </span>

            {active && (
              <div className="mt-3 space-y-1 text-xs text-white/50">
                <p>Robot : {license?.robotName}</p>
                {expiresLabel && <p>Expire le {expiresLabel}</p>}
              </div>
            )}
          </div>

          <nav className="p-1.5 text-sm">
            <Link
              href="/mon-espace"
              className="block rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/[0.06]"
              onClick={() => setOpen(false)}
            >
              Mon profil
            </Link>
            <Link
              href="/mon-espace"
              className="block rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/[0.06]"
              onClick={() => setOpen(false)}
            >
              Paramètres
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full rounded-lg px-3 py-2 text-left text-red-400 transition hover:bg-red-500/10"
            >
              Déconnexion
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
