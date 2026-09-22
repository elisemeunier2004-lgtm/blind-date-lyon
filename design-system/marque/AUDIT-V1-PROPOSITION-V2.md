# LA SALA — Audit de la V1 et proposition V2

> Statut : **proposition à valider**. Aucune refonte n'est lancée.
> Sources de vérité inchangées : `FONDATION-PHILOSOPHIQUE.md` (philosophie, langage), `VISUAL-WORLD-BIBLE-V2.md` (univers). Ce document **déplace le symbole central** : du cinéma vers **la table**. Le cinéma reste une influence esthétique, rien de plus.

---

## 0. Nettoyage commercial (fait)

Tout ce qui laissait croire que LA SALA est déjà lancée a été retiré. L'architecture est conservée dans `src/config/site.ts` :

| Retiré | Désormais |
|---|---|
| 85 €, « dès 85 € », prix par séance | `prixParDefaut: null` : aucun prix affiché |
| Dates d'octobre, horaires, quartiers, formats datés | `seances: []` : la liste réapparaîtra automatiquement avec de vraies dates |
| « Prochaine séance » | « LA SALA arrive bientôt à Lyon. » |
| Faux bouton « Réserver » (e-mail pré-rempli) | `reservation.url: null` : aucun bouton « Réserver » |
| Adresse `bonjour@lacita.example` | `contact.email: null` : aucune adresse affichée |
| Conditions d'annulation (72 h) | `annulation: null` : « publiées avec l'ouverture des réservations » |
| « Séance Nº 017 », « Rang G · Place 17 », « Place 18 » | Billet sans numéro (« Votre place : à table », « La place d'en face : réservée ») |
| Promesses non confirmées (identité vérifiée, équipe joignable) | Retirées. Seuls restent les principes (lieu public, charte, liberté de partir, accord mutuel) |

**CTA principal :** « Être informé de l'ouverture ». Tant que `ouverture.lienInformation` vaut `null`, il mène à la section « L'ouverture », qui l'indique honnêtement (« L'inscription à l'annonce d'ouverture arrive très bientôt »). **Il faudra brancher un vrai outil** (liste d'attente ou newsletter) pour que ce bouton recueille réellement des inscriptions.

Les heures de la nuit (20:47, 22:00…) restent pour l'instant. Ce sont des repères narratifs, pas des horaires d'événement. La V2 propose de les réduire fortement (§3).

---

## 1. Audit de la V1

### 1.1 Ce qui fonctionne vraiment bien (à garder)
- **La place vide réservée.** Le carton « réservée » posé sur un siège vide, en 3D, est l'image la plus forte du site. La V2 la transpose sur une chaise de table.
- **La question seule à l'écran**, sans navigation ni appel à l'action juste après. C'est juste, calme et adulte.
- **La clarté « Concrètement ».** Chaque moment poétique est accompagné d'une phrase utile. Le principe est bon, c'est son exécution qui est trop lourde (voir §1.8).
- **L'architecture :**
  - une configuration unique pour tout ce qui est commercial ;
  - une affiche sans 3D, lisible, qui prend le relais ;
  - le scroll natif ;
  - la 3D chargée en différé et mise en pause hors champ ;
  - l'accessibilité : lien d'évitement, clavier, réduction des animations ;
  - aucun débordement horizontal.
- **L'honnêteté du fond.** Réponse privée à « Se revoir ? », liberté de partir, aucune fausse rareté.
- **La palette et le trio typographique** de la bible : la base est bonne, c'est leur usage qui est systématique.

### 1.2 Ce qui donne une impression « AI generated »
- **Un gabarit répété six fois à l'identique** : surtitre en capitales espacées, grand titre serif, paragraphe, encadré à filet gauche. C'est la signature des pages générées.
- **Le tic des capitales espacées** partout (« CONCRÈTEMENT », « PREMIER INDICE », « VEINTIUNA Y TRES », « DÉCHIRER POUR ENTRER »). C'est devenu le code du « luxe IA ».
- **Un mot en italique champagne dans presque chaque titre** : une formule plutôt qu'un choix.
- **La recette « dark luxury »** : grain global + vignette + halos radiaux derrière chaque texte + filets dorés.
- **Les heures écrites en espagnol sous chaque heure.** C'est décoratif, pas culturel : cela sonne comme un effet.
- **Les phrases-maximes** en fin de bloc, trop nombreuses : chaque section « conclut ».
- **Les numéros « 01 / 02 / 03 »** des épisodes, avec leurs perforations de pellicule décoratives.

### 1.3 Ce qui fait trop « site de cinéma »
- **Toute la métaphore** : salle, écran, rideau, projecteur, fauteuils, billet à déchirer, « la séance va commencer », « entracte », « Fin. ».
- **La 3D est une salle de cinéma.** La table, le repas et le restaurant n'apparaissent **jamais**.
- **Le visiteur regarde un écran.** Il ne s'assoit jamais à une table. On raconte un spectacle, pas un dîner.
- **Le vocabulaire** : séance, entracte, écran, carte de bal.

### 1.4 Ce qui manque pour comprendre immédiatement le dîner et la rencontre
- **Le premier écran ne montre ni table, ni verre, ni assiette.** Le mot « dîner » arrive tard et en petit.
- **La compréhension demande environ 9 écrans de scroll** : le fonctionnement est dilué dans six chapitres de 150 % de hauteur.
- **Aucune présence humaine** : pas une main, pas une silhouette.
- **La promesse centrale** (« vous allez vous asseoir à une table avec quelqu'un que vous n'avez pas choisi sur photo ») n'est jamais dite en une phrase dès l'arrivée.

### 1.5 Ce qui manque en 3D
- **Des primitives de code** (boîtes arrondies, sphères) : la rose se lit comme une boule, la clé comme un jouet.
- **Aucun modèle réel**, aucune texture PBR (albedo, normal, rugosité, occlusion).
- **Aucune carte d'environnement** : le métal et le verre ne reflètent rien, donc ils n'existent pas.
- **Aucune ombre projetée**, aucune ombre de contact : les objets flottent.
- **Aucun post-traitement** : ni profondeur de champ, ni halo sur la flamme, ni grain dans l'image.
- **Aucun verre, aucun liquide**, aucune transparence réfractive.
- **Une caméra qui n'a que deux positions** (l'écran, le voisin).
- **Aucune imperfection** : tout est propre, droit, neuf.

