/**
 * Les objets de la table. Chaque objet est construit à partir d'un profil réel
 * (tour, découpe, drapé) plutôt que de primitives brutes, et reçoit une
 * imperfection : rien n'est parfaitement droit, neuf ou aligné.
 */
import {
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  CapsuleGeometry,
  AdditiveBlending,
  ShaderMaterial,
  type Material,
  type BufferGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { fbm } from './textures';

export const HAUTEUR_TABLE = 0.75;

const v2 = (r: number, y: number) => new Vector2(r, y);

function ombres<T extends Mesh | Group>(o: T, projette = true, recoit = true): T {
  o.traverse((m) => {
    if ((m as Mesh).isMesh) {
      m.castShadow = projette;
      m.receiveShadow = recoit;
    }
  });
  return o;
}

// ——— Matières partagées ———
export function creerMatieres(t: {
  lin: { map: any; normalMap: any };
  noyer: { map: any; roughnessMap: any };
  papier: any;
  velours: any;
  traces: any;
}) {
  return {
    lin: new MeshPhysicalMaterial({
      color: '#ffffff',
      map: t.lin.map,
      normalMap: t.lin.normalMap,
      normalScale: new Vector2(0.07, 0.07),
      roughness: 0.92,
      sheen: 0.6,
      sheenColor: new Color('#fff6ea'),
      sheenRoughness: 0.8,
      side: DoubleSide,
    }),
    noyer: new MeshStandardMaterial({
      color: '#ffffff',
      map: t.noyer.map,
      roughnessMap: t.noyer.roughnessMap,
      roughness: 0.7,
    }),
    velours: new MeshPhysicalMaterial({
      color: '#ffffff',
      map: t.velours,
      roughness: 0.95,
      sheen: 0.8,
      sheenColor: new Color('#7a4a4e'),
      sheenRoughness: 0.4,
    }),
    porcelaine: new MeshPhysicalMaterial({
      color: '#f4efe6',
      roughness: 0.42,
      clearcoat: 0.5,
      clearcoatRoughness: 0.32,
    }),
    orFilet: new MeshStandardMaterial({ color: '#c9a064', metalness: 1, roughness: 0.28, envMapIntensity: 4 }),
    argent: new MeshStandardMaterial({ color: '#d6d0c6', metalness: 0.82, roughness: 0.26, envMapIntensity: 5 }),
    laiton: new MeshStandardMaterial({ color: '#b8904f', metalness: 1, roughness: 0.3, envMapIntensity: 4 }),
    verre: new MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.03,
      roughnessMap: t.traces,
      transmission: 1,
      thickness: 0.004,
      ior: 1.5,
      specularIntensity: 1,
      envMapIntensity: 3,
      side: DoubleSide,
      transparent: true,
    }),
    vin: new MeshPhysicalMaterial({
      color: '#4a0712',
      emissive: new Color('#1a0206'),
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    }),
    eau: new MeshPhysicalMaterial({
      color: '#d8dccf',
      roughness: 0.02,
      clearcoat: 1,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    }),
    verreBouteille: new MeshPhysicalMaterial({
      color: '#1b2418',
      roughness: 0.08,
      transmission: 0.35,
      thickness: 0.01,
      ior: 1.5,
      attenuationColor: new Color('#0c140c'),
      attenuationDistance: 0.02,
      clearcoat: 1,
    }),
    cire: new MeshPhysicalMaterial({
      color: '#efe5d2',
      roughness: 0.55,
      transmission: 0.25,
      thickness: 0.02,
      sheen: 0.4,
      sheenColor: new Color('#fff3dc'),
    }),
    cireCachet: new MeshPhysicalMaterial({ color: '#6c0e1c', roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    papier: new MeshStandardMaterial({ map: t.papier, roughness: 0.95 }),
    petale: new MeshPhysicalMaterial({
      color: '#521019',
      roughness: 0.58,
      sheen: 0.45,
      sheenColor: new Color('#8a3a42'),
      sheenRoughness: 0.55,
      side: DoubleSide,
    }),
    tige: new MeshStandardMaterial({ color: '#1f2a17', roughness: 0.7 }),
  };
}
export type Matieres = ReturnType<typeof creerMatieres>;

// ——— La nappe : un drapé qui tombe, avec des plis ———
export function nappe(m: Matieres, largeur = 1.1, profondeur = 0.8, chute = 0.55) {
  const debord = chute + 0.05;
  const geo = new PlaneGeometry(largeur + debord * 2, profondeur + debord * 2, 180, 140);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position as BufferAttribute;
  const hx = largeur / 2;
  const hz = profondeur / 2;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i);
    let z = p.getZ(i);
    const dx = Math.max(0, Math.abs(x) - hx);
    const dz = Math.max(0, Math.abs(z) - hz);
    const d = Math.max(dx, dz);
    let y = 0;
    if (d > 0) {
      // Le tissu tombe verticalement à partir du bord, avec un léger évasement.
      const arrondi = Math.min(d, 0.02);
      const tombe = d - arrondi;
      y = -arrondi * 0.6 - tombe;
      const evasement = 0.012 + tombe * 0.08;
      if (dx > 0) x = Math.sign(x) * (hx + arrondi * 0.9 + evasement * (tombe / chute));
      if (dz > 0) z = Math.sign(z) * (hz + arrondi * 0.9 + evasement * (tombe / chute));
      // Plis : ondulation verticale qui s'amplifie vers le bas.
      const le_long = dx > dz ? z : x;
      const pli =
        (Math.sin(le_long * 17 + fbm(le_long * 3, 1) * 7) * 0.05 + Math.sin(le_long * 43 + 1.7) * 0.012) *
        Math.pow(tombe / chute, 0.6);
      y += (fbm(le_long * 5, 3) - 0.5) * 0.06 * (tombe / chute);
      if (dx > dz) x += Math.sign(x) * pli;
      else z += Math.sign(z) * pli;
    } else {
      // Plateau : quelques faux plis de repassage, très légers.
      // Plateau : marques du repassage (une croix de plis) et légères ondulations.
      const pliRepassage = Math.exp(-Math.pow(x / 0.004, 2)) * 0.0012 + Math.exp(-Math.pow(z / 0.004, 2)) * 0.0009;
      y = (fbm(x * 6, z * 6) - 0.5) * 0.0018 + pliRepassage;
    }
    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  const mesh = new Mesh(geo, m.lin);
  mesh.position.y = HAUTEUR_TABLE + 0.004;
  return ombres(mesh);
}

