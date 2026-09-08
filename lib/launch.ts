// Dates et message liés à l'ouverture des ventes.
// Ce fichier est importé aussi bien côté client (ex: PropFirmConfigurator)
// que côté serveur : il ne doit JAMAIS importer supabaseAdmin ni aucun
// module nécessitant des variables d'environnement serveur, sinon ça
// fait planter le site (client-side exception). La vérification Supabase
// vit dans lib/launch-server.ts, réservé au serveur.

export const PUBLIC_LAUNCH_AT = new Date("2026-09-22T00:00:00+02:00");
export const EARLY_ACCESS_AT = new Date(PUBLIC_LAUNCH_AT.getTime() - 24 * 60 * 60 * 1000);

export const SALES_CLOSED_MESSAGE =
  "Les abonnements ouvrent le 22 septembre 2026. Les personnes préinscrites peuvent s'abonner dès le 21 septembre, 24h avant tout le monde — inscrivez-vous gratuitement ci-dessous.";
