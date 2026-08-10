"use client";

import { useState } from "react";
import {
  Download, PlugZap, Split, Building2, Wallet, SlidersHorizontal,
  CheckCircle2, HelpCircle, Check, ShieldAlert, Gauge,
} from "lucide-react";

const STEPS = [
  { icon: Download, title: "Installer MetaTrader 5" },
  { icon: PlugZap, title: "Installer Qrypton sur MT5" },
  { icon: Split, title: "Choisir son mode d'utilisation" },
  { icon: SlidersHorizontal, title: "Configuration du robot" },
  { icon: CheckCircle2, title: "Vérification" },
  { icon: HelpCircle, title: "Questions fréquentes" },
];

export default function GuideClient() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"propfirm" | "personnel">("propfirm");

  return (
    <div className="max-w-[820px] mx-auto">
      {/* PROGRESS BAR */}
      <div className="flex items-center mb-12">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setStep(i)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition ${
                i === step
                  ? "bg-blue border-blue text-white"
                  : i < step
                  ? "bg-positive/15 border-positive text-positive"
                  : "border-line-strong text-muted-2"
              }`}
            >
              {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" strokeWidth={1.8} />}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${i < step ? "bg-positive/40" : "bg-line"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-2">
        <span className="font-mono text-xs text-blue-soft uppercase tracking-widest">
          Étape {step + 1} / {STEPS.length}
        </span>
      </div>
      <h2 className="font-display text-2xl font-semibold text-center mb-10">{STEPS[step].title}</h2>

      {/* STEP CONTENT */}
      <div className="border border-line rounded-2xl bg-bg-2 p-8 md:p-10 min-h-[280px]">
        {step === 0 && (
          <StepBody>
            <P>MetaTrader 5 (MT5) est le logiciel gratuit qui exécute les trades sur votre compte.
            C&apos;est la seule chose à installer avant de commencer.</P>
            <Ol items={[
              "Téléchargez MetaTrader 5 depuis le site officiel de votre broker ou de MetaQuotes.",
              "Installez-le comme n'importe quel logiciel (suivant, suivant, terminer).",
              "Ouvrez MT5 et connectez-vous avec les identifiants de votre compte (login, mot de passe, serveur) — vous les recevez par email à l'ouverture du compte.",
            ]} />
          </StepBody>
        )}

        {step === 1 && (
          <StepBody>
            <P>Qrypton est un « Expert Advisor » (EA) — un petit fichier qui vient s&apos;ajouter à
            MT5 pour automatiser les trades.</P>
            <Ol items={[
              "Téléchargez le fichier OPR Edge™ (.ex5) depuis votre espace client, section « Robot ».",
              "Dans MT5 : Fichier → Ouvrir le dossier des données → copiez le fichier dans MQL5/Experts.",
              "Redémarrez MT5, ou clic droit sur « Expert Advisors » dans le navigateur → Actualiser.",
              "Dans MT5 : Outils → Options → Expert Advisors → cochez « Autoriser WebRequest pour les URL listées » et ajoutez https://qryptonedge.com",
              "Glissez OPR Edge™ sur le graphique NAS100 / US100.cash.",
            ]} />
          </StepBody>
        )}

        {step === 2 && (
          <StepBody>
            <P>Vous êtes libre d&apos;utiliser Qrypton avec une Prop Firm <strong className="text-white">ou</strong> avec
            votre propre compte de trading — selon ce qui vous convient le mieux. Choisissez votre
            parcours :</P>
            <div className="flex gap-3 mb-6 mt-5">
              <ModeButton active={mode === "propfirm"} onClick={() => setMode("propfirm")} icon={Building2} label="Prop Firm" />
              <ModeButton active={mode === "personnel"} onClick={() => setMode("personnel")} icon={Wallet} label="Compte personnel" />
            </div>

            {mode === "propfirm" ? (
              <div className="flex flex-col gap-4">
                <MiniCard title="Qu'est-ce qu'une Prop Firm ?">
                  Une société qui vous prête un capital de trading (ex. 80 000 €) après réussite
                  d&apos;un test appelé « challenge ». Vous tradez son argent et gardez une part des
                  gains, sans risquer le vôtre.
                </MiniCard>
                <MiniCard title="Utiliser Qrypton avec une Prop Firm">
                  Installez OPR Edge™ normalement sur le compte MT5 fourni par la Prop Firm — le
                  fonctionnement est identique à un compte classique.
                </MiniCard>
                <MiniCard title="Précautions" icon={ShieldAlert}>
                  Vérifiez les règles de drawdown maximal autorisées par votre Prop Firm avant de
                  démarrer, et assurez-vous que le trading algorithmique est autorisé (c&apos;est le
                  cas chez la grande majorité des Prop Firms).
                </MiniCard>
                <MiniCard title="Paramètres recommandés" icon={Gauge}>
                  Gardez le risque par défaut à 0,5 % — c&apos;est le réglage validé par le backtest
                  et compatible avec la plupart des limites de drawdown des challenges.
                </MiniCard>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <MiniCard title="Utiliser Qrypton avec son propre capital">
                  Installez OPR Edge™ sur votre compte MT5 personnel, chez le broker de votre choix
                  proposant le Nasdaq (NAS100 / US100.cash).
                </MiniCard>
                <MiniCard title="Paramètres conseillés" icon={Gauge}>
                  Le réglage par défaut (0,5 % de risque) convient à la majorité des profils. Vous
                  pouvez l&apos;ajuster, mais nous recommandons de ne jamais dépasser 1 % par trade.
                </MiniCard>
                <MiniCard title="Bonnes pratiques" icon={ShieldAlert}>
                  Ne modifiez pas les paramètres à chaud pendant qu&apos;une position est ouverte, et
                  laissez le robot tourner en continu (VPS recommandé) pour ne rater aucune clôture.
                </MiniCard>
              </div>
            )}
          </StepBody>
        )}

        {step === 3 && (
          <StepBody>
            <P>Une fois OPR Edge™ sur le graphique, une fenêtre de paramètres s&apos;ouvre.</P>
            <Ol items={[
              "Collez votre clé de licence (disponible dans votre espace client) dans le champ « LicenseKey ».",
              "Laissez le risque par défaut à 0,5 %, sauf si vous savez précisément ce que vous faites.",
              "Cochez « Autoriser le trading algorithmique » en haut de MT5 (bouton à activer une seule fois).",
              "Cliquez sur OK — le robot est actif dès l'apparition d'un smiley 🙂 en haut à droite du graphique.",
            ]} />
          </StepBody>
        )}

        {step === 4 && (
          <StepBody>
            <P>Quelques vérifications simples pour confirmer que tout fonctionne :</P>
            <Ol items={[
              "L'onglet « Journal » de MT5 ne doit afficher aucune erreur rouge après l'installation.",
              "Un smiley 🙂 (pas triste ☹️) doit apparaître en haut à droite du graphique.",
              "Connectez-vous à votre espace client Qrypton : la licence doit apparaître comme « active ».",
              "Le robot ne prendra position qu'à l'ouverture du marché — pas d'inquiétude si rien ne se passe immédiatement.",
            ]} />
          </StepBody>
        )}

        {step === 5 && (
          <StepBody>
            <div className="flex flex-col gap-4">
              <MiniCard title="Le robot n'ouvre aucun trade">
                C'est normal en dehors de l'horaire d'ouverture du marché ciblé, ou si les
                conditions d'entrée ne sont pas réunies ce jour-là.
              </MiniCard>
              <MiniCard title="Un smiley triste ☹️ apparaît">
                Cela signifie que le trading algorithmique n'est pas autorisé — vérifiez le bouton
                en haut de MT5 et les options de l'EA (onglet Options → Expert Advisors).
              </MiniCard>
              <MiniCard title="Le smiley disparaît juste après l'installation">
                C'est le signe que l'URL https://qryptonedge.com n'est pas autorisée. Allez dans
                MT5 : Outils → Options → Expert Advisors → cochez « Autoriser WebRequest pour les
                URL listées » et ajoutez https://qryptonedge.com, puis réattachez le robot.
              </MiniCard>
              <MiniCard title="Ma licence n'active pas mon compte">
                Vérifiez que la clé collée est exacte, et que votre abonnement est bien actif dans
                votre espace client.
              </MiniCard>
              <MiniCard title="Besoin d'aide ?">
                Contactez le support depuis votre espace client — nous répondons rapidement.
              </MiniCard>
            </div>
          </StepBody>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-lg text-sm border border-line-strong disabled:opacity-30 hover:bg-white/5 transition"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="px-5 py-2.5 rounded-lg text-sm bg-white text-bg font-semibold disabled:opacity-30 hover:bg-blue-soft transition"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

function StepBody({ children }: { children: React.ReactNode }) {
  return <div className="text-[14.5px] text-muted leading-relaxed">{children}</div>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}
function Ol({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-blue/10 text-blue-soft text-xs font-semibold flex items-center justify-center shrink-0 font-mono">
            {i + 1}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}
function MiniCard({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) {
  return (
    <div className="border border-line rounded-xl bg-bg p-5">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-blue-soft" strokeWidth={1.8} />}
        <div className="text-white font-medium text-sm">{title}</div>
      </div>
      <p className="text-[13.5px] text-muted leading-relaxed">{children}</p>
    </div>
  );
}
function ModeButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition ${
        active ? "bg-blue/10 border-blue text-white" : "border-line-strong text-muted hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.8} />
      {label}
    </button>
  );
}
