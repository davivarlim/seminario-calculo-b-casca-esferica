/* ==========================================================================
   Casca de Esfera — Seminário de Cálculo B (UFPel)
   Motor da apresentação: navegação, KaTeX, Canvas 2D e cenas 3D (Three.js r128)
   ========================================================================== */
'use strict';

const SLIDE_TITLES = [
  'Capa Oficial (5 Partes)',
  'PARTE 1: Círculo e Semicírculo (ℝ²)',
  'PARTE 1: Rotação 360° → Surge a Esfera (ℝ³)',
  'PARTE 2: Volume da Esfera — Riemann e Discos',
  'PARTE 2: Dedução do Volume da Esfera (4/3 π R³)',
  'PARTE 2: Construção da Casca (Duas Esferas R, r)',
  'PARTE 2: Região Geradora e Revolução da Casca',
  'PARTE 2: Modelagem da Casca no GeoGebra (R=5, r=3)',
  'PARTE 2: Fórmula Final da Casca Esférica',
  'PARTE 3: Bola de Chocolate — ENEM PPL 2023',
  'PARTE 3: Resolução, SI e Massa',
  'PARTE 4: Reservatório Esférico de Água',
  'PARTE 4: GeoGebra — Curvas, 180° e 3D',
  'PARTE 4: Volume de Concreto via Integral',
  'PARTE 4: Discussão Crítica e Limitações',
  'PARTE 5: Conclusão e Encerramento'
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

let whyYMode = 'semi';
let shellR3Mode = 'sub';

const ACTIONS = {
  fullscreen: toggleFullscreen,
  'revolve-single': () => toggleRev('single'),
  'revolve-single-reset': () => resetRevolution('single'),
  revolve: () => toggleRev('shell'),
  'revolve-reset': () => resetRevolution('shell'),
  layer: setTankLayer,
  'why-y-mode': btn => {
    whyYMode = btn.dataset.mode;
    document.querySelectorAll('[data-action="why-y-mode"]').forEach(b => b.classList.toggle('active', b === btn));
    drawWhyIsolateY();
  },
  'shell-r3-mode': btn => {
    shellR3Mode = btn.dataset.mode;
    document.querySelectorAll('[data-action="shell-r3-mode"]').forEach(b => b.classList.toggle('active', b === btn));
    drawShellR3();
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-target], [data-toggle], [data-action]');
  if (!el) return;
  if (el.dataset.target !== undefined) goToSlide(+el.dataset.target);
  else if (el.dataset.toggle) toggleStage(el);
  else ACTIONS[el.dataset.action]?.(el);
});

/* ==========================================================================
   INFRAESTRUTURA 3D E CANVAS 2D
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
const cPillText = (ctx, text, x, y, color, align = 'left', font = 'bold 12.5px Inter, sans-serif') => {
  ctx.save(); ctx.font = font; ctx.textAlign = align;
  const w = ctx.measureText(text).width + 10;
  const rx = align === 'right' ? x - w + 5 : align === 'center' ? x - w / 2 : x - 5;
  ctx.fillStyle = 'rgba(6, 20, 35, 0.88)';
  ctx.fillRect(rx, y - 12, w, 17);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
};
const drawTextAt = (ctx, x, y, text, color = '#e2e8f0', size = 13) => {
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = `600 ${size}px Inter, sans-serif`;
  ctx.fillStyle = color; ctx.fillText(text, x, y);
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
  2: slide => buildRevolution(slide, 'container-3d-single-rev', 'single'),
  3: buildDisks,
  6: slide => buildRevolution(slide, 'container-3d-s1', 'shell'),
  8: buildShellCut,
  9: buildFloat,
  10: buildFloatSlider,
  11: buildTank,
  14: buildTankLayers
};

function activateScene(i) {
  if (i === 1) drawWhyIsolateY();
  if (i === 2) {
    drawRegion2D('canvas-2d-sphere-rev', false);
    resetRevolution('single', false);
  }
  if (i === 3) drawRiemann2D();
  if (i === 5) drawShellR3();
  if (i === 6) {
    drawRegion2D('canvas-2d-s1', true);
    resetRevolution('shell', false);
  }
  if (!SCENES[i] || typeof THREE === 'undefined') return;
  if (stages[i]) resizeStage(stages[i]);
  else stages[i] = SCENES[i](i);
}

/* ==========================================================================
   SLIDE 1 — DO CÍRCULO AO SEMICÍRCULO NO PLANO ℝ²
   ========================================================================== */

