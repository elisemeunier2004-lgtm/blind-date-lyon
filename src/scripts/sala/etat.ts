/** L'état de la salle pour une scène donnée (lu depuis les `data-*` des sections). */
export type EtatSalle = {
  scene: string;
  /** Section opaque (papier, velours) : la salle n'est pas visible, le rendu 3D se met en pause. */
  horsSalle: boolean;
  rideau: 'ouvert' | 'ferme';
  regard: 'ecran' | 'voisin';
  lumieres: 'allumees' | 'eteintes';
  tonalite: 'chaude' | 'lune' | 'aube';
  strapontin: 'releve' | 'abaisse';
  cle: boolean;
  rose: boolean;
  /** Contenu de l'écran : le rideau, un écran vide (la question), ou l'heure. */
  ecran: 'rideau' | 'vide' | 'heure';
  heure: string;
  heureEs: string;
};

export function lireEtat(section: HTMLElement, billetDechire: boolean): EtatSalle {
  const d = section.dataset;
  const scene = d.scene ?? 'entree';
  const rideau =
    scene === 'entree' ? (billetDechire ? 'ouvert' : 'ferme') : d.rideau === 'ferme' ? 'ferme' : 'ouvert';

  return {
    scene,
    horsSalle: scene === 'papier',
    rideau,
    regard: d.regard === 'voisin' ? 'voisin' : 'ecran',
    lumieres: d.lumieres === 'allumees' ? 'allumees' : 'eteintes',
    tonalite: d.tonalite === 'lune' || d.tonalite === 'aube' ? d.tonalite : 'chaude',
    strapontin: d.strapontin === 'abaisse' ? 'abaisse' : 'releve',
    cle: d.cle === '1',
    rose: d.rose === '1',
    ecran: scene === 'question' ? 'vide' : rideau === 'ferme' ? 'rideau' : 'heure',
    heure: d.heure ?? '',
    heureEs: d.heureEs ?? '',
  };
}
