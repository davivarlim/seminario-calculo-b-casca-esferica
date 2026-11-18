/* ==========================================================================
   Casca de Esfera — Seminário de Cálculo B (UFPel)
   Motor da apresentação: navegação, KaTeX, Canvas 2D e cenas 3D (Three.js r128)
   ========================================================================== */
'use strict';

const SLIDE_TITLES = [
  'Capa Oficial',
  'PARTE 1: Definição Formal no R³ e Pitágoras',
  'PARTE 1: Círculo Perfeito e Região Geradora',
  'PARTE 1: Elementos Constituintes',
  'PARTE 1: GeoGebra (R=5, r=3)',
  'PARTE 2: Soma de Riemann à Integral',
  'PARTE 2: Discos vs. Cascas Cilíndricas',
  'PARTE 2: Montagem e Propriedades',
  'PARTE 2: Antiderivada (Primitiva)',
  'PARTE 2: Teorema Fundamental do Cálculo',
  'PARTE 2: Fórmula Final e Derivada',
  'PARTE 3: Flutuador de Aço (Enunciado)',
  'PARTE 3: Resolução, SI e Interpretação',
  'PARTE 4: Tanque Criogênico (LH₂)',
  'PARTE 4: GeoGebra — Curvas 2D e 180°',
  'PARTE 4: GeoGebra — 3D Paramétrico',
  'PARTE 4: Integral do Isolamento e Massa',
  'PARTE 4: Discussão Crítica e Limitações',
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

function setActive(btn, on) {
  btn.classList.toggle('active', on);
  if (btn.dataset.off) {
    btn.dataset.on ??= btn.textContent.trim();
    btn.textContent = on ? btn.dataset.on : btn.dataset.off;
  }
}

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
const fmt = (n, dec = 1) => n.toFixed(dec).replace('.', ',');

function sizeOf(el) {
  const { width, height } = el.getBoundingClientRect();
  return [width > 20 ? width : 500, height > 20 ? height : 320];
}

function setupCanvas(canvas) {
  const [width, height] = sizeOf(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function createStage(slide, containerId, { cam = [0, 3, 9], ambient = 0.6, light = 1.1, autoRotate = 0.8, clipping = false } = {}) {
  const el = $(containerId);
  const [w, h] = sizeOf(el);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061423);

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
  2: buildRevolution,
  6: buildDisks,
  10: buildShellCut,
  11: buildFloat,
  12: buildFloatSlider,
  13: buildTank,
  17: buildTankLayers
};

function activateScene(i) {
  if (i === 1) drawPythagoras3D();
  if (i === 2) drawRegion2D();
  if (i === 5) drawRiemann2D();
  if (!SCENES[i] || typeof THREE === 'undefined') return;
  if (stages[i]) resizeStage(stages[i]);
  else stages[i] = SCENES[i](i);
}

/* ==========================================================================
   SLIDE 1 — PITÁGORAS NO ESPAÇO 3D (DISTÂNCIA d = √(x² + y² + z²))
   ========================================================================== */

function drawPythagoras3D() {
  const canvas = $('canvas-pythagoras-3d');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width * 0.48;
  const cy = height * 0.46;
  const rad = Math.min(width * 0.36, height * 0.34);
  const R = 5, r = 3;
  const rPx = rad * (r / R);

  const line = (x1, y1, x2, y2, dash = []) => {
    ctx.save();
    ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  };
  const dot = (x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
  };

  // Esfera externa (R=5) e interna (r=3)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(6, 20, 35, 0.75)';
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.78)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);

  // Equador em perspectiva
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(cx, cy, rad, rad * 0.3, 0, 0, Math.PI * 2); ctx.stroke();

  // Eixos 3D isométricos (x, y, z)
  const proj = (x, y, z) => [
    cx + (y - x * 0.52) * (rad / R),
    cy + (x * 0.34 - z) * (rad / R)
  ];
  const [xEndX, xEndY] = proj(5.6, 0, 0);
  const [yEndX, yEndY] = proj(0, 5.8, 0);
  const [zEndX, zEndY] = proj(0, 0, 5.5);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)'; ctx.lineWidth = 1.3;
  line(cx, cy, xEndX, xEndY);
  line(cx, cy, yEndX, yEndY);
  line(cx, cy, zEndX, zEndY);

  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('x', xEndX - 10, xEndY + 12);
  ctx.fillText('y', yEndX + 6, yEndY + 4);
  ctx.fillText('z', zEndX - 4, zEndY - 8);

  // Ponto P(x, y, z) dentro da casca (d ≈ 4, entre r=3 e R=5)
  const px = 2.4, py = 2.2, pz = 2.35;
  const [ax, ay] = proj(px, 0, 0);
  const [bx, by] = proj(px, py, 0);
  const [px2d, py2d] = proj(px, py, pz);

  // Triângulo 1 (base xy): x e y -> diagonal p
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.2;
  line(cx, cy, ax, ay);
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.2;
  line(ax, ay, bx, by);
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.75)'; ctx.lineWidth = 1.8;
  line(cx, cy, bx, by, [4, 3]);

  // Triângulo 2 (vertical p e z -> hipotenusa d)
  ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.2;
  line(bx, by, px2d, py2d);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  line(cx, cy, px2d, py2d);

  // Rótulos dos catetos e da distância d
  dot(cx, cy, 4, '#ffffff');
  dot(bx, by, 3, '#cbd5e1');
  dot(px2d, py2d, 5, '#f59e0b');

  const pillText = (text, x, y, color, align = 'left') => {
    ctx.save();
    ctx.font = 'bold 11.5px Inter, sans-serif';
    ctx.textAlign = align;
    const w = ctx.measureText(text).width + 8;
    const rx = align === 'right' ? x - w + 4 : align === 'center' ? x - w / 2 : x - 4;
    ctx.fillStyle = 'rgba(6, 20, 35, 0.86)';
    ctx.fillRect(rx, y - 11, w, 15);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#38bdf8'; ctx.fillText('x', (cx + ax) / 2 - 18, (cy + ay) / 2 - 4);
  ctx.fillStyle = '#34d399'; ctx.fillText('y', (ax + bx) / 2, (ay + by) / 2 + 15);
  pillText('p = √(x²+y²)', bx + 8, by + 14, '#cbd5e1', 'left');
  ctx.fillStyle = '#c084fc'; ctx.fillText('z', bx + 7, (by + py2d) / 2);
  pillText('d = √(x²+y²+z²)', (cx + px2d) / 2 - 8, (cy + py2d) / 2 - 12, '#fbbf24', 'right');
  ctx.fillStyle = '#ffffff'; ctx.fillText('P(x, y, z)', px2d + 8, py2d - 4);
  ctx.fillStyle = '#94a3b8'; ctx.fillText('C(0,0,0)', cx - 56, cy + 4);

  // Rótulos de R e r nas bordas
  ctx.fillStyle = '#38bdf8'; ctx.fillText('R = 5 (borda)', cx - rad + 4, cy - rad + 16);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171'; ctx.fillText('r = 3 (oco)', cx, cy + rPx - 12);
  ctx.restore();

  // Régua inferior mostrando r ≤ d ≤ R
  const barW = Math.min(width - 60, 420);
  const bx0 = (width - barW) / 2;
  const barY = height - 26;
  const rStop = bx0 + barW * (r / R);
  const dStop = bx0 + barW * (4 / R);

  ctx.strokeStyle = 'rgba(248, 113, 113, 0.55)'; ctx.lineWidth = 4;
  line(bx0, barY, rStop, barY);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6;
  line(rStop, barY, bx0 + barW, barY);

  dot(bx0, barY, 3.5, '#94a3b8');
  dot(rStop, barY, 4.5, '#f87171');
  dot(dStop, barY, 5, '#f59e0b');
  dot(bx0 + barW, barY, 4.5, '#38bdf8');

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8'; ctx.fillText('0', bx0, barY + 15);
  ctx.fillStyle = '#f87171'; ctx.fillText('r = 3', rStop, barY + 15);
  ctx.fillStyle = '#fbbf24'; ctx.fillText('d (na casca)', dStop, barY - 10);
  ctx.fillStyle = '#38bdf8'; ctx.fillText('R = 5', bx0 + barW, barY + 15);
  ctx.restore();
}

