/**
 * Le billet : déchirer le talon pour entrer dans la salle.
 * - toucher / cliquer / clavier : le talon est un vrai <button> ;
 * - glisser le talon vers la droite : il se détache.
 * Les visiteurs qui reviennent retrouvent leur billet déjà déchiré.
 */
const CLE_MEMOIRE = 'lacita:billet-dechire';

function lireMemoire(): boolean {
  try {
    return localStorage.getItem(CLE_MEMOIRE) === '1';
  } catch {
    return false;
  }
}

function ecrireMemoire() {
  try {
    localStorage.setItem(CLE_MEMOIRE, '1');
  } catch {
    /* navigation privée : sans importance */
  }
}

export function installerBillet({ surEntree }: { surEntree: (dejaVenu: boolean) => void }) {
  const billet = document.querySelector<HTMLElement>('[data-billet]');
  const talon = billet?.querySelector<HTMLButtonElement>('[data-billet-talon]');
  const retour = document.querySelector<HTMLElement>('[data-retour]');
  if (!billet || !talon) return;

  let dechire = false;

  const dechirer = (dejaVenu = false) => {
    if (dechire) return;
    dechire = true;
    talon.style.transform = '';
    billet.classList.add('est-dechire');
    if (!dejaVenu) ecrireMemoire();
    surEntree(dejaVenu);
  };

  if (lireMemoire()) {
    if (retour) retour.hidden = false;
    dechirer(true);
    return;
  }

  // Glisser pour déchirer (le clic reste le geste principal).
  let depart: number | null = null;
  let glisse = false;
  talon.addEventListener('pointerdown', (e) => {
    depart = e.clientX;
    glisse = false;
  });
  talon.addEventListener('pointermove', (e) => {
    if (depart === null || dechire) return;
    const dx = Math.max(0, e.clientX - depart);
    if (dx > 6) glisse = true;
    talon.style.transform = `translateX(${Math.min(dx, 80)}px) rotate(${Math.min(dx, 80) / 8}deg)`;
    if (dx > 56) dechirer();
  });
  const relacher = () => {
    depart = null;
    if (!dechire) talon.style.transform = '';
  };
  talon.addEventListener('pointerup', relacher);
  talon.addEventListener('pointercancel', relacher);
  talon.addEventListener('click', () => {
    if (!glisse) dechirer();
    glisse = false;
  });
}
