# Qrypton — Projet Next.js

Ce projet regroupe le site vitrine et le début de la plateforme SaaS (dashboard, espace client, API de licence, webhooks Stripe).

## Structure

```
app/
├─ page.tsx                        → page d'accueil
├─ connexion/, inscription/         → authentification réelle (Supabase Auth)
├─ mon-espace/page.tsx              → dashboard + licence + abonnement + factures, en un seul espace
├─ tarifs/page.tsx                  → page Tarifs dédiée
├─ faq/page.tsx                     → page FAQ dédiée
├─ performance/page.tsx             → page Performance backtest premium (courbe, stats, tableau mensuel)
├─ challenge-prop-firm/page.tsx      → challenge Prop Firm en cours (data/challenge.json, MAJ manuelle)
├─ gestion-du-risque/page.tsx       → simulateur de risque
├─ api/checkout/route.ts            → crée une session Stripe Checkout (connexion requise)
├─ api/stripe/portal/route.ts       → portail Stripe (gestion/résiliation en 1 clic)
├─ api/v1/license/verify/route.ts   → API appelée par le robot MT5
├─ api/v1/trades/report/route.ts    → API appelée par le robot MT5 à chaque trade fermé (mode auto futur)
├─ api/v1/account/heartbeat/route.ts→ API balance/équité temps réel (mode auto futur)
├─ api/v1/challenge/prop-firm/route.ts → agrégation Supabase pour le mode auto futur (non utilisée tant que le JSON manuel suffit)
└─ api/webhooks/stripe/route.ts     → synchronisation abonnement Stripe ↔ licence

middleware.ts                       → protège /mon-espace (redirige vers /connexion)
database/schema.sql                 → schéma PostgreSQL (Supabase), profils liés à auth.users
mt5/OPR_LicenseCheck.mqh            → à inclure dans OPR_Edge.mq5 (vérification licence)
mt5/OPR_LiveReport.mqh              → à inclure dans OPR_Edge.mq5 (report des trades réels, mode auto futur)
mt5/OPR_Heartbeat.mqh               → équité temps réel toutes les X min (mode auto futur)
lib/supabase.ts                     → client admin (clé service_role, serveur uniquement)
lib/supabase-server.ts              → client Supabase pour Server Components (lit la session)
lib/supabase-browser.ts             → client Supabase pour les formulaires de connexion/inscription
lib/challenge.ts                    → loader typé pour data/challenge.json
data/challenge.json                 → données réelles du challenge Prop Firm, mises à jour à la main
```

## Authentification (réelle, pas une maquette)

- Inscription / connexion par email + mot de passe via **Supabase Auth**.
- `middleware.ts` protège `/mon-espace` : sans session valide, redirection automatique vers
  `/connexion`.
- À l'inscription, un trigger SQL (`on_auth_user_created` dans `schema.sql`) crée automatiquement
  une ligne dans `profiles`, liée à l'utilisateur Supabase Auth.
- **Aucune donnée fictive** : `/mon-espace` affiche un état vide explicite tant que
  l'abonnement/les trades ne sont pas encore synchronisés — jamais de faux chiffres.
- **Mot de passe oublié** : `/mot-de-passe-oublie` puis `/reinitialiser-mot-de-passe`, via
  `supabase.auth.resetPasswordForEmail` — fonctionne dès que Supabase est configuré, aucune
  action manuelle supplémentaire nécessaire.
- **Connexion Google** — nécessite une configuration en dehors du code, que je ne peux pas faire à
  ta place :
  1. Créer des identifiants OAuth sur [Google Cloud Console](https://console.cloud.google.com)
     (type "Application Web"), avec comme URI de redirection autorisée :
     `https://<ton-projet>.supabase.co/auth/v1/callback`.
  2. Dans Supabase → Authentication → Providers → Google : activer, coller le Client ID et le
     Client Secret obtenus à l'étape précédente.
  3. Rien d'autre à faire côté code — le bouton "Continuer avec Google" sur `/connexion` et
     `/inscription` fonctionnera dès que ces deux étapes sont faites.
- **Confirmation d'email à l'inscription** : Supabase envoie automatiquement un email de
  confirmation si l'option "Confirm email" est activée dans Authentication → Settings (activée par
  défaut sur un nouveau projet). Tant que l'email n'est pas confirmé, l'utilisateur ne peut pas se
  connecter.
