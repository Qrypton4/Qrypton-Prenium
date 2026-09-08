"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "qrypton_intro_played";
const TOTAL_DURATION_MS = 4000; // durée totale de l'animation (incl. fondu de sortie)
const SKIP_FADE_MS = 280; // durée du fondu si l'utilisateur clique pour passer

export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage indisponible (navigation privée stricte, etc.) : on rejoue à chaque fois
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (alreadyPlayed) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    setReduced(!!prefersReducedMotion);
    setShow(true);

    const duration = prefersReducedMotion ? 500 : TOTAL_DURATION_MS;
    removeTimer.current = setTimeout(() => setShow(false), duration);

    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, []);

  if (!show) return null;

  const handleSkip = () => {
    if (removeTimer.current) clearTimeout(removeTimer.current);
    const el = overlayRef.current;
    if (el) {
      el.style.transition = `opacity ${SKIP_FADE_MS}ms ease`;
      el.style.opacity = "0";
    }
    setTimeout(() => setShow(false), SKIP_FADE_MS);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleSkip}
      role="presentation"
      aria-hidden="true"
      className={`intro-overlay ${reduced ? "intro-reduced" : ""}`}
    >
      <div className="intro-glow" />
      <div className="intro-sweep" />
      <div className="intro-core">
        <svg className="intro-mark" viewBox="0 0 200 200">
          <circle className="intro-ring" cx="100" cy="100" r="54" transform="rotate(-58 100 100)" />
          <circle className="intro-pulse-ring" cx="100" cy="100" r="54" />
          <path className="intro-tail" d="M 128 128 L 158 160" />
          <rect className="intro-candle intro-c1" x="76" y="112" width="9" height="20" rx="1.5" />
          <rect className="intro-candle intro-c2" x="90" y="98" width="9" height="34" rx="1.5" />
          <rect className="intro-candle intro-c3" x="104" y="82" width="9" height="50" rx="1.5" />
          <rect className="intro-candle intro-c4" x="118" y="64" width="9" height="68" rx="1.5" />
        </svg>
        <div className="intro-word">QRYPTON</div>
        <div className="intro-underline" />
      </div>
    </div>
  );
}