function drawWhyIsolateY() {
  const canvas = $('canvas-why-y');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const ox = width * 0.48, oy = whyYMode === 'semi' ? height * 0.50 : height * 0.48;
  const rad = Math.min(width * 0.30, (height - 150) * 0.38);

  if ($('why-y-status')) {
    const msgs = {
      semi: 'Triângulo <strong class="c-amber">x&sup2;+y&sup2;=R&sup2;</strong> &rarr; isolando <strong class="c-cyan">y &ge; 0</strong> surge a função <strong class="c-cyan">f(x) = &radic;(R&sup2;&minus;x&sup2;)</strong>',
      'x-axis': 'O círculo inteiro tem 2 imagens (não é função); com <strong class="c-cyan">f(x)=&radic;(R&sup2;&minus;x&sup2;)</strong> girando no <strong class="c-cyan">eixo x</strong>, <strong class="c-amber">f(x)</strong> vira o raio',
      'sign-plus': 'Círculo inteiro tem 2 imagens (<strong class="c-red">não é função</strong>); usando só <strong class="c-green">y &ge; 0</strong> nasce <strong class="c-cyan">f(x)</strong> sem duplicar o volume.'
    };
    $('why-y-status').innerHTML = msgs[whyYMode] || msgs.semi;
  }

  // Eixos 2D base
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6;
  cLine(ctx, ox - rad - 38, oy, ox + rad + 38, oy);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)'; ctx.lineWidth = 1.2;
  cLine(ctx, ox, oy + rad + 18, ox, oy - rad - 24);

  if (whyYMode === 'semi') {
    // Contorno pontilhado da metade inferior mostrando o círculo completo
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'; ctx.lineWidth = 1.3; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI, false); ctx.stroke();
    ctx.setLineDash([]);

    // Preenchimento do semicírculo superior (y >= 0)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0, false); ctx.closePath(); ctx.fill();

    // Diâmetro [-R, R] destacado em verde
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3.2;
    cLine(ctx, ox - rad, oy, ox + rad, oy);

    // Arco superior brilhante
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0, false); ctx.stroke();

    // Raio R em 52° + triângulo retângulo de Pitágoras (catetos x, y e hipotenusa R)
    const a = -0.92;
    const rx = ox + rad * Math.cos(a), ry = oy + rad * Math.sin(a);
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.4; cLine(ctx, ox, oy, rx, oy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.8; cLine(ctx, ox, oy, rx, ry);
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.2; cLine(ctx, rx, ry, rx, oy, [4, 3]);
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.3; ctx.strokeRect(rx - 7, oy - 7, 7, 7);

    cDot(ctx, ox - rad, oy, 4, '#34d399');
    cDot(ctx, ox + rad, oy, 4, '#34d399');
    cDot(ctx, ox, oy, 5.5, '#f59e0b');
    cDot(ctx, rx, ry, 5, '#fbbf24');

    cPillText(ctx, 'Centro C(0,0)', ox - 48, oy + 20, '#fbbf24', 'center');
    cPillText(ctx, 'x² + y² = R²', ox + 52, oy + 20, '#34d399', 'center');
    cPillText(ctx, 'R', (ox + rx) / 2 - 14, (oy + ry) / 2 - 8, '#fbbf24', 'center');
    drawTextAt(ctx, (ox + rx) / 2, oy - 7, 'x', '#34d399', 12.5);
    drawTextAt(ctx, rx + 11, (oy + ry) / 2 + 4, 'y', '#e9d5ff', 12.5);
    cPillText(ctx, 'Função (y ≥ 0): f(x) = √(R² − x²)', ox, oy - rad - 14, '#38bdf8', 'center');
    drawTextAt(ctx, ox - rad - 16, oy - 8, '−R', '#94a3b8', 11);
    drawTextAt(ctx, ox + rad + 12, oy - 8, '+R', '#94a3b8', 11);
    drawTextAt(ctx, ox - 14, oy - rad * 0.78, 'y', '#94a3b8', 11);
    drawTextAt(ctx, ox + rad + 28, oy - 8, 'x', '#38bdf8', 11);
    drawTextAt(ctx, ox, oy + rad * 0.62, 'parte inferior: y = −√(R² − x²)', 'rgba(148,163,184,0.75)', 11);
  } else if (whyYMode === 'x-axis') {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0); ctx.fill(); ctx.stroke();

    const ux = 0.52, uy = Math.sqrt(1 - ux * ux);
    const sx = ox + rad * ux, sy = oy - rad * uy, sliceH = rad * uy;

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(sx, oy, 18, sliceH, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.ellipse(sx, oy, 18, sliceH, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; cLine(ctx, ox, oy, sx, oy);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; cLine(ctx, sx, oy, sx, sy);
    cDot(ctx, ox, oy, 3.5, '#ffffff');
    cDot(ctx, sx, sy, 4.5, '#fbbf24');

    drawTextAt(ctx, ox + rad + 10, oy + 16, 'Eixo x (giro)', '#38bdf8', 11.5);
    drawTextAt(ctx, (ox + sx) / 2, oy + 16, 'x', '#cbd5e1', 12);
    cPillText(ctx, 'f(x) = raio da fatia', sx + 12, (oy + sy) / 2, '#fbbf24', 'left');
    cPillText(ctx, 'f(x) = √(R² − x²)', sx - 8, sy - 12, '#7dd3fc', 'center');
  } else {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(ox, oy, rad, Math.PI, 0); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(248, 113, 113, 0.12)';
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);

    cPillText(ctx, 'Círculo inteiro: 2 imagens para cada x (NÃO é função!)', ox, 24, '#cbd5e1', 'center');
    cPillText(ctx, 'f(x) = +√(R² − x²)  [Função: y ≥ 0]', ox, oy - rad * 0.52, '#34d399', 'center');
    cPillText(ctx, 'y = −√(R² − x²)  [Descartada: duplicaria o giro]', ox, oy + rad * 0.55, '#fca5a5', 'center');
  }

  // Faixa resumo fixa no rodapé do canvas
  const bx = 18, by = height - 52, bw = width - 36, bh = 40;
  ctx.save();
  ctx.fillStyle = 'rgba(13, 33, 56, 0.84)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 7); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const summary = {
    semi: 'Do triângulo x² + y² = R², isolando y ≥ 0 surge a função f(x) = √(R² − x²).',
    'x-axis': 'O círculo inteiro NÃO é função (2 imagens); no giro em x, f(x) = √(R²−x²) é o raio!',
    'sign-plus': 'Escolhendo y ≥ 0, f(x) vira função e o giro 360° não duplica o volume!'
  };
  ctx.fillText(summary[whyYMode], width / 2, by + 24);
  ctx.restore();
}