### 1.6 Ce qui manque en matière
- Seul le velours existe, grâce à l'effet de lustre.
- **Absents : le papier, la cire, la porcelaine, le verre, le bois, le lin, le liquide.**
- **Les couleurs sont unies**, sans grain de matière. On voit des couleurs, pas des matières.

### 1.7 Ce qui manque en photographie
- **Il n'y a aucune photographie.** Tout est CSS ou 3D.
- Il faudra un vrai tournage (voir §5). **Aucune banque d'images, aucune image générée par IA.**

### 1.8 Ce qui manque en son
- **Rien : ni son, ni architecture pour en accueillir.**

### 1.9 Les animations trop artificielles
- **Le rideau CSS** qui glisse en changeant d'échelle, dans l'affiche sans 3D.
- **Le talon du billet** qui s'envole en tournant.
- **Le fondu montant** du sous-titre d'entrée, qui est un réflexe de template.
- **Le scintillement de projection** et les **particules de poussière**, qui se lisent comme des étoiles génériques.
- **La même courbe d'interpolation pour tout** en 3D : tout glisse de la même façon, rien n'a de poids.

### 1.10 Les composants UI trop génériques
- **La barre d'onglets mobile fixée en bas** : c'est un code d'application.
- **Le bandeau d'en-tête en dégradé.**
- **L'accordéon « + »** des questions.
- **Le panneau latéral** « carte de bal ».
- **Les boutons pleins avec halo au survol.**
- **La grille de trois cartes** d'épisodes.

### 1.11 Les textes trop nombreux
- **L'entrée empile huit couches de texte** : heure, statut, titre, suite, clarté, annonce, billet, lien.
- **Chaque chapitre a cinq couches** (heure, heure en espagnol, titre, phrase, « Concrètement »), fois six.
- **L'idée de la place réservée est dite quatre fois.**
- Les sections sur fond papier sont longues pour un site qui n'a pas encore de dates.

### 1.12 Ce qui donne une impression de faux luxe
- **Le rouge velours et l'or**, systématiquement associés.
- **Les filets dorés** encadrant l'écran.
- **Le halo champagne** sur les boutons.
- **Les noms de rubriques** « carte de bal » et « Fin. ».
- **Bodoni en italique partout.**
- **Le gadget du billet.**

### 1.13 Ce qui donne une impression de vraie expérience premium
- **La retenue** : une seule question, du silence, aucune pression.
- **L'honnêteté** : pas de faux chiffres, pas de fausse rareté, des conditions claires.
- **Les règles humaines** : partir quand on veut, dire oui ou non en privé.
- **La place réservée**, en tant qu'image : une absence qui promet quelqu'un.
- **Des performances sobres** : rien ne bloque, tout reste lisible sans 3D.

