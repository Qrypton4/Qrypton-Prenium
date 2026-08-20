// Date d'ouverture officielle des abonnements Qrypton.
// Le "+02:00" fixe explicitement l'heure de Paris (CEST, applicable en septembre),
// donc la comparaison est correcte quel que soit le fuseau horaire du serveur.
const SALES_OPEN_AT = new Date("2026-09-22T00:00:00+02:00");

export function isSalesOpen(): boolean {
  return Date.now() >= SALES_OPEN_AT.getTime();
}

export const SALES_CLOSED_MESSAGE =
  "Les abonnements Qrypton ouvriront officiellement le 22 septembre 2026.";