/* ==========================================================================
   SLIDES 2 & 6 — SEMICÍRCULO / REGIÃO GERADORA (ℝ²) E REVOLUÇÃO 360° (ℝ³)
   ========================================================================== */

function drawRegion2D(canvasId = 'canvas-2d-s1', showInner = true) {
  const canvas = $(canvasId);
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const ox = width / 2, oy = height - (showInner ? 48 : 38);
  const s = Math.min(width / 14.0, (height - (showInner ? 68 : 54)) / 5.4);
  const R = 5, r = 3;
  const arc = rad => { ctx.beginPath(); ctx.arc(ox, oy, rad * s, Math.PI, 0); ctx.stroke(); };

  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let x = -6; x <= 6; x++) cLine(ctx, ox + x * s, 10, ox + x * s, oy + 6);
  for (let y = 0; y <= 6; y++) cLine(ctx, 15, oy - y * s, width - 15, oy - y * s);

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6; cLine(ctx, 15, oy, width - 15, oy);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2; cLine(ctx, ox, oy + 6, ox, 14);

  // Região geradora: semicírculo completo (Slide 2) ou faixa anelar ℛ (Slide 6)
  ctx.beginPath();
  ctx.arc(ox, oy, R * s, Math.PI, 0);
  if (showInner) {
    ctx.lineTo(ox + r * s, oy);
    ctx.arc(ox, oy, r * s, 0, Math.PI, true);
  } else {
    ctx.lineTo(ox - R * s, oy);
  }
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, oy - R * s, 0, oy);
  grad.addColorStop(0, 'rgba(56,189,248,0.48)');
  grad.addColorStop(1, 'rgba(2,132,199,0.16)');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6; arc(R);
  if (showInner) {
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2; arc(r);
  }

  // Triângulo de Pitágoras no 1º quadrante
  const aR = 38 * Math.PI / 180;
  const rx = ox + R * s * Math.cos(aR), ry = oy - R * s * Math.sin(aR);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2; cLine(ctx, ox, oy, rx, oy);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.2; cLine(ctx, rx, oy, rx, ry, [4, 3]);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.4; ctx.strokeRect(rx - 8, oy - 8, 8, 8);
  ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2.6; cLine(ctx, ox, oy, rx, ry);
  cDot(ctx, rx, ry, 4.5, '#38bdf8');

  ctx.font = 'bold 11.5px Inter, sans-serif';
  ctx.fillStyle = '#e2e8f0'; ctx.fillText('x', (ox + rx) / 2 - 4, oy - 5);
  ctx.fillStyle = '#fbbf24'; ctx.fillText('y', rx + 6, (oy + ry) / 2 + 4);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillText('R = 5', ox + 3.9 * s * Math.cos(aR) - 34, oy - 3.9 * s * Math.sin(aR) - 8);

  if (showInner) {
    const ar = 140 * Math.PI / 180;
    const irx = ox + r * s * Math.cos(ar), iry = oy - r * s * Math.sin(ar);
    ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 2.2; cLine(ctx, ox, oy, irx, iry);
    cDot(ctx, irx, iry, 4, '#f87171');
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('r = 3', ox + 1.55 * s * Math.cos(ar) - 24, oy - 1.55 * s * Math.sin(ar) + 14);
    drawTextAt(ctx, ox - 2.35 * s, oy - 3.3 * s, 'Região Geradora ℛ', '#ffffff', 12);
  } else {
    drawTextAt(ctx, ox - 2.25 * s, oy - 3.25 * s, 'y = +√(R² − x²)', '#ffffff', 12);
  }
  cDot(ctx, ox, oy, 3.5, '#ffffff');

  ctx.save(); ctx.textAlign = 'center'; ctx.font = '600 11px Inter, sans-serif';
  const ticks = showInner
    ? [[-R, '-R (-5)', '#38bdf8'], [-r, '-r (-3)', '#f87171'], [0, '0', '#cbd5e1'], [r, 'r (3)', '#f87171'], [R, 'R (5)', '#38bdf8']]
    : [[-R, '-R (-5)', '#38bdf8'], [0, '0', '#cbd5e1'], [R, 'R (5)', '#38bdf8']];
  ticks.forEach(([val, lbl, col]) => {
    const px = ox + val * s;
    cDot(ctx, px, oy, 3, col);
    ctx.fillStyle = col;
    ctx.fillText(lbl, px, oy + 14);
  });

  const drawInterval = (rad, yBar, color, label) => {
    const x1 = ox - rad * s, x2 = ox + rad * s;
    ctx.strokeStyle = color; ctx.lineWidth = 1.6;
    cLine(ctx, x1, yBar, x2, yBar);
    cLine(ctx, x1, yBar - 3, x1, yBar + 3);
    cLine(ctx, x2, yBar - 3, x2, yBar + 3);
    ctx.fillStyle = '#061423';
    ctx.fillRect(ox - 24, yBar - 7, 48, 13);
    ctx.fillStyle = color;
    ctx.font = 'bold 10.5px Fira Code, monospace';
    ctx.fillText(label, ox, yBar + 3.5);
  };
  if (showInner) {
    drawInterval(r, oy + 26, '#f87171', '[-r, r]');
    drawInterval(R, oy + 40, '#38bdf8', '[-R, R]');
  } else {
    drawInterval(R, oy + 28, '#38bdf8', '[-R, R]');
  }
  ctx.restore();

  ctx.save(); ctx.textAlign = 'right'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.fillStyle = '#38bdf8';
  ctx.fillText('Eixo x', width - 12, oy - 19);
  ctx.fillText('(Rotação)', width - 12, oy - 7);
  ctx.restore();
}

