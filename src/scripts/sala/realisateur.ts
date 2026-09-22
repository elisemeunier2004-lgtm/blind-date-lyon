/**
 * Le réalisateur : il observe quelle scène du récit est à l'écran
 * et met la salle dans l'état correspondant (affiche CSS + 3D si disponible).
 *
 * Le scroll reste natif : on suit le défilement, on ne le détourne jamais.
 */
import { peutAfficher3D, mouvementReduit } from './capacites';
import { lireEtat, type EtatSalle } from './etat';
import { installerBillet } from './billet';

type Salle3D = {
  appliquer(etat: EtatSalle): void;
  progression(p: number): void;
  figer(): void;
};

const salle = document.querySelector<HTMLElement>('[data-salle]');
const toile = document.querySelector<HTMLCanvasElement>('[data-salle-toile]');
const heureCourante = document.querySelector<HTMLElement>('[data-heure-courante]');
const ecranHeure = document.querySelector<HTMLElement>('[data-ecran-heure]');
const ecranEs = document.querySelector<HTMLElement>('[data-ecran-es]');
const sections = [...document.querySelectorAll<HTMLElement>('main [data-scene]')];

let billetDechire = false;
let sectionActive: HTMLElement | undefined = sections[0];
let etatActif: EtatSalle | undefined;
let salle3d: Salle3D | undefined;

function appliquer(section: HTMLElement) {
  if (!salle) return;
  const etat = lireEtat(section, billetDechire);
  etatActif = etat;

  document.documentElement.dataset.scene = etat.scene;
  salle.dataset.rideau = etat.rideau;
  salle.dataset.regard = etat.regard;
  salle.dataset.lumieres = etat.lumieres;
  salle.dataset.tonalite = etat.tonalite;
  salle.dataset.strapontin = etat.strapontin;

  if (etat.heure && heureCourante) heureCourante.textContent = etat.heure;
  if (ecranHeure && ecranEs) {
    const vide = etat.ecran === 'vide';
    ecranHeure.textContent = vide ? '' : etat.heure;
    ecranEs.textContent = vide ? '' : etat.heureEs;
  }

  salle3d?.appliquer(etat);
}

// — Quelle scène traverse le milieu de l'écran ? —
const observateur = new IntersectionObserver(
  (entrees) => {
    for (const e of entrees) {
      if (e.isIntersecting && e.target !== sectionActive) {
        sectionActive = e.target as HTMLElement;
        appliquer(sectionActive);
      }
    }
  },
  { rootMargin: '-50% 0px -50% 0px' },
);
sections.forEach((s) => observateur.observe(s));

// — Progression dans la scène active (léger travelling de la caméra 3D) —
let rafProgression = 0;
function mesurerProgression() {
  rafProgression = 0;
  if (!salle3d || !sectionActive) return;
  const r = sectionActive.getBoundingClientRect();
  const p = (innerHeight / 2 - r.top) / Math.max(r.height, 1);
  salle3d.progression(Math.min(1, Math.max(0, p)));
}
addEventListener(
  'scroll',
  () => {
    if (!rafProgression) rafProgression = requestAnimationFrame(mesurerProgression);
  },
  { passive: true },
);

// — Le billet : le premier geste —
installerBillet({
  surEntree(dejaVenu) {
    billetDechire = true;
    if (sectionActive) appliquer(sectionActive);
    if (dejaVenu) return;
    const question = document.getElementById('question');
    setTimeout(
      () => question?.scrollIntoView({ behavior: mouvementReduit() ? 'auto' : 'smooth' }),
      mouvementReduit() ? 0 : 900,
    );
  },
});

if (sectionActive) appliquer(sectionActive);

// — La 3D : chargée en différé, jamais bloquante —
function chargerLa3D() {
  if (!toile || !salle || !peutAfficher3D()) return;
  import('./salle3d')
    .then(({ creerSalle }) => creerSalle(toile))
    .then((api) => {
      salle3d = api;
      if (etatActif) api.appliquer(etatActif);
      mesurerProgression();
      salle.classList.add('est-3d');
      if (new URLSearchParams(location.search).has('debug')) {
        (window as unknown as { __sala: unknown }).__sala = {
          scene(id: string) {
            const s = document.querySelector<HTMLElement>(`main [data-scene="${id}"]`);
            if (s) {
              billetDechire = true;
              appliquer(s);
              api.figer();
            }
          },
        };
      }
    })
    .catch((erreur) => {
      // L'affiche CSS reste en place : l'expérience est complète sans 3D.
      console.warn('[LA SALA] 3D indisponible, affiche conservée.', erreur);
    });
}

const lancer = () =>
  'requestIdleCallback' in window
    ? requestIdleCallback(chargerLa3D, { timeout: 2500 })
    : setTimeout(chargerLa3D, 800);

if (document.readyState === 'complete') lancer();
else addEventListener('load', lancer, { once: true });
