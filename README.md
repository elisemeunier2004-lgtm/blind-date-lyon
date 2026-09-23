# LA SALA — homepage V2 (« Una mesa para dos »)

Site de LA SALA : dîners à l'aveugle. Première destination : Lyon.

> Sources de vérité, à lire avant toute modification :
> 1. `design-system/marque/FONDATION-PHILOSOPHIQUE.md` : philosophie, langage, principes de décision
> 2. `design-system/marque/VISUAL-WORLD-BIBLE-V2.md` : direction artistique
> 3. `design-system/marque/AUDIT-V1-PROPOSITION-V2.md` : audit de la V1 et direction V2 (la table, le dîner)
> 4. `/scene-reference` : scène 3D de référence validée (lumière, matières, composition). **Ne plus la modifier.**

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

## Architecture (V2)

```
src/
  config/
    site.ts            ← informations commerciales et clarté (seul fichier à modifier)
    recit.ts           ← le récit : étapes et soirée (un plan de la table + une phrase)
    sons.ts            ← identité sonore : manifeste des sons (tous à null pour l'instant)
  lib/format.ts        ← dates, prix, liens
  styles/              ← tokens de la bible V2, styles globaux
  layouts/Base.astro
  components/
    Scene.astro        ← la table fixe : photographie immédiate + 3D en relais
    Entete.astro       ← marque + « Être informé de l'ouverture »
    Clarte.astro       ← ce qu'il faut savoir (emplacements prix/dates/durée/lieu/conditions)
  pages/
    index.astro        ← la homepage : arrivée, question, étapes, place vide, soirée, clarté, fin
    scene-reference.astro ← scène de référence validée (ne plus modifier)
  scripts/
    capacites.ts       ← décide si la 3D en direct est proposée
    table/             ← objets, textures et scène de référence (partagés)
    accueil/
      decor.ts         ← la table de la homepage et ses plans de caméra
      realisateur.ts   ← suit le moment à l'écran et règle la table (3D ou photographies ;
                         retour automatique aux photographies sous ~20 images/s)
      son.ts           ← moteur audio (inactif tant qu'aucun fichier n'existe)
public/scene/          ← photographies de la scène, une par plan (-p paysage, -v portrait)
```

### La table : photographie d'abord, 3D ensuite
- Chaque plan existe en **photographie calculée à l'avance** (`public/scene/`). Elle s'affiche immédiatement et reste l'expérience complète si la 3D n'est pas proposée : réduction des animations demandée, économie de données, appareil modeste, WebGL absent.
- La **3D en direct** (three.js) se charge ensuite, dans le même cadre, et prend le relais par un fondu. Sur mobile, elle tourne en mode léger (sans profondeur de champ ni halo, ombres réduites).
- **Régénérer les photographies** après un changement de la scène : lancer `npm run build && npm run preview`, puis ouvrir `/?capture=<plan>` ; la console expose `__plan(plan, bougie, jour)` pour passer d'un plan à l'autre et capturer l'écran (1440×900 en paysage, 390×844 @2x en portrait).
- Forçage pour les tests : `?3d=1` ou `?3d=0`.

### Clarté : les emplacements existent déjà
`site.informations` (prix, dates, durée, lieu, conditions) : tant qu'une valeur vaut `null`, son emplacement est **masqué** publiquement. `?structure` les affiche pour travailler.

### Son
`src/config/sons.ts` liste musique, ambiance de salle et bruits d'objets. Tant qu'aucun fichier n'est renseigné, rien n'est chargé et aucun bouton n'apparaît. Déposer les fichiers dans `public/sons/` et renseigner leur chemin.

## Règle de décision du projet

Chaque nouvelle fonctionnalité passe le **test de la place vide** (fondation, §12) :

> « Est-ce que cela rapproche le visiteur de l'expérience d'une rencontre imprévisible, ou est-ce que cela ressemble simplement à une interface de dating classique ? »
