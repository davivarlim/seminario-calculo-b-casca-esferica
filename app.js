/* ==========================================================================
   Casca de Esfera — Seminário de Cálculo B (UFPel)
   Motor da apresentação: navegação, KaTeX e cenas 3D interativas (Three.js r128)
   ========================================================================== */
'use strict';

const SLIDE_TITLES = [
  'Capa Oficial',
  'PARTE 1: Definição Formal no R³ (R=5, r=3)',
  'PARTE 1: Propriedades Geométricas (5 Desenhos)',
  'PARTE 1: Modelagem GeoGebra (Fundamentação R=5, r=3)',
  'PARTE 2: Método dos Discos vs. Cascas Cilíndricas',
  'PARTE 2: Passos 3.1 & 3.2: Montagem e Simplificação',
  'PARTE 2: Passo 3.3: Primitiva da Integral',
  'PARTE 2: Passo 3.4: Teorema Fundamental do Cálculo',
  'PARTE 2: Passo 3.5: Fórmula Final Deduzida',
  'PARTE 3: Problema Industrial (Flutuador de Alta Pressão)',
  'PARTE 3: Resolução Numérica e Unidades SI',
  'PARTE 4: Tanque Criogênico Aeroespacial (LH₂)',
  'PARTE 4: GeoGebra Proposto — Curvas 2D e Seção 180°',
  'PARTE 4: GeoGebra Proposto — 3D Paramétrico e Translúcido',
  'PARTE 4: Cálculo do Volume de Isolamento de Perlita',
  'PARTE 4: Discussão Crítica e Limitações do Modelo',
  'Conclusão e Considerações Finais'
];

const $ = id => document.getElementById(id);
const slides = document.querySelectorAll('.slide');
const stages = {};      // slide -> cena 3D já construída
let current = 0;

/* ==========================================================================
   NAVEGAÇÃO
   ========================================================================== */

function goToSlide(i) {
  if (i < 0 || i >= slides.length) return;
  current = i;
  slides.forEach((s, k) => s.classList.toggle('active', k === i));
  document.querySelectorAll('.nav-sections [data-target]')
    .forEach(t => t.classList.toggle('active', +t.dataset.target === i));
  document.body.classList.toggle('on-cover', i === 0);

  const last = i === slides.length - 1;
  $('btn-prev').disabled = i === 0;
  $('btn-next').disabled = last;
  $('btn-next').innerHTML = last ? 'Concluir &check;' : 'Próximo &rarr;';
  $('progress-fill').style.width = `${((i + 1) / slides.length) * 100}%`;
  $('progress-label').textContent = `Slide ${i + 1} de ${slides.length} (${SLIDE_TITLES[i]})`;

  setTimeout(() => activateScene(i), 60);
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => {});
}

const KEYS = {
  ArrowRight: () => goToSlide(current + 1),
  PageDown: () => goToSlide(current + 1),
  ' ': () => goToSlide(current + 1),
  ArrowLeft: () => goToSlide(current - 1),
  PageUp: () => goToSlide(current - 1),
  Home: () => goToSlide(0),
  End: () => goToSlide(slides.length - 1),
  f: toggleFullscreen,
  F: toggleFullscreen
};

/* ==========================================================================
   INTERAÇÕES (delegação de eventos: data-target, data-toggle, data-action)
   ========================================================================== */

/** Marca o botão como ativo e, se houver data-off, alterna o rótulo. */
function setActive(btn, on) {
  btn.classList.toggle('active', on);
  if (btn.dataset.off) {
    btn.dataset.on ??= btn.textContent.trim();
    btn.textContent = on ? btn.dataset.on : btn.dataset.off;
  }
}

/** Alterna um estado (cut, xray, explode, spin, anim) da cena do slide do botão. */
function toggleStage(btn) {
  const st = stages[[...slides].indexOf(btn.closest('.slide'))];
  if (!st) return;
  const key = btn.dataset.toggle;
  st.state[key] = !st.state[key];
  setActive(btn, st.state[key]);
  if (key === 'spin' && st.controls) st.controls.autoRotate = st.state.spin;
  st.apply?.();
}

function pulseCard(id, ms = 1200) {
  const card = $(id);
  card.classList.add('active-pulse');
  setTimeout(() => card.classList.remove('active-pulse'), ms);
}

