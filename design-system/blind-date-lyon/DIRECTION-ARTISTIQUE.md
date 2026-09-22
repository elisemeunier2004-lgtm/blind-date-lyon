# Blind Date Lyon — Direction artistique

> Document de référence de la marque. Aucune page n'est codée à ce stade.
> Il fait autorité pour les futurs choix de design et d'intégration, et se déclinera plus tard en `MASTER.md` (tokens) et en règles propres à chaque page.

---

## 0. L'idée en une phrase

**LE VOILE : un clair-obscur lyonnais.**
Blind Date Lyon ne vend pas des profils. Elle vend *le moment qui précède le premier regard*. Toute la marque vit dans la pénombre, et la **lumière** sert à raconter : elle dévoile peu à peu, jamais tout d'un coup.

Signature verbale : **« Vous ne vous êtes jamais vus. C'est tout l'intérêt. »**

---

## 1. Concept visuel

L'identité ne s'appuie sur aucun code du « site de rencontre » (cœurs, swipe, roses, dégradés roses). Elle part de trois vérités **propres à Lyon**, qui correspondent chacune à une part du concept :

| Ancrage lyonnais | Ce qu'il raconte | Traduction visuelle |
|---|---|---|
| **La soie** (les Canuts, la Croix-Rousse) | Le *voile* qui sépare deux inconnus | Textures de tissu, mouvement fluide, drapé qui se soulève |
| **La lumière** (les frères Lumière, qui ont inventé le cinéma à Lyon en 1895, et la Fête des Lumières) | La *révélation* et le cinéma | Clair-obscur, lumière de tungstène, grain de film, format cinémascope, timecodes |
| **La Confluence** (le Rhône et la Saône qui se rejoignent) | *Deux personnes qui se rencontrent* | Deux lignes ou deux lueurs qui convergent et finissent par n'en faire qu'une |

Et une quatrième, en réserve pour les campagnes : **les traboules**, ces passages secrets qui relient deux immeubles. C'est la métaphore du chemin caché qui mène de l'un à l'autre.

**Le motif central : les deux lueurs.** Deux points de lumière douce, l'un chaud (ambre, tungstène) et l'autre froid (argent de Saône), se cherchent tout au long du site et se rejoignent à la fin. Il n'y a ni cœur ni personnage : seulement deux températures de lumière qui s'attirent. Le motif est abstrait, il reste inclusif (aucun genre représenté) et il est immédiatement reconnaissable.

**Le logo (piste).** Un monogramme **« Confluence »** : deux traits fins et courbes qui descendent, se rapprochent et fusionnent en un seul trait, comme la presqu'île vue du ciel. Il se lit à la fois comme un Y, un fil de soie et deux trajectoires qui se croisent. Le logotype est composé en capitales espacées, avec un verrouillage par ville :

```
BLIND DATE
LYON · 45°45′N
```

La coordonnée permet de décliner la marque dans d'autres villes (`PARIS · 48°51′N`, `BORDEAUX · 44°50′N`) sans toucher à l'identité.

---

## 2. Palette

Le fond est sombre, mais **chaud**. On évite volontairement le duo « noir et or » générique : le noir tire vers le brun, l'or devient une *lumière* (du tungstène) plutôt qu'une matière, et le bordeaux rappelle le velours des salles de cinéma et le vin des bouchons.

### Primitives

| Nom | Hex | Rôle |
|---|---|---|
| **Nuit** | `#0D0A0B` | Fond principal (noir chaud, jamais `#000`) |
| **Velours** | `#1A1214` | Surfaces, cartes et feuilles modales sur fond Nuit |
| **Velours bordeaux** | `#5E1A24` | Accent de surface (survol, états actifs, fonds de chapitre) |
| **Lueur** | `#F0B97A` | **Couleur d'action**. La lumière chaude : CTA, focus, lueur n°1 |
| **Saône** | `#9FB4C7` | Lueur n°2, la lumière froide. **Rare** : réservée au motif des deux lueurs |
| **Soie** | `#E3B8A8` | Rose champagne pour l'italique émotionnel et les détails |
| **Ivoire** | `#F4EEE6` | Texte sur fond sombre et fond « papier » |
| **Cendre** | `#9C918A` | Texte secondaire et métadonnées |
| **Pierre dorée** | `#CDB08A` | Ocre du Vieux-Lyon, secondaire en mode papier |
| Alerte | `#E0685A` | Erreurs (un corail doux, jamais un rouge vif) |
| Validation | `#9DBF9A` | Succès |

