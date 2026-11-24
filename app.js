/* ==========================================================================
   Casca de Esfera — Seminário de Cálculo B (UFPel)
   Motor da apresentação: navegação, KaTeX, Canvas 2D e cenas 3D (Three.js r128)
   ========================================================================== */
'use strict';

const SLIDE_TITLES = [
  'Capa Oficial',
  'PARTE 1: Semicírculo e Giro 360°',
  'PARTE 1: Origem de V = (4/3)πR³',
  'PARTE 1: Da Esfera à Casca Esférica (R e r)',
  'PARTE 1: Distâncias dₓᵧ e d no R³',
  'PARTE 1: Por Que Isolar y?',
  'PARTE 1: Região Geradora e Revolução 360°',
  'PARTE 1: Elementos Constituintes',
  'PARTE 1: GeoGebra (R=5, r=3)',
  'PARTE 2: Soma de Riemann à Integral',
  'PARTE 2: Discos vs. Cascas Cilíndricas',
  'PARTE 2: Montagem e Propriedades',
  'PARTE 2: Antiderivada (Primitiva)',
  'PARTE 2: Teorema Fundamental do Cálculo',
  'PARTE 2: Fórmula Final e Derivada',
  'PARTE 3: Bola de Chocolate — ENEM PPL 2023',
  'PARTE 3: Resolução, Massa e SI',
  'PARTE 4: Reservatório de Água em Concreto',
  'PARTE 4: GeoGebra — Curvas 2D e 180°',
  'PARTE 4: GeoGebra — 3D Paramétrico',
  'PARTE 4: Integral do Concreto e Massa',
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

  if (i !== 2 && introAnim.raf) {
    cancelAnimationFrame(introAnim.raf);
    introAnim.raf = 0;
  }
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
  'semi-revolve': () => { semiRev.rotating = true; },
  'semi-reset': resetSemiRevolution,
  revolve: () => {
    revolution.rotating = !revolution.rotating;
    if ($('btn-s1-rotate')) $('btn-s1-rotate').textContent = revolution.rotating ? '⏸ Pausar' : '▶ Retomar';
  },
  'revolve-reset': resetRevolution,
  layer: setTankLayer,
  'pyth-step': btn => {
    pythStep = btn.dataset.step;
    document.querySelectorAll('[data-action="pyth-step"]').forEach(b => b.classList.toggle('active', b === btn));
    drawPythagoras3D();
  },
  'why-y-mode': btn => {
    whyYMode = btn.dataset.mode;
    document.querySelectorAll('[data-action="why-y-mode"]').forEach(b => b.classList.toggle('active', b === btn));
    drawWhyIsolateY();
  },
  'intro-toggle': () => toggleIntroPlay(),
  'intro-replay': () => jumpIntroStage(0, true),
  'intro-prev': () => jumpIntroStage(introAnim.stageIdx - 1, true),
  'intro-next': () => jumpIntroStage(introAnim.stageIdx + 1, true),
  'intro-stage': btn => jumpIntroStage(+btn.dataset.stage, true),
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

const cLine = (ctx, x1, y1, x2, y2, dash = []) => {
  ctx.save(); ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
};
const cDot = (ctx, x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
};
const cPillText = (ctx, text, x, y, color, align = 'left', font = 'bold 11.5px Inter, sans-serif') => {
  ctx.save(); ctx.font = font; ctx.textAlign = align;
  const w = ctx.measureText(text).width + 8;
  const rx = align === 'right' ? x - w + 4 : align === 'center' ? x - w / 2 : x - 4;
  ctx.fillStyle = 'rgba(6, 20, 35, 0.88)';
  ctx.fillRect(rx, y - 11, w, 15);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
};

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
  1: buildSemiRevolution,
  6: buildRevolution,
  10: buildDisks,
  14: buildShellCut,
  15: buildFloat,
  16: buildFloatSlider,
  17: buildTank,
  21: buildTankLayers
};

let pythStep = 'all';
let whyYMode = 'x-axis';

function activateScene(i) {
  if (i === 1) drawSemicircleParts();
  if (i === 2) startIntroAnim(false);
  if (i === 3) drawShellConcept();
  if (i === 4) drawPythagoras3D();
  if (i === 5) drawWhyIsolateY();
  if (i === 6) {
    drawRegion2D();
    revolution.rotating = true;
    revolution.hold = 0;
    if ($('btn-s1-rotate')) $('btn-s1-rotate').textContent = '⏸ Pausar';
  }
  if (i === 9) drawRiemann2D();
  if (!SCENES[i] || typeof THREE === 'undefined') return;
  if (stages[i]) resizeStage(stages[i]);
  else stages[i] = SCENES[i](i);
}

/* ==========================================================================
   SLIDE 2 — ANIMAÇÃO FIEL: DE ONDE VEM V = (4/3)πR³? + PONTE À CASCA
   ========================================================================== */

const INTRO_STAGE_DURATION = 5200;
const INTRO_STAGES = [
  { label: '1. Fórmula', status: 'Você conhece a fórmula do volume da esfera. Mas <strong class="c-amber">de onde surgiu esse 4/3?</strong>' },
  { label: '2. Discos', status: 'Cortamos a esfera em <strong class="c-amber">discos cada vez mais finos (&Delta;x &rarr; 0)</strong> e somamos seus volumes.' },
  { label: '3. Girar x', status: 'Giramos o desenho para deixar o <strong class="c-cyan">eixo x na horizontal</strong> (de &minus;R até R).' },
  { label: '4. Pitágoras', status: 'Pelo Teorema de Pitágoras: <strong class="c-cyan">x&sup2;</strong> + <strong class="c-amber">y&sup2;</strong> = R&sup2; &rArr; <strong class="c-amber">y&sup2; = R&sup2; &minus; x&sup2;</strong>.' },
  { label: '5. Integral', status: 'Cada disco contribui com <strong class="c-cyan">&pi;(R&sup2; &minus; x&sup2;)dx</strong>; a integral soma tudo de &minus;R até R.' },
  { label: '6. Origem 4/3', status: 'Nos limites: <strong class="c-amber">2/3 &minus; (&minus;2/3) = 2/3 + 2/3 = 4/3</strong> &mdash; é daqui que vem o 4/3!' },
  { label: '7. V = 4/3 πR³', status: 'Resultado: <strong class="c-green">V = (4/3)&pi;R&sup3;</strong> &bull; Adaptação: na <strong class="c-cyan">Casca</strong> subtraímos r de R!' }
];

