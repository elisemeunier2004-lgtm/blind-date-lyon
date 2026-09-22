/**
 * Informations commerciales et éditoriales du site.
 *
 * C'est le SEUL endroit à modifier pour changer un prix, une date, une séance,
 * une condition ou le lien de réservation. Aucune de ces valeurs n'est écrite
 * en dur dans les composants.
 *
 * ⚠️ Les valeurs actuelles sont des PLACEHOLDERS (prix, dates, conditions,
 * adresse de contact). Tant que `placeholders` vaut `true`, le site affiche
 * une mention « indicatif » à côté du prix et des dates.
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

export const site = {
  /** Nom de travail : le nom définitif n'est pas encore choisi. */
  marque: 'LA CITA',

  /** true = les chiffres affichés sont indicatifs (mention visible sur le site). */
  placeholders: true,

  destination: {
    ville: 'Lyon',
    mention: 'Première destination',
    prochaines: 'Prochaines destinations : à annoncer',
  },

  offre: {
    /** La phrase de clarté : ce qu'est l'expérience, en une ligne. */
    enUneLigne: "Une soirée pour rencontrer quelqu'un que vous n'avez jamais vu.",
    prixParDefaut: 85,
    devise: 'EUR',
    prixComprend: 'dîner et boissons compris',
    comprend: [
      'Une place à table, pour une soirée, avec une personne que vous ne connaissez pas encore.',
      'Un dîner et ses boissons, dans un lieu partenaire.',
      'Quelques indices sur la personne, dans les jours qui précèdent.',
      "L'adresse exacte, confiée la veille.",
      'Le lendemain, une question privée : « Se revoir ? »',
    ],
    ageMinimum: 18,
    annulation: "Annulation gratuite jusqu'à 72 h avant la séance. Au-delà, la place n'est pas remboursée, mais elle peut être reportée une fois.",
  },

  reservation: {
    /**
     * Lien vers la billetterie quand elle existera.
     * Tant qu'il est vide, les boutons « Réserver » ouvrent un e-mail pré-rempli.
     */
    url: '',
  },

  contact: {
    /** Adresse provisoire (domaine .example réservé aux exemples). À remplacer. */
    email: 'bonjour@lacita.example',
  },

  seances: [
    {
      numero: '017',
      date: '2026-10-15T21:00:00+02:00',
      format: 'La Cena',
      formatDescription: 'Dîner à deux',
      quartier: 'Lyon 2e',
      public: '28 – 38 ans · toutes orientations',
      placesRestantes: null,
      statut: 'ouverte',
    },
    {
      numero: '018',
      date: '2026-10-22T21:00:00+02:00',
      format: 'La Cena',
      formatDescription: 'Dîner à deux',
      quartier: 'Lyon 1er',
      public: '35 – 48 ans · toutes orientations',
      placesRestantes: null,
      statut: 'ouverte',
    },
    {
      numero: '019',
      date: '2026-10-29T20:30:00+01:00',
      format: 'La Tertulia',
      formatDescription: 'Grande soirée de conversation entre inconnus',
      quartier: 'Lyon 7e',
      public: '25 – 45 ans · toutes orientations',
      prix: 65,
      placesRestantes: null,
      statut: 'bientot',
    },
  ] satisfies Seance[],

  securite: [
    'Toujours un lieu public : un restaurant ou un lieu partenaire.',
    "Identité vérifiée pour chaque participant·e avant la séance.",
    'Une charte de respect acceptée par tout le monde.',
    "Vous pouvez partir à tout moment, sans avoir à vous justifier.",
    'Notre équipe reste joignable pendant toute la soirée.',
    'Vos coordonnées ne sont jamais transmises sans votre accord mutuel.',
  ],

  episodes: [
    {
      numero: 1,
      titre: 'La Víspera',
      description: 'La veille d’une séance. Deux inconnus, la même nuit, aucun visage.',
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
  ] satisfies Episode[],
} as const;