function flash(id, attrs, restore, ms = 1000) {
  const el = $(id);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  setTimeout(() => Object.entries(restore).forEach(([k, v]) => el.setAttribute(k, v)), ms);
}

const ACTIONS = {
  fullscreen: toggleFullscreen,
  revolve: () => { revolution.rotating = true; },
  'revolve-reset': resetRevolution,
  layer: setTankLayer,
  'pulse-center': () => {
    pulseCard('card-geom-centro');
    flash('dot-origin-s2', { r: 11, filter: 'drop-shadow(0 0 16px #f59e0b)' }, { r: 7, filter: 'drop-shadow(0 0 8px #f59e0b)' });
  },
  'sweep-ext': () => {
    pulseCard('card-geom-raio-ext');
    flash('line-raio-ext-s2', { 'stroke-width': 6 }, { 'stroke-width': 3.5 });
  },
  'pulse-int': () => {
    pulseCard('card-geom-raio-int');
    flash('path-cavidade-s2', { fill: 'rgba(248,113,113,0.65)' }, { fill: 'rgba(248,113,113,0.25)' });
  },
  thickness: () => pulseCard('card-geom-espessura', 1400),
  'spin-symmetry': btn => setActive(btn, !$('group-symm-axes').classList.toggle('paused'))
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-target], [data-toggle], [data-action]');
  if (!el) return;
  if (el.dataset.target !== undefined) goToSlide(+el.dataset.target);
  else if (el.dataset.toggle) toggleStage(el);
  else ACTIONS[el.dataset.action]?.(el);
});

/* ==========================================================================
   INFRAESTRUTURA 3D
   ========================================================================== */

const std = opts => new THREE.MeshStandardMaterial(opts);
const ball = (r, material, seg = 48) =>
  new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), material);
const fmt = n => n.toFixed(1).replace('.', ',');

function sizeOf(el) {
  const { width, height } = el.getBoundingClientRect();
  return [width > 20 ? width : 500, height > 20 ? height : 320];
}

/** Cria cena, câmera, renderizador, OrbitControls e luzes; renderiza só quando o slide está ativo. */
function createStage(slide, containerId, { cam = [0, 3, 9], ambient = 0.6, light = 1.1, autoRotate = 0.8, clipping = false } = {}) {
  const el = $(containerId);
  const [w, h] = sizeOf(el);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x041220);

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(...cam);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.localClippingEnabled = clipping;
  el.appendChild(renderer.domElement);

  const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
  if (controls) Object.assign(controls, { enableDamping: true, autoRotate: autoRotate > 0, autoRotateSpeed: autoRotate });

  const sun = new THREE.DirectionalLight(0xffffff, light);
  sun.position.set(8, 12, 10);
  scene.add(new THREE.AmbientLight(0xffffff, ambient), sun);

  const stage = { el, scene, camera, renderer, controls, state: {}, onFrame: null, apply: null };
  (function loop() {
    requestAnimationFrame(loop);
    if (current !== slide) return;
    stage.onFrame?.();
    controls?.update();
    renderer.render(scene, camera);
  })();
  return stage;
}

function resizeStage(st) {
  if (!st) return;
  const [w, h] = sizeOf(st.el);
  st.camera.aspect = w / h;
  st.camera.updateProjectionMatrix();
  st.renderer.setSize(w, h);
}

const SCENES = {
  1: buildRevolution,
  4: buildDisks,
  8: buildShellCut,
  9: buildFloat,
  10: buildFloatSlider,
  11: buildTank,
  15: buildTankLayers
};

function activateScene(i) {
  if (i === 1) drawRegion2D();
  if (!SCENES[i] || typeof THREE === 'undefined') return;
  if (stages[i]) resizeStage(stages[i]);
  else stages[i] = SCENES[i](i);
}

/* ==========================================================================
   SLIDE 1 — REGIÃO GERADORA 2D E REVOLUÇÃO 360°
   ========================================================================== */