---

## 2. Nouvelle direction : de la salle de cinéma à la salle à manger

**Relecture du nom de travail « LA SALA ».** En espagnol, *la sala* désigne aussi **la salle à manger, la pièce où l'on reçoit**. LA SALA devient donc **la salle d'un restaurant, le soir**, et plus une salle de projection. Le concept et le nom restent inchangés, seul leur sens se déplace.

**Le symbole principal devient LA TABLE :** une vraie table de dîner dressée pour deux. Une place est préparée pour le visiteur, **l'autre est vide**. Cette absence, c'est la personne qu'il va rencontrer.

**Ce que le visiteur doit ressentir, dans l'ordre :**
1. *« Qu'est-ce que c'est ? »* : une table dans la pénombre, une lumière qui s'allume.
2. *« Ah… c'est une vraie rencontre. »* : deux couverts, et l'un des deux n'a pas de visage.
3. *« J'ai envie de découvrir l'expérience. »* : quatre objets, quatre étapes, compris en une minute.
4. *« J'ai envie de savoir quand ça ouvre. »* : « LA SALA arrive bientôt à Lyon », suivi d'un seul appel à l'action.

**Ce qui disparaît :** l'écran, le rideau, le projecteur, les fauteuils, le billet, le vocabulaire de séance, les heures en espagnol, « Fin. », la carte de bal, la barre d'onglets mobile.

**Ce qui reste de la bible V2 :** la nuit, le rouge profond et le bordeaux (en matière : velours des chaises, vin, cire), l'ivoire (nappe, porcelaine, papier), le champagne (verre, lumière), l'influence latino (musique, gastronomie, mots rares), l'esthétique des années 50 et 60 réinterprétée, la sensualité par le geste.

---

## 3. Structure proposée pour la homepage V2 : *Una mesa para dos*

Une seule scène continue : **la table**. Le scroll fait avancer la soirée, sans intertitres. Au plus **une phrase par écran**, plus une ligne claire quand c'est nécessaire.

| # | Moment | Ce qu'on voit (3D ou photo) | Texte (maximum) | Rôle |
|---|---|---|---|---|
| 1 | **L'arrivée** | Une table dans la pénombre. Une allumette s'allume, puis la bougie. Deux verres apparaissent dans la lumière | « Une table pour deux. Une personne que vous n'avez pas choisie. » Puis, en petit : « Dîners à l'aveugle · bientôt à Lyon » et **Être informé de l'ouverture** | Comprendre en 5 secondes : **dîner et rencontre** |
| 2 | **La question** | La caméra s'immobilise sur la flamme | « Et si nous arrêtions de choisir avant de rencontrer ? » | La philosophie, seule, une fois |
| 3 | **Comment ça se passe** | Quatre objets de la table, un par étape : **l'enveloppe** (le questionnaire, puis les indices), **la clé** (le lieu confié la veille), **la chaise tirée** (le dîner), **la serviette pliée avec un mot** (le lendemain : « Se revoir ? ») | Une ligne claire par objet | Le fonctionnement, en un seul écran long |
| 4 | **La place d'en face** | La caméra passe de l'autre côté : un couvert préparé, une chaise vide, la rose posée sur l'assiette | « Cette place est pour quelqu'un que vous ne connaissez pas encore. » | L'émotion centrale |
| 5 | **La présence** | Interlude photographique, dès que le tournage existera : une main autour d'un verre, une nuque, une veste sur un dossier, une personne qui entre dans un restaurant | Aucun, ou une ligne | L'humain, sans visage |
| 6 | **La salle** | La lumière se réchauffe, la profondeur de champ s'ouvre : d'autres tables floues, un reflet dans un miroir | — | Le restaurant, le réel, la soirée |
| 7 | **L'engagement** | Fond papier, sobre | Quatre principes, et trois ou quatre questions au plus | La confiance |
| 8 | **Le retour aux deux places** | Plan large sur la table : les deux places, la bougie plus basse, la rose | « LA SALA arrive bientôt à Lyon. » et **Être informé de l'ouverture** | La conversion |
| — | **Pied de page** | — | Destination, épisodes (quand ils existent), mentions | — |

**Navigation :** un menu discret (« Menu » en haut à droite) et un seul lien fixe et discret « Être informé de l'ouverture ». Plus de barre d'onglets.