// ——— La table (visible sous la nappe : pieds en noyer) ———
export function table(m: Matieres, largeur = 1.1, profondeur = 0.8) {
  const g = new Group();
  const plateau = new Mesh(new RoundedBoxGeometry(largeur, 0.03, profondeur, 2, 0.01), m.noyer);
  plateau.position.y = HAUTEUR_TABLE - 0.015;
  g.add(plateau);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const pied = new Mesh(new CylinderGeometry(0.022, 0.016, HAUTEUR_TABLE - 0.03, 12), m.noyer);
      pied.position.set(sx * (largeur / 2 - 0.08), (HAUTEUR_TABLE - 0.03) / 2, sz * (profondeur / 2 - 0.08));
      g.add(pied);
    }
  return ombres(g);
}

// ——— Chaise : modernisme des années 50, pieds fuselés, velours ———
export function chaise(m: Matieres) {
  const g = new Group();
  const hAssise = 0.46;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const pied = new Mesh(new CylinderGeometry(0.016, 0.011, hAssise, 10), m.noyer);
      pied.position.set(sx * 0.18, hAssise / 2, sz * 0.17);
      pied.rotation.z = sx * 0.07;
      pied.rotation.x = -sz * 0.07;
      g.add(pied);
    }
  const cadre = new Mesh(new RoundedBoxGeometry(0.44, 0.035, 0.42, 2, 0.012), m.noyer);
  cadre.position.y = hAssise;
  g.add(cadre);
  const assise = new Mesh(new RoundedBoxGeometry(0.43, 0.06, 0.41, 4, 0.028), m.velours);
  assise.position.y = hAssise + 0.045;
  g.add(assise);
  // Dossier enveloppant, rembourré, porté par deux montants fuselés.
  for (const sx of [-1, 1]) {
    const montant = new Mesh(new CylinderGeometry(0.016, 0.018, 0.46, 12), m.noyer);
    montant.position.set(sx * 0.2, hAssise + 0.2, 0.2);
    montant.rotation.x = -0.16;
    g.add(montant);
  }
  const geoDos = new RoundedBoxGeometry(0.46, 0.34, 0.07, 6, 0.032);
  const p = geoDos.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    // Courbure horizontale (enveloppe le dos) et sommet arrondi.
    p.setZ(i, p.getZ(i) + x * x * 0.9);
    if (y > 0.1) p.setY(i, y - x * x * 0.35 * ((y - 0.1) / 0.07));
  }
  geoDos.computeVertexNormals();
  const dossier = new Mesh(geoDos, m.velours);
  dossier.position.set(0, hAssise + 0.33, 0.22);
  dossier.rotation.x = -0.16;
  g.add(dossier);
  return ombres(g);
}

