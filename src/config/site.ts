/**
 * Informations commerciales et éditoriales du site.
 *
 * C'est le SEUL endroit à modifier pour annoncer l'ouverture, un prix, une date,
 * une séance, une condition ou un lien. Aucune de ces valeurs n'est écrite en dur
 * dans les composants.
 *
 * ÉTAT ACTUEL : rien n'est encore confirmé. LA SALA n'est pas lancée.
 * Toutes les valeurs commerciales sont donc à `null` ou vides :
 * le site annonce simplement que LA SALA arrive bientôt à Lyon.
 * Dès qu'une information est officielle, la renseigner ici : les composants
 * l'afficheront automatiquement (séances, prix, conditions, réservation…).
 */

export type Seance = {
  /** Numéro de séance, gravé sur la clé et le billet. */
  numero: string;
  /** Date et heure au format ISO, avec le décalage horaire. */
  date: string;
  /** Nom du format, en espagnol. */
  format: string;
  /** Sous-titre clair du format, en français. */
  formatDescription: string;
  /** Quartier annoncé à la réservation. L'adresse exacte est confiée la veille. */
  quartier: string;
  /** Public de la séance. */
  public: string;
  /** Prix par personne, en euros. Si absent, c'est le prix par défaut qui s'applique. */
  prix?: number;
  /** Places restantes. N'afficher QUE des chiffres réels ; `null` = ne rien afficher. */
  placesRestantes: number | null;
  statut: 'ouverte' | 'complete' | 'bientot';
};

export type Episode = {
  numero: number;
  titre: string;
  description: string;
  /** URL de la vidéo quand elle sera publiée. `null` = « à venir ». */
  videoUrl: string | null;
};

type Site = {
  /** Nom de travail : le nom définitif n'est pas encore choisi. */
  marque: string;
  destination: { ville: string; mention: string; prochaines: string };
  ouverture: {
    /** 'bientot' tant qu'aucune séance n'est ouverte à la réservation. */
    statut: 'bientot' | 'ouverte';
    annonce: string;
    /**
     * Lien vers le formulaire « Être informé de l'ouverture » (liste d'attente, newsletter…).
     * `null` = pas encore de dispositif : le site le dit honnêtement.
     */
    lienInformation: string | null;
  };
  offre: {
    /** La phrase de clarté : ce qu'est l'expérience, en une ligne. */
    enUneLigne: string;
    /** Prix par personne. `null` = non communiqué (rien n'est affiché). */
    prixParDefaut: number | null;
    devise: string;
    /** Ce que le prix inclut (ex. « dîner et boissons compris »). `null` = non communiqué. */
    prixComprend: string | null;
    /** Ce que sera une soirée : le concept, sans chiffre ni lieu. */
    comprend: string[];
    /** Âge minimum légal pour participer. */
    ageMinimum: number;
    /** Conditions d'annulation. `null` = publiées avec l'ouverture des réservations. */
    annulation: string | null;
  };
  reservation: {
    /** Lien vers la billetterie. `null` = pas de réservation possible (aucun bouton « Réserver »). */
    url: string | null;
  };
  contact: {
    /** Adresse de contact officielle. `null` = aucune adresse affichée. */
    email: string | null;
  };
  /** Séances ouvertes ou annoncées. Vide tant qu'aucune date n'est officielle. */
  seances: Seance[];
  securite: string[];
  episodes: Episode[];
};

export const site: Site = {
  marque: 'LA CITA',

  destination: {
    ville: 'Lyon',
    mention: 'Première destination',
    prochaines: 'Prochaines destinations : à annoncer',
  },

  ouverture: {
    statut: 'bientot',
    annonce: 'LA SALA arrive bientôt à Lyon.',
    lienInformation: null,
  },

  offre: {
    enUneLigne: "Une soirée pour rencontrer quelqu'un que vous n'avez jamais vu.",
    prixParDefaut: null,
    devise: 'EUR',
    prixComprend: null,
    comprend: [
      'Une place à table, pour une soirée, face à une personne que vous ne connaissez pas encore.',
      'Un dîner, dans un lieu public.',
      'Quelques indices sur la personne, dans les jours qui précèdent.',
      "L'adresse exacte, confiée la veille.",
      'Le lendemain, une question privée : « Se revoir ? »',
    ],
    ageMinimum: 18,
    annulation: null,
  },

  reservation: {
    url: null,
  },

  contact: {
    email: null,
  },

  seances: [],

  securite: [
    'Toujours un lieu public.',
    'Une charte de respect acceptée par tout le monde.',
    'Vous pouvez partir à tout moment, sans avoir à vous justifier.',
    'Vos coordonnées ne sont jamais transmises sans votre accord mutuel.',
  ],

  episodes: [
    {
      numero: 1,
      titre: 'La Víspera',
      description: 'La veille d’une soirée. Deux inconnus, la même nuit, aucun visage.',
      videoUrl: null,
    },
    {
      numero: 2,
      titre: 'Cartas',
      description: 'Des lettres écrites le lendemain, lues à voix haute.',
      videoUrl: null,
    },
    {
      numero: 3,
      titre: 'Después',
      description: 'Ce qui reste d’une soirée : des voix, des objets, une table vide.',
      videoUrl: null,
    },
  ],
};