**Épisodes :** la section n'apparaît que lorsqu'un épisode existe. D'ici là, une seule ligne dans le pied de page.

---

## 4. Les scènes 3D principales

**Une seule scène : une table de restaurant, la nuit.** La caméra se déplace autour d'elle comme un chef opérateur, avec des travellings lents et des mises au point.

| Plan | Progression demandée | Caméra | Lumière | Matières mises en avant |
|---|---|---|---|---|
| **A · Pénombre** | 1. Table plongée dans la pénombre | Plongée large et lente | Presque noir, un reflet sur le verre | Nappe de lin, bois |
| **B · La flamme** | 2. Lumière qui apparaît · 4. Bougie | Rapprochement vers l'allumette, puis la bougie | La flamme devient la source principale, avec ombres portées | Cire (coulures), laiton du bougeoir |
| **C · Les verres** | 3. Deux verres | Travelling latéral au ras de la table | Reflets et réfraction de la flamme dans le verre | Cristal, vin ou eau dans une carafe |
| **D · Les objets de l'attente** | 5. Enveloppe · 6. Clé · 7. Rose | Gros plans en macro, la mise au point passe d'un objet à l'autre | Lumière rasante qui révèle le papier et le cachet | Papier coton, cire à cacheter, laiton, pétales |
| **E · Les deux places** | 8. Chaise légèrement tirée · 9. Deuxième chaise vide · 10. Couvert préparé | Passage de l'autre côté de la table, à hauteur d'assise | La place vide est éclairée : réservée, jamais triste | Porcelaine, argenterie, velours de chaise |
| **F · La salle** | 11. Lumière plus chaude · 12. Ambiance de restaurant | Recul et ouverture de la profondeur de champ | Arrière-plan en bokeh chaud, autres bougies, reflets dans un miroir ancien | Miroir, laiton, verre |
| **G · La présence** | 13. Présence suggérée sans visage | Fixe | Une ombre passe sur la nappe, une main pose une serviette (animation ou photo incrustée) | Tissu, peau |
| **H · Retour** | 14. Retour sur les deux places | Plongée large, symétrique | Bougie plus basse, lumière de fin de soirée | L'ensemble |

### Exigences de qualité (anti CGI générique)
- **Des modèles réalisés pour le projet**, dans Blender, par un·e artiste 3D ou par photogrammétrie de vrais objets : chaises (modernisme latino des années 50), assiettes, couverts, verres, carafe, bouteille, bougeoir, enveloppe, clé, rose, menu. **Pas d'objets de bibliothèque pour les objets principaux.** Des banques CC0 ne servent qu'aux éclairages d'environnement (HDRI) et à certaines textures de base.
- **Des matières physiques réalistes :**
  - verre à transmission, épaisseur et réfraction ;
  - liquide sous forme de maillage intérieur ;
  - métal reflétant une carte d'environnement ;
  - porcelaine avec vernis ;
  - velours avec lustre ;
  - cire translucide ;
  - papier avec relief léger ;
  - lin avec tissage visible.
- **L'imperfection comme règle :** serviette froissée, cire qui a coulé, trace de doigt sur un verre, couverts pas tout à fait alignés, une goutte sur la nappe.
- **Une lumière réelle :** éclairage précalculé dans Blender pour la table, plus une lumière dynamique de bougie qui vacille doucement, des ombres douces et des ombres de contact.
- **Un post-traitement discret :** profondeur de champ, léger halo sur la flamme et les reflets, grain dans l'image elle-même (et non plus un calque CSS sur toute la page), tone mapping doux.
- **Une approche hybride recommandée :**
  - le plan d'ouverture et les gros plans sont **pré-rendus en qualité cinéma** (images ou courtes vidéos) ;
  - la scène temps réel sert aux moments interactifs et au desktop ;
  - le mobile reçoit en priorité les rendus précalculés.

  Sur un téléphone, un rendu précalculé est plus beau et plus fluide qu'une 3D temps réel.
- **Budget :** modèles compressés et textures optimisées, au plus environ 6 à 8 Mo chargés progressivement. Le premier écran reste lisible en moins de 2 secondes.

---

## 5. Photographie

- **Un vrai tournage**, en lumière de bougie, dans un restaurant réel (idéalement un futur lieu partenaire lyonnais).
- **Ce qu'on photographie :**
  - des mains autour d'un verre ;
  - une nuque, une épaule, un dos ;
  - une robe, une veste posée sur un dossier, des cheveux ;
  - une personne qui entre (de dos) ;
  - une chaise que l'on tire, deux verres ;
  - des reflets dans un miroir ;
  - une table dressée, des ombres.