### Contrastes à vérifier (cible WCAG AA, et AAA pour le texte courant)

- Ivoire sur Nuit ≈ 17:1 · Lueur sur Nuit ≈ 11:1 · Soie sur Nuit ≈ 10:1 · Cendre sur Nuit ≈ 6,4:1 (valeurs estimées, à mesurer avant la mise en production)
- CTA : texte **Nuit sur Lueur**, pour un contraste maximal
- Velours bordeaux sert **uniquement de surface**, jamais de couleur de texte sur fond sombre

### Deux ambiances, un seul système

- **Nuit** (par défaut) : découverte, émotion, événements, vidéo.
- **Papier** (fond Ivoire, texte Nuit, accent Velours bordeaux) : tout ce qui est pratique ou rassurant (questionnaire, compte, paiement, FAQ, pages partenaires, mentions légales). On y retrouve le **carton d'invitation**, clair, posé sur la nuit. Le passage du sombre au clair a lui-même un sens : *on passe du mystère au concret*.

**Règle d'usage : 70 % Nuit, 20 % Ivoire, 8 % Lueur, 2 % Saône et Soie.** La lumière reste précieuse parce qu'elle est rare.

---

## 3. Typographies

Trois voix, trois rôles.

| Rôle | Choix (gratuit, Google Fonts) | Option premium sous licence | Pourquoi |
|---|---|---|---|
| **Titres** (affiche de film) | **Bodoni Moda**, variable, avec axe de taille optique | *Editorial New* (Pangram Pangram) ou *Canela* (Commercial Type) | Fort contraste, élégance mode et cinéma, pas du tout « app ». L'italique porte l'émotion. |
| **Texte et interface** | **Manrope** | *Satoshi* (Fontshare) ou *Neue Haas Unica* | Sobre, contemporain, très lisible en petit sur mobile. Il ne cherche pas à rivaliser avec les titres. |
| **Métadonnées** (générique, timecodes) | **IBM Plex Mono**, en capitales avec interlettrage de 0,14 em | *GT America Mono* | Timecodes (`21:04:17`), numéros de rendez-vous (`RDV Nº 024`), coordonnées : c'est le détail cinéma qui rend la marque crédible. |

> La recherche UI/UX Pro Max proposait Cormorant et Montserrat, une paire « luxe » très répandue qui donne un rendu générique. Je retiens plutôt sa piste « éditoriale + mono pour les étiquettes » (Minimalist Monochrome Editorial), adaptée à Bodoni Moda, Manrope et Plex Mono pour obtenir une voix propre à la marque.

### Échelle (mobile d'abord, valeurs fluides)

| Token | Mobile → Desktop | Interligne | Usage |
|---|---|---|---|
| `display-xl` | 56 → 144 px | 0.92 | Titres de chapitre et hero, Bodoni Moda Light avec l'italique en Soie |
| `display-l` | 40 → 88 px | 0.95 | Titres de section |
| `title` | 26 → 40 px | 1.1 | Titres de cartes et de questions |
| `body-l` | 18 → 20 px | 1.6 | Manifeste, textes éditoriaux |
| `body` | 16 → 17 px | 1.6 | Texte courant (jamais sous 16 px) |
| `label` | 12 px | 1.3 | Plex Mono en capitales. Minimum absolu : réservé aux étiquettes, jamais au texte |

**Règle de composition :** dans chaque titre, **un mot en italique** porte l'émotion.
*« Faites connaissance **avant** de vous voir. »* ou *« Le lieu reste **secret** jusqu'à la veille. »*

---

## 4. Effets, textures et animations