/* ==========================================================================
   SLIDE 2 — CÍRCULO DE PITÁGORAS, REGIÃO GERADORA 2D E REVOLUÇÃO 360°
   ========================================================================== */

function drawRegion2D() {
  const canvas = $('canvas-2d-s1');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const ox = width / 2, oy = height - 48;
  const s = Math.min(width / 14.0, (height - 68) / 5.4);
  const R = 5, r = 3;
  const line = (x1, y1, x2, y2, dash = []) => {
    ctx.save(); ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  };
  const arc = rad => { ctx.beginPath(); ctx.arc(ox, oy, rad * s, Math.PI, 0); ctx.stroke(); };
  const dot = (x, y, rad, color) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  };

  // Grade suave
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = -6; x <= 6; x++) line(ox + x * s, 10, ox + x * s, oy + 6);
  for (let y = 0; y <= 6; y++) line(15, oy - y * s, width - 15, oy - y * s);

  // Eixos x e y
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6; line(15, oy, width - 15, oy);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2; line(ox, oy + 6, ox, 14);

  // Região geradora ℛ sombreada
  ctx.beginPath();
  ctx.arc(ox, oy, R * s, Math.PI, 0);
  ctx.lineTo(ox + r * s, oy);
  ctx.arc(ox, oy, r * s, 0, Math.PI, true);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, oy - R * s, 0, oy);
  grad.addColorStop(0, 'rgba(56,189,248,0.48)');
  grad.addColorStop(1, 'rgba(2,132,199,0.16)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Contornos das curvas f(x) e g(x)
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6; arc(R);
  ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2; arc(r);

  // Triângulo Retângulo de Pitágoras no 1º quadrante (x² + y² = R²)
  const aR = 38 * Math.PI / 180;
  const rx = ox + R * s * Math.cos(aR), ry = oy - R * s * Math.sin(aR);
  // Cateto x (horizontal na base)
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
  line(ox, oy, rx, oy);
  // Cateto y (vertical até a borda externa)
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.2;
  line(rx, oy, rx, ry, [4, 3]);
  // Símbolo 90° no canto reto (rx, oy)
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.4;
  ctx.strokeRect(rx - 8, oy - 8, 8, 8);
  // Hipotenusa R = 5
  ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2.6;
  line(ox, oy, rx, ry);
  dot(rx, ry, 4.5, '#38bdf8');

  ctx.font = 'bold 11.5px Inter, sans-serif';
  ctx.fillStyle = '#e2e8f0'; ctx.fillText('x', (ox + rx) / 2 - 4, oy - 5);
  ctx.fillStyle = '#fbbf24'; ctx.fillText('y', rx + 6, (oy + ry) / 2 + 4);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillText('R = 5', ox + 3.9 * s * Math.cos(aR) - 34, oy - 3.9 * s * Math.sin(aR) - 8);

  // Vetor radial do Raio Interno r (no 2º quadrante a 140°)
  const ar = 140 * Math.PI / 180;
  const irx = ox + r * s * Math.cos(ar), iry = oy - r * s * Math.sin(ar);
  ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 2.2;
  line(ox, oy, irx, iry);
  dot(irx, iry, 4, '#f87171');
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('r = 3', ox + 1.55 * s * Math.cos(ar) - 24, oy - 1.55 * s * Math.sin(ar) + 14);
  dot(ox, oy, 3.5, '#ffffff');

  // Rótulo centralizado da Região Geradora ℛ dentro da faixa sombreada
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Região Geradora ℛ', ox - 2.35 * s, oy - 3.3 * s);
  ctx.restore();

  // Marcadores de pontos no eixo x: -R, -r, 0, r, R
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 11px Inter, sans-serif';
  [
    [-R, '-R (-5)', '#38bdf8'],
    [-r, '-r (-3)', '#f87171'],
    [0, '0', '#cbd5e1'],
    [r, 'r (3)', '#f87171'],
    [R, 'R (5)', '#38bdf8']
  ].forEach(([val, lbl, col]) => {
    const px = ox + val * s;
    dot(px, oy, 3, col);
    ctx.fillStyle = col;
    ctx.fillText(lbl, px, oy + 14);
  });

  // Barras visuais dos intervalos [-r, r] e [-R, R] abaixo do eixo x
  const drawInterval = (rad, yBar, color, label) => {
    const x1 = ox - rad * s, x2 = ox + rad * s;
    ctx.strokeStyle = color; ctx.lineWidth = 1.6;
    line(x1, yBar, x2, yBar);
    line(x1, yBar - 3, x1, yBar + 3);
    line(x2, yBar - 3, x2, yBar + 3);
    ctx.fillStyle = '#061423';
    ctx.fillRect(ox - 24, yBar - 7, 48, 13);
    ctx.fillStyle = color;
    ctx.font = 'bold 10.5px Fira Code, monospace';
    ctx.fillText(label, ox, yBar + 3.5);
  };
  drawInterval(r, oy + 26, '#f87171', '[-r, r]');
  drawInterval(R, oy + 40, '#38bdf8', '[-R, R]');
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'right';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Eixo x', width - 12, oy - 19);
  ctx.fillText('(Rotação)', width - 12, oy - 7);
  ctx.restore();
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
      s1Status('Rotação Concluída (360&deg;): <strong class="c-green">Casca Esférica Gerada!</strong>');
    } else {
      s1Status(`Ângulo de Rotação: <strong class="c-cyan">${Math.round((revolution.angle / (Math.PI * 2)) * 360)}&deg;</strong>`);
    }
  };
  return st;
}

