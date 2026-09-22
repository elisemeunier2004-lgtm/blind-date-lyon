/**
 * SCÈNE DE RÉFÉRENCE — Una mesa para dos.
 * Une table de dîner pour deux dans une pièce sombre et élégante.
 * La lumière vient de la bougie et d'une suspension ; le reste de la salle
 * n'existe que par ses reflets, ses flous et ses petites lumières lointaines.
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
} from './textures';
import {
  HAUTEUR_TABLE,
  assiette,
  bougie,
  bouteille,
  carafe,
  chaise,
  cle,
  couteau,
  creerMatieres,
  cuillere,
  decalque,
  enveloppe,
  fourchette,
  nappe,
  rose,
  serviettePliee,
  servietteFroissee,
  table,
  verreAVin,
} from './objets';

export type Plan = 'large' | 'place' | 'objets';

const PLANS: Record<Plan, { pos: Vector3; vise: Vector3; fov: number; focus: number; ouverture: number }> = {
  // Plan large : la table, la salle derrière, la place vide au fond.
  large: { pos: new Vector3(1.32, 1.3, 1.08), vise: new Vector3(-0.12, 0.84, -0.34), fov: 36, focus: 1.7, ouverture: 0.004 },
  // Assis à sa place : en face, la chaise vide.
  place: { pos: new Vector3(0.04, 1.12, 0.78), vise: new Vector3(-0.02, 0.86, -0.45), fov: 40, focus: 1.15, ouverture: 0.003 },
  // Au ras de la nappe : l'enveloppe, la clé, la rose, la flamme.
  objets: { pos: new Vector3(0.52, 0.86, 0.5), vise: new Vector3(0.12, 0.77, 0.08), fov: 32, focus: 0.55, ouverture: 0.006 },
};

export async function creerScene(toile: HTMLCanvasElement, options: { plan: Plan; fixe: boolean }) {
  const renderer = new WebGLRenderer({ canvas: toile, antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color('#070506');
  scene.fog = new FogExp2('#0a0506', 0.19);

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

  // Appliques murales : deux petites lumières chaudes dans le fond.
  const appliques: PointLight[] = [];
  for (const x of [-1.25, 2.1]) {
    const globe = new Mesh(new SphereGeometry(0.05, 16, 12), new MeshBasicMaterial({ color: new Color('#ffd49a').multiplyScalar(2.2) }));
    globe.position.set(x, 1.85, -3.85);
    scene.add(globe);
    const l = new PointLight('#ffb870', 0.6, 3.5, 2);
    l.position.copy(globe.position).add(new Vector3(0, 0, 0.1));
    scene.add(l);
    appliques.push(l);
  }

  // ——— La table pour deux ———
  scene.add(table(m));
  scene.add(nappe(m));
  const tache = decalque(tacheVin(), 0.05, 0.9);
  tache.position.set(0.23, HAUTEUR_TABLE + 0.0065, 0.18);
  scene.add(tache);

  const y0 = HAUTEUR_TABLE + 0.006;

  // Place du visiteur (au premier plan) : déjà « habitée ».
  const chaiseIci = chaise(m);
  chaiseIci.position.set(0.02, 0, 0.6);
  chaiseIci.rotation.y = 0.1;
  scene.add(chaiseIci);

  // Place d'en face : préparée pour quelqu'un qui n'est pas encore arrivé.
  const chaiseVide = chaise(m);
  chaiseVide.position.set(-0.05, 0, -0.72);
  chaiseVide.rotation.y = Math.PI - 0.16;
  scene.add(chaiseVide);

  for (const [z, sens] of [
    [0.25, 1],
    [-0.25, -1],
  ] as const) {
    const grande = assiette(m, 0.135);
    grande.position.set(0, y0, z);
    scene.add(grande);
    const petite = assiette(m, 0.098);
    petite.position.set(0, y0 + 0.007, z);
    petite.rotation.y = 0.3;
    scene.add(petite);

    const f = fourchette(m);
    f.position.set(-0.17 * sens, y0 + 0.001, z + 0.005 * sens);
    f.rotation.y = (Math.PI / 2) * sens + 0.03 * sens;
    scene.add(f);
    const c = couteau(m);
    c.position.set(0.165 * sens, y0 + 0.001, z - 0.004);
    c.rotation.y = (Math.PI / 2) * sens - 0.02;
    scene.add(c);
    const cu = cuillere(m);
    cu.position.set(0.205 * sens, y0 + 0.001, z + 0.01);
    cu.rotation.y = (Math.PI / 2) * sens + 0.05;
    scene.add(cu);
  }

  // Les verres : le mien est servi, celui d'en face attend.
  const verreIci = verreAVin(m, 0.55);
  verreIci.position.set(0.19, y0, 0.08);
  scene.add(verreIci);
  const verreVide = verreAVin(m, 0);
  verreVide.position.set(-0.2, y0, -0.1);
  scene.add(verreVide);

  // Serviettes : dépliée et froissée ici, pliée en face.
  const froissee = servietteFroissee(m);
  froissee.position.set(-0.3, y0, 0.3);
  froissee.rotation.y = 0.6;
  scene.add(froissee);
  const pliee = serviettePliee(m);
  pliee.position.set(0.3, y0 + 0.007, -0.26);
  pliee.rotation.y = 0.04;
  scene.add(pliee);

  // La bougie, au centre, un peu décalée.
  const b = bougie(m);
  b.groupe.position.set(0.1, y0, -0.02);
  scene.add(b.groupe);
  const lumiereBougie = new PointLight('#ffa95c', 0.55, 0, 2);
  lumiereBougie.position.set(0.1, y0 + b.hauteurFlamme + 0.01, -0.02);
  lumiereBougie.castShadow = true;
  lumiereBougie.shadow.mapSize.set(1024, 1024);
  lumiereBougie.shadow.radius = 6;
  lumiereBougie.shadow.bias = -0.0008;
  lumiereBougie.shadow.camera.near = 0.01;
  scene.add(lumiereBougie);

  // Bouteille et carafe, sur le côté.
  const bt = bouteille(m);
  bt.position.set(-0.42, y0, 0.02);
  bt.rotation.y = 0.8;
  scene.add(bt);
  const cf = carafe(m);
  cf.position.set(-0.36, y0, -0.2);
  scene.add(cf);

  // La rose, posée en travers de l'assiette vide.
  const r = rose(m);
  r.rotation.set(0, 0.5, -Math.PI / 2 + 0.12);
  r.position.set(0.06, y0 + 0.04, -0.23);
  scene.add(r);

  // L'enveloppe et la clé, près de ma place.
  const env = enveloppe(m);
  env.position.set(0.3, y0 + 0.002, 0.3);
  env.rotation.y = -0.35;
  scene.add(env);
  const k = cle(m);
  k.position.set(0.27, y0 + 0.012, 0.36);
  k.rotation.z = 0.8;
  scene.add(k);

  // ——— La salle au loin : d'autres tables, d'autres bougies (en flou) ———
  const linLointain = m.lin.clone();
  linLointain.color.set('#5e5048');
  const lointains = new Group();
  for (const [x, z] of [
    [-2.3, -2.6],
    [2.4, -3.1],
    [-0.6, -3.4],
  ]) {
    const t = new Group();
    t.add(table(m, 0.8, 0.8));
    t.add(nappe({ ...m, lin: linLointain }, 0.8, 0.8, 0.55));
    const bb = bougie(m);
    bb.groupe.position.y = HAUTEUR_TABLE;
    t.add(bb.groupe);
    const l = new PointLight('#ffa95c', 0.12, 1.6, 2);
    l.position.set(0, HAUTEUR_TABLE + 0.32, 0);
    t.add(l);
    t.position.set(x, 0, z);
    lointains.add(t);
  }
  scene.add(lointains);

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
  suspension.shadow.mapSize.set(2048, 2048);
  suspension.shadow.radius = 4;
  suspension.shadow.bias = -0.0003;
  scene.add(suspension, suspension.target);

  // ——— Reflets : la salle photographiée depuis la table sert d'environnement ———
  const pmrem = new PMREMGenerator(renderer);
  const cible = new WebGLCubeRenderTarget(256, { type: HalfFloatType });
  const cubeCam = new CubeCamera(0.05, 20, cible);
  cubeCam.position.set(0.05, HAUTEUR_TABLE + 0.2, 0);
  const verres = [verreIci, verreVide, cf];
  verres.forEach((v) => (v.visible = false));
  cubeCam.update(renderer, scene);
  verres.forEach((v) => (v.visible = true));
  scene.environment = pmrem.fromCubemap(cible.texture).texture;
  scene.environmentIntensity = 0.45;

  // ——— Post-traitement : profondeur de champ, halo, grain ———
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: PLANS[options.plan].focus, aperture: PLANS[options.plan].ouverture, maxblur: 0.012 });
  composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new Vector2(256, 256), 0.4, 0.5, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grain = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTemps: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTemps; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTemps) * 43758.5453); }
      void main(){
        vec4 c = texture2D(tDiffuse, vUv);
        float g = (h(vUv * 1000.0) - 0.5) * 0.045;
        float vig = smoothstep(1.15, 0.35, length((vUv - 0.5) * vec2(1.25, 1.0)));
        c.rgb = (c.rgb + g) * mix(0.55, 1.0, vig);
        gl_FragColor = c;
      }`,
  });
  composer.addPass(grain);

  // ——— Cadrage ———
  const pos = PLANS[options.plan].pos.clone();
  const vise = PLANS[options.plan].vise.clone();
  let planCible: Plan = options.plan;
  // En portrait, on élargit le champ pour garder la table entière.
  let facteurFov = 1;

  function cadrer() {
    const w = toile.clientWidth || innerWidth;
    const h = toile.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    composer.setPixelRatio(dpr);
    camera.aspect = w / h;
    facteurFov = h > w ? 1.6 : 1;
    camera.updateProjectionMatrix();
  }
  cadrer();
  addEventListener('resize', cadrer);

  function allerA(plan: Plan) {
    planCible = plan;
  }

  // ——— Boucle ———
  let temps = 0;
  let dernier = performance.now();
  let raf = 0;
  function image(t: number) {
    raf = 0;
    const dt = Math.min(0.05, (t - dernier) / 1000);
    dernier = t;
    temps += dt;

    const p = PLANS[planCible];
    const lissage = 1 - Math.exp(-dt * 1.2);
    pos.lerp(p.pos, lissage);
    vise.lerp(p.vise, lissage);
    camera.fov += (p.fov * facteurFov - camera.fov) * lissage;
    camera.updateProjectionMatrix();
    const u = bokeh.uniforms as Record<string, { value: number }>;
    u.focus.value += (p.focus - u.focus.value) * lissage;
    u.aperture.value += (p.ouverture - u.aperture.value) * lissage;

    const derive = options.fixe ? 0 : 1;
    camera.position.set(
      pos.x + Math.sin(temps * 0.13) * 0.025 * derive,
      pos.y + Math.sin(temps * 0.17) * 0.012 * derive,
      pos.z + Math.cos(temps * 0.11) * 0.02 * derive,
    );
    camera.lookAt(vise);

    // La flamme vit : vacillement irrégulier, repris par la lumière.
    const vacille = options.fixe ? 1 : 0.9 + Math.sin(temps * 7.3) * 0.05 + Math.sin(temps * 13.1) * 0.035 + Math.sin(temps * 23.7) * 0.02;
    lumiereBougie.intensity = 0.55 * vacille;
    b.matFlamme.uniforms.uTemps.value = temps;
    b.flamme.scale.set(1, 0.92 + vacille * 0.1, 1);
    b.flamme.quaternion.copy(camera.quaternion);
    grain.uniforms.uTemps.value = temps % 10;

    composer.render(dt);
    if (!document.hidden) raf = requestAnimationFrame(image);
  }
  raf = requestAnimationFrame(image);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !raf) {
      dernier = performance.now();
      raf = requestAnimationFrame(image);
    }
  });

  return { allerA };
}
