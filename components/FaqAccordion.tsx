"use client";

import { useState, useEffect } from "react";

const FAQS = [
  { q: "Est-ce compatible avec MT5 ?", a: "Oui. OPR Edge™ fonctionne nativement en tant qu'Expert Advisor sur MetaTrader 5." },
  { q: "Est-ce compatible avec FTMO ?", a: "OPR Edge™ est utilisable dans l'environnement MetaTrader 5 de FTMO, sous réserve des règles applicables à votre compte et des conditions de FTMO. Qrypton est un éditeur de logiciel indépendant et n'est ni partenaire, ni affilié, ni sponsorisé par FTMO." },
  { q: "Compatible avec d'autres Prop Firms ?", a: "Oui, toute prop firm utilisant MetaTrader 5 est compatible." },
  { q: "Comment installer le robot ?", a: "Après l'abonnement, vous recevez un guide d'installation pas à pas ainsi que le fichier .ex5 sous licence pour MT5, directement depuis votre espace client." },
  { id: "mobile-tablette", q: "Le robot fonctionne-t-il sur mobile ou tablette ?", a: "Non. OPR Edge™ s'installe uniquement sur un PC ou un Mac, sur lequel vous installez au préalable le logiciel gratuit MetaTrader 5. Pour que le robot puisse trader chaque jour, votre ordinateur doit rester allumé, avec MetaTrader 5 ouvert, entre 15h et 18h (heure française) — la plage horaire correspondant à l'ouverture du marché américain. Si vous ne souhaitez pas garder votre ordinateur allumé, vous pouvez utiliser un VPS (un petit serveur en ligne qui reste actif 24h/24) à partir de 10€/mois, disponible directement depuis MetaTrader 5. Le robot tourne alors en continu, sans dépendre de votre propre ordinateur." },
  { q: "Quel broker utiliser ?", a: "Tout broker MT5 proposant le Nasdaq (NAS100) avec une exécution fiable et des spreads réduits convient." },
  { q: "Puis-je annuler à tout moment ?", a: "Oui, la résiliation se fait en un clic depuis votre espace client (portail Stripe), sans engagement ni frais cachés." },
  { q: "La licence peut-elle changer de compte MT5 ?", a: "Une licence est liée à un seul compte MT5. Un changement (nouveau PC, nouveau broker) se fait depuis l'espace client, avec une limite raisonnable pour éviter le partage de licence." },
  { q: "Que se passe-t-il si j'annule mon abonnement ?", a: "La licence est automatiquement désactivée et le robot cesse de trader — vos données restent accessibles pendant la durée légale de conservation." },
  { q: "Le robot fonctionne-t-il toute l'année ?", a: "Non. Il ne trade pas le week-end, puisque les marchés sont fermés." },
   { q: "Est-ce que le robot prend un trade tous les jours ?", a: "Non. Le robot ne trade que lorsque la tendance du marché et les critères techniques de la stratégie sont réunis. Certains jours, aucune configuration ne correspond aux règles de l'algorithme, et aucune position n'est ouverte. C'est un choix assumé : la qualité des opportunités passe avant la fréquence des trades." },
  { q: "Quel capital minimum faut-il pour commencer avec Qrypton ?", a: "Qrypton peut être utilisé avec un compte personnel ou un compte de prop firm. Le montant minimum dépend principalement de votre objectif et de votre gestion du risque.\n\nPour un compte personnel, nous recommandons un capital minimum de 1 000 € afin d'utiliser une gestion du risque cohérente avec la stratégie du robot.\n\nQrypton est également compatible avec les comptes de prop firm, permettant d'utiliser le robot sur des capitaux plus importants." },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const index = FAQS.findIndex((item: any) => item.id === hash);
    if (index !== -1) {
      setOpen(index);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, []);

  return (
    <div className="max-w-[760px] mx-auto border-t border-line">
      {FAQS.map((item: any, i) => (
        <div key={item.q} id={item.id} className="border-b border-line">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full bg-transparent border-none text-white text-left py-6 px-1 text-base font-medium font-display flex justify-between items-center cursor-pointer"
          >
            {item.q}
            <span className={`text-muted text-xl font-light transition-transform ${open === i ? "rotate-45 text-blue-soft" : ""}`}>+</span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? 360 : 0 }}
          >
            <p className="px-1 pb-6 text-muted text-[14.5px] leading-relaxed max-w-[640px] whitespace-pre-line">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