function resetRevolution() {
  Object.assign(revolution, { rotating: false, angle: 0 });
  stages[2]?.setAngle(0.01);
  s1Status(S1_IDLE);
}

/* ==========================================================================
   SLIDE 4 — SOMA DE RIEMANN INTERATIVA (NOVO)
   ========================================================================== */

function drawRiemann2D() {
  const canvas = $('canvas-riemann');
  const slider = $('slider-riemann-n');
  if (!canvas || !slider) return;

  const n = +slider.value;
  $('riemann-n-val').textContent = n;

  const { ctx, width, height } = setupCanvas(canvas);
  const R = 5;
  const s = Math.min((width - 60) / 11, (height - 74) / 5.4);
  const ox = width / 2;
  const oy = (height + 4.8 * s) / 2;
  const topY = Math.max(24, oy - 5.3 * s);

  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };

  // Grade suave limitada à região útil do gráfico
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = -5; x <= 5; x++) line(ox + x * s, topY, ox + x * s, oy + 10);
  for (let y = 0; y <= 5; y++) line(ox - 5.4 * s, oy - y * s, ox + 5.4 * s, oy - y * s);

  // Retângulos / Discos de Riemann (ponto médio)
  const dx = (2 * R) / n;
  const sampleIdx = Math.floor(n * 0.65);
  let sumVol = 0;

  for (let i = 0; i < n; i++) {
    const x0 = -R + i * dx;
    const xMid = x0 + dx / 2;
    const yMid = Math.sqrt(Math.max(0, R * R - xMid * xMid));
    sumVol += Math.PI * (R * R - xMid * xMid) * dx;

    const px = ox + x0 * s;
    const pw = dx * s;
    const ph = yMid * s;
    const isSample = i === sampleIdx;

    ctx.fillStyle = isSample ? 'rgba(245, 158, 11, 0.42)' : 'rgba(56, 189, 248, 0.24)';
    ctx.strokeStyle = isSample ? '#f59e0b' : 'rgba(56, 189, 248, 0.78)';
    ctx.lineWidth = isSample ? 2 : 1;
    ctx.fillRect(px, oy - ph, pw, ph);
    ctx.strokeRect(px, oy - ph, pw, ph);

    if (isSample) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(ox + xMid * s, oy - ph, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Eixos e curva exata y = sqrt(R² - x²)
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  line(Math.max(20, ox - 5.6 * s), oy, Math.min(width - 20, ox + 5.6 * s), oy);
  line(ox, oy + 8, ox, topY);

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(ox, oy, R * s, Math.PI, 0);
  ctx.stroke();

  // Rótulos didáticos limpos
  ctx.font = '600 12px Inter, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('-R', ox - R * s - 8, oy + 18);
  ctx.fillText('0', ox - 3, oy + 18);
  ctx.fillText('R', ox + R * s - 4, oy + 18);

  const sx = ox + (-R + (sampleIdx + 0.5) * dx) * s;
  const sy = oy - Math.sqrt(Math.max(0, R * R - Math.pow(-R + (sampleIdx + 0.5) * dx, 2))) * s;
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('y(xᵢ*)', sx + 6, Math.max(topY + 10, sy - 6));
  ctx.fillText(`Δx = ${fmt(dx, 2)}`, Math.min(width - 90, sx - 12), oy + 18);

  const exact = (4 / 3) * Math.PI * Math.pow(R, 3);
  $('riemann-status').innerHTML =
    `n = <strong class="c-cyan">${n}</strong> | Δx = <strong class="c-cyan">${fmt(dx, 2)}</strong> | ` +
    `Soma Vₙ ≈ <strong class="c-amber">${fmt(sumVol, 2)}</strong> | Integral = <strong class="c-green">${fmt(exact, 2)}</strong>`;
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
  const hole = new THREE.Mesh(slab(0.06), new THREE.MeshBasicMaterial({ color: 0x061423 }));

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

    const X = (x / R) * 5;
    posText.textContent = `x = ${fmt(X)}`;
    areaText.textContent = Math.abs(X) < 3
      ? `π(R² − r²) = 16π ≈ ${fmt(16 * Math.PI)}`
      : `π(25 − x²) ≈ ${fmt(Math.PI * (25 - X * X))}`;
  };
  return st;
}

