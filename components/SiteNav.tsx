"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { ProfileMenu } from "./navbar/ProfileMenu";
import type { LicenseStatus } from "@/lib/license";

const BASE_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/performance", label: "Performance du robot" },
  { href: "/guide-qrypton/prop-firm", label: "Prop Firm" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/guide-qrypton", label: "Guide Qrypton" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];
const EDGE_ZONE = 40; // px depuis le bord pour déclencher l'ouverture au swipe
const SWIPE_THRESHOLD = 60; // px minimum de déplacement horizontal pour valider le geste
const SWIPE_BACK_KEY = "qrypton_swipe_nav_pending";
const SWIPE_BACK_MAX_AGE = 15000; // ms — au-delà, le repère est ignoré (évite un "retour" surprise longtemps après)

function markSwipeNavigation() {
  try {
    sessionStorage.setItem(SWIPE_BACK_KEY, String(Date.now()));
  } catch {}
}

function consumePendingSwipeBack(): boolean {
  try {
    const raw = sessionStorage.getItem(SWIPE_BACK_KEY);
    if (!raw) return false;
    sessionStorage.removeItem(SWIPE_BACK_KEY);
    return Date.now() - Number(raw) < SWIPE_BACK_MAX_AGE;
  } catch {
    return false;
  }
}

type SiteNavProps = {
  isLoggedIn: boolean;
  firstName?: string | null;
  license?: LicenseStatus | null;
};

export default function SiteNav({ isLoggedIn, firstName, license }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const LINKS = isLoggedIn
    ? [{ href: "/mon-espace", label: "⭐ Dashboard" }, ...BASE_LINKS]
    : BASE_LINKS;

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const deltaX = t.clientX - touchStart.current.x;
      const deltaY = t.clientY - touchStart.current.y;
      const startX = touchStart.current.x;

      // Ignore les gestes principalement verticaux (scroll normal de la page)
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        touchStart.current = null;
        return;
      }

      const screenWidth = window.innerWidth;
      const isMenuGestureShape = startX < EDGE_ZONE && deltaX > SWIPE_THRESHOLD;
      const isMonEspaceGestureShape = startX > screenWidth - EDGE_ZONE && deltaX < -SWIPE_THRESHOLD;

      // Menu (bord gauche → swipe vers la droite)
      if (!open && isMenuGestureShape) {
        // Si on vient d'arriver ici via le swipe "Mon espace", ce geste en sens
        // inverse doit ramener à la page précédente — pas ouvrir le menu.
        if (consumePendingSwipeBack()) {
          router.back();
        } else {
          setOpen(true);
        }
      } else if (open && deltaX < -SWIPE_THRESHOLD) {
        setOpen(false);
      } else if (!open && isMonEspaceGestureShape) {
        // Mon espace (même système, en miroir : bord droit → swipe vers la gauche)
        markSwipeNavigation();
        router.push(isLoggedIn ? "/mon-espace" : "/connexion");
      }

      touchStart.current = null;
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, isLoggedIn, router]);

  return (
    <>
      <header className="sticky top-0 z-50 grid grid-cols-3 items-center px-6 md:px-12 py-4 bg-bg/70 backdrop-blur-md border-b border-line">
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="justify-self-start w-9 h-9 flex items-center justify-center rounded-lg border border-line-strong hover:bg-white/5 hover:border-muted transition"
        >
          <Menu className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </button>

        <Link href="/" className="justify-self-center flex items-center gap-2 font-semibold text-[15px]">
          <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={26} height={26} />
          QRYPTON
        </Link>

        {isLoggedIn && firstName ? (
          <ProfileMenu firstName={firstName} license={license ?? null} />
        ) : (
          <Link
            href="/connexion"
            aria-label="Connexion"
            className="justify-self-end w-9 h-9 flex items-center justify-center rounded-full border border-line-strong hover:border-blue-soft hover:bg-blue/10 transition"
          >
            <User className="w-4 h-4" strokeWidth={1.8} />
          </Link>
        )}
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[80vw] bg-bg-2 border-r border-line z-[70] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={22} height={22} />
            QRYPTON
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex flex-col p-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3.5 rounded-lg text-[14.5px] text-muted hover:text-white hover:bg-white/5 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