### Textures
- **Grain argentique** : bruit SVG à 4–6 % d'opacité sur toute la page, animé par saccades à 8 i/s comme une vraie pellicule. Désactivé si l'utilisateur a demandé à réduire les animations.
- **Soie** : une texture de tissu réellement photographiée (soie lyonnaise, idéalement tournée chez un soyeux de la Croix-Rousse). Elle sert de voile, de fond de chapitre et de masque.
- **Vignettage** léger sur les images et **fuites de lumière** ambrées, rares, sur les transitions de chapitre.
- **Filets** d'1 px en Ivoire à 12 % d'opacité, plutôt que des ombres portées. **L'élévation passe par la lumière**, avec un halo Lueur très diffus, pas par des ombres grises.

### Langage d'animation : « la mise au point »
Le geste qui définit la marque est le **flou qui devient net**, comme un opérateur qui fait le point. Les images et certains mots apparaissent flous puis se précisent. C'est la métaphore directe de la rencontre à l'aveugle.

| Token | Valeur | Usage |
|---|---|---|
| `ease-voile` | `cubic-bezier(0.22, 1, 0.36, 1)` | Apparitions et révélations (expo-out) |
| `ease-fondu` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transitions de page et fondus |
| `dur-micro` | 180 ms | Survol, pression, bascules |
| `dur-ui` | 320 ms | Feuilles modales, menus, étapes de formulaire |
| `dur-reveal` | 900 ms | Mise au point, apparition de chapitre |
| `dur-cinema` | 1 600 ms | Ouverture, convergence finale des deux lueurs |

**Règles :**
- On n'anime que `transform`, `opacity` et `filter`, jamais les dimensions.
- Les sorties sont plus rapides que les entrées, et on n'utilise **aucun rebond** : l'easing `back.out` proposé par l'outil est écarté, car il donne un rendu « app ludique » et bon marché.
- Au plus **1 à 2 sections épinglées** (pin) sur toute la page. Sur mobile, on utilise le scroll natif et `scroll-snap`.
- Si l'utilisateur a demandé à réduire les animations, chaque chapitre s'affiche dans son état final net, sans parallaxe ni scrub.
- **Transitions de page** : un fondu au noir de 400 ms, pendant lequel un timecode s'affiche brièvement.

---

## 5. Direction photo et vidéo

### Principe : montrer l'émotion, cacher les visages
Les supports de marque ne montrent **jamais un couple entier et souriant face caméra**. On montre ce qui précède le regard.

**On filme :**
- Des **fragments** : une main qui hésite sur un verre, une nuque, une chaise vide en face, deux manteaux sur un portant, un reflet dans une vitre.
- Des **silhouettes en contre-jour** et des visages hors de la zone de netteté.
- **Lyon la nuit**, en vrai : les quais de Saône, la passerelle Saint-Georges, les traboules, les lampadaires au sodium, les vitres embuées d'un bouchon, le funiculaire.
- Les **deux températures** : une lumière chaude de tungstène d'un côté, la nuit bleue de l'autre. Le motif des deux lueurs se retrouve ainsi dans l'image même.

**Style de prise de vue :** optiques anamorphiques ou vintage, très faible profondeur de champ, bokeh ovale, caméra à l'épaule mais posée. Le tournage est documentaire : on capte de vraies soirées, pas des mises en scène.

**Étalonnage :** noirs chauds, hautes lumières ambrées, ombres qui tirent vers le bordeaux, peau naturelle. On évite l'orange-bleu criard et les blancs cliniques.

**Formats :**
- Le **hero** est une boucle muette de 8 à 12 s en 2.39:1 sur desktop et en 4:5 sur mobile, avec une image de repli (poster) et un bouton pause visible.
- **« Le premier regard »**, série vidéo signature en 9:16 : le moment exact où deux participants se découvrent, publié **uniquement avec leur consentement écrit**. C'est le contenu le plus fort de la marque, pour le site comme pour les réseaux.
- **« Et après ? »** : des témoignages d'après-rendez-vous, filmés de dos ou en ombres chinoises, avec sous-titres systématiques.

**Casting et éthique :** une représentation variée (âges de 25 à 55 ans et plus, morphologies, origines, orientations). Consentement explicite et droit de retrait. **Aucune banque d'images.**