const introAnim = { stageIdx: 0, progress: 0, playing: true, lastTick: 0, raf: 0, renderedIdx: -1 };
const clamp01 = x => Math.max(0, Math.min(1, x));
const easeIO = x => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function drawStackedFrac(ctx, x, y, num, den, size, color) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Inter, sans-serif`;
  const w = Math.max(ctx.measureText(num).width, ctx.measureText(den).width) + 8;
  ctx.fillText(num, x, y - size * 0.28);
  ctx.fillText(den, x, y + size * 0.85);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.08);
  cLine(ctx, x - w / 2, y + size * 0.06, x + w / 2, y + size * 0.06);
  ctx.restore();
  return w;
}

function drawWireSphere(ctx, cx, cy, rad, spin, tilt, sliceU, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const sg = ctx.createRadialGradient(cx - rad * 0.32, cy - rad * 0.32, rad * 0.06, cx, cy, rad);
  sg.addColorStop(0, 'rgba(56, 189, 248, 0.34)');
  sg.addColorStop(0.65, 'rgba(2, 132, 199, 0.14)');
  sg.addColorStop(1, 'rgba(6, 20, 35, 0.28)');
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();

  const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
  const cosS = Math.cos(spin), sinS = Math.sin(spin);
  const project = (lx, ly, lz) => {
    const rx = lx * cosS + lz * sinS;
    const rz = -lx * sinS + lz * cosS;
    const tx = rx * cosT - ly * sinT;
    const ty = rx * sinT + ly * cosT;
    return [cx + tx * rad, cy - ty * rad, rz];
  };

  ctx.lineWidth = 1.05;
  // Paralelos ao longo do eixo principal
  for (let i = -4; i <= 4; i++) {
    const u = i / 5, rr = Math.sqrt(1 - u * u);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.34)';
    ctx.beginPath();
    for (let k = 0; k <= 40; k++) {
      const a = (k / 40) * Math.PI * 2;
      const [px, py] = project(rr * Math.cos(a), u, rr * Math.sin(a));
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  // Meridianos
  for (let j = 0; j < 8; j++) {
    const phi = (j / 8) * Math.PI;
    const cPhi = Math.cos(phi), sPhi = Math.sin(phi);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.beginPath();
    for (let k = 0; k <= 40; k++) {
      const th = (k / 40) * Math.PI * 2;
      const [px, py] = project(Math.sin(th) * cPhi, Math.cos(th), Math.sin(th) * sPhi);
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();

  if (sliceU !== null && Math.abs(sliceU) < 0.96) {
    const sr = rad * Math.sqrt(1 - sliceU * sliceU);
    const sx = cx + Math.sin(tilt) * sliceU * rad;
    const sy = cy - Math.cos(tilt) * sliceU * rad;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.30)';
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(sx, sy, sr, sr * 0.28, tilt, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function drawSlicedDiscs(ctx, cx, cy, rad, n, tilt, activeU) {
  let bestI = 0, bestDiff = 9;
  for (let i = 0; i < n; i++) {
    const u = -0.92 + 1.84 * (i / Math.max(1, n - 1));
    if (Math.abs(u - activeU) < bestDiff) { bestDiff = Math.abs(u - activeU); bestI = i; }
  }
  for (let i = 0; i < n; i++) {
    const u = -0.92 + 1.84 * (i / Math.max(1, n - 1));
    const sr = rad * Math.sqrt(Math.max(0.04, 1 - u * u));
    const px = cx + Math.sin(tilt) * u * rad;
    const py = cy - Math.cos(tilt) * u * rad;
    const isHot = i === bestI;
    ctx.fillStyle = isHot ? 'rgba(245, 158, 11, 0.36)' : 'rgba(56, 189, 248, 0.08)';
    ctx.strokeStyle = isHot ? '#f59e0b' : 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = isHot ? 2.2 : 1.05;
    ctx.beginPath(); ctx.ellipse(px, py, sr, sr * 0.28, tilt, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
}

const drawTextAt = (ctx, x, y, text, color = '#e2e8f0', size = 13) => {
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = `600 ${size}px Inter, sans-serif`;
  ctx.fillStyle = color; ctx.fillText(text, x, y);
  ctx.restore();
};
const drawIntroCaption = (ctx, w, y, text, color = '#e2e8f0', size = 13) =>
  drawTextAt(ctx, w / 2, y, text, color, size);

const INTRO_RENDERERS = [
  // 1. V = 4/3 π R³ — A pergunta inicial
  (ctx, w, h, p, now) => {
    const cx = w / 2, cy = h * 0.52, rad = Math.min(w * 0.23, h * 0.23), eqY = Math.max(54, h * 0.14);
    ctx.save(); ctx.textAlign = 'center'; ctx.font = 'bold 26px Inter, sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.fillText('V =', cx - 64, eqY + 8);
    drawStackedFrac(ctx, cx - 18, eqY, '4', '3', 18, '#38bdf8');
    ctx.fillText('π R³', cx + 38, eqY + 8);
    ctx.restore();
    drawWireSphere(ctx, cx, cy, rad, now * 0.0007, 0, null, 1);
    drawIntroCaption(ctx, w, h - 24,
      p < 0.45 ? 'Você conhece a fórmula do volume da esfera.' : 'Mas de onde surgiu esse quatro terços?',
      p < 0.45 ? '#e2e8f0' : '#fbbf24');
  },

  // 2. Corte em discos cada vez mais finos (Δx → 0)
  (ctx, w, h, p) => {
    const cx = w / 2, cy = h * 0.53, rad = Math.min(w * 0.23, h * 0.23), eqY = Math.max(52, h * 0.13);
    drawIntroCaption(ctx, w, eqY - 22, 'Uma soma de volumes.', '#94a3b8', 12);
    drawIntroCaption(ctx, w, eqY + 12, 'Δx → 0', '#f59e0b', 20);
    const n = Math.round(9 + easeIO(clamp01(p * 1.2)) * 24);
    const hotU = 0.55 - easeIO(clamp01((p - 0.15) / 0.75)) * 0.9;
    drawSlicedDiscs(ctx, cx, cy, rad, n, 0, hotU);
    drawIntroCaption(ctx, w, h - 24,
      p < 0.55 ? 'Imagine cortar a esfera em discos cada vez mais finos.' : 'Somando seus volumes, reconstruímos a esfera.');
  },

  // 3. Girar o desenho para eixo x horizontal
  (ctx, w, h, p) => {
    const cx = w / 2, cy = h * 0.52, rad = Math.min(w * 0.23, h * 0.23), eqY = Math.max(48, h * 0.12);
    const tilt = easeIO(clamp01((p - 0.1) / 0.75)) * (Math.PI / 2);
    drawIntroCaption(ctx, w, eqY, 'O mesmo sólido. Outro ângulo.', '#cbd5e1', 14);
    drawSlicedDiscs(ctx, cx, cy, rad, 26, tilt, 0.36);

    const axLen = rad * 1.25;
    const x1 = cx - Math.sin(tilt) * axLen, y1 = cy + Math.cos(tilt) * axLen;
    const x2 = cx + Math.sin(tilt) * axLen, y2 = cy - Math.cos(tilt) * axLen;
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.6;
    cLine(ctx, x1, y1, x2, y2);
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('x', x2 + 8, y2 + 4);
    drawIntroCaption(ctx, w, h - 24, 'Vamos girar o desenho para deixar o eixo x na horizontal.');
  },

  // 4. Dois raios diferentes + Pitágoras (x² + y² = R²)
  (ctx, w, h, p) => {
    const cx = w / 2, cy = h * 0.55, rad = Math.min(w * 0.23, h * 0.23), eqY = Math.max(54, h * 0.14);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)'; ctx.lineWidth = 1.4;
    cLine(ctx, cx - rad * 1.25, cy, cx + rad * 1.28, cy);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();

    const ux = 0.52, uy = Math.sqrt(1 - ux * ux);
    const sx = cx + rad * ux, sy = cy - rad * uy;
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6; cLine(ctx, cx, cy, sx, cy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.6; cLine(ctx, sx, cy, sx, sy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.3; ctx.strokeRect(sx - 8, cy - 8, 8, 8);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; cLine(ctx, cx, cy, sx, sy);
    cDot(ctx, cx, cy, 3.5, '#ffffff'); cDot(ctx, sx, sy, 4.5, '#fbbf24');

    ctx.save(); ctx.textAlign = 'center'; ctx.font = '600 11px Inter, sans-serif'; ctx.fillStyle = '#94a3b8';
    ctx.fillText('-R', cx - rad - 10, cy + 14); ctx.fillText('0', cx, cy + 14);
    ctx.fillText('R', cx + rad + 8, cy + 14); ctx.fillText('x', cx + rad * 1.25, cy - 6);
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#38bdf8'; ctx.fillText('x', (cx + sx) / 2, cy + 15);
    ctx.fillStyle = '#fbbf24'; ctx.fillText('y', sx + 12, (cy + sy) / 2 + 4);
    ctx.fillStyle = '#ffffff'; ctx.fillText('R', (cx + sx) / 2 - 12, (cy + sy) / 2 - 6);
    ctx.restore();

    if (p < 0.28) {
      drawIntroCaption(ctx, w, eqY, 'Dois raios diferentes: R e y', '#cbd5e1', 16);
    } else if (p < 0.65) {
      drawIntroCaption(ctx, w, eqY - 12, 'x² + y² = R²', '#ffffff', 22);
      drawIntroCaption(ctx, w, eqY + 14, 'TEOREMA DE PITÁGORAS', '#38bdf8', 10.5);
    } else {
      drawIntroCaption(ctx, w, eqY - 12, 'y² = R² − x²', '#fbbf24', 22);
      drawIntroCaption(ctx, w, eqY + 14, 'R é fixo.   y muda com x.', '#94a3b8', 11.5);
    }
    drawIntroCaption(ctx, w, h - 24,
      p < 0.65 ? 'O raio da esfera é R; o raio de cada disco é y.' : 'Isolando y², obtemos o raio de cada fatia ao quadrado.');
  },

  // 5. Fatia dV e Integral de -R até R
  (ctx, w, h, p) => {
    const cx = w / 2, cy = h * 0.54, rad = Math.min(w * 0.22, h * 0.22), eqY = Math.max(54, h * 0.14);
    if (p < 0.48) {
      drawIntroCaption(ctx, w, eqY, 'dV = π (R² − x²) dx', '#ffffff', 21);
      drawWireSphere(ctx, cx, cy, rad, 0.2, Math.PI / 2, null, 0.25);
      const sx = cx + 18, sr = rad * 0.85, dxW = 14;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.28)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.ellipse(sx, cy, sr * 0.3, sr, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(sx + dxW, cy, sr * 0.3, sr, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      cLine(ctx, sx, cy - sr, sx + dxW, cy - sr); cLine(ctx, sx, cy + sr, sx + dxW, cy + sr);
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2; cLine(ctx, sx, cy, sx, cy - sr);
      drawTextAt(ctx, sx - 10, cy - sr / 2, 'y', '#fbbf24', 13);
      ctx.fillStyle = '#94a3b8'; ctx.font = '600 11.5px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('dx', sx + dxW / 2, cy + sr + 16);
      drawIntroCaption(ctx, w, h - 24, 'Cada fatia contribui com a área do disco vezes a espessura.');
    } else {
      const sp = clamp01((p - 0.48) / 0.52);
      ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 21px Inter, sans-serif';
      ctx.fillText('V = π', cx - 102, eqY + 6);
      ctx.font = '32px Inter, sans-serif'; ctx.fillText('∫', cx - 60, eqY + 11);
      ctx.font = 'bold 11px Inter, sans-serif'; ctx.fillStyle = '#38bdf8';
      ctx.fillText('R', cx - 48, eqY - 12); ctx.fillText('−R', cx - 48, eqY + 22);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('(R² − x²) dx', cx + 38, eqY + 6);
      ctx.restore();

      const sweepU = -0.85 + easeIO(sp) * 1.7;
      drawWireSphere(ctx, cx, cy, rad, 0.3, Math.PI / 2, sweepU, 1);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.65)'; ctx.lineWidth = 1.4;
      cLine(ctx, cx - rad * 1.2, cy, cx + rad * 1.25, cy);
      ctx.fillStyle = '#94a3b8'; ctx.font = '600 11px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('−R', cx - rad - 10, cy + 16); ctx.fillText('R', cx + rad + 8, cy + 16);
      drawIntroCaption(ctx, w, h - 24, 'A integral soma todas as contribuições, de −R até R.');
    }
  },

  // 6. Antiderivada e a barra visual de 2/3 + 2/3 = 4/3
  (ctx, w, h, p, now) => {
    const cx = w / 2, eqY = Math.max(54, h * 0.14);
    if (p < 0.40) {
      ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('V = π [ R²x −', cx - 32, eqY + 6);
      drawStackedFrac(ctx, cx + 48, eqY - 2, 'x³', '3', 14, '#38bdf8');
      ctx.fillText(']', cx + 76, eqY + 6);
      ctx.font = 'bold 11px Inter, sans-serif'; ctx.fillStyle = '#fbbf24';
      ctx.fillText('R', cx + 90, eqY - 11); ctx.fillText('−R', cx + 92, eqY + 18);
      ctx.restore();
      drawIntroCaption(ctx, w, eqY + 38, 'UMA ANTIDERIVADA', '#38bdf8', 11);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
      cLine(ctx, cx - 105, eqY + 46, cx + 105, eqY + 46);
      drawWireSphere(ctx, cx, h * 0.60, Math.min(w * 0.17, h * 0.17), now * 0.001, 0, null, 0.9);
      drawIntroCaption(ctx, w, h - 24, 'Integramos e substituímos os limites superior e inferior.');
    } else {
      const sp = clamp01((p - 0.40) / 0.60);
      ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('π [', cx - 86, eqY + 6);
      drawStackedFrac(ctx, cx - 46, eqY - 2, '2R³', '3', 14, '#ffffff');
      ctx.fillText('− ( −', cx + 4, eqY + 6);
      drawStackedFrac(ctx, cx + 52, eqY - 2, '2R³', '3', 14, '#fbbf24');
      ctx.fillText(') ]', cx + 88, eqY + 6);
      ctx.restore();
      drawIntroCaption(ctx, w, eqY + 34, 'limite superior   −   limite inferior', '#94a3b8', 11.5);

      // Barra animada de 2/3 + 2/3 = 4/3 (marca registrada do vídeo)
      const barW = Math.min(w * 0.68, 340), gap = 18, half = (barW - gap) / 2;
      const bx = cx - barW / 2, by = h * 0.50;
      const g1 = easeIO(clamp01(sp / 0.36));
      const g2 = easeIO(clamp01((sp - 0.34) / 0.36));
      ctx.fillStyle = 'rgba(148, 163, 184, 0.14)'; ctx.fillRect(bx, by, half, 8);
      ctx.fillRect(bx + half + gap, by, half, 8);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(bx, by, half * g1, 8);
      if (g2 > 0) ctx.fillRect(bx + half + gap, by, half * g2, 8);

      const fy = by + 34;
      drawStackedFrac(ctx, bx + half / 2, fy, '2', '3', 15, '#fbbf24');
      if (sp > 0.34) {
        drawTextAt(ctx, cx, fy + 8, '+', '#fbbf24', 18);
        drawStackedFrac(ctx, bx + half + gap + half / 2, fy, '2', '3', 15, '#fbbf24');
      }
      if (sp > 0.72) {
        drawTextAt(ctx, cx - 18, fy + 48, '=', '#e2e8f0', 18);
        drawStackedFrac(ctx, cx + 14, fy + 42, '4', '3', 17, '#34d399');
        drawIntroCaption(ctx, w, h - 24, 'Dois terços mais dois terços: é daqui que vem o 4/3!', '#fbbf24');
      } else {
        drawIntroCaption(ctx, w, h - 24, 'Subtraindo −2/3, os sinais se somam positivamente...');
      }
    }
  },

  // 7. Resultado V = 4/3 πR³ e Adaptação para a Casca Esférica
  (ctx, w, h, p, now) => {
    const cx = w / 2, cy = h * 0.46, rad = Math.min(w * 0.21, h * 0.195), eqY = Math.max(48, h * 0.12);
    ctx.save(); ctx.textAlign = 'center'; ctx.font = 'bold 25px Inter, sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.fillText('V =', cx - 64, eqY + 8);
    drawStackedFrac(ctx, cx - 18, eqY, '4', '3', 18, '#34d399');
    ctx.fillText('π R³', cx + 38, eqY + 8);
    ctx.restore();

    drawWireSphere(ctx, cx, cy, rad, now * 0.0007, 0, Math.sin(now * 0.0012) * 0.45, 1);
    const cavityAlpha = easeIO(clamp01((p - 0.18) / 0.45));
    if (cavityAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = cavityAlpha;
      const rIn = rad * 0.58;
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.4;
      cLine(ctx, cx + rIn, cy, cx + rad + 14, cy, [3, 3]);
      ctx.setLineDash([]);
      cDot(ctx, cx + rIn, cy, 3.5, '#f87171');
      cPillText(ctx, 'cavidade r', cx + rad + 18, cy + 4, '#fca5a5', 'left');
      ctx.restore();
    }

    const bx = 20, by = h - 90, bw = w - 40, bh = 46;
    ctx.save();
    ctx.fillStyle = 'rgba(13, 33, 56, 0.84)'; ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Inter, sans-serif'; ctx.fillStyle = '#38bdf8';
    ctx.fillText('Adaptação ao Seminário — Casca Esférica:', w / 2, by + 17);
    ctx.font = 'bold 13px Inter, sans-serif'; ctx.fillStyle = '#34d399';
    ctx.fillText('V_casca = V(R) − V(r) = (4/3)π(R³ − r³)', w / 2, by + 36);
    ctx.restore();
    drawIntroCaption(ctx, w, h - 20, 'Nos próximos slides, detalhamos essa região entre r e R!');
  }
];

function drawIntroFrame() {
  const canvas = $('canvas-sphere-intro');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const idx = introAnim.stageIdx;
  const stage = INTRO_STAGES[idx] || INTRO_STAGES[0];
  const localP = introAnim.progress;

  if (idx !== introAnim.renderedIdx) {
    introAnim.renderedIdx = idx;
    document.querySelectorAll('.intro-ch-btn').forEach(b => b.classList.toggle('active', +b.dataset.stage === idx));
    if ($('intro-status')) $('intro-status').innerHTML = stage.status;
    if ($('btn-intro-prev')) {
      $('btn-intro-prev').disabled = idx === 0;
      $('btn-intro-prev').title = idx > 0 ? `Anterior: ${INTRO_STAGES[idx - 1].label}` : 'Início';
    }
    if ($('btn-intro-next')) {
      const last = INTRO_STAGES.length - 1;
      $('btn-intro-next').disabled = idx === last;
      $('btn-intro-next').title = idx < last ? `Próxima: ${INTRO_STAGES[idx + 1].label}` : 'Última etapa';
    }
  }
  if ($('intro-progress-fill')) $('intro-progress-fill').style.width = `${localP * 100}%`;
  INTRO_RENDERERS[idx](ctx, width, height, localP, performance.now());
  if (!introAnim.playing) {
    cPillText(ctx, '⏸ Pausado (clique para continuar)', width - 14, 22, '#fbbf24', 'right', '600 11.5px Inter, sans-serif');
  }
}

function stepIntroAnim(now) {
  if (current !== 2 || !introAnim.playing) { introAnim.raf = 0; return; }
  const dt = introAnim.lastTick ? now - introAnim.lastTick : 16;
  introAnim.lastTick = now;
  introAnim.progress = (introAnim.progress + dt / INTRO_STAGE_DURATION) % 1;
  drawIntroFrame();
  introAnim.raf = requestAnimationFrame(stepIntroAnim);
}

function startIntroAnim(reset = false) {
  if (reset) introAnim.progress = 0;
  introAnim.playing = true;
  introAnim.lastTick = performance.now();
  if ($('btn-intro-play')) $('btn-intro-play').textContent = '⏸ Pausar';
  drawIntroFrame();
  if (!introAnim.raf) introAnim.raf = requestAnimationFrame(stepIntroAnim);
}

function toggleIntroPlay() {
  introAnim.playing = !introAnim.playing;
  if ($('btn-intro-play')) $('btn-intro-play').textContent = introAnim.playing ? '⏸ Pausar' : '▶ Reproduzir';
  if (introAnim.playing) startIntroAnim(false);
  else drawIntroFrame();
}

function jumpIntroStage(idx, play = true) {
  introAnim.stageIdx = Math.max(0, Math.min(INTRO_STAGES.length - 1, idx));
  introAnim.progress = 0;
  introAnim.renderedIdx = -1;
  if (play) startIntroAnim(false);
  else drawIntroFrame();
}

/* ==========================================================================
   SLIDE 2 — PITÁGORAS NO ESPAÇO 3D (ORIGEM DE d_xy e d)
   ========================================================================== */

function drawPythagoras3D() {
  const canvas = $('canvas-pythagoras-3d');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width * 0.48, cy = height * 0.46;
  const rad = Math.min(width * 0.36, height * 0.34);
  const R = 5, r = 3, rPx = rad * (r / R);

  const showBase = pythStep === 'all' || pythStep === 'base';
  const showHeight = pythStep === 'all' || pythStep === 'height';
  const showShell = pythStep === 'all' || pythStep === 'shell';

  if ($('pyth-status-desc')) {
    const msgs = {
      all: '<strong class="c-cyan">d<sub>xy</sub></strong> (chão xy) + altura <strong class="c-cyan">z</strong> geram <strong class="c-amber">d = &radic;(x&sup2; + y&sup2; + z&sup2;)</strong>',
      base: '<strong class="c-cyan">Passo 1 (chão xy):</strong> catetos x e y formam d<sub>xy</sub>&sup2; = x&sup2; + y&sup2;',
      height: '<strong class="c-amber">Passo 2 (subida em z):</strong> d&sup2; = d<sub>xy</sub>&sup2; + z&sup2; = x&sup2; + y&sup2; + z&sup2;',
      shell: '<strong class="c-cyan">Passo 3 (casca):</strong> r &le; d &le; R &hArr; r&sup2; &le; x&sup2; + y&sup2; + z&sup2; &le; R&sup2;'
    };
    $('pyth-status-desc').innerHTML = msgs[pythStep] || msgs.all;
  }

  // Esferas (destacadas ou suaves dependendo da etapa)
  ctx.fillStyle = showShell ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.03)';
  ctx.strokeStyle = showShell ? 'rgba(56, 189, 248, 0.8)' : 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = showShell ? 2.2 : 1.2;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(6, 20, 35, 0.72)';
  ctx.strokeStyle = showShell ? 'rgba(248, 113, 113, 0.85)' : 'rgba(248, 113, 113, 0.28)';
  ctx.lineWidth = showShell ? 2 : 1.2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(cx, cy, rad, rad * 0.3, 0, 0, Math.PI * 2); ctx.stroke();

  const proj = (x, y, z) => [cx + (y - x * 0.52) * (rad / R), cy + (x * 0.34 - z) * (rad / R)];
  const [xEndX, xEndY] = proj(5.6, 0, 0);
  const [yEndX, yEndY] = proj(0, 5.8, 0);
  const [zEndX, zEndY] = proj(0, 0, 5.5);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)'; ctx.lineWidth = 1.3;
  cLine(ctx, cx, cy, xEndX, xEndY);
  cLine(ctx, cx, cy, yEndX, yEndY);
  cLine(ctx, cx, cy, zEndX, zEndY);
  ctx.font = 'bold 12px Inter, sans-serif'; ctx.fillStyle = '#94a3b8';
  ctx.fillText('x', xEndX - 10, xEndY + 12);
  ctx.fillText('y', yEndX + 6, yEndY + 4);
  ctx.fillText('z', zEndX - 4, zEndY - 8);

  const px = 2.4, py = 2.2, pz = 2.35;
  const [ax, ay] = proj(px, 0, 0);
  const [bx, by] = proj(px, py, 0);
  const [px2d, py2d] = proj(px, py, pz);

  // Triângulo 1 (chão xy): x e y -> d_xy
  ctx.globalAlpha = showBase ? 1 : 0.28;
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.4; cLine(ctx, cx, cy, ax, ay);
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.4; cLine(ctx, ax, ay, bx, by);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.1; cLine(ctx, cx, cy, bx, by, [4, 3]);
  ctx.fillStyle = '#38bdf8'; ctx.fillText('x', (cx + ax) / 2 - 18, (cy + ay) / 2 - 4);
  ctx.fillStyle = '#34d399'; ctx.fillText('y', (ax + bx) / 2, (ay + by) / 2 + 15);
  cPillText(ctx, 'dₓᵧ = √(x²+y²)', bx + 8, by + 14, '#e2e8f0', 'left');

  // Triângulo 2 (vertical d_xy e z -> distância 3D d)
  ctx.globalAlpha = showHeight ? 1 : 0.25;
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.9; cLine(ctx, cx, cy, bx, by, [4, 3]);
  ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5; cLine(ctx, bx, by, px2d, py2d);
  ctx.fillStyle = '#c084fc'; ctx.fillText('z', bx + 7, (by + py2d) / 2);

  ctx.globalAlpha = (showHeight || showShell) ? 1 : 0.3;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.2; cLine(ctx, cx, cy, px2d, py2d);
  cPillText(ctx, 'd = √(x²+y²+z²)', (cx + px2d) / 2 - 8, (cy + py2d) / 2 - 12, '#fbbf24', 'right');
  ctx.globalAlpha = 1;

  cDot(ctx, cx, cy, 4, '#ffffff');
  cDot(ctx, bx, by, 3, '#cbd5e1');
  cDot(ctx, px2d, py2d, 5, '#f59e0b');
  ctx.fillStyle = '#ffffff'; ctx.fillText('P(x, y, z)', px2d + 8, py2d - 4);
  ctx.fillStyle = '#94a3b8'; ctx.fillText('C(0,0,0)', cx - 56, cy + 4);

  ctx.globalAlpha = showShell ? 1 : 0.35;
  ctx.fillStyle = '#38bdf8'; ctx.fillText('R = 5 (borda)', cx - rad + 4, cy - rad + 16);
  ctx.save(); ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171'; ctx.fillText('r = 3 (oco)', cx, cy + rPx - 12);
  ctx.restore();

  const barW = Math.min(width - 60, 420), bx0 = (width - barW) / 2, barY = height - 26;
  const rStop = bx0 + barW * (r / R), dStop = bx0 + barW * (4 / R);
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.55)'; ctx.lineWidth = 4; cLine(ctx, bx0, barY, rStop, barY);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6; cLine(ctx, rStop, barY, bx0 + barW, barY);
  cDot(ctx, bx0, barY, 3.5, '#94a3b8'); cDot(ctx, rStop, barY, 4.5, '#f87171');
  cDot(ctx, dStop, barY, 5, '#f59e0b'); cDot(ctx, bx0 + barW, barY, 4.5, '#38bdf8');
  ctx.save(); ctx.textAlign = 'center'; ctx.font = '600 11px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8'; ctx.fillText('0', bx0, barY + 15);
  ctx.fillStyle = '#f87171'; ctx.fillText('r = 3', rStop, barY + 15);
  ctx.fillStyle = '#fbbf24'; ctx.fillText('d (na casca)', dStop, barY - 10);
  ctx.fillStyle = '#38bdf8'; ctx.fillText('R = 5', bx0 + barW, barY + 15);
  ctx.restore();
  ctx.globalAlpha = 1;
}

/* ==========================================================================
   SLIDE 3 — POR QUE ISOLAR y (E NÃO x OU z)?
   ========================================================================== */

function drawWhyIsolateY() {
  const canvas = $('canvas-why-y');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const ox = width * 0.48, oy = height * 0.50;
  const rad = Math.min(width * 0.30, (height - 140) * 0.36);

  if ($('why-y-status')) {
    const msgs = {
      'x-axis': 'Com rotação no <strong class="c-cyan">eixo x</strong>, a altura <strong class="c-amber">y</strong> é o raio de cada fatia: <strong class="c-white">y = &radic;(R&sup2; &minus; x&sup2;)</strong>',
      'y-axis': 'Isolaríamos <strong class="c-amber">x = &radic;(R&sup2; &minus; y&sup2;)</strong> apenas se girássemos em volta do <strong class="c-cyan">eixo y</strong>.',
      'sign-plus': '<strong class="c-cyan">Folha 2D (z = 0):</strong> z só nasce ao girar. E escolhemos só <strong class="c-green">y &ge; 0</strong> para não contar o volume 2x.'
    };
    $('why-y-status').innerHTML = msgs[whyYMode] || msgs['x-axis'];
  }

  // Eixos 2D base
  const xHighlight = whyYMode !== 'y-axis';
  ctx.strokeStyle = xHighlight ? '#38bdf8' : 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = xHighlight ? 2.4 : 1.3;
  cLine(ctx, ox - rad - 36, oy, ox + rad + 36, oy);

  ctx.strokeStyle = whyYMode === 'y-axis' ? '#38bdf8' : 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = whyYMode === 'y-axis' ? 2.4 : 1.3;
  cLine(ctx, ox, oy + rad + 20, ox, oy - rad - 26);

  ctx.font = 'bold 11.5px Inter, sans-serif';
  ctx.fillStyle = xHighlight ? '#38bdf8' : '#94a3b8';
  ctx.fillText(whyYMode === 'y-axis' ? 'x' : 'Eixo de giro: x', ox + rad - 12, oy + 16);
  ctx.fillStyle = whyYMode === 'y-axis' ? '#38bdf8' : '#94a3b8';
  ctx.fillText(whyYMode === 'y-axis' ? 'Eixo de giro: y' : 'y', ox + 8, oy - rad - 14);

  if (whyYMode === 'x-axis') {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0); ctx.fill(); ctx.stroke();

    const ux = 0.52, uy = Math.sqrt(1 - ux * ux);
    const sx = ox + rad * ux, sy = oy - rad * uy, sliceH = rad * uy;

    // Disco girado em torno do eixo x (elipse vertical em perspectiva)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(sx, oy, 18, sliceH, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.ellipse(sx, oy, 18, sliceH, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; cLine(ctx, ox, oy, sx, oy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; cLine(ctx, sx, oy, sx, sy);
    cDot(ctx, ox, oy, 3.5, '#ffffff');
    cDot(ctx, sx, sy, 4.5, '#fbbf24');

    ctx.fillStyle = '#cbd5e1'; ctx.fillText('x', (ox + sx) / 2 - 4, oy + 16);
    cPillText(ctx, 'y = raio da fatia', sx + 12, (oy + sy) / 2, '#fbbf24', 'left');
    cPillText(ctx, 'y = √(R² − x²)', sx - 8, sy - 12, '#7dd3fc', 'center');
  } else if (whyYMode === 'y-axis') {
    ctx.fillStyle = 'rgba(192, 132, 252, 0.16)';
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(ox, oy, rad, -Math.PI / 2, Math.PI / 2); ctx.fill(); ctx.stroke();

    const uy = 0.52, ux = Math.sqrt(1 - uy * uy);
    const hy = oy - rad * uy, hx = ox + rad * ux, sliceW = rad * ux;

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(ox, hy, sliceW, 16, 0, 0, Math.PI); ctx.stroke();
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.ellipse(ox, hy, sliceW, 16, 0, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; cLine(ctx, ox, oy, ox, hy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; cLine(ctx, ox, hy, hx, hy);
    cDot(ctx, ox, oy, 3.5, '#ffffff');
    cDot(ctx, hx, hy, 4.5, '#fbbf24');

    ctx.fillStyle = '#cbd5e1'; ctx.fillText('y', ox - 16, (oy + hy) / 2);
    cPillText(ctx, 'x seria o raio', (ox + hx) / 2, hy - 12, '#fbbf24', 'center');
    cPillText(ctx, 'x = √(R² − y²)', hx + 8, hy + 4, '#d8b4fe', 'left');
  } else {
    // Sem z no 2D e comparativo sinal + vs sinal -
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(248, 113, 113, 0.12)';
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);

    cPillText(ctx, 'Folha 2D (z = 0): z nasce só no giro 360°', ox, 24, '#cbd5e1', 'center');
    cPillText(ctx, 'y = +√(R² − x²)  [Usada: y ≥ 0]', ox, oy - rad * 0.52, '#34d399', 'center');
    cPillText(ctx, 'y = −√(R² − x²)  [Se girasse junto, duplicaria!]', ox, oy + rad * 0.55, '#fca5a5', 'center');
  }

  // Faixa resumo fixa no rodapé do canvas
  const bx = 18, by = height - 56, bw = width - 36, bh = 44;
  ctx.save();
  ctx.fillStyle = 'rgba(13, 33, 56, 0.8)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 7); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const summary = {
    'x-axis': 'Eixo no x  ⇒  o raio vertical vale y  ⇒  isolamos y em função de x!',
    'y-axis': 'Se o eixo fosse vertical (y), o raio seria x e isolaríamos x(y).',
    'sign-plus': 'No 2D usamos só (x, y) sem z; no giro 360° em x basta a metade y ≥ 0.'
  };
  ctx.fillText(summary[whyYMode], width / 2, by + 27);
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

/* ==========================================================================
   SLIDE 1 — SEMICÍRCULO, SUAS PARTES E GIRO GERADOR (360°)
   ========================================================================== */

function drawSemicircleParts() {
  const canvas = $('canvas-semicircle-parts');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width * 0.5, cy = height * 0.73;
  const rad = Math.min(width * 0.33, height * 0.43);

  // Semicírculo inferior suave apenas para contraste
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI, false); ctx.stroke();
  ctx.setLineDash([]);

  // Preenchimento do semicírculo superior (y >= 0)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.beginPath();
  ctx.arc(cx, cy, rad, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // Eixo x horizontal e eixo vertical y
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = 1.2;
  cLine(ctx, cx - rad * 1.22, cy, cx + rad * 1.22, cy);
  cLine(ctx, cx, cy + 26, cx, cy - rad * 1.07);

  // Linha do diâmetro destacado [-R, R]
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3.2;
  cLine(ctx, cx - rad, cy, cx + rad, cy);

  // Arco superior brilhante
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.2;
  ctx.beginPath(); ctx.arc(cx, cy, rad, Math.PI, 0, false); ctx.stroke();

  // Raio R em 52°
  const a = -0.92;
  const rx = cx + rad * Math.cos(a), ry = cy + rad * Math.sin(a);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.8;
  cLine(ctx, cx, cy, rx, ry);

  // Altura y até o eixo x (mostra y >= 0)
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.8)';
  ctx.lineWidth = 1.6;
  cLine(ctx, rx, ry, rx, cy, [4, 3]);

  // Pontos principais
  cDot(ctx, cx - rad, cy, 4, '#34d399');
  cDot(ctx, cx + rad, cy, 4, '#34d399');
  cDot(ctx, cx, cy, 5.5, '#f59e0b');
  cDot(ctx, rx, ry, 5, '#fbbf24');

  // Rótulos legíveis com pill (sem colisão entre y e o título do arco)
  cPillText(ctx, 'Centro C(0,0)', cx - 44, cy + 20, '#fbbf24', 'center');
  cPillText(ctx, 'Diâmetro = 2R', cx + 48, cy + 20, '#34d399', 'center');
  cPillText(ctx, 'Raio R', (cx + rx) / 2 - 22, (cy + ry) / 2 - 8, '#fbbf24', 'center');
  cPillText(ctx, 'Arco superior: y = √(R² − x²) ≥ 0', cx, cy - rad - 16, '#38bdf8', 'center');
  drawTextAt(ctx, cx - rad - 16, cy - 8, '−R', '#94a3b8', 11);
  drawTextAt(ctx, cx + rad + 6, cy - 8, '+R', '#94a3b8', 11);
  drawTextAt(ctx, cx - 15, cy - rad * 0.82, 'y', '#94a3b8', 11);
  drawTextAt(ctx, cx + rad * 1.17, cy - 8, 'x', '#94a3b8', 11);
}

/* ==========================================================================
   SLIDE 3 — DA ESFERA CHEIA À CASCA ESFÉRICA (R e r)
   ========================================================================== */

function drawShellConcept() {
  const canvas = $('canvas-shell-concept');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const cy = height * 0.48;
  const radExt = Math.min(width * 0.115, height * 0.34);
  const radInt = radExt * 0.6;
  const x1 = width * 0.17, x2 = width * 0.49, x3 = width * 0.82;

  // 1) Esfera cheia de raio R
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(x1, cy, radExt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  cLine(ctx, x1, cy, x1 + radExt, cy);
  cDot(ctx, x1, cy, 4, '#ffffff');
  cPillText(ctx, '1. Esfera Cheia', x1, cy - radExt - 16, '#38bdf8', 'center');
  drawTextAt(ctx, x1 + radExt * 0.45, cy - 8, 'R', '#ffffff', 12);
  cPillText(ctx, 'Volume V(R)', x1, cy + radExt + 22, '#cbd5e1', 'center');

  // Sinal de menos
  ctx.save();
  ctx.font = 'bold 28px Inter, sans-serif'; ctx.fillStyle = '#f87171'; ctx.textAlign = 'center';
  ctx.fillText('−', (x1 + x2) / 2, cy + 9);
  ctx.restore();

  // 2) Cavidade interna (miolo r)
  ctx.fillStyle = 'rgba(248, 113, 113, 0.2)';
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 2.4;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.arc(x2, cy, radInt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  cLine(ctx, x2, cy, x2 + radInt, cy);
  cDot(ctx, x2, cy, 3.8, '#f87171');
  cPillText(ctx, '2. Miolo Retirado', x2, cy - radExt - 16, '#f87171', 'center');
  drawTextAt(ctx, x2 + radInt * 0.45, cy - 8, 'r', '#fca5a5', 12);
  cPillText(ctx, 'Volume V(r)', x2, cy + radExt + 22, '#fca5a5', 'center');

  // Sinal de igual
  ctx.save();
  ctx.font = 'bold 28px Inter, sans-serif'; ctx.fillStyle = '#34d399'; ctx.textAlign = 'center';
  ctx.fillText('=', (x2 + x3) / 2, cy + 9);
  ctx.restore();

  // 3) Casca esférica resultante (coroa entre r e R)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(x3, cy, radExt, 0, Math.PI * 2, false);
  ctx.arc(x3, cy, radInt, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
  ctx.beginPath(); ctx.arc(x3, cy, radExt, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = 'rgba(6, 20, 35, 0.9)';
  ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(x3, cy, radInt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Destaque da espessura e = R - r
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.2;
  cLine(ctx, x3 + radInt, cy, x3 + radExt, cy);
  cDot(ctx, x3, cy, 3.8, '#ffffff');
  cPillText(ctx, '3. Casca Esférica', x3, cy - radExt - 16, '#34d399', 'center');
  drawTextAt(ctx, x3 + (radInt + radExt) / 2 - 4, cy - 9, 'e', '#fbbf24', 12);
  cPillText(ctx, 'V = V(R) − V(r)', x3, cy + radExt + 22, '#34d399', 'center');
}

function attachRevolver(st, plate, sweeps, state, statusId, doneHtml, loop = false) {
  const sweep = (mesh, rad, phi) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.SphereGeometry(rad, 36, 20, 0, phi, 0, Math.PI).rotateZ(Math.PI / 2);
  };
  st.setAngle = phi => {
    plate.rotation.x = phi;
    sweeps.forEach(([mesh, rad]) => sweep(mesh, rad, phi));
  };
  st.setAngle(0.01);

  st.onFrame = () => {
    if (!state.rotating) return;
    if (state.angle < Math.PI * 2) {
      state.angle = Math.min(state.angle + 0.035, Math.PI * 2);
      st.setAngle(state.angle);
    }
    if (state.angle >= Math.PI * 2) {
      $(statusId).innerHTML = doneHtml;
      if (!loop) {
        state.rotating = false;
      } else {
        state.hold = (state.hold || 0) + 1;
        if (state.hold >= 55) {
          state.hold = 0;
          state.angle = 0.01;
          st.setAngle(0.01);
        }
      }
    } else {
      $(statusId).innerHTML = `Ângulo de Rotação: <strong class="c-cyan">${Math.round((state.angle / (Math.PI * 2)) * 360)}&deg;</strong>`;
    }
  };
}

const semiRev = { rotating: false, angle: 0 };
const SEMI_IDLE = 'Ângulo do Giro: <strong class="c-cyan">0&deg;</strong> &bull; Clique em "Girar Semicírculo"';

function buildSemiRevolution(slide) {
  const st = createStage(slide, 'container-3d-s1-semi', { cam: [0, 5.5, 11.5], ambient: 0.65, light: 0.9 });
  const R = 3.4;
  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 14, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  axis.rotation.z = Math.PI / 2;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI, false);
  shape.lineTo(R, 0);
  const plate = new THREE.Mesh(new THREE.ShapeGeometry(shape, 36),
    std({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.35, side: THREE.DoubleSide }));
  const outer = new THREE.Mesh(undefined,
    new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, roughness: 0.2, side: THREE.DoubleSide }));
  st.scene.add(axis, plate, outer);

  attachRevolver(st, plate, [[outer, R]], semiRev, 's1-semi-status',
    'Giro Concluído (360&deg;): <strong class="c-green">Esfera Completa Gerada!</strong>');
  return st;
}

function resetSemiRevolution() {
  Object.assign(semiRev, { rotating: false, angle: 0 });
  stages[1]?.setAngle(0.01);
  if ($('s1-semi-status')) $('s1-semi-status').innerHTML = SEMI_IDLE;
}

const revolution = { rotating: true, angle: 0, hold: 0 };
const s1Status = html => { $('s1-status-desc').innerHTML = html; };

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

  attachRevolver(st, plate, [[outer, R], [inner, r]], revolution, 's1-status-desc',
    'Rotação Concluída (360&deg;): <strong class="c-green">Casca Esférica Gerada!</strong>', true);
  return st;
}

function resetRevolution() {
  Object.assign(revolution, { rotating: true, angle: 0.01, hold: 0 });
  stages[6]?.setAngle(0.01);
  if ($('btn-s1-rotate')) $('btn-s1-rotate').textContent = '⏸ Pausar';
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
      { r: 2.5, explode: 0.25, mat: { color: 0x6d3b20, roughness: 0.42, metalness: 0.08 } },
      { r: 2.25, back: true, xray: 1, mat: { color: 0x1c0f08, roughness: 0.55 } }
    ],
    ring: [2.25, 2.5],
    glow: [0xd97706, 1.3, 5],
    onFrame: group => { t += 0.02; group.position.y = Math.sin(t * 1.8) * 0.08; },
    status: {
      id: 's3-intro-status',
      cut: 'Estado: <strong class="c-amber">Corte 90° Ativo &bull; Casca de 1 cm</strong>',
      xray: 'Estado: <strong class="c-cyan">Modo Raio-X &bull; Interior Oco (r = 9 cm)</strong>',
      closed: 'Estado: <strong class="c-white">Bola de Chocolate Fechada (R = 10 cm)</strong>'
    }
  });
}

function buildTank(slide) {
  return buildCutaway(slide, 'container-3d-s4-intro', {
    cam: [0, 3.2, 9.8],
    layers: [
      { r: 2.55, explode: 0.25, mat: { color: 0x94a3b8, roughness: 0.85, metalness: 0.1 } },
      { r: 2.04, xray: 0.85, mat: { color: 0x0ea5e9, emissive: 0x0369a1, emissiveIntensity: 0.45, roughness: 0.15, metalness: 0.2 } }
    ],
    ring: [2.04, 2.55],
    glow: [0x38bdf8, 1.8, 6],
    extras: (scene, group) => {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, 0.6, 32), std({ color: 0x334155, roughness: 0.85 }));
      base.position.y = -2.75;
      scene.add(base);
      const pipe = std({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 16), pipe);
      top.position.set(0, 2.45, 0);
      const side = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16), pipe);
      side.position.set(1.6, 1.4, 0);
      side.rotation.z = Math.PI / 3;
      group.add(top, side);
    },
    status: {
      id: 's4-intro-status',
      cut: 'Visualização: <strong class="c-amber">Corte Técnico 90° &bull; Parede e Núcleo de Água</strong>',
      xray: 'Visualização: <strong class="c-cyan">Raio-X &bull; Câmara de Água (r = 2,0 m)</strong>',
      closed: 'Visualização: <strong class="c-white">Reservatório Fechado (R = 2,5 m)</strong>'
    }
  });
}

/* ==========================================================================
   SLIDE 16 — BOLA DE CHOCOLATE COM SLIDER DE CORTE
   ========================================================================== */

let floatSlicePlane = null;
const sliceZ = percent => 2.8 - (percent / 100) * 5.6;

function buildFloatSlider(slide) {
  const st = createStage(slide, 'container-3d-s3-interactive', { cam: [4.2, 2.8, 9.2], ambient: 0.65, light: 1.25, clipping: true });
  floatSlicePlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), sliceZ(+$('slider-s3-cut').value));
  const clip = [floatSlicePlane];
  st.scene.add(
    ball(2.7, std({ color: 0x6d3b20, roughness: 0.42, metalness: 0.08, side: THREE.DoubleSide, clippingPlanes: clip })),
    ball(2.43, std({ color: 0x1c0f08, side: THREE.BackSide, clippingPlanes: clip }), 36)
  );
  return st;
}

/* ==========================================================================
   SLIDE 21 — CAMADAS DO RESERVATÓRIO E LIMITAÇÕES DO MODELO
   ========================================================================== */

const TANK_MODES = {
  outer: { opacity: 1, show: [], text: '1. Concreto Externo Totalmente Opaco' },
  perlite: { opacity: 0.25, show: ['perlite', 'inner'], text: '2. Parede e Câmara de Água (Concreto = 31,94 m³)' },
  limits: { opacity: 0.2, show: ['perlite', 'inner', 'pipes'], text: '3. Limitações: Canos e tampa perfurando a casca' }
};
let tankMode = 'outer';

function setTankLayer(btn) {
  tankMode = btn.dataset.layer;
  document.querySelectorAll('[data-layer]').forEach(b => b.classList.toggle('active', b === btn));
  $('s4-state-text').textContent = TANK_MODES[tankMode].text;
  $('s4-pipe-legend').hidden = tankMode !== 'limits';
  stages[21]?.applyLayer();
}

function buildTankLayers(slide) {
  const st = createStage(slide, 'container-3d-s4-interactive', { cam: [0, 4, 11], ambient: 0.55, light: 0.95 });
  const R = 3.1, r = 2.48;
  const outer = ball(R, std({ color: 0x94a3b8, metalness: 0.1, roughness: 0.85, side: THREE.DoubleSide }));
  const parts = {
    perlite: ball((R + r) / 2, std({ color: 0xfde047, transparent: true, opacity: 0.55, roughness: 0.75, side: THREE.DoubleSide }), 40),
    inner: ball(r, new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide }), 36),
    pipes: new THREE.Group()
  };
  const pipeMat = std({ color: 0xf87171, metalness: 0.7 });
  [[0.22, 4.0, [0, 2.5, 0], 0], [0.12, 3.5, [2.4, 0, 0], Math.PI / 2], [0.14, 3.6, [0, -2.4, 0], 0]]
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

  $('intro-progress-track')?.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width));
    introAnim.progress = frac;
    introAnim.lastTick = performance.now();
    drawIntroFrame();
  });
  $('canvas-sphere-intro')?.addEventListener('click', toggleIntroPlay);
  $('slider-riemann-n')?.addEventListener('input', drawRiemann2D);

  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea') || !KEYS[e.key]) return;
    e.preventDefault();
    KEYS[e.key]();
  });

  window.addEventListener('resize', () => {
    if (current === 1) drawSemicircleParts();
    if (current === 2) drawIntroFrame();
    if (current === 3) drawShellConcept();
    if (current === 4) drawPythagoras3D();
    if (current === 5) drawWhyIsolateY();
    if (current === 6) drawRegion2D();
    if (current === 9) drawRiemann2D();
    resizeStage(stages[current]);
  });

  renderMath();
  goToSlide(0);
});
