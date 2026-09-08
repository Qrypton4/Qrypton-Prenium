"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_DURATION_MS = 3600;
const SKIP_FADE_MS = 280;

export default function IntroAnimation() {
  const [show, setShow] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const alreadyPlayed = document.documentElement.hasAttribute("data-skip-intro");
    if (alreadyPlayed) {
      setShow(false);
      return;
    }

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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
      className="intro-overlay"
    >
      <div className="intro-glow" />
      <div className="intro-core">
        <img
          className="mark-img"
          src="/assets/qrypton-mark-transparent.png"
          alt="Qrypton"
        />
        <div className="intro-word">QRYPTON</div>
        <div className="intro-underline" />
      </div>
    </div>
  );
}