function drawRegion2D() {
  const canvas = $('canvas-2d-s1');
  const ctx = canvas.getContext('2d');
  const [width, height] = sizeOf(canvas.parentElement);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const ox = width / 2, oy = height - 26;
  const s = Math.min(width / 13, (height - 35) / 5.5);
  const R = 5, r = 3;
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const arc = rad => { ctx.beginPath(); ctx.arc(ox, oy, rad * s, Math.PI, 0); ctx.stroke(); };

  // Grade e eixos
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = -6; x <= 6; x++) line(ox + x * s, 0, ox + x * s, height);
  for (let y = 0; y <= 6; y++) line(0, oy - y * s, width, oy - y * s);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6; line(15, oy, width - 15, oy);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2; line(ox, oy, ox, 15);

  // Região sombreada (semi-anel)
  ctx.beginPath();
  ctx.arc(ox, oy, R * s, Math.PI, 0);
  ctx.lineTo(ox + r * s, oy);
  ctx.arc(ox, oy, r * s, 0, Math.PI, true);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, oy - R * s, 0, oy);
  grad.addColorStop(0, 'rgba(56,189,248,0.5)');
  grad.addColorStop(1, 'rgba(2,132,199,0.2)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Fronteiras e rótulos
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.4; arc(R);
  ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.0; arc(r);
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('R = 5', ox + 22, oy - R * s + 15);
  ctx.fillText('r = 3', ox + 10, oy - r * s + 14);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Eixo x (Rotação)', width - 100, oy - 8);
}

const revolution = { rotating: false, angle: 0 };
const s1Status = html => { $('s1-status-desc').innerHTML = html; };
const S1_IDLE = 'Ângulo de Rotação: <strong class="c-cyan">0&deg;</strong> &bull; Clique em "Gerar Rotação"';

function buildRevolution(slide) {
  const st = createStage(slide, 'container-3d-s1', { cam: [0, 6, 13], ambient: 0.65, light: 0.9 });
  const R = 3.8, r = 2.2;

  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  axis.rotation.z = Math.PI / 2;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI, false);
  shape.lineTo(-r, 0);
  shape.absarc(0, 0, r, Math.PI, 0, true);
  shape.lineTo(R, 0);
  const plate = new THREE.Mesh(new THREE.ShapeGeometry(shape, 32),
    std({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.35, side: THREE.DoubleSide }));

  const outer = new THREE.Mesh(undefined, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.2, side: THREE.DoubleSide }));
  const inner = new THREE.Mesh(undefined, std({ color: 0xf59e0b, transparent: true, opacity: 0.65, side: THREE.DoubleSide }));
  st.scene.add(axis, plate, outer, inner);

  const sweep = (mesh, rad, phi) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.SphereGeometry(rad, 36, 20, 0, phi, 0, Math.PI).rotateZ(Math.PI / 2);
  };
  st.setAngle = phi => { plate.rotation.x = phi; sweep(outer, R, phi); sweep(inner, r, phi); };
  st.setAngle(0.01);

  st.onFrame = () => {
    if (!revolution.rotating) return;
    revolution.angle = Math.min(revolution.angle + 0.035, Math.PI * 2);
    st.setAngle(revolution.angle);
    if (revolution.angle >= Math.PI * 2) {
      revolution.rotating = false;
      s1Status('Rotação Concluída (360&deg;): <strong class="c-green">Casca Esférica Gerada com Sucesso!</strong>');
    } else {
      s1Status(`Ângulo de Rotação: <strong class="c-cyan">${Math.round((revolution.angle / (Math.PI * 2)) * 360)}&deg;</strong>`);
    }
  };
  return st;
}

function resetRevolution() {
  Object.assign(revolution, { rotating: false, angle: 0 });
  stages[1]?.setAngle(0.01);
  s1Status(S1_IDLE);
}

/* ==========================================================================
   SLIDE 5 — ESFERAS CONCÊNTRICAS E DISCO FATIADOR ANIMADO
   ========================================================================== */