**On bannit :** les roses rouges, les pétales, les cœurs, les coupes de champagne qui trinquent au ralenti, et les couples de stock qui rient face caméra.

---

## 6. Design system

### Architecture des tokens (primitive → sémantique → composant)
```
primitive   : --nuit, --velours, --lueur, --saone, --soie, --ivoire, --cendre …
sémantique  : --bg, --surface, --text, --text-muted, --action, --action-on,
              --line, --focus-ring   (redéfinis pour l'ambiance « Papier »)
composant   : --btn-primary-bg, --card-invitation-bg, --veil-opacity …
```
Aucune valeur hexadécimale n'est écrite en dur dans un composant.

### Fondations
- **Espacement** (base 4, densité aérée) : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144. Sur mobile, les sections sont espacées de 96 px au minimum.
- **Grille** : 4 colonnes sur mobile avec une gouttière de 20 px, 12 colonnes sur desktop. Les compositions sont asymétriques : un titre décalé, une image qui déborde du cadre.
- **Rayons** : **0** par défaut, pour un rendu net et cinématographique. **2 px** sur les champs de formulaire. Un rayon complet est réservé aux lueurs et aux interrupteurs.
- **Icônes** : trait fin de 1,25 px, style Lucide allégé ou jeu sur mesure. Aucun emoji.
- **Focus** : un anneau Lueur de 2 px avec 3 px de décalage, **toujours visible** au clavier.

### Composants signature
| Composant | Description |
|---|---|
| **Bouton Lueur** | Fond Lueur et texte Nuit. Au survol ou à la pression, un halo s'étend comme une bougie qu'on rapproche. Hauteur de 52 px sur mobile. |
| **Bouton filet** | Contour d'1 px en Ivoire. Au survol, le fond se remplit de bas en haut. |
| **Lien tracé** | Le soulignement se dessine de gauche à droite. |
| **Carton d'invitation** | Carte ivoire posée sur la nuit : date en Bodoni, `RDV Nº` en mono, quartier indiqué (« Quelque part dans le 2e ») et **lieu masqué** par une bande de soie portant la mention *révélé la veille*. |
| **Billet** | Confirmation de réservation, avec découpe perforée et code. Il peut s'ajouter à Apple Wallet ou Google Wallet. |
| **Image voilée** | Une image qui passe du flou au net au scroll ou au tap. |
| **Marqueur de chapitre** | Composé ainsi : `CHAPITRE II — PENDANT` · `00:02:14`. |
| **Indice** | Carte d'un indice sur l'autre personne. On la révèle par un appui long, avec une alternative accessible par bouton. |
| **Compte à rebours** | Chiffres en mono, avec l'heure écrite en toutes lettres et un rendu statique si les animations sont réduites. |
| **Question** | Une question par écran, affichée comme un sous-titre de film, avec une barre de progression en « bobine ». |
| **Feuille modale** (bottom sheet) | Détails d'un événement sur mobile, avec une poignée et un fond Velours. |
| **Sélecteur de ville** | Coordonnées et nom de ville. Les villes à venir apparaissent en Cendre avec la mention « Bientôt ». |
| **Carte lieu partenaire** | Photo d'ambiance du restaurant ou de l'activité. Le nom n'apparaît que si le lieu est public. |

### Ton de la marque
Le **vouvoiement**, des phrases courtes, du suspense et un humour léger. Jamais de « matching », d'« algorithme magique » ou d'« âme sœur ».
- CTA : *« Réserver ma place »* · *« Tenter l'inconnu »* · *« Recevoir le premier indice »*
- Un état vide : *« Aucune soirée ce soir. Le mystère se prépare. »*
- Une erreur : *« Ce champ nous manque pour vous trouver quelqu'un. »*

---

## 7. Expérience utilisateur

### Deux publics
1. **Les participant·es** : curieux, mais souvent **un peu anxieux**. Il faut les faire rêver *et* les rassurer.
2. **Les partenaires** (restaurants, bars, activités, marques) : ils veulent de la visibilité, une clientèle qualifiée et du concret.