const revStates = {
  single: { slide: 2, rotating: true, angle: 0.01, hold: 0, r: 0, btnId: 'btn-single-rotate', statusId: 'single-rev-status', doneMsg: 'Esfera Maciça Gerada no ℝ³!' },
  shell:  { slide: 6, rotating: true, angle: 0.01, hold: 0, r: 2.2, btnId: 'btn-s1-rotate', statusId: 's1-status-desc', doneMsg: 'Casca Esférica Gerada no ℝ³!' }
};

function toggleRev(key) {
  const rv = revStates[key];
  rv.rotating = !rv.rotating;
  if ($(rv.btnId)) $(rv.btnId).textContent = rv.rotating ? '⏸ Pausar' : '▶ Retomar';
}

function resetRevolution(key, restartAngle = true) {
  const rv = revStates[key];
  rv.rotating = true;
  rv.hold = 0;
  if (restartAngle) {
    rv.angle = 0.01;
    stages[rv.slide]?.setAngle(0.01);
  }
  if ($(rv.btnId)) $(rv.btnId).textContent = '⏸ Pausar';
}

function buildRevolution(slide, containerId, key) {
  const rv = revStates[key];
  const st = createStage(slide, containerId, { cam: [0, 6, 13], ambient: 0.65, light: 0.9 });
  const R = 3.8, r = rv.r;

  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  axis.rotation.z = Math.PI / 2;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI, false);
  if (r > 0) {
    shape.lineTo(-r, 0);
    shape.absarc(0, 0, r, Math.PI, 0, true);
  } else {
    shape.lineTo(0, 0);
  }
  shape.lineTo(R, 0);
  const plate = new THREE.Mesh(new THREE.ShapeGeometry(shape, 32),
    std({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.35, side: THREE.DoubleSide }));

  const outer = new THREE.Mesh(undefined, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.2, side: THREE.DoubleSide }));
  const inner = r > 0 ? new THREE.Mesh(undefined, std({ color: 0xf59e0b, transparent: true, opacity: 0.65, side: THREE.DoubleSide })) : null;
  st.scene.add(axis, plate, outer);
  if (inner) st.scene.add(inner);

  const sweep = (mesh, rad, phi) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.SphereGeometry(rad, 36, 20, 0, phi, 0, Math.PI).rotateZ(Math.PI / 2);
  };
  st.setAngle = phi => {
    plate.rotation.x = phi;
    sweep(outer, R, phi);
    if (inner) sweep(inner, r, phi);
  };
  st.setAngle(0.01);

  st.onFrame = () => {
    if (!rv.rotating) return;
    if (rv.angle < Math.PI * 2) {
      rv.angle = Math.min(rv.angle + 0.035, Math.PI * 2);
      st.setAngle(rv.angle);
    }
    const statusEl = $(rv.statusId);
    if (rv.angle >= Math.PI * 2) {
      if (statusEl) statusEl.innerHTML = `Rotação Concluída (360&deg;): <strong class="c-green">${rv.doneMsg}</strong>`;
      rv.hold += 1;
      if (rv.hold >= 55) {
        rv.hold = 0;
        rv.angle = 0.01;
        st.setAngle(0.01);
      }
    } else if (statusEl) {
      statusEl.innerHTML = `Ângulo de Rotação: <strong class="c-cyan">${Math.round((rv.angle / (Math.PI * 2)) * 360)}&deg;</strong>`;
    }
  };
  return st;
}