function buildDisks(slide) {
  const st = createStage(slide, 'container-3d-s2-disks', { cam: [0, 3.2, 9.5], ambient: 0.65, clipping: true });
  st.state = { anim: true, cut: false, spin: true };
  const R = 2.6, r = 1.56;
  const clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7, 16),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }));
  axis.rotation.z = Math.PI / 2;

  const outer = ball(R, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.1, transmission: 0.65, side: THREE.DoubleSide }));
  const inner = ball(r, std({ color: 0xf87171, transparent: true, opacity: 0.82, roughness: 0.25, metalness: 0.15, side: THREE.DoubleSide }), 36);

  const slab = h => new THREE.CylinderGeometry(1, 1, h, 48).rotateZ(Math.PI / 2);
  const disk = new THREE.Mesh(slab(0.05), std({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45, transparent: true, opacity: 0.88, roughness: 0.2 }));
  const hole = new THREE.Mesh(slab(0.06), new THREE.MeshBasicMaterial({ color: 0x041220 }));

  const circle = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 65 }, (_, k) => new THREE.Vector3(0, Math.cos(k * Math.PI / 32), Math.sin(k * Math.PI / 32))));
  const rimOuter = new THREE.Line(circle, new THREE.LineBasicMaterial({ color: 0x00f0ff }));
  const rimInner = new THREE.Line(circle, new THREE.LineBasicMaterial({ color: 0xf87171 }));

  st.scene.add(axis, outer, inner, disk, hole, rimOuter, rimInner, new THREE.PointLight(0xf87171, 1.2, 6));

  st.apply = () => {
    const { cut } = st.state;
    Object.assign(outer.material, { opacity: cut ? 0.85 : 0.35, roughness: cut ? 0.25 : 0.1, clippingPlanes: cut ? [clip] : [] });
    outer.material.needsUpdate = true;
  };

  const posText = $('s2-disk-pos-text');
  const areaText = $('s2-disk-area-text');
  let t = 0;
  st.onFrame = () => {
    if (!st.state.anim) return;
    t += 0.022;
    const x = 2.45 * Math.sin(t);
    const ro = Math.sqrt(Math.max(0.01, R * R - x * x));
    const ri = Math.sqrt(Math.max(0, r * r - x * x));
    const hasHole = ri > 0.05;

    [disk, rimOuter].forEach(m => { m.position.x = x; m.scale.set(1, ro, ro); });
    [hole, rimInner].forEach(m => { m.visible = hasHole; m.position.x = x; m.scale.set(1, ri || 1, ri || 1); });

    const X = (x / R) * 5; // escala didática R = 5, r = 3
    posText.textContent = `x = ${fmt(X)}`;
    areaText.textContent = Math.abs(X) < 3
      ? `π(R² − r²) = 16π ≈ ${fmt(16 * Math.PI)}`
      : `π(25 − x²) ≈ ${fmt(Math.PI * (25 - X * X))}`;
  };
  return st;
}

/* ==========================================================================
   MODELO GENÉRICO EM CAMADAS COM CORTE 90° (slides 9, 10 e 12)
   - cut: remove o quadrante x>0, z>0 e exibe as faces de corte em âmbar
   - xray: camadas translúcidas · explode: expansão radial suave · spin: giro 360°
   ========================================================================== */

function buildCutaway(slide, containerId, cfg) {
  const st = createStage(slide, containerId, { cam: cfg.cam, ambient: 0.55, light: 1.25, clipping: true });
  st.state = { cut: true, xray: false, explode: false, spin: true };

  const planes = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)];
  const group = new THREE.Group();
  st.scene.add(group);

  const layers = cfg.layers.map(({ r, mat, back = false, xray = 0.35, explode = 0 }) => {
    const mesh = ball(r, std({ ...mat, clipIntersection: true, side: back ? THREE.BackSide : THREE.DoubleSide }), 64);
    group.add(mesh);
    return { mesh, xray, explode, base: { transparent: !!mat.transparent, opacity: mat.opacity ?? 1 } };
  });

  const [rIn, rOut] = cfg.ring;
  const rings = [[new THREE.Vector3(1, 0, 0), 0], [new THREE.Vector3(0, 0, 1), Math.PI / 2]].map(([normal, rotY]) => {
    const face = new THREE.Mesh(new THREE.RingGeometry(rIn, rOut, 64).rotateY(rotY), std({
      color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.35, metalness: 0.7, roughness: 0.3,
      side: THREE.DoubleSide, clippingPlanes: [new THREE.Plane(normal, 0)]
    }));
    group.add(face);
    return face;
  });

  group.add(new THREE.PointLight(...cfg.glow));
  cfg.extras?.(st.scene, group);

  st.apply = () => {
    const { cut, xray } = st.state;
    const clip = cut && !xray;
    layers.forEach(({ mesh, xray: opacity, base }) => {
      Object.assign(mesh.material, xray ? { transparent: true, opacity } : base, { clippingPlanes: clip ? planes : [] });
      mesh.material.needsUpdate = true;
    });
    rings.forEach(face => { face.visible = clip; });
    if (cfg.status) $(cfg.status.id).innerHTML = cfg.status[xray ? 'xray' : cut ? 'cut' : 'closed'];
  };

  let k = 0;
  st.onFrame = () => {
    k += ((st.state.explode ? 1 : 0) - k) * 0.08;
    layers.forEach(L => L.mesh.scale.setScalar(1 + L.explode * k));
    rings.forEach(face => face.scale.setScalar(1 + layers[0].explode * k));
    cfg.onFrame?.(group);
  };

  st.apply();
  return st;
}