// ——— Verre à vin (tourné) ———
export function verreAVin(m: Matieres, remplissage = 0) {
  const g = new Group();
  const profil = [
    v2(0, 0), v2(0.034, 0), v2(0.036, 0.0015), v2(0.03, 0.003), v2(0.008, 0.006), v2(0.0035, 0.014),
    v2(0.0032, 0.085), v2(0.006, 0.093), v2(0.018, 0.1), v2(0.032, 0.115), v2(0.041, 0.14),
    v2(0.043, 0.165), v2(0.04, 0.19), v2(0.035, 0.212), v2(0.034, 0.215),
  ];
  const verre = new Mesh(new LatheGeometry(profil, 48), m.verre);
  g.add(verre);
  if (remplissage > 0) {
    const h = 0.1 + remplissage * 0.05;
    const r = (y: number) => (y < 0.115 ? 0.006 + ((y - 0.094) / 0.021) * 0.024 : 0.03 + ((Math.min(y, 0.14) - 0.115) / 0.025) * 0.01);
    const pts: Vector2[] = [v2(0, 0.095)];
    for (let y = 0.096; y <= h; y += 0.004) pts.push(v2(Math.max(0.001, r(y) - 0.0015), y));
    pts.push(v2(0, h));
    const vin = new Mesh(new LatheGeometry(pts, 40), m.vin);
    g.add(vin);
  }
  return g;
}

// ——— Assiette (porcelaine, filet d'or) ———
export function assiette(m: Matieres, rayon = 0.135) {
  const g = new Group();
  const k = rayon / 0.135;
  const profil = [
    v2(0, 0.001), v2(0.075 * k, 0.001), v2(0.085 * k, 0.004), v2(0.1 * k, 0.012), v2(0.125 * k, 0.017),
    v2(0.135 * k, 0.019), v2(0.136 * k, 0.021), v2(0.133 * k, 0.021), v2(0.1 * k, 0.015), v2(0.085 * k, 0.008),
    v2(0.07 * k, 0.006), v2(0, 0.006),
  ];
  const a = new Mesh(new LatheGeometry(profil, 72), m.porcelaine);
  g.add(a);
  const filet = new Mesh(new TorusGeometry(0.1305 * k, 0.0009, 6, 96), m.orFilet);
  filet.rotation.x = Math.PI / 2;
  filet.position.y = 0.0205;
  g.add(filet);
  return ombres(g);
}

