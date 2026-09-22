/**
 * Textures générées (aucune image externe) : lin, bois, papier, plâtre, velours,
 * traces sur le verre, tache de vin. Le but n'est pas la perfection mais la
 * matière : irrégularité, grain, usure.
 */
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

// — Bruit —
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function lisse(t: number) {
  return t * t * (3 - 2 * t);
}
export function bruit(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = lisse(x - xi);
  const yf = lisse(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
export function fbm(x: number, y: number, octaves = 4) {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * bruit(x * f, y * f);
    f *= 2;
    amp *= 0.5;
  }
  return v;
}

type Pixel = (u: number, v: number) => [number, number, number, number?];

function peindre(taille: number, pixel: Pixel, couleur = true, repetition = 1): Texture {
  const c = document.createElement('canvas');
  c.width = c.height = taille;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(taille, taille);
  for (let y = 0; y < taille; y++) {
    for (let x = 0; x < taille; x++) {
      const [r, g, b, a = 255] = pixel(x / taille, y / taille);
      const i = (y * taille + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repetition, repetition);
  t.anisotropy = 8;
  if (couleur) t.colorSpace = SRGBColorSpace;
  return t;
}

/** Carte de normales à partir d'une fonction de hauteur (tuilable). */
function normales(taille: number, hauteur: (u: number, v: number) => number, force: number, repetition = 1) {
  const h = new Float32Array(taille * taille);
  for (let y = 0; y < taille; y++) for (let x = 0; x < taille; x++) h[y * taille + x] = hauteur(x / taille, y / taille);
  const at = (x: number, y: number) => h[((y + taille) % taille) * taille + ((x + taille) % taille)];
  return peindre(
    taille,
    (u, v) => {
      const x = Math.round(u * taille);
      const y = Math.round(v * taille);
      const dx = (at(x + 1, y) - at(x - 1, y)) * force;
      const dy = (at(x, y + 1) - at(x, y - 1)) * force;
      const l = Math.hypot(dx, dy, 1);
      return [(-dx / l * 0.5 + 0.5) * 255, (-dy / l * 0.5 + 0.5) * 255, (1 / l) * 255];
    },
    false,
    repetition,
  );
}

const T = Math.PI * 2;

// — Lin : tissage visible, fils irréguliers —
export function linTextures() {
  const F = 64;
  const hauteur = (u: number, v: number) => {
    const irr = fbm(u * 40, v * 3) * 0.6 + fbm(u * 3, v * 40) * 0.6;
    return (Math.sin(u * T * F + irr) * 0.5 + 0.5) * 0.5 + (Math.sin(v * T * F + irr) * 0.5 + 0.5) * 0.5;
  };
  const map = peindre(512, (u, v) => {
    // Fils irréguliers (« slubs ») plutôt qu'une grille : le tissage reste discret.
    const slub = (fbm(u * 3, v * 90) - 0.5) * 14 + (fbm(u * 90, v * 3) - 0.5) * 14;
    const n = fbm(u * 6, v * 6) * 16 + (hauteur(u, v) - 0.5) * 4 + slub;
    return [234 + n * 0.6, 227 + n * 0.6, 214 + n * 0.5];
  }, true, 6);
  const normalMap = normales(512, hauteur, 2.2, 6);
  return { map, normalMap };
}

// — Bois : noyer sombre, veinage —
export function boisTextures(clair = false) {
  const map = peindre(512, (u, v) => {
    const veine = Math.sin((u * 18 + fbm(u * 2, v * 14) * 6) * T) * 0.5 + 0.5;
    const grain = fbm(u * 60, v * 4);
    const k = veine * 0.55 + grain * 0.45;
    const base = clair ? [92, 58, 38] : [46, 27, 20];
    const fonce = clair ? [58, 34, 22] : [22, 12, 9];
    return [base[0] + (fonce[0] - base[0]) * k, base[1] + (fonce[1] - base[1]) * k, base[2] + (fonce[2] - base[2]) * k];
  }, true, 1);
  const roughnessMap = peindre(256, (u, v) => {
    const r = 120 + fbm(u * 30, v * 3) * 90;
    return [r, r, r];
  }, false, 1);
  return { map, roughnessMap };
}

// — Parquet : lames de bois —
export function parquetTextures() {
  const lames = 6;
  const map = peindre(1024, (u, v) => {
    const lame = Math.floor(u * lames);
    const decal = hash(lame, 7) * 3;
    const veine = Math.sin((u * 60 + fbm(u * 4, v * 30 + decal) * 5) * T) * 0.5 + 0.5;
    const joint = Math.min(1, Math.abs(((u * lames) % 1) - 0.5) * 2) > 0.97 ? 0.35 : 1;
    const ton = 0.75 + hash(lame, 3) * 0.35;
    const k = 0.55 + veine * 0.25 + fbm(u * 80, v * 5) * 0.2;
    return [38 * k * ton * joint, 22 * k * ton * joint, 16 * k * ton * joint];
  }, true, 3);
  const roughnessMap = peindre(512, (u, v) => {
    const r = 90 + fbm(u * 20, v * 20) * 120;
    return [r, r, r];
  }, false, 3);
  return { map, roughnessMap };
}

// — Papier coton : fibres —
export function papierTexture() {
  return peindre(512, (u, v) => {
    const fibre = fbm(u * 120, v * 12) * 10 + fbm(u * 12, v * 120) * 10;
    const tache = fbm(u * 3, v * 3) * 10;
    return [238 + fibre - tache, 231 + fibre - tache, 216 + fibre - tache * 1.2];
  });
}

// — Plâtre bordeaux, patiné —
export function platreTextures() {
  const map = peindre(512, (u, v) => {
    const n = fbm(u * 5, v * 5) * 0.6 + fbm(u * 30, v * 30) * 0.4;
    return [34 + n * 22, 9 + n * 7, 13 + n * 8];
  }, true, 2);
  const roughnessMap = peindre(256, (u, v) => {
    const r = 180 + fbm(u * 8, v * 8) * 70;
    return [r, r, r];
  }, false, 2);
  return { map, roughnessMap };
}

// — Velours : variations d'écrasement —
export function veloursTexture() {
  return peindre(256, (u, v) => {
    const n = fbm(u * 8, v * 8) * 0.7 + fbm(u * 40, v * 40) * 0.3;
    return [70 + n * 40, 12 + n * 8, 22 + n * 10];
  }, true, 2);
}

// — Traces sur le verre (rugosité) : doigts, buée légère —
export function tracesVerre() {
  return peindre(256, (u, v) => {
    const traces = Math.max(0, fbm(u * 6 + 3, v * 6) - 0.55) * 400;
    const r = Math.min(255, 12 + traces);
    return [r, r, r];
  }, false, 1);
}

// — Tain de miroir ancien (piqûres) —
export function tainMiroir() {
  return peindre(512, (u, v) => {
    const pique = Math.max(0, fbm(u * 14, v * 14) - 0.6) * 500 + Math.max(0, fbm(u * 60, v * 60) - 0.7) * 300;
    const bord = Math.max(0, 0.08 - Math.min(u, v, 1 - u, 1 - v)) * 2400;
    const r = Math.min(255, 30 + pique + bord);
    return [r, r, r];
  }, false, 1);
}

// — Tache de vin sur la nappe (décalque) —
export function tacheVin() {
  return peindre(256, (u, v) => {
    const dx = u - 0.5;
    const dy = v - 0.5;
    const d = Math.hypot(dx, dy) * 2 + (fbm(u * 8, v * 8) - 0.5) * 0.25;
    const anneau = Math.exp(-Math.pow((d - 0.62) / 0.05, 2));
    const fond = d < 0.62 ? 0.28 : 0;
    const a = Math.min(1, anneau * 0.9 + fond) * (d < 0.75 ? 1 : 0);
    return [120, 30, 45, a * 150];
  });
}
