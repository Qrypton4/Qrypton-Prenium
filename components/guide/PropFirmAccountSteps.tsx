"use client";

import { useCallback, useEffect, useState } from "react";

const CTA_HREF = "/guide-demarrage";

type StepIcon = "menu" | "list" | "user" | "flag" | "shield" | "wallet" | "card" | "key";

type GuideStep = {
  title: string;
  text: string;
  note?: string;
  icon: StepIcon;
  image: { src: string; alt: string };
};

const STEPS: GuideStep[] = [
  {
    title: "Ouvrez le Guide Qrypton",
    text: "Dans votre espace Qrypton, ouvrez le menu « Guide Qrypton » puis cliquez sur « Prop Firm ».",
    icon: "menu",
    image: { src: "/assets/guide/prop-firm/00-ouvrir-guide.jpg", alt: "Menu Guide Qrypton déroulé avec le lien Prop Firm" },
  },
  {
    title: "Choisissez votre Prop Firm",
    text: "Depuis le Guide Qrypton, repérez la liste des Prop Firms compatibles MT5 (FTMO, FundedNext…) et choisissez celle qui vous convient.",
    note: "Les captures qui suivent illustrent le parcours sur FTMO, à titre d'exemple. Le déroulé est quasiment identique sur les autres Prop Firms : inscription, choix du programme, du capital, de la devise et de la plateforme MT5.",
    icon: "list",
    image: { src: "/assets/guide/prop-firm/01-choix-prop-firm.jpg", alt: "Liste des Prop Firms compatibles MT5 sur le Guide Qrypton" },
  },
  {
    title: "Créez votre compte",
    text: "Rendez-vous sur le site de la Prop Firm choisie et créez gratuitement votre compte.",
    icon: "user",
    image: { src: "/assets/guide/prop-firm/02-creation-compte.jpg", alt: "Page d'accueil / inscription de la Prop Firm" },
  },
  {
    title: "Accédez aux challenges",
    text: "Une fois connecté à votre espace, lancez un nouveau challenge et comparez les offres disponibles.",
    icon: "flag",
    image: { src: "/assets/guide/prop-firm/03-acceder-challenge.jpg", alt: "Aperçu des comptes et lancement d'un nouveau challenge" },
  },
  {
    title: "Choisissez votre programme et vérifiez les règles",
    text: "Sélectionnez le type de challenge (1-Step, 2-Step…) et affichez les objectifs et restrictions avant de continuer.",
    note: "L'« objectif de profit » (souvent 8 à 10 %) est le gain à atteindre sur le compte de démonstration pour réussir le challenge. Les « restrictions » — perte maximale totale, perte quotidienne maximale, jours de trading minimum — sont les règles à respecter en permanence. Elles varient selon le programme et la Prop Firm.",
    icon: "shield",
    image: { src: "/assets/guide/prop-firm/04-programme-regles.jpg", alt: "Choix du programme et tableau des objectifs / restrictions" },
  },
  {
    title: "Choisissez le capital, l'euro et MetaTrader 5",
    text: "Sélectionnez la taille de compte souhaitée selon votre budget.",
    note: "Réglez la devise sur euro (EUR) — pas dollar (USD) — et sélectionnez impérativement MetaTrader 5 comme plateforme : Qrypton ne fonctionne qu'avec MT5.",
    icon: "wallet",
    image: { src: "/assets/guide/prop-firm/05-capital-devise-plateforme.jpg", alt: "Sélection du capital, de la devise EUR et de la plateforme MetaTrader 5" },
  },
  {
    title: "Finalisez votre achat",
    text: "Renseignez vos informations de facturation puis validez le paiement.",
    icon: "card",
    image: { src: "/assets/guide/prop-firm/06-paiement.jpg", alt: "Formulaire de facturation et validation du paiement" },
  },
  {
    title: "Récupérez vos identifiants",
    text: "Une fois l'achat confirmé, retrouvez vos identifiants de connexion dans votre espace Prop Firm.",
    note: "Conservez précieusement ces identifiants : ils vous permettront ensuite de connecter votre compte à MT5.",
    icon: "key",
    image: { src: "/assets/guide/prop-firm/07-identifiants.jpg", alt: "Compte actif avec accès aux identifiants" },
  },
];

const TOTAL = STEPS.length + 1;

