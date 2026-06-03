# Meltdown — Échelle de gestion quotidienne 📈

Une application mobile **privée et hors ligne** pour suivre ton **Échelle de Gestion Meltdown**
chaque jour — inspirée du livre *Meltdown* (routine du soir du chapitre 9 + chapitre 11
« Check Yourself Before You Wreck Yourself »).

Chaque soir, elle t'invite à répondre aux mêmes **8 questions de réflexion**, à évaluer comment
s'est passé chaque aspect de ta journée, puis compile ces réponses en un seul **score de 1 à 10**.
Au fil du temps, elle construit un calendrier coloré, des courbes de tendance, des moyennes
hebdomadaires/mensuelles et des **recommandations personnalisées** qui pointent vers le domaine de
ta vie qui demande le plus d'attention — exactement comme l'enseigne le livre.

## Les 8 questions
1. Qu'as-tu fait pour améliorer ta santé aujourd'hui ? *(Santé)*
2. T'es-tu amusé aujourd'hui — et si oui, à quoi ? *(Santé)*
3. Qu'as-tu appris aujourd'hui ? *(Productivité)*
4. Pour quoi es-tu le plus reconnaissant aujourd'hui ? *(Relations)*
5. Qui te souviens-tu avoir aidé aujourd'hui ? *(Relations)*
6. T'es-tu énervé ou contrarié aujourd'hui ? Comment as-tu réagi ? *(Santé)*
7. Comment as-tu amélioré ta richesse aujourd'hui ? *(Richesse)*
8. Que peux-tu faire mieux demain ? *(Productivité)*

Chaque question correspond à l'une des quatre dimensions du livre — **Santé, Richesse,
Productivité, Relations** — pour que tes analyses reflètent l'Échelle de Gestion Meltdown.

## Comment fonctionne le score
- Tu évalues chacune des 8 questions de **1 à 5** (😞 → 😄).
- **Score du jour (1–10)** = la moyenne de tes 8 notes, ramenée sur une échelle de 1 à 10.
- **Scores par catégorie (1–5)** : moyenne par dimension, pour repérer ton point faible.
- Les moyennes hebdomadaires et mensuelles suivent la méthode du livre (somme ÷ jours).

## Fonctionnalités
- 🏠 **Aujourd'hui** — un bilan guidé de 5 minutes, puis ton score du jour et ton équilibre.
- 🗓 **Calendrier** — une carte de chaleur colorée de chaque jour (rouge = bas, vert = haut).
- 📈 **Analyses** — tendance sur 30 jours, moyennes semaine par semaine, répartition de ton énergie et conseils sur mesure.
- ⚙️ **Plus** — change la **langue** (Français / English), définis ton prénom, gère ta **sécurité** (mot de passe, clé de récupération), exporte tes données en JSON, réinitialise.
- 🔒 100 % privé et hors ligne. Toutes les données restent dans le stockage de ton navigateur (`localStorage`). Rien n'est envoyé nulle part.

## Sécurité &amp; confidentialité
Au premier lancement, l'app te demande de créer un **mot de passe**. Ce mot de passe **chiffre tes bilans
directement sur l'appareil** (Web Crypto : clé AES-GCM dérivée par PBKDF2, 250 000 itérations). Même quelqu'un
qui inspecte le stockage du navigateur ne voit que des données chiffrées illisibles sans ton mot de passe.

- Le code source de l'app est public ; **tes données ne le sont jamais** — elles ne quittent pas ton navigateur.
- **Clé de récupération** : générée à la création et affichée une seule fois. Note-la en lieu sûr : c'est le seul
  moyen de reprendre la main si tu oublies ton mot de passe (chiffrement à enveloppe, sans porte dérobée).
- Tu peux changer ton mot de passe ou régénérer ta clé depuis **Plus → Sécurité**.
- Si tu perds **et** ton mot de passe **et** ta clé de récupération, les données sont irrécupérables — par conception.
  Pense à utiliser l'export JSON comme sauvegarde.
- Le chiffrement nécessite un **contexte sécurisé** (https ou `localhost`), tous deux disponibles ici.

## Lancer l'app sur ton ordinateur
```bash
cd ~/Desktop/Meltdown
python3 -m http.server 4321
```
Puis ouvre <http://localhost:4321> dans ton navigateur.

## L'installer sur iPhone / Android (l'utiliser comme une vraie app)
1. Assure-toi que ton téléphone est sur le **même Wi-Fi** que ton Mac.
2. Trouve l'adresse IP de ton Mac : `ipconfig getifaddr en0` (ex. `192.168.1.42`).
3. Démarre le serveur (commande ci-dessus) et, sur ton téléphone, ouvre `http://192.168.1.42:4321`.
4. **iPhone :** appuie sur le bouton Partager → **Sur l'écran d'accueil**.
   **Android (Chrome) :** menu → **Installer l'application / Ajouter à l'écran d'accueil**.
5. Lance-la depuis l'icône — elle s'ouvre en plein écran, hors ligne, comme une app native.

> Pour une installation permanente, héberge le dossier sur n'importe quel hébergeur statique
> (GitHub Pages, Netlify, Vercel) et ajoute *cette* URL à ton écran d'accueil. Le service worker
> la rend disponible hors ligne après le premier chargement.

## La seule règle qui fait que ça marche
Le livre est catégorique : rends le bilan **non négociable**. Programme un rappel récurrent à
**19h30** dans ton app Horloge/Rappels et fais-le chaque jour, sans exception. L'app s'occupe du reste.

---
*Fichiers :* `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icons/`.
`make_icons.py` régénère les icônes de l'app (bibliothèque standard uniquement).
