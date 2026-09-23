/**
 * Identité sonore de LA SALA — manifeste.
 *
 * Aucun fichier n'existe encore : chaque son vaut `null` et le site reste
 * silencieux (aucun bouton « son » n'est affiché tant qu'aucun fichier n'est renseigné).
 * Direction : boléro contemporain, latin jazz discret, guitare nylon, piano, vibraphone,
 * contrebasse douce, texture analogique. Bruitages enregistrés dans un vrai restaurant.
 * Jamais de musique de banque de sons, de bande-annonce ou générée par IA.
 *
 * Pour ajouter un son : déposer le fichier dans /public/sons/ et renseigner son chemin
 * (ex. '/sons/allumette.mp3').
 */

export type Son = {
  /** Chemin du fichier, ou `null` tant que l'enregistrement n'existe pas. */
  fichier: string | null;
  volume: number;
  boucle: boolean;
  couche: 'musique' | 'ambiance' | 'objet';
};

export const sons = {
  musique: { fichier: null, volume: 0.35, boucle: true, couche: 'musique' },
  salle: { fichier: null, volume: 0.18, boucle: true, couche: 'ambiance' },
  allumette: { fichier: null, volume: 0.5, boucle: false, couche: 'objet' },
  bougie: { fichier: null, volume: 0.25, boucle: false, couche: 'objet' },
  papier: { fichier: null, volume: 0.4, boucle: false, couche: 'objet' },
  enveloppe: { fichier: null, volume: 0.4, boucle: false, couche: 'objet' },
  cle: { fichier: null, volume: 0.45, boucle: false, couche: 'objet' },
  verre: { fichier: null, volume: 0.35, boucle: false, couche: 'objet' },
  couvert: { fichier: null, volume: 0.3, boucle: false, couche: 'objet' },
  chaise: { fichier: null, volume: 0.35, boucle: false, couche: 'objet' },
} satisfies Record<string, Son>;

export type IdSon = keyof typeof sons;

/** Sons associés aux plans du récit (joués à l'arrivée sur le plan, si le son est activé). */
export const sonsParPlan: Partial<Record<string, IdSon>> = {
  arrivee: 'allumette',
  enveloppe: 'enveloppe',
  cachet: 'papier',
  cle: 'cle',
  verres: 'verre',
  chaise: 'chaise',
  apres: 'couvert',
};

export const aDesSons = Object.values(sons).some((s) => s.fichier !== null);