function StepGlyph({ icon }: { icon: StepIcon }) {
  const common = {
    width: 16,
    height: 16,
    stroke: "currentColor",
    strokeWidth: 1.6,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "menu":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M8 6h11M8 12h11M8 18h11" />
          <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
        </svg>
      );
    case "flag":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M6 3v18" />
          <path d="M6 4h11l-3 4 3 4H6" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3.5 19 6v6c0 4.6-3 7.6-7 8.5-4-.9-7-3.9-7-8.5V6l7-2.5Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "wallet":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3.5" y="6.5" width="17" height="12" rx="2" />
          <path d="M3.5 10.5h17" />
          <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 14.5h4" />
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="8" cy="12" r="3.6" />
          <path d="M11 12h9.5M17 12v3M20 12v3" />
        </svg>
      );
  }
}

export default function PropFirmAccountSteps() {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const isFinal = index === STEPS.length;
  const step = !isFinal ? STEPS[index] : null;

  const goTo = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(TOTAL - 1, next)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) goTo(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <div className="mt-8 pt-6 border-t border-line">
      <h2 className="font-display text-base font-semibold mb-1">
        Créer votre compte Prop Firm
      </h2>
      <p className="text-muted-2 text-[12.5px] mb-5">
        Étape par étape, jusqu&apos;à la réception de vos identifiants.
      </p>

      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-blue-soft">
          {isFinal ? "Terminé" : `${String(index + 1).padStart(2, "0")} / ${String(STEPS.length).padStart(2, "0")}`}
        </span>
        <span className="text-muted-2 text-[11px]">{isFinal ? "Compte prêt" : step?.title}</span>
      </div>
      <div className="relative h-[3px] rounded-full bg-line overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-blue rounded-full transition-all duration-300"
          style={{ width: `${((isFinal ? STEPS.length : index + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mb-6">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            onClick={() => goTo(i)}
            aria-label={`Aller à l'étape ${i + 1} : ${s.title}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= index && !isFinal
                ? "bg-blue-soft"
                : i < index || isFinal
                ? "bg-blue"
                : "bg-line-strong"
            }`}
          />
        ))}
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="border border-line rounded-2xl bg-bg-2 overflow-hidden"
      >
        {!isFinal && step && (
          <>
            <div className="relative aspect-[16/10] bg-bg">
              {!broken[step.image.src] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={step.image.src}
                  alt={step.image.alt}
                  onError={() => setBroken((b) => ({ ...b, [step.image.src]: true }))}
                  className="w-full h-full object-cover block"
                />
              ) : (
                <div className="absolute inset-2.5 flex flex-col items-center justify-center gap-2 border border-dashed border-line-strong rounded-xl">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-muted-2">
                    <rect x="3" y="4" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="9.5" r="1.5" />
                    <path d="M21 16l-5.5-5.5L3 18" />
                  </svg>
                  <span className="text-muted-2 text-[11.5px] text-center px-5">
                    Capture à ajouter — {step.image.alt}
                  </span>
                </div>
              )}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg border border-line-strong bg-bg/70 backdrop-blur flex items-center justify-center text-blue-soft">
                <StepGlyph icon={step.icon} />
              </div>
            </div>

            <div className="p-6 md:p-7">
              <h3 className="font-display text-[17px] font-semibold mb-2">{step.title}</h3>
              <p className="text-muted text-[13.5px] leading-relaxed">{step.text}</p>
              {step.note && (
                <div className="mt-3 flex gap-2 p-3 bg-blue/5 border border-line rounded-xl">
                  <span className="text-blue-soft text-xs">ⓘ</span>
                  <span className="text-muted-2 text-[11.5px] leading-relaxed">{step.note}</span>
                </div>
              )}
            </div>
          </>
        )}

        {isFinal && (
          <div className="p-8 md:p-10 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 bg-blue/10 border border-line-strong flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-positive">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Votre compte est prêt 🚀</h3>
            <p className="text-muted text-[13.5px] leading-relaxed max-w-[380px] mx-auto mb-1">
              Vous avez maintenant créé votre compte Prop Firm et récupéré vos identifiants.
            </p>
            <p className="text-muted-2 text-[12.5px] leading-relaxed max-w-[380px] mx-auto mb-6">
              La prochaine étape consiste à connecter votre compte à MT5 et à installer Qrypton — une
              vidéo tuto dédiée vous attend dans votre espace Qrypton une fois votre abonnement actif.
            </p>
            <a
              href={CTA_HREF}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue-soft transition-colors"
            >
              Accéder au guide de démarrage Qrypton
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Étape précédente"
          className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-muted disabled:opacity-30 disabled:cursor-not-allowed hover:border-line-strong transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="text-muted-2 text-[11px] font-mono">glissez ou utilisez les flèches</span>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === TOTAL - 1}
          aria-label="Étape suivante"
          className="w-10 h-10 rounded-full border border-line-strong bg-blue/10 flex items-center justify-center text-blue-soft disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue/20 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