// ——— Couverts (découpés) ———
function manche(s: Shape, x0: number, long: number) {
  // Col fin près de la tête, puis le manche s'élargit et se termine en goutte.
  s.bezierCurveTo(x0 + long * 0.3, 0.0028, x0 + long * 0.6, 0.0042, x0 + long * 0.88, 0.0075);
  s.quadraticCurveTo(x0 + long + 0.006, 0.0078, x0 + long + 0.006, 0);
  s.quadraticCurveTo(x0 + long + 0.006, -0.0078, x0 + long * 0.88, -0.0075);
  s.bezierCurveTo(x0 + long * 0.6, -0.0042, x0 + long * 0.3, -0.0028, x0, -0.0032);
}
function extruder(s: Shape, epaisseur = 0.0022): BufferGeometry {
  const geo = new ExtrudeGeometry(s, {
    depth: epaisseur,
    bevelEnabled: true,
    bevelThickness: 0.0011,
    bevelSize: 0.0009,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}
export function couteau(m: Matieres) {
  const s = new Shape();
  s.moveTo(0, 0.0065);
  s.quadraticCurveTo(0.07, 0.009, 0.1, 0.002);
  s.quadraticCurveTo(0.104, -0.002, 0.1, -0.004);
  s.lineTo(0.098, -0.004);
  s.lineTo(0.102, -0.0045);
  s.lineTo(0.102, -0.0045);
  s.lineTo(0, -0.004);
  const lame = new Mesh(extruder(s, 0.0012), m.argent);
  const sm = new Shape();
  sm.moveTo(0, 0.0032);
  manche(sm, 0, 0.1);
  const m2 = new Mesh(extruder(sm, 0.0012), m.argent);
  m2.position.x = -0.1;
  const g = new Group();
  g.add(lame, m2);
  return ombres(g);
}
export function fourchette(m: Matieres) {
  const s = new Shape();
  s.moveTo(0, 0.004);
  s.quadraticCurveTo(0.03, 0.005, 0.045, 0.011);
  const dents = 4;
  const larg = 0.022;
  for (let i = 0; i < dents; i++) {
    const y0 = 0.011 - (i * larg) / dents;
    const y1 = y0 - larg / dents + 0.0012;
    s.lineTo(0.085, y0 - 0.0005);
    s.lineTo(0.085, y1 + 0.0005);
    if (i < dents - 1) s.lineTo(0.055, y1 - 0.0006);
  }
  s.lineTo(0.045, -0.011);
  s.quadraticCurveTo(0.03, -0.005, 0, -0.004);
  s.lineTo(0, 0.004);
  const g = new Group();
  const tete = new Mesh(extruder(s, 0.0018), m.argent);
  const sm = new Shape();
  sm.moveTo(0, 0.0032);
  manche(sm, 0, 0.1);
  const mm = new Mesh(extruder(sm, 0.0012), m.argent);
  mm.position.x = -0.1;
  g.add(tete, mm);
  return ombres(g);
}
export function cuillere(m: Matieres) {
  const g = new Group();
  const sm = new Shape();
  sm.moveTo(0, 0.0032);
  manche(sm, 0, 0.11);
  const mm = new Mesh(extruder(sm, 0.0012), m.argent);
  mm.position.x = -0.11;
  const creux = new Mesh(new SphereGeometry(0.02, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.argent);
  creux.scale.set(1.35, 0.35, 0.95);
  creux.position.set(0.028, 0.006, 0);
  g.add(mm, creux);
  return ombres(g);
}

// ——— Serviette : pliée, ou dépliée et froissée (quelqu'un est déjà là) ———
/** Serviette pliée. `imparfaite` : pliée de travers, un coin relevé, le tissu qui gonfle. */
export function serviettePliee(m: Matieres, imparfaite = false) {
  const geo = new RoundedBoxGeometry(0.1, 0.014, 0.16, 4, 0.006);
  if (imparfaite) {
    const p = geo.attributes.position as BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      const coin = Math.max(0, x - 0.015) * Math.max(0, z - 0.035) * 2.4;
      const gonfle = (fbm(x * 30 + 2, z * 30) - 0.5) * 0.004 + Math.sin((z / 0.16) * Math.PI) * 0.002;
      p.setXYZ(i, x + z * 0.09, y + (y > 0 ? coin + gonfle : coin * 0.8), z);
    }
    geo.computeVertexNormals();
  }
  return ombres(new Mesh(geo, m.lin));
}
/** Serviette dépliée à moitié, posée de travers : quelqu'un l'a touchée. */
export function serviettePosee(m: Matieres) {
  const geo = new PlaneGeometry(0.15, 0.2, 40, 52);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    // Repliée en deux sur la moitié arrière, bord avant soulevé, un coin retourné.
    const pli = z < 0 ? 0.005 + Math.sin(Math.min(1, -z / 0.1) * Math.PI) * 0.004 : 0.0015;
    const coin = Math.max(0, x - 0.035) * Math.max(0, z - 0.05) * 2.2;
    const ondule = (fbm(x * 22 + 4, z * 22) - 0.5) * 0.007 + Math.sin(x * 60 + z * 20) * 0.0012;
    p.setXYZ(i, x + (fbm(z * 6, 2) - 0.5) * 0.01, Math.max(0.0008, pli + coin + ondule), z);
  }
  geo.computeVertexNormals();
  return ombres(new Mesh(geo, m.lin));
}

/** Trace à peine visible sur le bord d'un verre (ni rouge à lèvres, ni symbole). */
export function traceSurVerre() {
  const geo = new CylinderGeometry(0.0346, 0.0352, 0.009, 24, 1, true, 0.2, 0.55);
  const mat = new MeshStandardMaterial({ color: '#6d5550', roughness: 0.6, transparent: true, opacity: 0.16, depthWrite: false, side: DoubleSide });
  const t = new Mesh(geo, mat);
  t.position.y = 0.2085;
  return t;
}

export function servietteFroissee(m: Matieres) {
  const geo = new PlaneGeometry(0.3, 0.3, 48, 48);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, z);
    const y = Math.max(0, 0.03 - r * 0.1) + (fbm(x * 14 + 2, z * 14) - 0.4) * 0.03 * (1 - r * 2);
    p.setXYZ(i, x * (0.75 + fbm(x * 5, z * 5) * 0.3), Math.max(0.0005, y), z * (0.8 + fbm(z * 5, x * 5) * 0.25));
  }
  geo.computeVertexNormals();
  return ombres(new Mesh(geo, m.lin));
}

