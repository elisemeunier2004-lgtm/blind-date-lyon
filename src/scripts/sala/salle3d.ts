/**
 * LA SALA — la salle de cinéma en 3D (three.js).
 *
 * Principes (VISUAL WORLD BIBLE V2, §7) :
 * - une caméra subjective, assise, qui ne quitte jamais sa place ;
 * - la lumière et un seul détail qui change (la place voisine) font le récit ;
 * - aucun objet ne tourne pour se montrer, aucune caméra libre ;
 * - budget : particules < 1 000, pixel ratio plafonné, rendu en pause hors de la salle.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  BufferAttribute,
  BufferGeometry,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  FogExp2,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { EtatSalle } from './etat';
import { estTactile } from './capacites';

// — Palette (bible V2) —
const C = {
  noche: '#08070a',
  terciopelo: '#3a0a12',
  burdeos: '#5b111e',
  rojoRosa: '#9b1b2c',
  marfil: '#f1e9dc',
  champan: '#d8c39b',
  oroViejo: '#a8844e',
};

// — Géométrie de la salle (mètres) —
const ECRAN = { x: 0, y: 3.35, z: -14, largeur: 11, hauteur: 11 / 1.85 };
const PROJECTEUR = new Vector3(0, 5.6, 7);
const PAS_SIEGE = 0.64;
const PAS_RANG = 1.25;
const VOISIN = new Vector3(PAS_SIEGE, 0, 0);

const approcher = (actuel: number, cible: number, vitesse: number, dt: number) =>
  actuel + (cible - actuel) * (1 - Math.exp(-vitesse * dt));

export async function creerSalle(toile: HTMLCanvasElement) {
  const tactile = estTactile();

  const renderer = new WebGLRenderer({
    canvas: toile,
    antialias: !tactile,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, tactile ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(C.noche);

  const scene = new Scene();
  scene.fog = new FogExp2(0x0a0305, 0.045);

  const camera = new PerspectiveCamera(45, 1, 0.05, 60);

  // ——— Matières ———
  const velours = new MeshPhysicalMaterial({
    color: C.burdeos,
    roughness: 0.92,
    sheen: 1,
    sheenColor: new Color('#c9505f'),
    sheenRoughness: 0.45,
  });
  const veloursRideau = new MeshPhysicalMaterial({
    color: '#6a1522',
    roughness: 0.88,
    sheen: 1,
    sheenColor: new Color('#e07a86'),
    sheenRoughness: 0.4,
    side: DoubleSide,
  });
  const boisSombre = new MeshStandardMaterial({ color: '#1a0b0a', roughness: 0.55 });
  const murs = new MeshStandardMaterial({ color: '#16050a', roughness: 1 });
  const laiton = new MeshStandardMaterial({
    color: '#c9a064',
    metalness: 0.65,
    roughness: 0.38,
    emissive: new Color('#2a1a08'),
  });

  // ——— L'architecture ———
  const sol = new Mesh(new PlaneGeometry(20, 30), murs);
  sol.rotation.x = -Math.PI / 2;
  sol.position.set(0, -2.2, -6);
  scene.add(sol);

  for (const cote of [-1, 1]) {
    const mur = new Mesh(new PlaneGeometry(26, 11), murs);
    mur.rotation.y = -cote * (Math.PI / 2);
    mur.position.set(cote * 8.2, 3.2, -4);
    scene.add(mur);
  }
  const plafond = new Mesh(new PlaneGeometry(20, 26), murs);
  plafond.rotation.x = Math.PI / 2;
  plafond.position.set(0, 8.4, -4);
  scene.add(plafond);

  // Le cadre de scène (proscenium) : velours très sombre.
  const cadreMat = new MeshStandardMaterial({ color: '#120306', roughness: 1 });
  for (const cote of [-1, 1]) {
    const pilier = new Mesh(new BoxGeometry(2.2, 11, 0.6), cadreMat);
    pilier.position.set(cote * 7.3, 3.2, -13.3);
    scene.add(pilier);
  }

  // ——— L'écran ———
  const toileEcran = document.createElement('canvas');
  toileEcran.width = 2048;
  toileEcran.height = Math.round(2048 / 1.85);
  const ctx = toileEcran.getContext('2d')!;
  const textureEcran = new CanvasTexture(toileEcran);
  textureEcran.colorSpace = SRGBColorSpace;
  const matEcran = new MeshBasicMaterial({ map: textureEcran, toneMapped: false, color: 0x000000 });
  const ecran = new Mesh(new PlaneGeometry(ECRAN.largeur, ECRAN.hauteur), matEcran);
  ecran.position.set(ECRAN.x, ECRAN.y, ECRAN.z);
  scene.add(ecran);

  await Promise.allSettled([
    document.fonts.load(`italic 400 120px "Bodoni Moda Variable"`),
    document.fonts.load(`500 40px "Jost Variable"`),
  ]);

  function dessinerEcran(etat: EtatSalle) {
    const w = toileEcran.width;
    const h = toileEcran.height;
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Fond selon la tonalité de la scène.
    if (etat.tonalite === 'lune') {
      const g = ctx.createRadialGradient(w * 0.72, h * 0.3, 10, w * 0.72, h * 0.3, w * 0.7);
      g.addColorStop(0, '#2a2f3a');
      g.addColorStop(1, '#07080c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // La lune, photographique et discrète.
      const lune = ctx.createRadialGradient(w * 0.74, h * 0.28, 0, w * 0.74, h * 0.28, 120);
      lune.addColorStop(0, 'rgba(232,230,222,0.95)');
      lune.addColorStop(0.55, 'rgba(210,208,200,0.85)');
      lune.addColorStop(0.62, 'rgba(210,208,200,0.12)');
      lune.addColorStop(1, 'rgba(210,208,200,0)');
      ctx.fillStyle = lune;
      ctx.fillRect(0, 0, w, h);
      // Étoiles très fines.
      ctx.fillStyle = 'rgba(241,233,220,0.7)';
      for (let i = 0; i < 70; i++) {
        const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * w;
        const y = (Math.sin(i * 47.3 + 2) * 0.5 + 0.5) * h * 0.8;
        ctx.fillRect(x, y, 2, 2);
      }
    } else if (etat.tonalite === 'aube') {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#223047');
      g.addColorStop(0.6, '#161a26');
      g.addColorStop(1, '#0d0a0c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createRadialGradient(w / 2, h * 0.45, 20, w / 2, h * 0.5, w * 0.62);
      g.addColorStop(0, '#2a1a12');
      g.addColorStop(1, '#0b0807');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    if (etat.ecran === 'heure' && etat.heure) {
      // Filet or vieux, comme un carton de film muet (sans ornement).
      ctx.strokeStyle = 'rgba(168,132,78,0.55)';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, w - 120, h - 120);

      ctx.fillStyle = C.marfil;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `italic 400 430px "Bodoni Moda Variable", "Bodoni Moda", serif`;
      ctx.fillText(etat.heure, w / 2, h * 0.6);

      if (etat.heureEs) {
        ctx.fillStyle = C.champan;
        ctx.font = `500 44px "Jost Variable", "Jost", sans-serif`;
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '16px';
        ctx.fillText(etat.heureEs.toUpperCase(), w / 2, h * 0.76);
      }
    }
    ctx.restore();
    textureEcran.needsUpdate = true;
  }

  // ——— Le rideau (deux pans, plis cousus dans la géométrie) ———
  function panDeRideau(sens: 1 | -1) {
    const largeur = 6.7;
    const geo = new PlaneGeometry(largeur, 8.6, tactile ? 90 : 160, 1);
    geo.translate((sens * largeur) / 2, 0, 0); // bord extérieur en x = 0
    const pos = geo.attributes.position as BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, 0.2 * Math.sin(x * 11.5) + 0.05 * Math.sin(x * 29 + 1.3));
    }
    geo.computeVertexNormals();
    const pan = new Mesh(geo, veloursRideau);
    const groupe = new Group();
    groupe.add(pan);
    groupe.position.set(-sens * 6.7, ECRAN.y + 0.35, ECRAN.z + 0.35);
    scene.add(groupe);
    return groupe;
  }
  const rideauG = panDeRideau(1);
  const rideauD = panDeRideau(-1);

  // Le lambrequin (bandeau du haut).
  const geoLambrequin = new PlaneGeometry(15, 1.5, 120, 1);
  {
    const p = geoLambrequin.attributes.position as BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setZ(i, 0.12 * Math.sin(p.getX(i) * 9));
    geoLambrequin.computeVertexNormals();
  }
  const lambrequin = new Mesh(geoLambrequin, veloursRideau);
  lambrequin.position.set(0, ECRAN.y + ECRAN.hauteur / 2 + 1.25, ECRAN.z + 0.7);
  scene.add(lambrequin);

  // ——— Les fauteuils (instanciés) ———
  const geoDossier = new RoundedBoxGeometry(0.56, 0.74, 0.12, 3, 0.05);
  const geoAssise = new RoundedBoxGeometry(0.52, 0.11, 0.46, 3, 0.04);
  const geoAccoudoir = new RoundedBoxGeometry(0.07, 0.38, 0.5, 2, 0.025);

  const placements: { x: number; y: number; z: number }[] = [];
  const rangs = 7;
  for (let r = 0; r < rangs; r++) {
    const z = -r * PAS_RANG;
    const y = -r * 0.3;
    for (let i = -10; i <= 10; i++) {
      if (r === 0 && (i === 0 || i === 1)) continue; // ma place (0) et la place voisine (1)
      placements.push({ x: i * PAS_SIEGE, y, z });
    }
  }
  const dossiers = new InstancedMesh(geoDossier, velours, placements.length);
  const assises = new InstancedMesh(geoAssise, velours, placements.length);
  const accoudoirs = new InstancedMesh(geoAccoudoir, boisSombre, placements.length + 2);
  const o = new Object3D();
  placements.forEach((p, i) => {
    o.position.set(p.x, p.y + 0.86, p.z + 0.2);
    o.rotation.set(-0.12, 0, 0);
    o.updateMatrix();
    dossiers.setMatrixAt(i, o.matrix);
    // Dans la salle vide, les assises sont relevées (strapontins).
    o.position.set(p.x, p.y + 0.62, p.z + 0.1);
    o.rotation.set(1.35, 0, 0);
    o.updateMatrix();
    assises.setMatrixAt(i, o.matrix);
    o.position.set(p.x - PAS_SIEGE / 2, p.y + 0.58, p.z - 0.02);
    o.rotation.set(0, 0, 0);
    o.updateMatrix();
    accoudoirs.setMatrixAt(i, o.matrix);
  });
  // Les accoudoirs de ma place et de la place voisine.
  [PAS_SIEGE / 2, PAS_SIEGE * 1.5].forEach((x, k) => {
    o.position.set(x, 0.58, -0.02);
    o.rotation.set(0, 0, 0);
    o.updateMatrix();
    accoudoirs.setMatrixAt(placements.length + k, o.matrix);
  });
  scene.add(dossiers, assises, accoudoirs);

  // ——— La place voisine : réservée, jamais abandonnée ———
  const voisin = new Group();
  voisin.position.copy(VOISIN);
  const dossierVoisin = new Mesh(geoDossier, velours);
  dossierVoisin.position.set(0, 0.86, 0.2);
  dossierVoisin.rotation.x = -0.12;
  voisin.add(dossierVoisin);

  const pivotAssise = new Group();
  pivotAssise.position.set(0, 0.46, 0.18);
  const assiseVoisin = new Mesh(geoAssise, velours);
  assiseVoisin.position.set(0, 0, -0.23);
  pivotAssise.add(assiseVoisin);
  voisin.add(pivotAssise);

  // Le carton « PLACE 18 · RÉSERVÉE ».
  const toileCarton = document.createElement('canvas');
  toileCarton.width = 512;
  toileCarton.height = 300;
  {
    const c = toileCarton.getContext('2d')!;
    c.fillStyle = C.marfil;
    c.fillRect(0, 0, 512, 300);
    c.strokeStyle = C.burdeos;
    c.lineWidth = 3;
    c.strokeRect(18, 18, 476, 264);
    c.textAlign = 'center';
    c.fillStyle = C.burdeos;
    c.font = `500 64px "Jost Variable", sans-serif`;
    (c as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '14px';
    c.fillText('PLACE 18', 256, 140);
    c.fillStyle = '#5e554f';
    c.font = `italic 400 60px "Bodoni Moda Variable", serif`;
    (c as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '0px';
    c.fillText('réservée', 256, 225);
  }
  const texCarton = new CanvasTexture(toileCarton);
  texCarton.colorSpace = SRGBColorSpace;
  const carton = new Mesh(
    new PlaneGeometry(0.24, 0.14),
    new MeshStandardMaterial({ map: texCarton, roughness: 0.9 }),
  );
  // Posé contre la face avant du dossier (il en suit l'inclinaison).
  carton.position.set(0, 0.15, -0.064);
  carton.rotation.y = Math.PI;
  dossierVoisin.add(carton);
  scene.add(voisin);

  // La clé ancienne, posée sur l'accoudoir.
  const cle = new Group();
  {
    const anneau = new Mesh(new TorusGeometry(0.03, 0.007, 10, 28), laiton);
    const tige = new Mesh(new CylinderGeometry(0.0055, 0.0055, 0.15, 10), laiton);
    tige.rotation.z = Math.PI / 2;
    tige.position.x = 0.105;
    const panneton = new Mesh(new BoxGeometry(0.018, 0.03, 0.006), laiton);
    panneton.position.set(0.165, -0.017, 0);
    cle.add(anneau, tige, panneton);
    cle.rotation.set(-Math.PI / 2, 0, 1.2);
    cle.position.set(PAS_SIEGE / 2 - 0.05, 0.78, -0.12);
    cle.scale.setScalar(0.001);
  }
  scene.add(cle);

  // La rose, une seule tige, posée à côté de la clé.
  const rose = new Group();
  {
    const matPetale = new MeshStandardMaterial({ color: '#8a1426', roughness: 0.55, side: DoubleSide });
    const tige = new Mesh(
      new CylinderGeometry(0.0035, 0.0035, 0.26, 6),
      new MeshStandardMaterial({ color: '#1d2618', roughness: 0.8 }),
    );
    tige.rotation.z = Math.PI / 2;
    tige.position.x = -0.13;
    rose.add(tige);
    const bouton = new Group();
    // Trois couronnes de pétales : serrées au cœur, qui s'ouvrent vers l'extérieur.
    const couronnes = [
      { n: 3, r: 0.016, ouverture: 0.15, arc: 0.55 },
      { n: 5, r: 0.022, ouverture: 0.45, arc: 0.5 },
      { n: 6, r: 0.028, ouverture: 0.85, arc: 0.42 },
    ];
    couronnes.forEach(({ n, r, ouverture, arc }, k) => {
      for (let i = 0; i < n; i++) {
        const geo = new SphereGeometry(r, 12, 8, -Math.PI * 0.42, Math.PI * 0.84, 0, Math.PI * arc);
        const petale = new Mesh(geo, matPetale);
        const pivot = new Group();
        pivot.rotation.y = (i / n) * Math.PI * 2 + k * 0.6;
        petale.rotation.x = ouverture;
        petale.position.z = r * 0.35;
        pivot.add(petale);
        bouton.add(pivot);
      }
    });
    const sepale = new Mesh(
      new SphereGeometry(0.012, 8, 6),
      new MeshStandardMaterial({ color: '#1d2618', roughness: 0.8 }),
    );
    sepale.scale.set(1.3, 0.5, 1.3);
    sepale.position.y = -0.008;
    bouton.add(sepale);
    bouton.rotation.z = -Math.PI / 2;
    rose.add(bouton);
    // Sur l'assise relevée de la place voisine, appuyée contre elle.
    rose.position.set(PAS_SIEGE - 0.02, 0.66, -0.04);
    rose.rotation.set(0, Math.PI / 2 + 0.35, 0.9);
    rose.scale.setScalar(0.001);
  }
  scene.add(rose);

  // ——— Le faisceau du projecteur ———
  const versEcran = new Vector3(ECRAN.x, ECRAN.y, ECRAN.z).sub(PROJECTEUR);
  const longueur = versEcran.length();
  const geoFaisceau = new CylinderGeometry(0.06, 3.1, longueur, 48, 1, true);
  const matFaisceau = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: {
      uIntensite: { value: 0 },
      uTemps: { value: 0 },
      uCouleur: { value: new Color('#f1d3a2') },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormale;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vec4 p = modelMatrix * vec4(position, 1.0);
        vPosition = p.xyz;
        vNormale = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * p;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensite;
      uniform float uTemps;
      uniform vec3 uCouleur;
      varying vec2 vUv;
      varying vec3 vNormale;
      varying vec3 vPosition;
      void main() {
        vec3 vue = normalize(cameraPosition - vPosition);
        float bord = pow(abs(dot(normalize(vNormale), vue)), 2.2);
        float le_long = smoothstep(0.0, 0.25, vUv.y) * (0.35 + 0.65 * vUv.y);
        float scintille = 0.92 + 0.08 * sin(uTemps * 23.0) * sin(uTemps * 7.0);
        gl_FragColor = vec4(uCouleur, bord * le_long * uIntensite * scintille * 0.16);
      }
    `,
  });
  const faisceau = new Mesh(geoFaisceau, matFaisceau);
  faisceau.position.copy(PROJECTEUR).addScaledVector(versEcran, 0.5);
  faisceau.quaternion.copy(
    new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), versEcran.clone().normalize().negate()),
  );
  scene.add(faisceau);

  // ——— La poussière dans le faisceau ———
  const nbPoussieres = tactile ? 420 : 900;
  const posPoussieres = new Float32Array(nbPoussieres * 3);
  const phases = new Float32Array(nbPoussieres);
  const dir = versEcran.clone().normalize();
  const perp1 = new Vector3(1, 0, 0);
  const perp2 = new Vector3().crossVectors(dir, perp1).normalize();
  for (let i = 0; i < nbPoussieres; i++) {
    const t = 0.08 + Math.random() * 0.85;
    const rayon = (0.06 + 3.04 * t) * Math.sqrt(Math.random()) * 0.9;
    const a = Math.random() * Math.PI * 2;
    const p = PROJECTEUR.clone()
      .addScaledVector(versEcran, t)
      .addScaledVector(perp1, Math.cos(a) * rayon)
      .addScaledVector(perp2, Math.sin(a) * rayon);
    posPoussieres.set([p.x, p.y, p.z], i * 3);
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geoPoussieres = new BufferGeometry();
  geoPoussieres.setAttribute('position', new BufferAttribute(posPoussieres, 3));
  const toilePoussiere = document.createElement('canvas');
  toilePoussiere.width = toilePoussiere.height = 64;
  {
    const c = toilePoussiere.getContext('2d')!;
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
  }
  const matPoussieres = new PointsMaterial({
    size: 0.035,
    map: new CanvasTexture(toilePoussiere),
    color: '#f2d6a8',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const poussieres = new Points(geoPoussieres, matPoussieres);
  scene.add(poussieres);
  const basePoussieres = posPoussieres.slice();

  // ——— Les lumières ———
  scene.add(new AmbientLight(0x2a1015, 0.35));

  const lumiereEcran = new SpotLight(0xe9c9a0, 0, 32, 0.95, 1, 1.6);
  lumiereEcran.position.set(0, ECRAN.y, ECRAN.z + 0.6);
  lumiereEcran.target.position.set(0, 0, 2);
  scene.add(lumiereEcran, lumiereEcran.target);

  const rampe = new SpotLight(0xffb070, 0, 16, 0.7, 0.9, 1.4);
  rampe.position.set(0, -0.6, ECRAN.z + 3.2);
  rampe.target.position.set(0, ECRAN.y + 1.5, ECRAN.z + 0.3);
  scene.add(rampe, rampe.target);

  const lumiereVoisin = new SpotLight(0xf3d2a4, 0, 6, 0.42, 0.85, 1.4);
  lumiereVoisin.position.set(0.2, 3.2, -1.6);
  lumiereVoisin.target.position.set(VOISIN.x, 0.7, 0.05);
  scene.add(lumiereVoisin, lumiereVoisin.target);

  const lumieresSalle = new HemisphereLight(0xffe2b8, 0x2a0a10, 0);
  scene.add(lumieresSalle);
  const appliques: PointLight[] = [];
  for (const x of [-7.9, 7.9]) {
    for (const z of [-9, -3.5, 1.5]) {
      const l = new PointLight(0xffc98a, 0, 7, 1.6);
      l.position.set(x, 3.4, z);
      scene.add(l);
      appliques.push(l);
      const globe = new Mesh(
        new SphereGeometry(0.09, 12, 8),
        new MeshBasicMaterial({ color: '#ffd9a6', transparent: true, opacity: 0.25 }),
      );
      globe.position.copy(l.position);
      scene.add(globe);
    }
  }

  // ——— État animé (valeurs lissées) ———
  const cible = {
    rideau: 0,
    regard: 0,
    lumieres: 0,
    ecran: 0,
    strapontin: 1.35,
    cle: 0,
    rose: 0,
    progression: 0,
    couleurEcran: new Color(0xe9c9a0),
  };
  const actuel = { ...cible, couleurEcran: cible.couleurEcran.clone() };
  let etatCourant: EtatSalle | undefined;
  let aRedessiner = false;
  let enPause = false;

  const couleurs = {
    chaude: new Color(0xe9c9a0),
    lune: new Color(0xb9c3d6),
    aube: new Color(0x93a6c6),
  };

  function appliquer(etat: EtatSalle) {
    const precedent = etatCourant;
    etatCourant = etat;
    enPause = etat.horsSalle;
    if (!enPause) demarrer();

    cible.rideau = etat.rideau === 'ouvert' ? 1 : 0;
    cible.regard = etat.regard === 'voisin' ? 1 : 0;
    cible.lumieres = etat.lumieres === 'allumees' ? 1 : 0;
    cible.strapontin = etat.strapontin === 'abaisse' ? 0.02 : 1.35;
    cible.cle = etat.cle ? 1 : 0;
    cible.rose = etat.rose ? 1 : 0;
    cible.couleurEcran.copy(couleurs[etat.tonalite]);

    const contenuChange =
      !precedent ||
      precedent.heure !== etat.heure ||
      precedent.ecran !== etat.ecran ||
      precedent.tonalite !== etat.tonalite;
    if (contenuChange) {
      if (!precedent) {
        dessinerEcran(etat);
        cible.ecran = etat.ecran === 'rideau' ? 0.4 : 1;
      } else {
        aRedessiner = true;
        cible.ecran = 0; // fondu au noir, puis on change la bobine
      }
    } else {
      cible.ecran = etat.ecran === 'vide' ? 0.35 : etat.ecran === 'rideau' ? 0.4 : 1;
    }
  }

  function progression(p: number) {
    cible.progression = p;
  }

  /** Débogage (?debug) : saute directement à l'état cible, sans transition. */
  function figer() {
    if (aRedessiner && etatCourant) {
      dessinerEcran(etatCourant);
      aRedessiner = false;
      cible.ecran = etatCourant.ecran === 'vide' ? 0.35 : etatCourant.ecran === 'rideau' ? 0.4 : 1;
    }
    Object.assign(actuel, { ...cible, couleurEcran: cible.couleurEcran.clone() });
    demarrer();
  }

  // ——— Caméra : assise, elle ne quitte jamais sa place ———
  const posEcran = new Vector3();
  const visEcran = new Vector3();
  const posVoisin = new Vector3();
  const visVoisin = new Vector3();
  const pos = new Vector3();
  const vise = new Vector3();

  function cadrer() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    const portrait = h > w;
    camera.aspect = w / h;
    camera.fov = portrait ? 66 : 44;
    camera.updateProjectionMatrix();
    // En portrait, l'écran monte dans le tiers haut pour laisser respirer le texte.
    posEcran.set(0.0, 1.16, 0.05);
    visEcran.set(0, portrait ? 1.35 : 2.55, ECRAN.z);
    posVoisin.set(portrait ? -0.55 : -0.7, 1.25, portrait ? -1.1 : -1.3);
    visVoisin.set(VOISIN.x - 0.05, portrait ? 0.5 : 0.72, 0.12);
  }
  cadrer();
  addEventListener('resize', cadrer);

  // ——— Boucle de rendu ———
  let raf = 0;
  let dernier = performance.now();
  let temps = 0;

  function image(maintenant: number) {
    raf = 0;
    const dt = Math.min(0.05, (maintenant - dernier) / 1000);
    dernier = maintenant;
    temps += dt;

    actuel.rideau = approcher(actuel.rideau, cible.rideau, 0.9, dt);
    actuel.regard = approcher(actuel.regard, cible.regard, 1.1, dt);
    actuel.lumieres = approcher(actuel.lumieres, cible.lumieres, 0.8, dt);
    actuel.strapontin = approcher(actuel.strapontin, cible.strapontin, 1.6, dt);
    actuel.cle = approcher(actuel.cle, cible.cle, 1.4, dt);
    actuel.rose = approcher(actuel.rose, cible.rose, 1.2, dt);
    actuel.progression = approcher(actuel.progression, cible.progression, 3, dt);
    actuel.couleurEcran.lerp(cible.couleurEcran, 1 - Math.exp(-2 * dt));
    actuel.ecran = approcher(actuel.ecran, cible.ecran, aRedessiner ? 5 : 1.8, dt);
    if (aRedessiner && actuel.ecran < 0.04 && etatCourant) {
      dessinerEcran(etatCourant);
      aRedessiner = false;
      cible.ecran = etatCourant.ecran === 'vide' ? 0.35 : 1;
    }

    // Rideau : les pans se retirent vers les côtés en se resserrant.
    const s = MathUtils.lerp(1, 0.17, actuel.rideau);
    rideauG.scale.x = s;
    rideauD.scale.x = s;
    rideauG.rotation.z = Math.sin(temps * 0.6) * 0.002;
    rideauD.rotation.z = -Math.sin(temps * 0.6 + 1) * 0.002;

    // Écran : luminosité + léger scintillement de projection.
    const scint = 0.96 + 0.04 * Math.sin(temps * 31) * Math.sin(temps * 5.3);
    const lum = actuel.ecran * actuel.rideau * scint;
    matEcran.color.setScalar(Math.max(0.02, lum));

    matFaisceau.uniforms.uIntensite.value = actuel.rideau * (0.35 + 0.65 * actuel.ecran) * (1 - actuel.lumieres * 0.7);
    matFaisceau.uniforms.uTemps.value = temps;
    matPoussieres.opacity = 0.55 * actuel.rideau * (1 - actuel.lumieres * 0.5);

    lumiereEcran.color.copy(actuel.couleurEcran);
    lumiereEcran.intensity = 40 * lum;
    rampe.intensity = 26 * (1 - actuel.rideau) + 2;
    lumiereVoisin.intensity = 6 * actuel.regard + 1.2 * actuel.lumieres;
    lumieresSalle.intensity = 0.9 * actuel.lumieres;
    for (const a of appliques) a.intensity = 6 * actuel.lumieres;

    pivotAssise.rotation.x = actuel.strapontin;
    cle.scale.setScalar(Math.max(0.001, actuel.cle * 0.8));
    rose.scale.setScalar(Math.max(0.001, actuel.rose * 1.5));

    // Poussière : dérive lente.
    const pp = geoPoussieres.attributes.position as BufferAttribute;
    for (let i = 0; i < nbPoussieres; i++) {
      const ph = phases[i];
      pp.setXYZ(
        i,
        basePoussieres[i * 3] + Math.sin(temps * 0.15 + ph) * 0.12,
        basePoussieres[i * 3 + 1] + Math.sin(temps * 0.11 + ph * 1.7) * 0.1,
        basePoussieres[i * 3 + 2] + Math.cos(temps * 0.09 + ph) * 0.12,
      );
    }
    pp.needsUpdate = true;

    // Caméra : écran ↔ voisin, léger travelling dans la scène, respiration.
    const r = MathUtils.smootherstep(actuel.regard, 0, 1);
    pos.lerpVectors(posEcran, posVoisin, r);
    vise.lerpVectors(visEcran, visVoisin, r);
    pos.z -= actuel.progression * 0.35 * (1 - r);
    pos.y += Math.sin(temps * 0.5) * 0.004;
    camera.position.copy(pos);
    camera.lookAt(vise);

    renderer.render(scene, camera);
    if (!enPause && !document.hidden) raf = requestAnimationFrame(image);
  }

  function demarrer() {
    if (!raf && !document.hidden) {
      dernier = performance.now();
      raf = requestAnimationFrame(image);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !enPause) demarrer();
  });

  demarrer();

  return { appliquer, progression, figer };
}