/* ==========================================================================
   SLIDE 3 — CASCA NO ℝ³: SUBTRAÇÃO V(R) - V(r) & TRANSIÇÃO x²+y² -> x²+y²+z²
   ========================================================================== */

function drawShellR3() {
  const canvas = $('canvas-shell-r3');
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);

  if ($('shell-r3-status')) {
    const msgs = {
      sub: 'Com <strong class="c-cyan">R = 5</strong> e <strong class="c-red">r = 3</strong>: resta parede sólida de espessura <strong class="c-amber">e = 2</strong>',
      base: '<strong class="c-cyan">Do 2D para o 3D:</strong> no plano é x&sup2; + y&sup2;; subindo em z vira <strong class="c-amber">dist&sup2; = x&sup2; + y&sup2; + z&sup2;</strong>',
      shell: '<strong class="c-cyan">Casca no &Ropf;&sup3;:</strong> a soma x&sup2; + y&sup2; + z&sup2; fica entre <strong class="c-red">r&sup2; = 9</strong> e <strong class="c-cyan">R&sup2; = 25</strong>'
    };
    $('shell-r3-status').innerHTML = msgs[shellR3Mode] || msgs.sub;
  }

  if (shellR3Mode === 'sub') {
    const cy = height * 0.48;
    const radExt = Math.min(width * 0.115, height * 0.32);
    const radInt = radExt * 0.6;
    const x1 = width * 0.17, x2 = width * 0.49, x3 = width * 0.82;

    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(x1, cy, radExt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    cLine(ctx, x1, cy, x1 + radExt, cy); cDot(ctx, x1, cy, 4, '#ffffff');
    cPillText(ctx, '1. Esfera Cheia', x1, cy - radExt - 16, '#38bdf8', 'center', 'bold 11px Inter, sans-serif');
    drawTextAt(ctx, x1 + radExt * 0.45, cy - 8, 'R', '#ffffff', 12);
    cPillText(ctx, 'Volume V(R)', x1, cy + radExt + 22, '#cbd5e1', 'center', 'bold 11px Inter, sans-serif');

    drawTextAt(ctx, (x1 + x2) / 2, cy + 9, '−', '#f87171', 26);

    ctx.fillStyle = 'rgba(248, 113, 113, 0.2)'; ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.4; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(x2, cy, radInt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    cLine(ctx, x2, cy, x2 + radInt, cy); cDot(ctx, x2, cy, 3.8, '#f87171');
    cPillText(ctx, '2. Miolo Retirado', x2, cy - radExt - 16, '#f87171', 'center', 'bold 11px Inter, sans-serif');
    drawTextAt(ctx, x2 + radInt * 0.45, cy - 8, 'r', '#fca5a5', 12);
    cPillText(ctx, 'Volume V(r)', x2, cy + radExt + 22, '#fca5a5', 'center', 'bold 11px Inter, sans-serif');

    drawTextAt(ctx, (x2 + x3) / 2, cy + 9, '=', '#34d399', 26);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.34)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(x3, cy, radExt, 0, Math.PI * 2, false); ctx.arc(x3, cy, radInt, 0, Math.PI * 2, true); ctx.fill('evenodd');
    ctx.beginPath(); ctx.arc(x3, cy, radExt, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(6, 20, 35, 0.9)'; ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(x3, cy, radInt, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.2; cLine(ctx, x3 + radInt, cy, x3 + radExt, cy);
    cDot(ctx, x3, cy, 3.8, '#ffffff');
    cPillText(ctx, '3. Casca Esférica', x3, cy - radExt - 16, '#34d399', 'center', 'bold 11px Inter, sans-serif');
    drawTextAt(ctx, x3 + (radInt + radExt) / 2, cy - 9, 'e', '#fbbf24', 12);
    cPillText(ctx, 'V = V(R) − V(r)', x3, cy + radExt + 22, '#34d399', 'center', 'bold 11px Inter, sans-serif');
    return;
  }

  // Visão ℝ³ (x² + y² + z² entre r² = 9 e R² = 25)
  const cx = width * 0.48, cy = height * 0.46;
  const rad = Math.min(width * 0.36, height * 0.34);
  const R = 5, r = 3, rPx = rad * (r / R);
  const showShell = shellR3Mode === 'shell';

  ctx.fillStyle = showShell ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.05)';
  ctx.strokeStyle = showShell ? 'rgba(56, 189, 248, 0.85)' : 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = showShell ? 2.4 : 1.4;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(6, 20, 35, 0.72)';
  ctx.strokeStyle = showShell ? 'rgba(248, 113, 113, 0.85)' : 'rgba(248, 113, 113, 0.35)';
  ctx.lineWidth = showShell ? 2.2 : 1.3; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(cx, cy, rad, rad * 0.3, 0, 0, Math.PI * 2); ctx.stroke();

  const proj = (x, y, z) => [cx + (y - x * 0.52) * (rad / R), cy + (x * 0.34 - z) * (rad / R)];
  const [xEndX, xEndY] = proj(5.6, 0, 0);
  const [yEndX, yEndY] = proj(0, 5.8, 0);
  const [zEndX, zEndY] = proj(0, 0, 5.5);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)'; ctx.lineWidth = 1.3;
  cLine(ctx, cx, cy, xEndX, xEndY); cLine(ctx, cx, cy, yEndX, yEndY); cLine(ctx, cx, cy, zEndX, zEndY);
  ctx.font = 'bold 12px Inter, sans-serif'; ctx.fillStyle = '#94a3b8';
  ctx.fillText('x', xEndX - 10, xEndY + 12); ctx.fillText('y', yEndX + 6, yEndY + 4); ctx.fillText('z', zEndX - 4, zEndY - 8);

  const [ax, ay] = proj(2.4, 0, 0), [bx, by] = proj(2.4, 2.2, 0), [px2d, py2d] = proj(2.4, 2.2, 2.35);

  ctx.globalAlpha = showShell ? 0.35 : 1;
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.4; cLine(ctx, cx, cy, ax, ay);
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.4; cLine(ctx, ax, ay, bx, by);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.1; cLine(ctx, cx, cy, bx, by, [4, 3]);
  ctx.fillStyle = '#38bdf8'; ctx.fillText('x', (cx + ax) / 2 - 18, (cy + ay) / 2 - 4);
  ctx.fillStyle = '#34d399'; ctx.fillText('y', (ax + bx) / 2, (ay + by) / 2 + 15);
  cPillText(ctx, 'chão² = x² + y²', bx + 8, by + 14, '#e2e8f0', 'left');

  ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5; cLine(ctx, bx, by, px2d, py2d);
  ctx.fillStyle = '#c084fc'; ctx.fillText('z', bx + 7, (by + py2d) / 2);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.2; cLine(ctx, cx, cy, px2d, py2d);
  cPillText(ctx, 'dist² = x² + y² + z²', (cx + px2d) / 2 - 8, (cy + py2d) / 2 - 12, '#fbbf24', 'right');

  cDot(ctx, cx, cy, 4, '#ffffff'); cDot(ctx, bx, by, 3, '#cbd5e1'); cDot(ctx, px2d, py2d, 5, '#f59e0b');
  ctx.fillStyle = '#ffffff'; ctx.fillText('P(x, y, z)', px2d + 8, py2d - 4);
  ctx.fillStyle = '#94a3b8'; ctx.fillText('C(0,0,0)', cx - 56, cy + 4);

  ctx.globalAlpha = showShell ? 1 : 0.45;
  ctx.fillStyle = '#38bdf8'; ctx.fillText('R = 5 (borda)', cx - rad + 4, cy - rad + 16);
  drawTextAt(ctx, cx, cy + rPx - 12, 'r = 3 (oco)', '#f87171', 12);

  const barW = Math.min(width - 60, 420), bx0 = (width - barW) / 2, barY = height - 26;
  const rStop = bx0 + barW * (r / R), dStop = bx0 + barW * (4 / R);
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.55)'; ctx.lineWidth = 4; cLine(ctx, bx0, barY, rStop, barY);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6; cLine(ctx, rStop, barY, bx0 + barW, barY);
  cDot(ctx, bx0, barY, 3.5, '#94a3b8'); cDot(ctx, rStop, barY, 4.5, '#f87171');
  cDot(ctx, dStop, barY, 5, '#f59e0b'); cDot(ctx, bx0 + barW, barY, 4.5, '#38bdf8');
  drawTextAt(ctx, bx0, barY + 15, '0', '#94a3b8', 11);
  drawTextAt(ctx, rStop, barY + 15, 'r² = 9', '#f87171', 11);
  drawTextAt(ctx, dStop, barY - 10, 'x²+y²+z² (na casca)', '#fbbf24', 11);
  drawTextAt(ctx, bx0 + barW, barY + 15, 'R² = 25', '#38bdf8', 11);
  ctx.globalAlpha = 1;
}

