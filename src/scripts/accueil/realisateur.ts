/**
 * Le réalisateur de la homepage : il suit le moment qui traverse le milieu de l'écran
 * et règle la table en conséquence (plan de caméra, bougie, lumière).
 *
 * Deux modes, un seul récit :
 * - 3D en direct (appareils capables) ;
 * - photographies de la scène calculées à l'avance, en fondu (réduction des animations,
 *   appareils modestes, WebGL absent). Le scroll reste natif dans les deux cas.
 *
 * Paramètres de travail : ?capture=<plan>[&bougie=...] (rendu des photographies),
 * ?structure (affiche les emplacements d'informations encore vides), ?3d=0|1.
 */
import { estTactile, mouvementReduit, peutAfficher3D } from '../capacites';
import type { Bougie, Plan } from './decor';
import { creerSon } from './son';

type Decor = Awaited<ReturnType<typeof import('./decor').creerDecor>>;

const html = document.documentElement;
html.classList.add('js');
const params = new URLSearchParams(location.search);
if (params.has('structure')) html.classList.add('structure');
const capture = params.get('capture') as Plan | null;
if (capture) html.classList.add('capture');

const scene = document.querySelector<HTMLElement>('[data-scene]');
const toile = document.querySelector<HTMLCanvasElement>('[data-toile]');
const afficheInitiale = document.querySelector<HTMLElement>('[data-affiche]');
const afficheSuivante = document.querySelector<HTMLImageElement>('[data-affiche-suivante]');
const moments = [...document.querySelectorAll<HTMLElement>('main [data-plan]')];

let decor: Decor | null = null;
let modeAffiches = true;
let planCourant: string | null = null;
const son = creerSon();

type Etat = { plan: Plan | 'papier'; bougie: Bougie; jour: number };
function lire(el: HTMLElement): Etat {
  return {
    plan: (el.dataset.plan ?? 'arrivee') as Etat['plan'],
    bougie: (el.dataset.bougie as Bougie) || 'allumee',
    jour: el.dataset.jour ? Number(el.dataset.jour) : 1,
  };
}

// — Photographies (mode sans 3D) —
const portrait = matchMedia('(orientation: portrait)');
function cheminAffiche(plan: Plan) {
  return `/scene/${plan}-${portrait.matches ? 'v' : 'p'}.jpg`;
}
function montrerAffiche(plan: Plan) {
  if (!afficheSuivante || !afficheInitiale) return;
  const src = cheminAffiche(plan);
  if (afficheSuivante.getAttribute('src') === src && afficheSuivante.classList.contains('est-visible')) return;
  const image = new Image();
  image.onload = () => {
    afficheSuivante.src = src;
    afficheSuivante.classList.add('est-visible');
    afficheInitiale.classList.toggle('est-visible', plan === 'arrivee');
  };
  image.src = src;
}

let momentActif: Element | null = null;
function appliquer(el: HTMLElement) {
  const etat = lire(el);
  html.dataset.ambiance = etat.plan === 'papier' ? 'papier' : 'nuit';
  html.dataset.plan = etat.plan;
  // Un seul texte à l'écran : celui du moment en cours.
  const moment = el.closest('.moment') ?? el;
  if (moment !== momentActif) {
    momentActif?.classList.remove('est-actif');
    moment.classList.add('est-actif');
    momentActif = moment;
  }
  if (etat.plan === 'papier') {
    decor?.pause(true);
    return;
  }
  if (etat.plan !== planCourant) son?.surPlan(etat.plan);
  planCourant = etat.plan;
  if (decor) {
    decor.pause(false);
    decor.allerA(etat.plan, etat.bougie, etat.jour);
  } else if (modeAffiches && planCourant !== 'arrivee') {
    montrerAffiche(etat.plan);
  } else if (modeAffiches) {
    afficheSuivante?.classList.remove('est-visible');
    afficheInitiale?.classList.add('est-visible');
  }
}

// — Quel moment traverse le milieu de l'écran ? —
let actif: HTMLElement | undefined;
const observateur = new IntersectionObserver(
  (entrees) => {
    for (const e of entrees) {
      if (e.isIntersecting && e.target !== actif) {
        actif = e.target as HTMLElement;
        appliquer(actif);
      }
    }
  },
  { rootMargin: '-50% 0px -50% 0px' },
);
if (!capture) moments.forEach((m) => observateur.observe(m));

// — La 3D : chargée en différé, jamais bloquante —
function chargerLa3D() {
  if (!toile || !scene) return;
  if (!capture && !peutAfficher3D()) return;
  const premier: Plan = capture ?? ((actif ? lire(actif).plan : 'arrivee') as Plan);
  import('./decor')
    .then(({ creerDecor }) =>
      creerDecor(toile, {
        plan: premier === ('papier' as Plan) ? 'arrivee' : premier,
        leger: !capture && (estTactile() || innerWidth < 700),
        fixe: !!capture || mouvementReduit(),
        // La photographie d'arrivée sort déjà du noir : la 3D la relaie, allumée, dans le même cadre.
        arriveeProgressive: false,
      }),
    )
    .then(async (api) => {
      decor = api;
      modeAffiches = false;
      if (capture) {
        api.allerA(capture, (params.get('bougie') as Bougie) || 'allumee', Number(params.get('jour') ?? 1));
        api.figer();
      } else if (actif) {
        appliquer(actif);
      } else {
        api.allerA('arrivee');
      }
      await api.premiere;
      scene.classList.add('est-3d');
      if (!capture) surveillerFluidite(api);
      if (capture) {
        const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));
        await attendre(400);
        const w = window as unknown as { __pret: boolean; __plan: (p: Plan, b?: Bougie, j?: number) => Promise<void> };
        // Outil de génération des photographies : passe d'un plan à l'autre sans recharger.
        w.__plan = async (p, b = 'allumee', j = 1) => {
          api.allerA(p, b, j);
          api.figer();
          await attendre(700);
        };
        w.__pret = true;
      }
    })
    .catch((erreur) => {
      console.warn('[LA SALA] 3D indisponible : photographies conservées.', erreur);
    });
}

// Si l'appareil n'arrive pas à tenir la 3D (moins de ~20 images/s), on revient aux photographies.
function surveillerFluidite(api: Decor) {
  let images = 0;
  const debut = performance.now();
  const compter = (t: number) => {
    images++;
    if (t - debut < 3000) return void requestAnimationFrame(compter);
    if (document.hidden || images / ((t - debut) / 1000) >= 20) return;
    api.pause(true);
    decor = null;
    modeAffiches = true;
    scene?.classList.remove('est-3d');
    if (actif) appliquer(actif);
  };
  requestAnimationFrame(compter);
}

if (capture) chargerLa3D();
else if (document.readyState === 'complete') requestIdleCallbackSafe(chargerLa3D);
else addEventListener('load', () => requestIdleCallbackSafe(chargerLa3D), { once: true });

function requestIdleCallbackSafe(f: () => void) {
  if ('requestIdleCallback' in window) requestIdleCallback(f, { timeout: 2000 });
  else setTimeout(f, 600);
}