/* ==========================================================================
   MODELO GENÉRICO EM CAMADAS COM CORTE 90° (slides 9, 10 e 12)
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
    onFrame: group => { t += 0.02; group.position.y = Math.sin(t * 1.8) * 0.08; },
    status: {
      id: 's3-intro-status',
      cut: 'Estado: <strong class="c-amber">Corte 90° Ativo &bull; Espessura de 2 cm</strong>',
      xray: 'Estado: <strong class="c-cyan">Modo Raio-X &bull; Cavidade Oca Visível</strong>',
      closed: 'Estado: <strong class="c-white">Flutuador Fechado (R = 10 cm)</strong>'
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
      cut: 'Visualização: <strong class="c-amber">Corte Técnico 90° &bull; 3 Camadas</strong>',
      xray: 'Visualização: <strong class="c-cyan">Raio-X &bull; Camadas Concêntricas</strong>',
      closed: 'Visualização: <strong class="c-white">Tanque Fechado (R = 2,5 m)</strong>'
    }
  });
}

/* ==========================================================================
   SLIDE 11 — FLUTUADOR COM SLIDER DE CORTE
   ========================================================================== */

let floatSlicePlane = null;
const sliceZ = percent => 2.8 - (percent / 100) * 5.6;

function buildFloatSlider(slide) {
  const st = createStage(slide, 'container-3d-s3-interactive', { cam: [4.2, 2.8, 9.2], ambient: 0.65, light: 1.25, clipping: true });
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
  perlite: { opacity: 0.25, show: ['perlite', 'inner'], text: '2. Perlita Expandida (Volume = 31,94 m³)' },
  limits: { opacity: 0.2, show: ['perlite', 'inner', 'pipes'], text: '3. Limitações: Tubulações perfurando a casca' }
};
let tankMode = 'outer';

function setTankLayer(btn) {
  tankMode = btn.dataset.layer;
  document.querySelectorAll('[data-layer]').forEach(b => b.classList.toggle('active', b === btn));
  $('s4-state-text').textContent = TANK_MODES[tankMode].text;
  $('s4-pipe-legend').hidden = tankMode !== 'limits';
  stages[17]?.applyLayer();
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

  $('slider-s3-cut')?.addEventListener('input', e => {
    $('slider-s3-val').textContent = `${e.target.value}%`;
    if (floatSlicePlane) floatSlicePlane.constant = sliceZ(+e.target.value);
  });

  $('slider-riemann-n')?.addEventListener('input', drawRiemann2D);

  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea') || !KEYS[e.key]) return;
    e.preventDefault();
    KEYS[e.key]();
  });

  window.addEventListener('resize', () => {
    if (current === 1) drawPythagoras3D();
    if (current === 2) drawRegion2D();
    if (current === 5) drawRiemann2D();
    resizeStage(stages[current]);
  });

  renderMath();
  goToSlide(0);
});