/* ==========================================================================
   SLIDE 5 — SOMA DE RIEMANN INTERATIVA & DISCOS 3D
   ========================================================================== */

function drawRiemann2D() {
  const canvas = $('canvas-riemann');
  const slider = $('slider-riemann-n');
  if (!canvas || !slider) return;

  const n = +slider.value;
  $('riemann-n-val').textContent = n;

  const { ctx, width, height } = setupCanvas(canvas);
  const R = 5;
  const s = Math.min((width - 60) / 11, (height - 64) / 5.4);
  const ox = width / 2;
  const oy = (height + 4.6 * s) / 2;
  const topY = Math.max(20, oy - 5.3 * s);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let x = -5; x <= 5; x++) cLine(ctx, ox + x * s, topY, ox + x * s, oy + 10);
  for (let y = 0; y <= 5; y++) cLine(ctx, ox - 5.4 * s, oy - y * s, ox + 5.4 * s, oy - y * s);

  const dx = (2 * R) / n;
  const sampleIdx = Math.floor(n * 0.65);
  let sumVol = 0;

  for (let i = 0; i < n; i++) {
    const x0 = -R + i * dx;
    const xMid = x0 + dx / 2;
    const yMid = Math.sqrt(Math.max(0, R * R - xMid * xMid));
    sumVol += Math.PI * (R * R - xMid * xMid) * dx;

    const px = ox + x0 * s, pw = dx * s, ph = yMid * s;
    const isSample = i === sampleIdx;
    ctx.fillStyle = isSample ? 'rgba(245, 158, 11, 0.42)' : 'rgba(56, 189, 248, 0.24)';
    ctx.strokeStyle = isSample ? '#f59e0b' : 'rgba(56, 189, 248, 0.78)';
    ctx.lineWidth = isSample ? 2 : 1;
    ctx.fillRect(px, oy - ph, pw, ph);
    ctx.strokeRect(px, oy - ph, pw, ph);

    if (isSample) cDot(ctx, ox + xMid * s, oy - ph, 3.5, '#f59e0b');
  }

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  cLine(ctx, Math.max(20, ox - 5.6 * s), oy, Math.min(width - 20, ox + 5.6 * s), oy);
  cLine(ctx, ox, oy + 8, ox, topY);

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(ox, oy, R * s, Math.PI, 0); ctx.stroke();

  ctx.font = 'bold 13px Inter, sans-serif'; ctx.fillStyle = '#cbd5e1';
  ctx.fillText('-R', ox - R * s - 9, oy + 17);
  ctx.fillText('0', ox - 3, oy + 17);
  ctx.fillText('R', ox + R * s - 4, oy + 17);

  const sx = ox + (-R + (sampleIdx + 0.5) * dx) * s;
  const sy = oy - Math.sqrt(Math.max(0, R * R - Math.pow(-R + (sampleIdx + 0.5) * dx, 2))) * s;
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('f(xᵢ*)', sx + 6, Math.max(topY + 12, sy - 6));
  ctx.fillText(`Δx = ${fmt(dx, 2)}`, Math.min(width - 88, sx - 12), oy + 17);

  const exact = (4 / 3) * Math.PI * Math.pow(R, 3);
  $('riemann-status').innerHTML =
    `n = <strong class="c-cyan">${n}</strong> | Δx = <strong class="c-cyan">${fmt(dx, 2)}</strong> | Soma Vₙ ≈ <strong class="c-amber">${fmt(sumVol, 2)}</strong> | Exato = <strong class="c-green">${fmt(exact, 2)}</strong>`;
}

