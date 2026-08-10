"use client";

import { usePWAInstall } from "./PWAInstallContext";

export default function PWAInstallSettingsCard() {
  const { canInstall, isIOS, isStandalone, promptInstall } = usePWAInstall();

  if (isStandalone) {
    return (
      <p className="text-muted text-sm">
        ✅ L&apos;application est déjà installée sur cet appareil.
      </p>
    );
  }

  if (isIOS) {
    return (
      <p className="text-muted-2 text-[13px] leading-relaxed">
        Appuyez sur <span className="text-white">Partager</span> <span aria-hidden>⬆️</span> puis
        sur <span className="text-white">Sur l&apos;écran d&apos;accueil</span>.
      </p>
    );
  }

  if (canInstall) {
    return (
      <button
        onClick={promptInstall}
        className="px-4 py-2 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition"
      >
        Installer l&apos;application
      </button>
    );
  }

  return (
    <p className="text-muted-2 text-[13px] leading-relaxed">
      Ouvrez le menu <span className="text-white">⋮</span> de votre navigateur (en haut à
      droite), puis appuyez sur{" "}
      <span className="text-white">Installer l&apos;application</span> ou{" "}
      <span className="text-white">Ajouter à l&apos;écran d&apos;accueil</span>.
    </p>
  );
}
