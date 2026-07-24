"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DISMISS_KEY = "qrypton_pwa_install_dismissed";

export default function InstallPromptAndroid() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-[360px] z-[90] border border-line-strong rounded-2xl bg-bg-2 p-4 shadow-2xl flex items-center gap-3">
      <Image src="/assets/qrypton-mark.png" alt="Qrypton" width={36} height={36} className="rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-white text-[13px] font-semibold">Installer Qrypton</div>
        <div className="text-muted-2 text-[11.5px]">Accès rapide depuis votre écran d&apos;accueil</div>
      </div>
      <button
        onClick={handleInstall}
        className="shrink-0 px-3 py-2 rounded-lg bg-white text-bg text-[12.5px] font-semibold hover:bg-blue-soft transition"
      >
        Installer
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Fermer"
        className="shrink-0 text-muted hover:text-white transition text-lg leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}