function buildDisks(slide) {
  const st = createStage(slide, 'container-3d-s2-disks', { cam: [0, 3.2, 9.5], ambient: 0.65, clipping: true });
  st.state = { anim: true, cut: false, spin: true };
  const R = 2.6;
  const clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7, 16),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }));
  axis.rotation.z = Math.PI / 2;

  const outer = ball(R, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.1, transmission: 0.65, side: THREE.DoubleSide }));

  const slab = h => new THREE.CylinderGeometry(1, 1, h, 48).rotateZ(Math.PI / 2);
  const disk = new THREE.Mesh(slab(0.05), std({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45, transparent: true, opacity: 0.88, roughness: 0.2 }));

  const circle = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 65 }, (_, k) => new THREE.Vector3(0, Math.cos(k * Math.PI / 32), Math.sin(k * Math.PI / 32))));
  const rimOuter = new THREE.Line(circle, new THREE.LineBasicMaterial({ color: 0x00f0ff }));

  st.scene.add(axis, outer, disk, rimOuter, new THREE.PointLight(0x38bdf8, 1.0, 6));

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

    [disk, rimOuter].forEach(m => { m.position.x = x; m.scale.set(1, ro, ro); });

    const X = (x / R) * 5;
    posText.textContent = `x = ${fmt(X)}`;
    const areaExt = Math.PI * (25 - X * X);
    areaText.textContent = `π(25 − x²) ≈ ${fmt(areaExt)}`;
  };
  return st;
}

/* ==========================================================================
   MODELO GENÉRICO EM CAMADAS COM CORTE 90° (Slides 8, 9 e 11)
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
   SLIDE 10 — BOLA DE CHOCOLATE COM SLIDER DE CORTE
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
   SLIDE 14 — CAMADAS DO RESERVATÓRIO E LIMITAÇÕES DO MODELO
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
  stages[14]?.applyLayer();
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

  $('slider-riemann-n')?.addEventListener('input', drawRiemann2D);

  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea') || !KEYS[e.key]) return;
    e.preventDefault();
    KEYS[e.key]();
  });

  window.addEventListener('resize', () => {
    if (current === 1) drawWhyIsolateY();
    if (current === 2) drawRegion2D('canvas-2d-sphere-rev', false);
    if (current === 3) drawRiemann2D();
    if (current === 5) drawShellR3();
    if (current === 6) drawRegion2D('canvas-2d-s1', true);
    resizeStage(stages[current]);
  });

  renderMath();
  goToSlide(0);
});