function buildShellCut(slide) {
  return buildCutaway(slide, 'container-3d-s2-final', {
    cam: [0, 3.2, 9.2],
    layers: [
      { r: 2.8, mat: { color: 0x38bdf8, metalness: 0.2, roughness: 0.25, transparent: true, opacity: 0.85 } },
      { r: 1.68, back: true, xray: 1, mat: { color: 0x05182a, roughness: 0.5 } }
    ],
    ring: [1.68, 2.8],
    glow: [0x38bdf8, 1.0, 5]
  });
}

function buildFloat(slide) {
  let t = 0;
  return buildCutaway(slide, 'container-3d-s3-intro', {
    cam: [0, 2.8, 8.5],
    layers: [
      { r: 2.5, explode: 0.25, mat: { color: 0xd8dde4, metalness: 0.94, roughness: 0.16 } },
      { r: 2.0, back: true, xray: 1, mat: { color: 0x06182a, roughness: 0.45 } }
    ],
    ring: [2.0, 2.5],
    glow: [0x38bdf8, 1.4, 5],
    onFrame: group => { t += 0.02; group.position.y = Math.sin(t * 1.8) * 0.08; }, // flutuação hidrodinâmica
    status: {
      id: 's3-intro-status',
      cut: 'Estado: <strong class="c-amber">Corte Técnico 90° Ativo &bull; Espessura de 2 cm Visível</strong>',
      xray: 'Estado: <strong class="c-cyan">Modo Raio-X Translúcido &bull; Cavidade Interna Flutuante</strong>',
      closed: 'Estado: <strong class="c-white">Esfera Metálica Fechada (R = 10 cm)</strong>'
    }
  });
}

function buildTank(slide) {
  return buildCutaway(slide, 'container-3d-s4-intro', {
    cam: [0, 3.2, 9.8],
    layers: [
      { r: 2.6, explode: 0.25, mat: { color: 0x94a3b8, metalness: 0.88, roughness: 0.22 } },
      { r: 2.56, explode: 0.14, xray: 0.45, mat: { color: 0xf59e0b, emissive: 0x92400e, emissiveIntensity: 0.35, roughness: 0.75 } },
      { r: 2.0, xray: 0.85, mat: { color: 0x00f0ff, emissive: 0x0284c7, emissiveIntensity: 0.45, roughness: 0.16, metalness: 0.2 } }
    ],
    ring: [2.0, 2.56],
    glow: [0x00f0ff, 2.0, 6],
    extras: (scene, group) => {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 0.6, 32), std({ color: 0x334155, roughness: 0.8 }));
      base.position.y = -2.8;
      scene.add(base);
      // Tubulações criogênicas atravessando as camadas
      const pipe = std({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4, 16), pipe);
      top.position.set(0, 2.5, 0);
      const side = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16), pipe);
      side.position.set(1.5, 1.5, 0);
      side.rotation.z = Math.PI / 3;
      group.add(top, side);
    },
    status: {
      id: 's4-intro-status',
      cut: 'Visualização: <strong class="c-amber">3 Camadas Concêntricas em Corte Técnico 90° &bull; Perlita Entrelaçada</strong>',
      xray: 'Visualização: <strong class="c-cyan">Raio-X Translúcido &bull; Esferas Concêntricas Sobrepostas</strong>',
      closed: 'Visualização: <strong class="c-white">Tanque Blindado Fechado (R = 2,5 m)</strong>'
    }
  });
}

/* ==========================================================================
   SLIDE 11 — FLUTUADOR COM SLIDER DE CORTE
   ========================================================================== */

