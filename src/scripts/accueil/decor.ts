/**
 * LA SALA — le décor de la homepage.
 * Même table, même lumière, mêmes matières que la scène de référence (/scene-reference),
 * racontée par des plans de caméra successifs au fil du scroll.
 * Ce fichier reprend la construction de la scène de référence sans la modifier.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Color,
  CubeCamera,
  CylinderGeometry,
  LatheGeometry,
  FogExp2,
  Group,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  boisTextures,
  linTextures,
  papierTexture,
  parquetTextures,
  platreTextures,
  tacheVin,
  tainMiroir,
  tracesVerre,
  veloursTexture,
} from '../table/textures';
import {
  HAUTEUR_TABLE,
  assiette,
  bougie,
  chaise,
  cle,
  couteau,
  creerMatieres,
  decalque,
  enveloppe,
  fourchette,
  nappe,
  rose,
  serviettePliee,
  traceSurVerre,
  table,
  verreAVin,
} from '../table/objets';

export type Plan =
  | 'arrivee'
  | 'flamme'
  | 'enveloppe'
  | 'cachet'
  | 'cle'
  | 'table'
  | 'profil'
  | 'apres'
  | 'place'
  | 'preparation'
  | 'chaise'
  | 'verres'
  | 'visavis'
  | 'fin';

export type Bougie = 'allumee' | 'eteinte' | 'basse';

type Cadre = { pos: Vector3; vise: Vector3; fov: number; focus: number; ouverture: number };
const c = (p: [number, number, number], v: [number, number, number], fov: number, focus: number, ouverture: number): Cadre => ({
  pos: new Vector3(...p),
  vise: new Vector3(...v),
  fov,
  focus,
  ouverture,
});

export const PLANS: Record<Plan, Cadre> = {
  // La table dans la pénombre, en plongée légère.
  arrivee: c([1.2, 1.4, 1.15], [-0.1, 0.78, -0.35], 34, 1.75, 0.0032),
  // Au plus près de la flamme : le silence.
  flamme: c([0.42, 1.03, 0.5], [0.1, 1.0, 0.0], 26, 0.62, 0.008),
  // L'invitation.
  enveloppe: c([0.5, 0.9, 0.58], [0.3, 0.77, 0.33], 24, 0.36, 0.007),
  // Le cachet : ce qu'il faut savoir, rien de plus.
  cachet: c([0.39, 0.845, 0.4], [0.31, 0.766, 0.315], 20, 0.14, 0.01),
  // La clé : le lieu, confié au bon moment.
  cle: c([0.1, 0.88, 0.57], [0.25, 0.764, 0.4], 22, 0.24, 0.009),
  // La table entière.
  table: c([1.08, 1.27, 0.98], [-0.12, 0.8, -0.4], 33, 1.62, 0.0034),
  // De profil : les deux places, face à face.
  profil: c([1.3, 1.02, 0.02], [0.0, 0.84, -0.05], 34, 1.3, 0.0034),
  // La place d'en face, après : le verre déplacé, la serviette de travers.
  apres: c([0.18, 0.99, 0.2], [-0.18, 0.79, -0.2], 30, 0.46, 0.007),
  // Assis à sa place : en face, la chaise vide.
  place: c([0.05, 1.1, 0.8], [-0.1, 0.83, -0.55], 40, 1.3, 0.0032),
  // Avant l'arrivée : la table dressée, vue de haut.
  preparation: c([0.9, 1.75, 0.75], [-0.05, 0.75, -0.15], 34, 1.55, 0.003),
  // La chaise tirée.
  chaise: c([-1.05, 1.15, -0.05], [-0.2, 0.6, -0.88], 34, 1.2, 0.004),
  // Les verres.
  verres: c([-0.17, 0.95, 0.5], [0.05, 0.84, 0.0], 30, 0.52, 0.007),
  // Depuis la place d'en face : vers votre place.
  visavis: c([-0.15, 1.12, -0.82], [0.05, 0.83, 0.5], 40, 1.25, 0.0032),
  // Retour aux deux places, symétrique, en hauteur.
  fin: c([0.0, 1.95, 1.3], [0.0, 0.72, -0.12], 36, 1.75, 0.003),
};

export type OptionsDecor = { plan: Plan; leger: boolean; fixe: boolean; arriveeProgressive: boolean };

export async function creerDecor(toile: HTMLCanvasElement, options: OptionsDecor) {
  const leger = options.leger;
  const renderer = new WebGLRenderer({ canvas: toile, antialias: !leger, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio, leger ? 1.25 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color('#060505');
  scene.fog = new FogExp2('#070606', 0.18);

  const camera = new PerspectiveCamera(PLANS[options.plan].fov * (innerHeight > innerWidth ? 1.6 : 1), 1, 0.02, 30);

  // ——— Matières ———
  const lin = linTextures();
  const noyer = boisTextures();
  const m = creerMatieres({ lin, noyer, papier: papierTexture(), velours: veloursTexture(), traces: tracesVerre() });

  // ——— La pièce ———
  const parquet = parquetTextures();
  const sol = new Mesh(
    new PlaneGeometry(12, 12),
    new MeshStandardMaterial({ map: parquet.map, roughnessMap: parquet.roughnessMap, roughness: 0.55 }),
  );
  sol.rotation.x = -Math.PI / 2;
  sol.receiveShadow = true;
  scene.add(sol);

  const platre = platreTextures();
  const matMur = new MeshStandardMaterial({ map: platre.map, roughnessMap: platre.roughnessMap, roughness: 0.9 });
  const fond = new Mesh(new PlaneGeometry(12, 4.2), matMur);
  fond.position.set(0, 2.1, -4.0);
  fond.receiveShadow = true;
  scene.add(fond);
  const gauche = new Mesh(new PlaneGeometry(8, 4.2), matMur);
  gauche.rotation.y = Math.PI / 2;
  gauche.position.set(-3.6, 2.1, -0.5);
  scene.add(gauche);

  // Lambris en noyer (bas du mur), avec panneaux.
  const boisClair = boisTextures(true);
  const matLambris = new MeshStandardMaterial({ map: boisClair.map, roughnessMap: boisClair.roughnessMap, roughness: 0.5 });
  const lambris = new Mesh(new BoxGeometry(12, 1.05, 0.04), matLambris);
  lambris.position.set(0, 0.525, -3.98);
  lambris.receiveShadow = true;
  scene.add(lambris);
  for (let i = -5; i <= 5; i++) {
    const panneau = new Mesh(new BoxGeometry(0.9, 0.75, 0.02), matLambris);
    panneau.position.set(i * 1.05, 0.52, -3.95);
    scene.add(panneau);
  }
  const cimaise = new Mesh(new BoxGeometry(12, 0.04, 0.06), matLambris);
  cimaise.position.set(0, 1.06, -3.96);
  scene.add(cimaise);

  // Le miroir ancien, cadre en laiton : il reflète la salle, flou et piqué.
  const miroir = new Mesh(
    new PlaneGeometry(0.95, 1.35),
    new MeshPhysicalMaterial({ color: '#b9ad9c', metalness: 1, roughness: 0.06, roughnessMap: tainMiroir(), envMapIntensity: 1.6 }),
  );
  miroir.position.set(0.55, 1.78, -3.94);
  scene.add(miroir);
  for (const [w, h, x, y] of [
    [1.03, 0.04, 0.55, 2.47],
    [1.03, 0.04, 0.55, 1.09],
    [0.04, 1.43, 0.06, 1.78],
    [0.04, 1.43, 1.04, 1.78],
  ]) {
    const barre = new Mesh(new BoxGeometry(w, h, 0.03), m.laiton);
    barre.position.set(x, y, -3.93);
    scene.add(barre);
  }

  // Une seule applique, loin, à gauche : la salle existe, sans se montrer.
  const globe = new Mesh(new SphereGeometry(0.045, 16, 12), new MeshBasicMaterial({ color: new Color('#ffd49a').multiplyScalar(1.8) }));
  globe.position.set(-1.45, 1.8, -3.85);
  scene.add(globe);
  const applique = new PointLight('#ffb870', 0.3, 3, 2);
  applique.position.copy(globe.position).add(new Vector3(0, 0, 0.12));
  scene.add(applique);

  // D'autres bougies, très loin : seulement des points de lumière, flous.
  for (const [x, y, z] of [
    [-2.1, 0.95, -3.1],
    [1.9, 1.0, -3.4],
    [0.95, 0.92, -3.7],
  ]) {
    const point = new Mesh(new SphereGeometry(0.012, 8, 6), new MeshBasicMaterial({ color: new Color('#ffb46a').multiplyScalar(2.5) }));
    point.position.set(x, y, z);
    scene.add(point);
  }

  // ——— La table pour deux ———
  scene.add(table(m));
  scene.add(nappe(m));
  const tache = decalque(tacheVin(), 0.04, 0.55);
  tache.position.set(-0.13, HAUTEUR_TABLE + 0.0065, -0.02);
  scene.add(tache);

  const y0 = HAUTEUR_TABLE + 0.006;

  // Ma place (premier plan).
  const chaiseIci = chaise(m);
  chaiseIci.position.set(0.02, 0, 0.6);
  chaiseIci.rotation.y = 0.06;
  scene.add(chaiseIci);

  // La place d'en face : la chaise est tirée et tournée, comme si quelqu'un
  // venait de se lever — ou allait s'asseoir.
  const chaiseVide = chaise(m);
  chaiseVide.position.set(-0.2, 0, -0.93);
  chaiseVide.rotation.y = Math.PI - 0.42;
  scene.add(chaiseVide);

  // Deux couverts : une assiette, une fourchette, un couteau. Rien de plus.
  const ici = { z: 0.25, sens: 1 };
  const face = { z: -0.25, sens: -1 };
  for (const { z, sens } of [ici, face]) {
    const a = assiette(m, 0.135);
    a.position.set(0, y0, z);
    scene.add(a);
  }
  const fIci = fourchette(m);
  fIci.position.set(-0.17, y0 + 0.001, 0.255);
  fIci.rotation.y = Math.PI / 2 + 0.02;
  scene.add(fIci);
  const cIci = couteau(m);
  cIci.position.set(0.165, y0 + 0.001, 0.246);
  cIci.rotation.y = Math.PI / 2 - 0.015;
  scene.add(cIci);
  // En face, le couvert a bougé : la fourchette a glissé, le couteau est de biais.
  const fFace = fourchette(m);
  fFace.position.set(0.19, y0 + 0.001, -0.225);
  fFace.rotation.y = -Math.PI / 2 - 0.11;
  scene.add(fFace);
  const cFace = couteau(m);
  cFace.position.set(-0.158, y0 + 0.001, -0.27);
  cFace.rotation.y = -Math.PI / 2 + 0.07;
  scene.add(cFace);

  // Les verres. Le mien, servi. Celui d'en face a été déplacé vers le centre,
  // il reste un fond de vin et une trace à peine visible sur le bord.
  const verreIci = verreAVin(m, 0.55);
  verreIci.position.set(0.19, y0, 0.08);
  scene.add(verreIci);
  const verreFace = verreAVin(m, 0.08);
  verreFace.position.set(-0.1, y0, -0.05);
  verreFace.rotation.y = 2.2;
  verreFace.add(traceSurVerre());
  scene.add(verreFace);

  // Serviettes : la mienne, pliée. Celle d'en face, dépliée à moitié, posée de travers.
  const plieeIci = serviettePliee(m);
  plieeIci.position.set(-0.3, y0 + 0.007, 0.27);
  plieeIci.rotation.y = 0.02;
  scene.add(plieeIci);
  const poseeFace = serviettePliee(m, true);
  poseeFace.position.set(-0.3, y0 + 0.007, -0.3);
  poseeFace.rotation.y = 0.32;
  scene.add(poseeFace);

  // La bougie, un peu décalée du centre.
  const b = bougie(m);
  b.groupe.position.set(0.1, y0, 0.0);
  scene.add(b.groupe);
  const lumiereBougie = new PointLight('#ffa95c', 0.5, 0, 2);
  lumiereBougie.position.set(0.1, y0 + b.hauteurFlamme + 0.01, 0.0);
  lumiereBougie.castShadow = true;
  lumiereBougie.shadow.mapSize.set(leger ? 512 : 1024, leger ? 512 : 1024);
  lumiereBougie.shadow.radius = 6;
  lumiereBougie.shadow.bias = -0.0008;
  lumiereBougie.shadow.camera.near = 0.01;
  scene.add(lumiereBougie);

  // La rose : une seule tige, simplement posée sur la nappe, à côté de l'assiette d'en face.
  const r = rose(m);
  r.scale.setScalar(0.85);
  r.rotation.set(0.04, -0.25, -Math.PI / 2 + 0.06);
  r.position.set(0.1, y0 + 0.017, -0.45);
  scene.add(r);

  // L'enveloppe et la clé, près de ma place.
  const env = enveloppe(m);
  env.position.set(0.31, y0 + 0.002, 0.31);
  env.rotation.y = -0.35;
  scene.add(env);
  const k = cle(m);
  // (Homepage) la clé est posée à côté du cachet pour qu'on voie les deux.
  k.position.set(0.235, y0 + 0.0068, 0.395);
  k.rotation.z = 0.55;
  scene.add(k);

  // La suspension en laiton au-dessus de la table (elle se reflète dans le métal et le verre).
  const abatJour = new Group();
  const coque = new Mesh(
    new LatheGeometry([new Vector2(0.004, 0), new Vector2(0.03, 0.005), new Vector2(0.13, 0.11), new Vector2(0.16, 0.16), new Vector2(0.158, 0.162)].map((v) => new Vector2(v.x, -v.y)), 48),
    m.laiton,
  );
  const ampoule = new Mesh(new SphereGeometry(0.035, 16, 12), new MeshBasicMaterial({ color: new Color('#fff0d6').multiplyScalar(3) }));
  ampoule.position.y = -0.1;
  const cordon = new Mesh(new CylinderGeometry(0.003, 0.003, 1.2, 6), new MeshStandardMaterial({ color: '#111' }));
  cordon.position.y = 0.6;
  abatJour.add(coque, ampoule, cordon);
  abatJour.position.set(0.15, 2.35, 0.1);
  scene.add(abatJour);

  // ——— Lumières ———
  scene.add(new AmbientLight('#2a1216', 0.06));
  const suspension = new SpotLight('#ffcf98', 2.4, 0, 0.5, 0.9, 2);
  suspension.position.set(0.15, 2.22, 0.1);
  suspension.target.position.set(0, HAUTEUR_TABLE, 0);
  suspension.castShadow = true;
  suspension.shadow.mapSize.set(leger ? 1024 : 2048, leger ? 1024 : 2048);
  suspension.shadow.radius = 4;
  suspension.shadow.bias = -0.0003;
  scene.add(suspension, suspension.target);

  // Contre-jour discret derrière la place vide : il dessine la silhouette de la chaise,
  // comme le ferait un photographe, sans qu'on voie d'où vient la lumière.
  const contreJour = new SpotLight('#d9d2c6', 5.5, 0, 0.5, 0.9, 2);
  contreJour.position.set(-0.55, 1.9, -2.3);
  contreJour.target.position.set(-0.2, 0.75, -0.9);
  scene.add(contreJour, contreJour.target);
  // La nappe blanche renvoie la lumière vers la place d'en face : un rebond chaud, très doux.
  // Placé sous le plateau : il n'éclaire que la chaise, jamais la table.
  const rebond = new PointLight('#ffd6a8', 0.45, 1.3, 2);
  rebond.position.set(-0.18, 0.6, -0.62);
  scene.add(rebond);

  // ——— Reflets : la salle photographiée depuis la table sert d'environnement ———
  const pmrem = new PMREMGenerator(renderer);
  const cible = new WebGLCubeRenderTarget(256, { type: HalfFloatType });
  const cubeCam = new CubeCamera(0.05, 20, cible);
  cubeCam.position.set(0.05, HAUTEUR_TABLE + 0.2, 0);
  const verres = [verreIci, verreFace];
  verres.forEach((v) => (v.visible = false));
  cubeCam.update(renderer, scene);
  verres.forEach((v) => (v.visible = true));
  scene.environment = pmrem.fromCubemap(cible.texture).texture;
  scene.environmentIntensity = 0.45;

  // ——— Post-traitement : profondeur de champ, halo, étalonnage (léger : étalonnage seul) ———
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: PLANS[options.plan].focus, aperture: PLANS[options.plan].ouverture, maxblur: 0.012 });
  if (!leger) {
    composer.addPass(bokeh);
    composer.addPass(new UnrealBloomPass(new Vector2(256, 256), 0.28, 0.5, 0.94));
  }
  composer.addPass(new OutputPass());
  const grain = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTemps: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTemps; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTemps) * 43758.5453); }
      void main(){
        vec4 c = texture2D(tDiffuse, vUv);
        float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
        c.rgb = mix(vec3(l), c.rgb, 0.82);
        c.rgb = mix(c.rgb * vec3(0.96, 0.98, 1.02), c.rgb * vec3(1.04, 1.0, 0.93), smoothstep(0.15, 0.7, l));
        c.rgb = c.rgb * c.rgb * (3.0 - 2.0 * c.rgb) * 0.35 + c.rgb * 0.65;
        float g = (h(vUv * 1000.0) - 0.5) * 0.045;
        float vig = smoothstep(1.2, 0.3, length((vUv - 0.5) * vec2(1.3, 1.0)));
        c.rgb = (c.rgb + g) * mix(0.5, 1.0, vig);
        gl_FragColor = c;
      }`,
  });
  composer.addPass(grain);

  // ——— Lumières pilotées (arrivée progressive, bougie) ———
  const base = {
    suspension: suspension.intensity,
    contreJour: contreJour.intensity,
    rebond: rebond.intensity,
    applique: applique.intensity,
    environnement: scene.environmentIntensity,
  };
  const ciblesLumiere = { jour: 1, bougie: 1, cire: 1 };
  const lum = { jour: options.arriveeProgressive ? 0 : 1, bougie: options.arriveeProgressive ? 0 : 1, cire: 1 };

  // ——— Cadrage : en paysage le sujet glisse à droite (le texte vit à gauche),
  // en portrait il descend (le texte vit en haut). ———
  const pos = PLANS[options.plan].pos.clone();
  const vise = PLANS[options.plan].vise.clone();
  let planCible: Plan = options.plan;
  let facteurFov = 1;

  function cadrer() {
    const w = toile.clientWidth || innerWidth;
    const h = toile.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    composer.setPixelRatio(dpr);
    camera.aspect = w / h;
    const portrait = h > w;
    facteurFov = portrait ? 1.6 : 1;
    if (portrait) camera.setViewOffset(w, h, 0, -h * 0.1, w, h);
    else camera.setViewOffset(w, h, -w * 0.13, 0, w, h);
    camera.updateProjectionMatrix();
  }
  cadrer();
  addEventListener('resize', cadrer);

  function allerA(plan: Plan, bougie: Bougie = 'allumee', jour = 1) {
    planCible = plan;
    ciblesLumiere.jour = jour;
    ciblesLumiere.bougie = bougie === 'eteinte' ? 0 : 1;
    ciblesLumiere.cire = bougie === 'basse' ? 0.5 : 1;
    if (!raf && actif) lancer();
  }

  /** Saute directement à l'état cible (captures, réduction des animations). */
  function figer() {
    const p = PLANS[planCible];
    pos.copy(p.pos);
    vise.copy(p.vise);
    camera.fov = p.fov * facteurFov;
    const u = bokeh.uniforms as Record<string, { value: number }>;
    u.focus.value = p.focus;
    u.aperture.value = p.ouverture;
    Object.assign(lum, ciblesLumiere);
  }

  // ——— Boucle ———
  let temps = 0;
  let dernier = performance.now();
  let raf = 0;
  let actif = true;
  let premiereImage: (() => void) | null = null;
  const premiere = new Promise<void>((r) => (premiereImage = r));

  function image(t: number) {
    raf = 0;
    const dt = Math.min(0.05, (t - dernier) / 1000);
    dernier = t;
    temps += dt;

    const p = PLANS[planCible];
    const lissage = 1 - Math.exp(-dt * 0.9);
    pos.lerp(p.pos, lissage);
    vise.lerp(p.vise, lissage);
    camera.fov += (p.fov * facteurFov - camera.fov) * lissage;
    camera.updateProjectionMatrix();
    const u = bokeh.uniforms as Record<string, { value: number }>;
    u.focus.value += (p.focus - u.focus.value) * lissage;
    u.aperture.value += (p.ouverture - u.aperture.value) * lissage;

    // Lumières : l'arrivée s'allume lentement ; la bougie s'allume, s'éteint, baisse.
    const lent = 1 - Math.exp(-dt * 0.55);
    lum.jour += (ciblesLumiere.jour - lum.jour) * lent;
    lum.bougie += (ciblesLumiere.bougie - lum.bougie) * (1 - Math.exp(-dt * 1.4));
    lum.cire += (ciblesLumiere.cire - lum.cire) * lent;
    suspension.intensity = base.suspension * lum.jour;
    contreJour.intensity = base.contreJour * lum.jour;
    rebond.intensity = base.rebond * lum.jour;
    applique.intensity = base.applique * lum.jour;
    scene.environmentIntensity = base.environnement * (0.25 + 0.75 * lum.jour);

    const derive = options.fixe ? 0 : 1;
    camera.position.set(
      pos.x + Math.sin(temps * 0.13) * 0.02 * derive,
      pos.y + Math.sin(temps * 0.17) * 0.01 * derive,
      pos.z + Math.cos(temps * 0.11) * 0.016 * derive,
    );
    camera.lookAt(vise);

    // La cire baisse au fil de la soirée ; la flamme suit.
    b.cire.scale.y = lum.cire;
    b.cire.position.y = 0.155 + (b.hCire * lum.cire) / 2;
    b.flamme.position.y = 0.155 + b.hCire * lum.cire + 0.022;
    lumiereBougie.position.y = y0 + b.flamme.position.y + 0.01;

    const vacille = options.fixe ? 1 : 0.9 + Math.sin(temps * 7.3) * 0.05 + Math.sin(temps * 13.1) * 0.035 + Math.sin(temps * 23.7) * 0.02;
    lumiereBougie.intensity = 0.55 * vacille * lum.bougie * (0.35 + 0.65 * Math.min(1, lum.jour * 3));
    b.flamme.visible = lum.bougie > 0.02;
    b.matFlamme.uniforms.uTemps.value = temps;
    b.flamme.scale.set(lum.bougie, (0.92 + vacille * 0.1) * lum.bougie, 1);
    b.flamme.quaternion.copy(camera.quaternion);
    grain.uniforms.uTemps.value = temps % 10;

    composer.render(dt);
    if (premiereImage) {
      premiereImage();
      premiereImage = null;
    }
    if (actif && !document.hidden) raf = requestAnimationFrame(image);
  }
  function lancer() {
    if (!raf && !document.hidden) {
      dernier = performance.now();
      raf = requestAnimationFrame(image);
    }
  }
  function pause(p: boolean) {
    actif = !p;
    if (actif) lancer();
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && actif) lancer();
  });
  lancer();

  return { allerA, figer, pause, premiere };
}
