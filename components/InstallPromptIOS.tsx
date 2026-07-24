"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DISMISS_KEY = "qrypton_pwa_ios_dismissed";

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
  const isStandalone = (window.navigator as any).standalone === true;
  return isIos && isSafari && !isStandalone;
}

export default function InstallPromptIOS() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (isIosSafari()) {
      const timeout = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timeout);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-[360px] z-[90] border border-line-strong rounded-2xl bg-bg-2 p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={36} height={36} className="rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-white text-[13px] font-semibold mb-1">Installer Qrypton</div>
          <p className="text-muted-2 text-[11.5px] leading-relaxed">
            Appuyez sur <span className="text-white">Partager</span>{" "}
            <span aria-hidden>⬆️</span> puis sur{" "}
            <span className="text-white">Sur l&apos;écran d&apos;accueil</span>.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Fermer"
          className="shrink-0 text-muted hover:text-white transition text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