### Le parcours participant : l'attente fait partie du produit
```
Découvrir → Comprendre (3 temps) → Se rassurer → Choisir une soirée
→ Questionnaire (≈ 12 questions, 1 par écran, sauvegarde auto)
→ Paiement → Billet
→ L'ATTENTE : J-7 indice nº1 · J-3 indice nº2 · J-1 lieu révélé · H-2 dernier mot
→ Le rendez-vous
→ L'après : retour privé + « Se revoir ? » (double accord mutuel, sinon rien)
```
L'**attente** est un espace à concevoir comme le reste (dans le compte, par e-mail et par SMS). C'est là que la marque se distingue : le mystère se prolonge sur plusieurs jours au lieu de se consommer en un clic.

### Ce qui reste secret, et ce qui ne l'est jamais
Le mystère ne doit **jamais** peser sur la sécurité. Une section explicite l'affirme :
- **Secret** : le visage, le nom et le lieu (jusqu'à la veille).
- **Jamais secret** : la charte, la vérification d'identité, le fait qu'un lieu est public et fréquenté, le contact d'urgence, la politique d'annulation et le remboursement.

### Règles mobile d'abord
- Un CTA « Réserver » **collant, dans la zone du pouce**, qui apparaît après le hero.
- Des zones tactiles de 44 × 44 px au minimum, espacées d'au moins 8 px. Aucune interaction ne dépend du survol.
- Une vidéo muette par défaut, avec son au tap, sous-titres et bouton pause. Elle se met en pause dès qu'elle sort de l'écran.
- Des labels visibles sur tous les champs (pas seulement des placeholders), des erreurs affichées sous le champ concerné et la progression toujours visible.
- Des images en AVIF ou WebP chargées à la demande, avec un espace réservé pour éviter tout décalage de mise en page (CLS < 0,1).
- **Aucune fausse rareté** : on n'affiche « plus que 3 places » que si le chiffre est réel et à jour.

### Architecture évolutive (plusieurs villes, partenaires, activités)
```
/                         → choix de ville (ou redirection Lyon)
/lyon                     → homepage ville
/lyon/soirees             → agenda (filtres : format, âge, orientation, date)
/lyon/soirees/[slug]      → fiche événement
/lyon/lieux               → restaurants, bars, activités partenaires
/lyon/journal             → vidéos « Le premier regard », récits
/experience               → comment ça marche, formats (dîner, activité, apéro, grand événement)
/confiance                → sécurité, charte, FAQ
/partenaires              → B2B : devenir lieu partenaire, marques, privatisation
/inscription  /compte     → questionnaire, billets, indices, « Se revoir ? »
```
Chaque ville a sa propre coordonnée, sa texture et ses images. Le système, lui, reste identique. Les **formats** (dîner à l'aveugle, cours de cuisine à deux, dégustation, soirée à 40 inconnus) sont des types d'événement, ce qui permet d'ajouter des activités sans refaire le design.

---

## 8. Structure de la homepage

Ce n'est pas une landing page classique en « hero, 3 avantages, témoignages ». C'est un **film en chapitres**, avec un appel à l'action discret à la fin de chaque chapitre et un climax final (motif « Scroll-Triggered Storytelling » recommandé par l'outil).

| # | Séquence | Contenu | Intention |
|---|---|---|---|
| 0 | **Ouverture** (≤ 1,5 s, première visite seulement) | Écran Nuit, timecode `LYON — 21:04`, puis les deux lueurs apparaissent de part et d'autre | Installer le ton cinéma sans faire attendre |
| 1 | **Le voile** (hero) | Une boucle vidéo floue sous un voile de soie. Titre : *« Vous ne vous êtes jamais **vus**. C'est tout l'intérêt. »* Le carton de la prochaine soirée (date, quartier) et deux CTA : `Réserver ma place` · `Comment ça marche` | Émotion immédiate + information utile dès le premier écran |
| 2 | **Chapitre I — Avant** (manifeste) | Trois phrases qui se précisent **mot à mot** au scroll. *« On a appris à juger en 0,3 seconde. On vous propose une soirée entière. »* | Le positionnement anti-application |
| 3 | **Chapitre II — Pendant** (comment ça marche) | Trois « plans » en défilement horizontal natif sur mobile : **1. Le questionnaire**, **2. Les indices**, **3. Le rendez-vous** | Lever l'appréhension en trois temps |
| 4 | **Les prochaines soirées** | Des cartons d'invitation (lieu masqué, quartier, format, places réelles) | Conversion |
| 5 | **Le premier regard** | Des vidéos 9:16 réelles, qui se lancent au tap et sont sous-titrées | Preuve émotionnelle |
| 6 | **Ce qui reste secret / ce qui ne l'est jamais** | Deux colonnes : mystère d'un côté, garanties de sécurité de l'autre, puis les chiffres vérifiés | Confiance |
| 7 | **Les lieux** | Carte stylisée de Lyon, réduite à ses deux fleuves tracés en filets, avec les lieux partenaires en points de lumière | Ancrage local et vitrine pour les partenaires |
| 8 | **Questions** | Une FAQ courte en accordéon, avec un lien vers la page Confiance | Lever les dernières objections |
| 9 | **Chapitre III — Le rendez-vous** (climax) | Les deux lueurs se rejoignent. *« Il ne manque que **vous**. »* et le CTA | Émotion finale et conversion |
| — | **Pied de page** | Sélecteur de ville (« Bientôt : Paris, Bordeaux… »), liens partenaires, réseaux, inscription aux indices par e-mail | Évolutivité |

**Fil conducteur, la Confluence :** deux fils de soie très fins courent sur les bords de l'écran. À mesure qu'on descend dans la page, ils se rapprochent et **se rejoignent au chapitre III**. Ils servent d'indicateur de progression, sont signés par la marque et restent invisibles pour les lecteurs d'écran (`aria-hidden`).

---

## 9. Interactions originales

1. **Le voile de soie** (hero) : le doigt ou le curseur soulève légèrement le voile et laisse voir un fragment plus net. On ne découvre jamais de visage, seulement une main ou une flamme de bougie.
2. **Les deux lueurs** : sur desktop, le curseur devient une lueur chaude et une seconde lueur, froide, dérive puis s'en approche lentement. Sur mobile, elles réagissent au scroll (pas au gyroscope, qui demande une autorisation sur iOS).
3. **La mise au point** : les titres et les images se précisent au scroll, et le manifeste se lit mot par mot.
4. **Le lieu masqué** : l'adresse reste cachée sous une bande de soie qui glisse la veille, avec une petite animation quand l'utilisateur revient sur son billet.
5. **Les indices** : on les révèle par un appui long d'environ 600 ms, avec vibration sur Android. Un bouton « Révéler » sert d'alternative accessible.
6. **Le questionnaire en sous-titres** : chaque question apparaît comme une réplique de film, et la réponse fait avancer la « bobine ».
7. **« Se revoir ? »** : chacun·e répond en privé. Si les deux réponses sont oui, les deux lueurs fusionnent et les coordonnées s'échangent. Sinon, il ne se passe rien et personne n'est blessé.
8. **L'ambiance sonore** (désactivée par défaut) : un bouton discret « Ambiance » lance le fond sonore d'une salle, un verre qui tinte, un projecteur qui démarre.
9. **Les transitions** : un fondu au noir avec un timecode qui défile. Changer de page, c'est changer de plan.

---

## 10. 3D et immersion : l'effet « wow » sans le kitsch

**Règle d'or : une seule surprise par écran, et la 3D doit toujours servir la métaphore** (cacher et révéler, ou deux qui deviennent un). Jamais pour la décoration.

| Élément | Technique | Garde-fous |
|---|---|---|
| **Voile de soie en WebGL** (hero uniquement) | Un plan de tissu déformé par du bruit, qui réagit au toucher, via un shader léger (OGL, plus léger que Three.js) | Chargé à la demande, en pause hors de l'écran. En repli (animations réduites, appareil modeste, `deviceMemory` < 4), une image statique avec un masque flou en CSS |
| **Bokeh de Lyon la nuit** | Des particules de lumière derrière le texte, avec profondeur de champ | Moins de 2 000 particules (plafond mobile recommandé : 3 000), à tester sur un vrai téléphone de milieu de gamme |
| **Convergence des deux lueurs** | Deux sources lumineuses en 2,5D avec un glow additif | Aussi réalisable en CSS/SVG, la 3D n'est pas indispensable |
| **« La Traboule »** (campagnes spéciales : 8 décembre, Saint-Valentin) | Une caméra qui avance au scroll dans un passage voûté jusqu'à une porte éclairée qui ouvre la billetterie | Une seule fois par an, sur une page dédiée, avec possibilité de passer l'animation |

**Ce qu'on ne fera jamais :** des cœurs en 3D, un logo qui tourne, des avatars, des roses qui tombent, un curseur à paillettes, du glassmorphism partout, un chargement de plus de 1,5 s.

**Budget performance :** le JS 3D reste sous 120 ko gzip et n'est chargé qu'après le premier affichage. On vise un LCP inférieur à 2,5 s en 4G.

---

## 11. Anti-patterns (à refuser en revue)

- ❌ L'imagerie des sites de rencontre : cœurs, swipe, profils en grille, flammes, roses.
- ❌ Le noir et or « luxe » générique, et le **Liquid Glass** que l'outil suggérait : c'est un langage d'interface système Apple, froid et technologique, à l'opposé du velours et de la soie.
- ❌ Les animations rebondissantes, les transitions instantanées et les parallaxes lourdes sur mobile.
- ❌ Les banques d'images, les faux témoignages, les faux compteurs de places.
- ❌ Un texte sous 16 px, du gris sur gris, des interactions qui ne marchent qu'au survol.

---

## 12. Pourquoi cette direction correspond au concept

- **Le mystère est dans le design lui-même.** Flou, voile, lieu masqué, indices : l'interface *fait vivre* l'expérience d'une rencontre à l'aveugle au lieu de simplement la décrire.
- **L'identité est enracinée dans Lyon, donc impossible à copier.** La soie des Canuts, la lumière des frères Lumière et la Confluence des deux fleuves ne se transposent pas ailleurs, et elles portent pourtant une idée universelle, deux qui deviennent un. C'est une identité propre, pas un modèle générique.
- **Le cinéma est légitime.** Le cinéma est né à Lyon. Timecodes, cinémascope, grain de film et série « Le premier regard » donnent naturellement à la marque sa dimension événementielle et vidéo.
- **Le positionnement haut de gamme passe par la retenue** : une palette chaude et sombre, de la typographie éditoriale, beaucoup d'espace et une lumière utilisée avec parcimonie. Pas par l'accumulation d'effets.
- **La marque est inclusive par construction.** Deux lueurs, pas deux silhouettes genrées.
- **Elle est rassurante là où il le faut.** L'ambiance Papier et la section « ce qui ne l'est jamais » séparent le mystère de la sécurité.
- **Elle est évolutive.** Les coordonnées par ville, les formats traités comme des types d'événements et des URL `/ville/…` permettent d'ajouter partenaires, activités et nouvelles villes sans refonte.

---

## Annexe : méthode

Cette direction a été construite avec **UI/UX Pro Max** : génération d'un design system (`--design-system`, variance 7, animation 7, densité 2) et recherches ciblées dans les domaines typographie, style, couleur, landing, GSAP, UX et la stack Three.js. Ont été **retenus** : le motif Scroll-Triggered Storytelling, l'intuition « éditorial + mono pour les étiquettes », les règles d'accessibilité et de réduction des animations, le plafond de particules sur mobile et la limite d'une ou deux sections épinglées. Ont été **écartés**, parce qu'ils rendaient la marque générique : le style Liquid Glass, la paire Cormorant et Montserrat, le fond clair par défaut et l'easing à rebond.

Prochaines étapes, sur validation :
1. Moodboard visuel et exploration du logo Confluence.
2. `MASTER.md` et les tokens CSS.
3. Maquette mobile du hero et du carton d'invitation.
4. Choix de la stack.