let floatSlicePlane = null;
const sliceZ = percent => 2.8 - (percent / 100) * 5.6;

function buildFloatSlider(slide) {
  const st = createStage(slide, 'container-3d-s3-interactive', { cam: [0, 3, 8.5], ambient: 0.45, light: 1.2, clipping: true });
  floatSlicePlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), sliceZ(+$('slider-s3-cut').value));
  const clip = [floatSlicePlane];
  st.scene.add(
    ball(2.7, std({ color: 0xd8dde4, metalness: 0.9, roughness: 0.18, side: THREE.DoubleSide, clippingPlanes: clip })),
    ball(2.1, std({ color: 0x06182a, side: THREE.BackSide, clippingPlanes: clip }), 36)
  );
  return st;
}

/* ==========================================================================
   SLIDE 16 — CAMADAS DO TANQUE E LIMITAÇÕES DO MODELO
   ========================================================================== */

const TANK_MODES = {
  outer: { opacity: 1, show: [], text: '1. Capa Externa Totalmente Opaca' },
  perlite: { opacity: 0.25, show: ['perlite', 'inner'], text: '2. Camada Isolante de Perlita Expandida (Volume = 31,94 m³)' },
  limits: { opacity: 0.2, show: ['perlite', 'inner', 'pipes'], text: '3. Limitação do Modelo: Tubulações reais quebrando a simetria e continuidade' }
};
let tankMode = 'outer';

function setTankLayer(btn) {
  tankMode = btn.dataset.layer;
  document.querySelectorAll('[data-layer]').forEach(b => b.classList.toggle('active', b === btn));
  $('s4-state-text').textContent = TANK_MODES[tankMode].text;
  $('s4-pipe-legend').hidden = tankMode !== 'limits';
  stages[15]?.applyLayer();
}

function buildTankLayers(slide) {
  const st = createStage(slide, 'container-3d-s4-interactive', { cam: [0, 4, 11], ambient: 0.55, light: 0.95 });
  const R = 3.1, r = 2.45;
  const outer = ball(R, std({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3, side: THREE.DoubleSide }));
  const parts = {
    perlite: ball((R + r) / 2, std({ color: 0xfde047, transparent: true, opacity: 0.65, roughness: 0.7, side: THREE.DoubleSide }), 40),
    inner: ball(r, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.3, side: THREE.DoubleSide }), 36),
    pipes: new THREE.Group()
  };
  const pipeMat = std({ color: 0xf87171, metalness: 0.7 });
  [[0.18, 4.0, [0, 2.5, 0], 0], [0.12, 3.5, [2.4, 0, 0], Math.PI / 2], [0.14, 3.6, [0, -2.4, 0], 0]]
    .forEach(([rad, len, pos, rotZ]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, len, 16), pipeMat);
      p.position.set(...pos);
      p.rotation.z = rotZ;
      parts.pipes.add(p);
    });
  st.scene.add(outer, ...Object.values(parts));

  st.applyLayer = () => {
    const mode = TANK_MODES[tankMode];
    Object.assign(outer.material, { transparent: mode.opacity < 1, opacity: mode.opacity });
    outer.material.needsUpdate = true;
    Object.entries(parts).forEach(([name, obj]) => { obj.visible = mode.show.includes(name); });
  };
  st.applyLayer();
  return st;
}

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

function renderMath(attempt = 1) {
  if (typeof renderMathInElement !== 'function') {
    if (attempt < 15) setTimeout(() => renderMath(attempt + 1), 200);
    return;
  }
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
    throwOnError: false
  });
}

document.addEventListener('DOMContentLoaded', () => {
  $('btn-prev').addEventListener('click', () => goToSlide(current - 1));
  $('btn-next').addEventListener('click', () => goToSlide(current + 1));
  $('slider-s3-cut').addEventListener('input', e => {
    $('slider-s3-val').textContent = `${e.target.value}%`;
    if (floatSlicePlane) floatSlicePlane.constant = sliceZ(+e.target.value);
  });
  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea') || !KEYS[e.key]) return;
    e.preventDefault();
    KEYS[e.key]();
  });
  window.addEventListener('resize', () => {
    if (current === 1) drawRegion2D();
    resizeStage(stages[current]);
  });

  renderMath();
  goToSlide(0);
});
