# CoteSport

Suivi de la cote des véhicules sportifs (v1 : BMW M / M Performance) sur les marchés suisse et allemand, à partir d'annonces publiques (prix, kilométrage, année, puissance, description, ancienneté de l'annonce). Pas de VIN : le modèle est déduit de l'année, de la puissance et du titre ; les options sont détectées dans la description.

## Architecture
- **Base** : Neon Postgres (`sql/schema.sql`).
- **API + collecte + application web** : une fonction Neon (`src/index.ts`, bundle esbuild). Un déclencheur planifié l'appelle toutes les 15 min ; la collecte est étalée sur la journée (`crawl_queue`).
- **Démarrage** : `deploy/bootstrap.mjs` charge `bundle/index.mjs` depuis GitHub et en vérifie le SHA-256 (`BUNDLE_URL`, `BUNDLE_SHA256`). Pour publier une nouvelle version : `npm run release`, commit, puis mettre à jour `BUNDLE_SHA256` sur la fonction.
- **Interface** : PWA dans `web/` (embarquée dans le bundle par `scripts_genweb.mjs`).
- **Cote** : régression ridge sur ln(prix) (âge, km, pays, version, options, état), intervalle à 80 %, projection 12/24/36 mois (`src/valuation.ts`).

## Sources
`as24de` (AutoScout24.de), `as24ch` (AutoScout24.ch, refuse actuellement les accès automatisés : la source s'arrête sans contournement) et `autolina` (Autolina.ch, source suisse effective : listes `/bmw/<modèle>` + détail `/auto/<slug>/<id>`, robots.txt respecté). À faire valider côté conditions d'utilisation avant usage régulier. mobile.de n'est **pas** activé (filtres non fiabilisés). Pour ajouter une plateforme ou un pays : créer `src/sources/<nom>.ts` (interface `Source` dans `types.ts`) et l'enregistrer dans `src/sources/index.ts`.

## Variables d'environnement
`DATABASE_URL` (injectée par Neon), `APP_TOKEN` (jeton d'accès à l'API/à l'interface), `REQUEST_DELAY_S` (4), `RESPECT_ROBOTS` (true), `MAX_DETAILS_PER_DAY` (1200), `STALE_AFTER_DAYS` (3), `SOURCES` (`as24de,as24ch,autolina`).

## Limites et précautions
- Collecte polie : robots.txt respecté, délai ~4 s par site, arrêt de la source en cas de 403/429/503/451 ou de page anti-robot (aucun contournement).
- Les prix sont des prix **demandés**, pas des prix de vente.
- Avant tout usage public ou payant des données collectées : validation juridique (conditions des plateformes, droit des bases de données).


## Interface et déploiement
- Onglets « Crédit / leasing » et « Import DE ↔ CH » (pages `web/leasing.html`, `web/import.html`, préremplies depuis les annonces via le hash d'URL). Les colonnes/choix Suisse n'apparaissent que s'il existe des annonces suisses.
- Hébergement : Cloudflare Workers + assets statiques (`wrangler.jsonc`, `worker/index.js` proxifie `/api/*` vers la fonction Neon). Déploiement automatique à chaque push via Workers Builds (build : aucun ; deploy : `npx wrangler deploy`). Netlify n'est plus utilisé.
- Backend : `npm run release` régénère `bundle/index.mjs` ; mettre à jour `BUNDLE_SHA256` sur la fonction Neon après chaque release.
- Les annonces accidentées / défectueuses / épaves sont détectées dans le texte (`isDamaged`, src/options.ts), exclues du calcul de la cote et masquées par défaut dans la liste (case à décocher). Un prix > 30 % sous la cote est signalé « à vérifier ».
- Le suivi accepte des annonces (☆) : prix courant, historique, retrait de l'annonce.
