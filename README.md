# LA CITA — LA SALA (V1)

Site de la marque (nom de travail : **LA CITA**). Première destination : Lyon.

> Sources de vérité, à lire avant toute modification :
> 1. `design-system/marque/FONDATION-PHILOSOPHIQUE.md` : philosophie, langage, principes de décision
> 2. `design-system/marque/VISUAL-WORLD-BIBLE-V2.md` : direction artistique
> 3. `design-system/marque/CONCEPTS-HOMEPAGE.md` : historique des concepts (LA SALA est retenu)

## Voir le site en local

**Prérequis : Node.js 22.12 ou plus récent** (vérifier avec `node -v` ; sinon l'installer depuis https://nodejs.org, version LTS, ou `nvm use` grâce au fichier `.nvmrc`).

```bash
git clone https://github.com/elisemeunier2004-lgtm/blind-date-lyon.git
cd blind-date-lyon
git checkout claude/upbeat-maxwell-di9jpq
npm install
npm start         # ouvre http://localhost:4321/ dans le navigateur
```

Arrêter le serveur : `Ctrl + C` dans le terminal.

## Commandes

```bash
npm start         # développement + ouverture automatique du navigateur
npm run dev       # développement : http://localhost:4321
npm run build     # site statique dans dist/
npm run preview   # prévisualiser le build
npm run check     # vérification des types
```

## MCP 21st.dev (Claude Code)

Le fichier `.mcp.json` déclare le serveur MCP officiel de 21st.dev (`https://21st.dev/api/mcp`). La clé n'est jamais écrite dans le repo : elle est lue dans la variable d'environnement `API_KEY_21ST`.

1. Créer une clé gratuite sur https://21st.dev/mcp (les anciennes clés « Magic » ne fonctionnent plus).
2. Dans le terminal, avant de lancer Claude Code : `export API_KEY_21ST="votre-clé"`
3. Lancer `claude` dans le dossier du projet, puis approuver le serveur « 21st » lorsque c'est demandé. Vérifier avec `claude mcp list`.

## Modifier les informations commerciales

**Tout se trouve dans un seul fichier : `src/config/site.ts`.**

**État actuel : rien n'est confirmé.** LA SALA n'est pas lancée : aucune date, aucun lieu, aucun prix, aucune billetterie. Toutes les valeurs commerciales sont à `null` ou vides, et le site annonce simplement « LA SALA arrive bientôt à Lyon. ». Chaque information réapparaît automatiquement dès qu'elle est renseignée.

| Pour… | Modifier… |
|---|---|
| Brancher le bouton « Être informé de l'ouverture » (liste d'attente, newsletter) | `ouverture.lienInformation` (tant qu'il vaut `null`, le bouton mène à la section « L'ouverture », qui l'indique honnêtement) |
| Annoncer l'ouverture | `ouverture.statut` : `'ouverte'` (avec au moins une séance) |
| Ajouter des soirées (dates, format, quartier, public) | `seances` (vide pour l'instant) |
| Le prix par défaut / ce qu'il inclut | `offre.prixParDefaut`, `offre.prixComprend` (`null` = rien n'est affiché) |
| Le prix d'une soirée en particulier | `prix` dans la séance |
| Les places restantes | `placesRestantes` (**uniquement des chiffres réels**, sinon `null`) |
| Les conditions d'annulation | `offre.annulation` (`null` = « publiées avec l'ouverture des réservations ») |
| Le lien de billetterie | `reservation.url` (`null` = aucun bouton « Réserver ») |
| L'adresse de contact | `contact.email` (`null` = aucune adresse affichée) |
| Les engagements de sécurité | `securite` |
| Les épisodes vidéo | `episodes` (renseigner `videoUrl` quand une vidéo est publiée) |

Le texte des chapitres de la nuit (heures, phrases, explications concrètes) se trouve dans `src/config/nuit.ts`.

## Architecture

```
src/
  config/
    site.ts            ← informations commerciales (seul fichier à modifier)
    nuit.ts            ← les chapitres de la nuit (20:47 → 02:13)
  lib/format.ts        ← dates, prix, lien de réservation
  styles/
    tokens.css         ← tokens de la bible V2 (palette, typographies, mouvement)
    global.css
  layouts/Base.astro
  components/
    Salle.astro        ← la salle : affiche CSS/SVG + toile 3D
    Billet.astro       ← le billet à déchirer (premier geste)
    Chapitre.astro     ← une heure de la nuit (poésie + « Concrètement »)
    Seances.astro      ← dates, lieux, prix, réservation (ambiance papier)
    Engagement.astro   ← ce qui reste secret / ce qui ne l'est jamais
    Questions.astro    ← questions fréquentes
    Cartas.astro       ← les épisodes vidéo à venir
    Fin.astro          ← la fin et le pied de page
    Entete.astro, BarreBasse.astro, CarteDeBal.astro
  scripts/sala/
    realisateur.ts     ← observe la scène à l'écran et règle la salle
    etat.ts            ← l'état de la salle, lu depuis les data-* des sections
    billet.ts          ← déchirer le billet (clic, clavier, glisser)
    capacites.ts       ← décide si la 3D est proposée
    salle3d.ts         ← la salle en three.js (chargée en différé)
```

### La 3D, une couche optionnelle
- **L'affiche CSS/SVG** s'affiche toujours en premier. C'est l'expérience complète sans 3D.
- **La 3D** (three.js) se charge après le rendu, pendant un moment d'inactivité, dans un fichier séparé (environ 140 Ko compressés). Elle n'est **pas** chargée si l'utilisateur demande à réduire les animations, en mode économie de données, sur un appareil modeste ou sans WebGL 2.
- Forçage pour les tests : `?3d=1` ou `?3d=0`. Avec `?3d=1&debug`, la console expose `__sala.scene('place')` pour sauter directement à une scène (réglage des cadrages).
- Le rendu se met en pause quand la salle n'est pas visible (sections papier) et quand l'onglet est caché.

### Le scroll
Le scroll reste **natif**. Chaque section porte des attributs `data-scene`, `data-rideau`, `data-regard`, etc. Le réalisateur lit l'état de la section qui traverse le milieu de l'écran et l'applique à la salle.

## Règle de décision du projet

Chaque nouvelle fonctionnalité passe le **test de la place vide** (fondation, §12) :

> « Est-ce que cela rapproche le visiteur de l'expérience d'une rencontre imprévisible, ou est-ce que cela ressemble simplement à une interface de dating classique ? »