- **Interdits :** visages de face, couples génériques, banques d'images, images générées.
- **D'ici le tournage :** aucune photo de substitution. La 3D porte seule la présence (ombres, gestes).

---

## 6. Le son

### Architecture (à coder en V2, sans aucun faux fichier)
- **Un module audio** basé sur Web Audio, avec trois couches :
  1. **la musique**, avec une boucle par moment et des fondus enchaînés ;
  2. **l'ambiance de salle**, un fond de restaurant ;
  3. **les sons ponctuels**, déclenchés par les scènes : verre, couvert, chaise, allumette, bougie, papier, enveloppe, clé.
- **Un manifeste central**, `src/config/sons.ts`, avec pour chaque son : `id`, `fichier` (`null` tant que l'enregistrement n'existe pas), volume, boucle ou non. **Si le fichier vaut `null`, rien ne se passe.**
- **Règles d'usage :**
  - le son est coupé par défaut et s'active avec un bouton visible (« Écouter la salle ») ;
  - le choix est mémorisé ;
  - le son se met en pause quand l'onglet est caché ;
  - le volume reste bas ;
  - rien ne démarre sans geste du visiteur.

### Direction de production
- **La musique :** une composition originale, avec un compositeur à qualifier. Boléro contemporain, latin jazz discret, guitare à cordes nylon, piano, vibraphone, contrebasse douce, texture analogique (bande, vinyle discret), ambiance nocturne.
- **Les bruitages :** enregistrés dans un vrai restaurant, avec de vrais verres et de vrais couverts, une vraie allumette.
- **Interdits :** musique romantique de banque de sons, musique de bande-annonce, piano triste générique, musique générée par IA.

---

## 7. Faire disparaître l'effet « AI cheap » : règles précises

1. **Une phrase par écran.** On supprime les heures en espagnol, les surtitres, les encadrés « Concrètement » répétés. La clarté passe par les objets du §3, avec une ligne chacun.
2. **Aucun gabarit répété.** Chaque moment a sa propre composition, dictée par l'objet et le cadrage, et non plus par un modèle de bloc.
3. **La typographie retenue.** Bodoni seulement pour trois ou quatre phrases de toute la page. Caslon pour le reste. Les capitales espacées sont réservées à la navigation. Plus d'italique systématique.
4. **Plus de halos, de vignettes ni de grain CSS global.** La lisibilité vient de la composition (le texte posé là où l'image est sombre), pas de voiles superposés.
5. **Un minimum d'interface.** Pas de barre d'onglets, pas d'accordéon « + », pas de halo sur les boutons. Un seul style d'appel à l'action, sobre, avec le texte d'abord.
6. **Des matières vraies.** Modèles et textures réalisés pour le projet, imperfections, lumière physique. Pas de primitives de code.
7. **Des humains vrais.** Photographies et sons originaux. Jamais de banque d'images, jamais d'IA générative pour l'image ou le son.
8. **Un mouvement qui a du poids.** Moins d'animations, mais physiques : une lumière qui change, une mise au point, un travelling lent. Pas de fondu montant sur chaque bloc, pas de particules décoratives, pas de scintillement.
9. **Écrire du concret sensoriel plutôt que des maximes.** « La nappe est blanche. Il y a deux verres. L'un attend encore. » Moins d'aphorismes.
10. **L'honnêteté, toujours.** Aucun chiffre, aucune date, aucun lieu tant qu'ils ne sont pas réels (déjà appliqué).

---

## 8. Décisions à prendre avant de coder la V2

1. **Valider la structure** *Una mesa para dos* (§3) et la relecture de « LA SALA » comme salle à manger.
2. **Choisir l'approche 3D** : hybride (pré-rendus et temps réel, recommandée) ou tout en temps réel.
3. **Choisir la production des objets 3D** :
   - un·e artiste 3D ou de la photogrammétrie, pour le niveau de qualité demandé ;
   - ou une première passe réalisée par moi, en Blender procédural ou en three.js, qui sera meilleure que la V1 mais restera en dessous d'objets réalisés sur mesure.
4. **Tournage photo et son** : à planifier. Le site est prêt à les accueillir sans faux contenu.
5. **Outil pour « Être informé de l'ouverture »** : à brancher dès qu'il est choisi (liste d'attente ou newsletter).