- **CGU / Politique de confidentialité** — `/cgu` et `/confidentialite` sont des pages de
  **structure uniquement**, clairement marquées comme telles. Le texte légal réel doit être rédigé
  ou validé par un professionnel du droit avant mise en ligne.

## Guide de démarrage — `/guide-demarrage`

Accessible uniquement connecté (protégé par le même middleware que `/mon-espace`), lié depuis
l'en-tête de Mon Espace. 6 étapes avec une barre de progression cliquable :

1. Installer MetaTrader 5
2. Installer Qrypton sur MT5
3. Choisir son mode d'utilisation — **deux parcours au choix** (Prop Firm / compte personnel),
   sélectionnables par un toggle, sans obliger l'un ou l'autre
4. Configuration du robot
5. Vérification
6. FAQ / résolution de problèmes

Tout le contenu est dans `components/guide/GuideClient.tsx` — pour ajouter une illustration ou une
capture d'écran réelle à une étape, il suffit de l'insérer dans le bloc `<StepBody>` correspondant.

## Résultats réels — supprimé

La page `/performance-live` (résultats d'un compte de démo officiel générique) a été retirée à la
demande : le seul suivi de résultats réels du site est désormais `/challenge-prop-firm`. Les
routes API `trades/report` et `live_trades` restent utilisées par le Challenge (voir plus bas).


## Section Performance (backtest) — `data/performance.json`

Source unique de vérité pour `/performance` (courbe de capital, cartes de stats, tableau mensuel).

- `summary` contient déjà les chiffres réels que tu as fournis (47,87 %, PF 1,61, DD 5,72 %, 229
  trades, 31,44 %, 8 pertes consécutives). `avgRiskReward` reste `null` tant que le rapport complet
  n'est pas fourni.
- `equityCurve` et `monthly` sont vides — la page affiche un état "en attente du rapport" tant que
  ces tableaux ne sont pas remplis. Aucune valeur n'est inventée.
- Dès que tu envoies le rapport MT5, il suffit de remplir ce fichier JSON (ou de me le transmettre
  pour que je le fasse) — aucun changement de code n'est nécessaire, tout le design est déjà branché
  dessus.

Format attendu pour un point de la courbe :
```json
{ "date": "2023-01-15", "capital": 100500, "cumulativeProfit": 500, "drawdownPct": 0.4 }
```

Format attendu pour une ligne mensuelle :
```json
{ "year": 2023, "month": 1, "gainEUR": 1200, "gainPct": 1.2, "drawdownPct": 0.8 }
```

## Challenge Prop Firm — mode actuel (manuel) + mode futur (automatique, déjà codé)

### Mode actuel : `data/challenge.json`

Tant qu'aucun VPS ne fait tourner MT5 en continu, la page `/challenge-prop-firm` lit directement
`data/challenge.json` (même principe que `data/performance.json` pour le backtest) :

- `config` : broker, plateforme, taille du compte, date de début — ne change pas.
- `snapshot` : balance/équité au moment de la dernière capture envoyée.
- `openPositions` : positions actuellement ouvertes (visibles sur la capture MT5, pas encore
  clôturées — donc pas comptées dans Win Rate / Profit Factor).
- `closedTrades`, `equityCurve`, `monthly`, `weekly` : vides tant qu'aucun trade n'est clôturé.

**Mise à jour** : chaque vendredi (ou à la demande), une nouvelle capture MT5 est envoyée en
conversation ; ce fichier est édité à la main avec les nouvelles valeurs. Dès qu'un trade se
clôture, il est ajouté dans `closedTrades` et toutes les statistiques (Win Rate, Profit Factor,
courbe, calendrier) se recalculent automatiquement à partir de `lib/challenge.ts` — aucune autre
modification de code nécessaire.

### Mode futur : automatique via Supabase (déjà codé, pas encore branché)

Une fois un VPS en place, le site peut basculer sur un flux 100% automatique, sans plus jamais
envoyer de capture :

1. **Trades clôturés** — `OPR_LiveReport.mqh` envoie chaque trade fermé vers `/api/v1/trades/report`.
2. **Solde/équité en temps réel** — `OPR_Heartbeat.mqh` envoie un instantané toutes les
   `HeartbeatMinutes` minutes vers `/api/v1/account/heartbeat`.
3. **Configuration** — une ligne dans la table `prop_challenges` (voir `database/schema.sql`),
   reliée à la licence du compte challenge.

`/api/v1/challenge/prop-firm/route.ts` agrège déjà tout ça côté Supabase — il suffira de rebrancher
la page dessus (au lieu de `data/challenge.json`) le jour où l'automatisation est en place.

## Système d'emails automatiques

Architecture indépendante du fournisseur d'envoi — `lib/email.ts` est le seul fichier
à modifier pour basculer de Resend vers Brevo ou un autre service (voir commentaire
dans le fichier). Tant que `RESEND_API_KEY` n'est pas renseignée, les emails sont
simplement journalisés en console (`[email] ... non envoyé (simulation)`) — rien ne
casse, mais rien ne part réellement.

### Scénarios couverts

| # | Scénario | Déclencheur | Fichier |
|---|----------|-------------|---------|
| 1 | Bienvenue après inscription | Appel client-side après `signUp()` réussi | `app/api/emails/welcome/route.ts` |
| 2 | Confirmation de paiement | Webhook Stripe `checkout.session.completed` | `app/api/webhooks/stripe/route.ts` |
| 3a | Rappel avant renouvellement | Webhook Stripe `invoice.upcoming` | idem |
| 3b | Confirmation après renouvellement | Webhook Stripe `invoice.paid` (billing_reason = subscription_cycle) | idem |
| 4 | Échec de paiement | Webhook Stripe `invoice.payment_failed` | idem |
| 5a | Relance panier abandonné (24h) | Cron `/api/cron/abandoned-checkout` | `app/api/cron/abandoned-checkout/route.ts` |
| 5b | Relance panier abandonné (3 jours) | idem | idem |
| 6 | Confirmation de résiliation | Webhook Stripe `customer.subscription.deleted` | `app/api/webhooks/stripe/route.ts` |
| Bonus | Suivi à J+7 après l'achat | Cron quotidien `/api/cron/checkin-7d` | `app/api/cron/checkin-7d/route.ts` |

Tous les emails envoyés sont journalisés dans la table `email_log` (évite les
doublons, donne un historique consultable). Les tentatives de paiement non
finalisées sont tracées dans `checkout_attempts`, insérée à chaque appel de
`/api/checkout`.

### Mise en place

1. Créer un compte sur [resend.com](https://resend.com), vérifier un domaine
   d'envoi (ou utiliser leur domaine de test en développement), récupérer une clé API.
2. Renseigner `RESEND_API_KEY` et `EMAIL_FROM` dans les variables d'environnement.
3. Générer une chaîne aléatoire pour `CRON_SECRET`, la renseigner en variable
   d'environnement **et** remplacer `CRON_SECRET_PLACEHOLDER` dans `vercel.json` par
   la même valeur.
4. Une fois déployé sur Vercel, les deux cron jobs (`vercel.json`) se déclenchent
   automatiquement — toutes les heures pour les relances panier, une fois par jour
   à 8h pour le suivi à J+7. Sur un autre hébergeur que Vercel, il faudra un
   scheduler externe (cron-job.org, GitHub Actions, etc.) pointant vers ces mêmes URL.
5. Dans le dashboard Stripe, activer l'événement `invoice.upcoming` dans la
   configuration du webhook (les autres événements utilisés étaient déjà actifs).

## Formules d'abonnement (Mensuel / 6 mois / 12 mois)

Toute la configuration des 3 formules vit dans **`lib/plans.ts`** — un seul fichier à
modifier pour ajuster un prix, une économie affichée, ou le badge "Meilleur choix".

### Mise en place Stripe

1. Dans le dashboard Stripe → Product catalog, créer **un produit** OPR Edge™ avec
   **3 prix récurrents** :
   - 79€ / tous les mois
   - 399€ / tous les 6 mois
   - 699€ / tous les 12 mois
2. Copier chaque `price_xxxxx` dans les variables d'environnement correspondantes :
   `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY`, `NEXT_PUBLIC_STRIPE_PRICE_ID_6M`,
   `NEXT_PUBLIC_STRIPE_PRICE_ID_12M`.
3. `/api/checkout?plan=monthly|six_months|twelve_months` choisit automatiquement le
   bon prix Stripe selon le paramètre reçu depuis les boutons de `/tarifs`.

### Durée de licence réelle (indépendante de Stripe)

Stripe ne gère que le **paiement** (quand débiter, quand renouveler). La durée
**réelle d'utilisation active** du robot est calculée côté application, dans
`lib/plans.ts::computeLicenseEndDate()`, et stockée dans
`licenses.active_license_until` :

- **Mensuel** : pas de calcul spécial — le renouvellement Stripe suffit à faire
  vivre la licence mois par mois.
- **6 mois** : la licence doit couvrir 6 mois **actifs**. Si août et/ou septembre
  tombent dans la période, ils ne comptent pas comme actifs — la licence est
  automatiquement prolongée d'autant.
- **12 mois** : même logique, **+ 2 mois bonus** ajoutés à la fin (annoncés sur
  `/tarifs` comme compensation de la pause saisonnière).

Cette date est calculée une fois, à l'activation (`checkout.session.completed`
dans le webhook Stripe), et stockée telle quelle — aucune tâche récurrente
nécessaire pour ce calcul.

## Progressive Web App (PWA)

Le site reste un site web classique, indexé par Google normalement — l'installation
est **entièrement facultative**, sans aucun impact sur le SEO ni sur le design existant.

- **`public/manifest.webmanifest`** — nom, icônes, couleurs, mode d'affichage `standalone`.
- **Icônes** — générées à partir du logo existant (`public/icons/`), plusieurs tailles
  (192, 512, maskable Android, apple-touch-icon) + `favicon.ico`.
- **`public/sw.js`** — service worker écrit à la main (pas de dépendance tierce type
  `next-pwa`, pour éviter tout risque d'incompatibilité non testable) :
  - Les pages HTML passent **toujours par le réseau en priorité** — le contenu
    n'est jamais périmé pour un visiteur ou pour Googlebot.
  - Seuls les fichiers statiques (images, icônes, assets `_next/static`) sont mis
    en cache, pour accélérer les visites répétées.
  - Les routes `/api/*` ne sont jamais interceptées.
- **Bannières d'installation**, discrètes et fermables (mémorisées via `localStorage`,
  ne réapparaissent pas après fermeture) :
  - `components/InstallPromptAndroid.tsx` — capture l'événement `beforeinstallprompt`.
  - `components/InstallPromptIOS.tsx` — détecte Safari iOS et explique
    "Partager → Sur l'écran d'accueil" (Safari ne propose pas d'installation native).

Rien n'est requis côté configuration Vercel/Supabase/Stripe pour que la PWA
fonctionne — tout est autonome, servi depuis `public/`.

## Ce qui reste à faire pour une mise en production complète

- Mettre à jour `data/challenge.json` chaque semaine (ou passer au mode automatique décrit
  ci-dessus une fois un VPS en place).
- Configurer les emails Supabase Auth (confirmation d'inscription, réinitialisation de mot de passe)
  avec ton propre domaine d'envoi.
- Ajouter la documentation détaillée (installation, prop firms) — structure prête à recevoir ce contenu.

## Déploiement (première mise en ligne)

1. **Créer un projet Supabase** → exécuter `database/schema.sql` dans l'éditeur SQL.
2. **Créer un compte Stripe** → créer un produit "OPR Edge™" à 79€/mois → récupérer le `price_id`.
3. Copier `.env.example` → `.env.local` et remplir les clés (Supabase, Stripe).
4. `npm install`
5. `npm run dev` pour tester en local, puis déployer sur **Vercel** (connecter le repo GitHub).
6. Dans Stripe : ajouter l'URL du webhook → `https://[ton-domaine]/api/webhooks/stripe`.
7. Dans MT5 : ajouter `https://[ton-domaine]` aux URL autorisées (Outils → Options → Expert Advisors).

## Prochaine étape recommandée

Ajouter l'authentification (Supabase Auth) pour que `dashboard` et `compte` affichent les vraies données du client connecté au lieu des données de démonstration.
