/**
 * Les chapitres de la nuit projetés dans LA SALA.
 * Chaque heure est à la fois une scène (poétique) et une étape concrète
 * de l'expérience (clarté) : le film explique le fonctionnement.
 */

export type Tonalite = 'chaude' | 'lune' | 'aube';

export type Chapitre = {
  id: string;
  heure: string;
  /** L'heure en toutes lettres, en espagnol (intertitre). */
  heureEs: string;
  titre: string;
  /** Une seule phrase fondatrice par chapitre, au plus. */
  phrase: string;
  /** Ce qui se passe concrètement, en langage clair. */
  concretement: string;
  tonalite: Tonalite;
  /** État du fauteuil voisin pendant ce chapitre. */
  voisin: { regard: boolean; strapontin: 'releve' | 'abaisse'; cle: boolean; rose: boolean };
};

export const chapitres: Chapitre[] = [
  {
    id: 'indice',
    heure: '21:03',
    heureEs: 'veintiuna y tres',
    titre: 'Premier indice',
    phrase: 'Avant son nom, il y a une histoire.',
    concretement:
      'Après votre réservation, vous répondez à quelques questions : vos histoires, vos envies, ce qui compte pour vous. Jamais votre apparence. Aucune photo n’est demandée.',
    tonalite: 'chaude',
    voisin: { regard: false, strapontin: 'releve', cle: true, rose: false },
  },
  {
    id: 'lettre',
    heure: '21:27',
    heureEs: 'veintiuna y veintisiete',
    titre: 'La lettre',
    phrase: 'Quelqu’un a reçu la même lettre que vous.',
    concretement:
      'Dans les jours qui précèdent la séance, vous recevez quelques indices sur la personne que vous allez rencontrer. Pas de photo, pas de nom : des fragments d’histoire.',
    tonalite: 'chaude',
    voisin: { regard: false, strapontin: 'releve', cle: true, rose: false },
  },
  {
    id: 'lieu',
    heure: '21:46',
    heureEs: 'veintiuna y cuarenta y seis',
    titre: 'Le lieu',
    phrase: 'Le lieu vous sera confié la veille.',
    concretement:
      'Toujours un lieu public : un restaurant ou un lieu partenaire, dans le quartier annoncé à la réservation. L’adresse exacte vous est envoyée la veille.',
    tonalite: 'lune',
    voisin: { regard: false, strapontin: 'releve', cle: true, rose: false },
  },
  {
    id: 'rencontre',
    heure: '22:00',
    heureEs: 'veintidós horas',
    titre: 'La rencontre',
    phrase: 'Ce soir, vous ne choisissez personne.',
    concretement:
      'Une table pour deux, un dîner. En face de vous, quelqu’un que vous n’avez pas choisi sur une photo. Nous composons les rencontres à partir de vos réponses, avec attention.',
    tonalite: 'chaude',
    voisin: { regard: false, strapontin: 'releve', cle: true, rose: false },
  },
  {
    id: 'nuit',
    heure: '00:17',
    heureEs: 'medianoche y diecisiete',
    titre: 'La nuit',
    phrase: 'Avant son visage, il y a sa voix.',
    concretement:
      'Vous restez le temps que vous voulez. Vous pouvez partir à tout moment, et notre équipe reste joignable toute la soirée.',
    tonalite: 'chaude',
    voisin: { regard: false, strapontin: 'abaisse', cle: true, rose: false },
  },
  {
    id: 'apres',
    heure: '02:13',
    heureEs: 'dos y trece',
    titre: 'Après',
    phrase: 'Vous ne vous êtes pas choisis. Vous êtes simplement venus.',
    concretement:
      'Le lendemain, une seule question : « Se revoir ? ». Votre réponse reste privée. Si vous dites oui tous les deux, nous vous mettons en relation. Sinon, personne ne sait rien.',
    tonalite: 'aube',
    voisin: { regard: false, strapontin: 'releve', cle: true, rose: true },
  },
];
