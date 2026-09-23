/**
 * Le son de LA SALA (Web Audio). Architecture prête, aucun fichier encore :
 * tant que `sons.ts` ne contient que des `null`, rien n'est chargé ni joué,
 * et aucun bouton n'est affiché.
 * Règles : coupé par défaut, activé par un geste, choix mémorisé, pause quand l'onglet est caché.
 */
import { aDesSons, sons, sonsParPlan, type IdSon } from '../../config/sons';

const CLE = 'lasala:son';

export function creerSon() {
  if (!aDesSons) return null;

  let contexte: AudioContext | null = null;
  const tampons = new Map<IdSon, AudioBuffer>();
  const boucles = new Map<IdSon, AudioBufferSourceNode>();
  let actif = false;

  async function charger(id: IdSon) {
    const s = sons[id];
    if (!s.fichier || !contexte || tampons.has(id)) return;
    const r = await fetch(s.fichier);
    tampons.set(id, await contexte.decodeAudioData(await r.arrayBuffer()));
  }

  async function jouer(id: IdSon) {
    const s = sons[id];
    if (!actif || !contexte || !s.fichier) return;
    await charger(id);
    const tampon = tampons.get(id);
    if (!tampon) return;
    const source = contexte.createBufferSource();
    const gain = contexte.createGain();
    gain.gain.value = s.volume;
    source.buffer = tampon;
    source.loop = s.boucle;
    source.connect(gain).connect(contexte.destination);
    source.start();
    if (s.boucle) boucles.set(id, source);
  }

  async function activer() {
    contexte ??= new AudioContext();
    await contexte.resume();
    actif = true;
    try {
      localStorage.setItem(CLE, '1');
    } catch {
      /* navigation privée */
    }
    await jouer('musique');
    await jouer('salle');
  }

  function couper() {
    actif = false;
    boucles.forEach((b) => b.stop());
    boucles.clear();
    try {
      localStorage.setItem(CLE, '0');
    } catch {
      /* navigation privée */
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!contexte) return;
    if (document.hidden) contexte.suspend();
    else if (actif) contexte.resume();
  });

  return {
    activer,
    couper,
    get actif() {
      return actif;
    },
    surPlan(plan: string) {
      const id = sonsParPlan[plan];
      if (id) void jouer(id);
    },
  };
}
