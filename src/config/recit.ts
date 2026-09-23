/**
 * Le récit de la homepage : chaque moment associe un plan de la table,
 * un état de la bougie et une seule phrase. Peu de mots, beaucoup d'espace.
 */
import type { Bougie, Plan } from '../scripts/accueil/decor';

export type Moment = {
  plan: Plan;
  bougie?: Bougie;
  /** Intensité de la lumière de la salle (1 = normale). */
  jour?: number;
  titre: string;
  texte: string;
};

/** Comment ça se passe : six étapes concrètes, chacune portée par un objet de la table. */
export const etapes: Moment[] = [
  {
    plan: 'enveloppe',
    titre: 'L’invitation',
    texte: 'Vous demandez une invitation. Nous vous posons quelques questions, jamais une photo.',
  },
  {
    plan: 'cachet',
    titre: 'L’essentiel',
    texte: 'Avant la soirée, vous recevez ce qu’il faut savoir. Rien de plus.',
  },
  {
    plan: 'cle',
    titre: 'Le lieu',
    texte: 'L’adresse vous est confiée au bon moment, peu avant la soirée. Toujours un lieu public.',
  },
  {
    plan: 'table',
    titre: 'La table',
    texte: 'Une table pour deux, dressée pour vous, dans un restaurant.',
  },
  {
    plan: 'profil',
    titre: 'La rencontre',
    texte: 'Quelqu’un s’assoit en face de vous. Personne ne s’est choisi sur une photo.',
  },
  {
    plan: 'apres',
    titre: 'Après',
    texte: 'Le lendemain, une seule question : se revoir ? Votre réponse reste privée.',
  },
];

/** Une soirée : ce que l'on vit, de la table dressée à la bougie basse. */
export const soiree: Moment[] = [
  {
    plan: 'preparation',
    bougie: 'eteinte',
    jour: 0.7,
    titre: 'Préparation',
    texte: 'La table est dressée avant vous. La bougie attend.',
  },
  {
    plan: 'chaise',
    titre: 'L’arrivée',
    texte: 'On vous installe. En face, une chaise est tirée.',
  },
  {
    plan: 'verres',
    titre: 'Le dîner',
    texte: 'Un verre, un plat, le temps de se découvrir.',
  },
  {
    plan: 'visavis',
    titre: 'La rencontre',
    texte: 'D’abord une voix. Puis un rire, une histoire. Le reste vient à son rythme.',
  },
  {
    plan: 'apres',
    bougie: 'basse',
    jour: 0.8,
    titre: 'Après le dîner',
    texte: 'La bougie a baissé. Vous partez quand vous le souhaitez.',
  },
];