// ——— Bougie : bougeoir en laiton, cire qui a coulé, flamme vivante ———
export function bougie(m: Matieres) {
  const g = new Group();
  const profil = [
    v2(0, 0), v2(0.045, 0), v2(0.046, 0.004), v2(0.04, 0.008), v2(0.014, 0.014), v2(0.011, 0.03),
    v2(0.016, 0.05), v2(0.009, 0.07), v2(0.009, 0.14), v2(0.022, 0.15), v2(0.024, 0.155), v2(0.014, 0.158), v2(0, 0.158),
  ];
  const pied = new Mesh(new LatheGeometry(profil, 48), m.laiton);
  g.add(pied);
  const hCire = 0.13;
  const cire = new Mesh(new CylinderGeometry(0.0115, 0.012, hCire, 32, 1), m.cire);
  cire.position.y = 0.155 + hCire / 2;
  g.add(cire);
  // Coulures de cire.
  for (let i = 0; i < 5; i++) {
    const a = i * 1.9 + 0.4;
    const l = 0.012 + (i % 3) * 0.014;
    const goutte = new Mesh(new CapsuleGeometry(0.0028, l, 4, 8), m.cire);
    goutte.position.set(Math.cos(a) * 0.0118, 0.155 + hCire - l / 2 - 0.004, Math.sin(a) * 0.0118);
    g.add(goutte);
  }
  const flaque = new Mesh(new CylinderGeometry(0.02, 0.022, 0.004, 24), m.cire);
  flaque.position.y = 0.156;
  g.add(flaque);
  const meche = new Mesh(new CylinderGeometry(0.0007, 0.0007, 0.009, 6), new MeshStandardMaterial({ color: '#111' }));
  meche.position.y = 0.155 + hCire + 0.004;
  g.add(meche);
  ombres(g, true, true);

  // Flamme : billboard au shader (goutte, cœur blanc, bords orangés).
  const matFlamme = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTemps: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTemps; varying vec2 vUv;
      void main(){
        vec2 p = vUv - vec2(0.5, 0.18);
        float oscill = sin(uTemps*9.0 + vUv.y*6.0)*0.03*vUv.y;
        p.x += oscill;
        float largeur = mix(0.34, 0.02, smoothstep(0.0, 0.85, vUv.y));
        float corps = smoothstep(largeur, largeur*0.35, abs(p.x)) * smoothstep(-0.18, 0.05, p.y) * smoothstep(0.82, 0.3, vUv.y);
        float coeur = smoothstep(0.12, 0.0, length(vec2(p.x*2.2, (p.y-0.08)*1.2)));
        float bleu = smoothstep(0.1, 0.0, length(vec2(p.x*1.6, p.y+0.1))) * 0.35;
        vec3 c = mix(vec3(1.0,0.45,0.12), vec3(1.0,0.82,0.5), smoothstep(0.0,0.6,corps)) + vec3(1.0,0.97,0.9)*coeur*1.4 + vec3(0.2,0.3,1.0)*bleu;
        gl_FragColor = vec4(c * (corps*1.6 + coeur), corps);
      }`,
  });
  const flamme = new Mesh(new PlaneGeometry(0.018, 0.05), matFlamme);
  flamme.position.y = 0.155 + hCire + 0.022;
  flamme.renderOrder = 10;
  g.add(flamme);
  return { groupe: g, flamme, matFlamme, hauteurFlamme: flamme.position.y };
}

// ——— Rose : pétales incurvés en spirale (phyllotaxie), tige, feuille, épines ———
function geoPetale(l: number, h: number, creux: number, enroule: number) {
  const geo = new PlaneGeometry(l, h, 10, 14);
  geo.translate(0, h / 2, 0);
  const p = geo.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const nx = p.getX(i) / (l / 2);
    const ny = p.getY(i) / h;
    const forme = 0.3 + 0.7 * Math.sin(Math.min(1, ny * 1.15) * Math.PI * 0.62 + 0.25);
    const x = p.getX(i) * forme;
    const z = -creux * nx * nx * (0.25 + 0.75 * ny) + enroule * Math.pow(ny, 3) + (fbm(nx * 3 + 7, ny * 3) - 0.5) * 0.0015;
    p.setXYZ(i, x, p.getY(i), z);
  }
  geo.computeVertexNormals();
  return geo;
}
export function rose(m: Matieres) {
  const g = new Group();
  const bouton = new Group();
  // Une rose simple, à peine ouverte : pétales irréguliers, aucun n'est parfait.
  const alea = (i: number) => {
    const x = Math.sin(i * 91.3 + 7.1) * 43758.5453;
    return x - Math.floor(x);
  };
  const n = 17;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const angle = i * 2.39996 + (alea(i) - 0.5) * 0.5;
    const l = (0.016 + t * 0.018) * (0.88 + alea(i + 3) * 0.24);
    const h = (0.022 + t * 0.014) * (0.9 + alea(i + 5) * 0.2);
    const petale = new Mesh(geoPetale(l, h, 0.004 + t * 0.006, t * t * 0.007 + alea(i + 9) * 0.002), m.petale);
    const pivot = new Group();
    pivot.rotation.y = angle;
    petale.position.z = 0.0015 + t * 0.009;
    petale.rotation.x = 0.1 + t * t * 0.75 + (alea(i + 11) - 0.5) * 0.12;
    petale.rotation.z = (alea(i + 13) - 0.5) * 0.18;
    pivot.add(petale);
    bouton.add(pivot);
  }
  const sepales = new Mesh(new SphereGeometry(0.009, 12, 8), m.tige);
  sepales.scale.set(1.4, 0.6, 1.4);
  bouton.add(sepales);
  g.add(bouton);

  const courbe = new CatmullRomCurve3([
    new Vector3(0, 0, 0), new Vector3(0.005, -0.08, 0.002), new Vector3(-0.004, -0.18, -0.003), new Vector3(0.003, -0.3, 0.002),
  ]);
  const tige = new Mesh(new TubeGeometry(courbe, 40, 0.0028, 8), m.tige);
  g.add(tige);
  const feuille = new Mesh(geoPetale(0.026, 0.05, 0.006, -0.004), new MeshStandardMaterial({ color: '#223019', roughness: 0.55, side: DoubleSide }));
  feuille.position.set(0.003, -0.13, 0);
  feuille.rotation.set(0.3, 0.4, -1.0);
  g.add(feuille);
  for (let i = 0; i < 4; i++) {
    const epine = new Mesh(new CylinderGeometry(0, 0.0018, 0.005, 5), m.tige);
    epine.position.set(0.003, -0.05 - i * 0.06, 0);
    epine.rotation.z = -1.2 + (i % 2) * 2.4;
    g.add(epine);
  }
  return ombres(g);
}

// ——— Enveloppe cachetée ———
export function enveloppe(m: Matieres) {
  const g = new Group();
  const corps = new Mesh(new RoundedBoxGeometry(0.165, 0.004, 0.112, 1, 0.0015), m.papier);
  g.add(corps);
  // Rabat : triangle légèrement soulevé.
  const s = new Shape();
  s.moveTo(-0.0825, 0);
  s.lineTo(0.0825, 0);
  s.lineTo(0.004, -0.058);
  s.quadraticCurveTo(0, -0.061, -0.004, -0.058);
  s.lineTo(-0.0825, 0);
  const geoRabat = new ExtrudeGeometry(s, { depth: 0.0006, bevelEnabled: false });
  geoRabat.rotateX(-Math.PI / 2);
  const rabat = new Mesh(geoRabat, m.papier);
  rabat.position.set(0, 0.0024, -0.056);
  rabat.rotation.x = -0.02;
  g.add(rabat);
  // Cachet de cire : bord irrégulier.
  const geoCachet = new CylinderGeometry(0.013, 0.0135, 0.0032, 40, 1);
  const p = geoCachet.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, z);
    if (r > 0.005) {
      const a = Math.atan2(z, x);
      const k = 1 + (fbm(Math.cos(a) * 2 + 5, Math.sin(a) * 2) - 0.5) * 0.35;
      p.setX(i, x * k);
      p.setZ(i, z * k);
    }
  }
  geoCachet.computeVertexNormals();
  const cachet = new Mesh(geoCachet, m.cireCachet);
  cachet.position.set(0, 0.0045, 0.002);
  g.add(cachet);
  const empreinte = new Mesh(new TorusGeometry(0.0075, 0.0009, 6, 32), m.cireCachet);
  empreinte.rotation.x = Math.PI / 2;
  empreinte.position.set(0, 0.0062, 0.002);
  g.add(empreinte);
  return ombres(g);
}

// ——— Clé ancienne en laiton ———
export function cle(m: Matieres) {
  const g = new Group();
  const anneau = new Mesh(new TorusGeometry(0.013, 0.0028, 12, 40), m.laiton);
  const ornement = new Mesh(new TorusGeometry(0.005, 0.0014, 8, 24), m.laiton);
  const tige = new Mesh(new CylinderGeometry(0.0024, 0.0024, 0.06, 12), m.laiton);
  tige.rotation.z = Math.PI / 2;
  tige.position.x = 0.043;
  const collier = new Mesh(new CylinderGeometry(0.0038, 0.0038, 0.004, 12), m.laiton);
  collier.rotation.z = Math.PI / 2;
  collier.position.x = 0.017;
  const panneton = new Mesh(new RoundedBoxGeometry(0.012, 0.016, 0.003, 1, 0.0008), m.laiton);
  panneton.position.set(0.066, -0.009, 0);
  const dent = new Mesh(new RoundedBoxGeometry(0.004, 0.006, 0.003, 1, 0.0006), m.laiton);
  dent.position.set(0.058, -0.014, 0);
  g.add(anneau, ornement, tige, collier, panneton, dent);
  g.rotation.x = -Math.PI / 2;
  return ombres(g);
}

// ——— Bouteille (verre sombre, étiquette sans marque) ———
export function bouteille(m: Matieres) {
  const g = new Group();
  const profil = [
    v2(0, 0), v2(0.036, 0), v2(0.0375, 0.004), v2(0.0375, 0.2), v2(0.034, 0.225), v2(0.02, 0.25),
    v2(0.0145, 0.27), v2(0.014, 0.315), v2(0.0155, 0.318), v2(0.0155, 0.325), v2(0, 0.325),
  ];
  const b = new Mesh(new LatheGeometry(profil, 48), m.verreBouteille);
  g.add(b);
  const etiquette = new Mesh(
    new CylinderGeometry(0.0382, 0.0382, 0.07, 48, 1, true, -0.8, 1.6),
    new MeshStandardMaterial({ map: m.papier.map, color: '#b8ab92', roughness: 0.95 }),
  );
  etiquette.position.y = 0.11;
  g.add(etiquette);
  const capsule = new Mesh(new CylinderGeometry(0.0158, 0.0158, 0.04, 24), new MeshStandardMaterial({ color: '#4a0c16', metalness: 0.4, roughness: 0.45 }));
  capsule.position.y = 0.305;
  g.add(capsule);
  return ombres(g);
}

// ——— Carafe d'eau ———
export function carafe(m: Matieres) {
  const g = new Group();
  const profil = [
    v2(0, 0), v2(0.045, 0), v2(0.05, 0.02), v2(0.052, 0.09), v2(0.042, 0.14), v2(0.024, 0.17),
    v2(0.022, 0.2), v2(0.026, 0.21),
  ];
  g.add(new Mesh(new LatheGeometry(profil, 48), m.verre));
  const eau: Vector2[] = [v2(0, 0.004), v2(0.044, 0.004), v2(0.049, 0.02), v2(0.05, 0.08), v2(0, 0.08)];
  g.add(new Mesh(new LatheGeometry(eau, 40), m.eau));
  return g;
}

/** Décalque plat posé sur la nappe (tache de vin, ombre de contact…). */
export function decalque(texture: any, taille: number, opacite = 1): Mesh {
  const mat = new MeshStandardMaterial({ map: texture, transparent: true, opacity: opacite, roughness: 0.9, depthWrite: false });
  const d = new Mesh(new PlaneGeometry(taille, taille), mat as Material);
  d.rotation.x = -Math.PI / 2;
  d.receiveShadow = true;
  return d;
}
