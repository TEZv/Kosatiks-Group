const spinBtn = document.getElementById("spin-btn");
const weekSpinBtn = document.getElementById("week-spin-btn");
const copyBtn = document.getElementById("copy-btn");
const kosatikBtn = document.getElementById("kosatik-btn");
const immersiveBtn = document.getElementById("immersive-btn");
const passportEl = document.getElementById("passport");
const loader = document.getElementById("loader");

const weeklyTitle = document.getElementById("weekly-title");
const weeklySpheres = document.getElementById("weekly-spheres");
const weeklyTopic = document.getElementById("weekly-topic");

const primaryName = document.getElementById("primary-name");
const primaryQuote = document.getElementById("primary-quote");
const primarySource = document.getElementById("primary-source");
const primaryTopic = document.getElementById("primary-topic");
const secondaryName = document.getElementById("secondary-name");
const secondaryQuote = document.getElementById("secondary-quote");
const secondarySource = document.getElementById("secondary-source");
const secondaryTopic = document.getElementById("secondary-topic");

const shareThreads = document.getElementById("share-threads");
const shareX = document.getElementById("share-x");
const kosatikLine = document.getElementById("kosatik-line");
const kosatikPanel = document.getElementById("kosatik-panel");
const kosatikQuip = document.getElementById("kosatik-quip");

let compass = null;
let lastOutcome = null;
let kosatikMode = false;
let immersiveMode = false;
let weeklyPack = null;
let createCompassScene = null;

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickTwoSpheres(rng) {
  const spheres = window.KLifeVault.getSpheres();
  const a = spheres[Math.floor(rng() * spheres.length)];
  let b = spheres[Math.floor(rng() * spheres.length)];
  while (b.id === a.id) b = spheres[Math.floor(rng() * spheres.length)];
  return [a, b];
}

function formatSphere(sp) {
  return `${sp.icon} S${sp.id}: ${sp.name}`;
}

function updateResult(primary, secondary, rng, weekTopicText) {
  const q1 = window.KLifeVault.getQuote(primary.id, rng);
  const q2 = window.KLifeVault.getQuote(secondary.id, rng);
  const t1 = weekTopicText || window.KLifeVault.getTopic(primary.id, rng);
  const t2 = window.KLifeVault.getTopic(secondary.id, rng);

  primaryName.textContent = formatSphere(primary);
  primaryQuote.textContent = `«${q1.t}»`;
  primarySource.textContent = q1.s ? `— ${q1.s}` : "";
  primaryTopic.textContent = `Топік: ${t1}`;

  secondaryName.textContent = formatSphere(secondary);
  secondaryQuote.textContent = `«${q2.t}»`;
  secondarySource.textContent = q2.s ? `— ${q2.s}` : "";
  secondaryTopic.textContent = `Топік: ${t2}`;

  passportEl.textContent = `🧭 [K Life OS] ➜ [S${primary.id}: ${primary.slug}] + [S${secondary.id}: ${secondary.slug}]`;

  if (compass) {
    compass.spinToSphereId(primary.id);
    compass.setHighlight(primary.id);
  }

  lastOutcome = { primary, secondary, t1, t2, q1, q2 };
  updateShareLinks(primary, secondary, t1);
}

function updateShareLinks(primary, secondary, topic) {
  const shareText = `[K Life OS]: ${primary.icon}+${secondary.icon}. ${topic}`;
  const encoded = encodeURIComponent(shareText);
  const page = encodeURIComponent("https://game.kosatiks-group.pp.ua/");
  shareThreads.href = `https://www.threads.net/intent/post?text=${encoded}%20${page}`;
  shareX.href = `https://twitter.com/intent/tweet?text=${encoded}&url=${page}`;
}

function renderWeeklyBanner() {
  weeklyPack = window.KLifeVault.getWeeklyPack();
  weeklyTitle.textContent = weeklyPack.weekLabel;
  weeklySpheres.textContent = `${formatSphere(weeklyPack.primary)} × ${formatSphere(weeklyPack.secondary)}`;
  weeklyTopic.textContent = weeklyPack.weekTopic;
}

function spinRandom() {
  const rng = Math.random;
  const [primary, secondary] = pickTwoSpheres(rng);
  updateResult(primary, secondary, rng);
  if (kosatikMode) showKosatikQuip();
}

function spinWeek() {
  const pack = window.KLifeVault.getWeeklyPack();
  const rng = mulberry32(pack.seed);
  updateResult(pack.primary, pack.secondary, rng, pack.weekTopic);
  passportEl.textContent += " • 🗓️ Спін тижня";
  if (kosatikMode) showKosatikQuip();
}

function showKosatikQuip() {
  const line = window.KLifeVault.getKosatikLine(Math.random);
  kosatikLine.textContent = line;
  kosatikLine.classList.remove("hidden");
  kosatikQuip.textContent = line;
}

async function copyOutcome() {
  if (!lastOutcome) return;
  const text = [
    "[K Life OS] — маршрут",
    `Primary: ${lastOutcome.primary.name}`,
    `Secondary: ${lastOutcome.secondary.name}`,
    `Цитата: ${lastOutcome.q1.t}`,
    `Топік: ${lastOutcome.t1}`,
    "https://game.kosatiks-group.pp.ua/",
  ].join("\n");
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = "Скопійовано ✓";
  setTimeout(() => { copyBtn.textContent = "Скопіювати"; }, 1400);
}

function toggleKosatik() {
  kosatikMode = !kosatikMode;
  document.body.classList.toggle("kosatik-mode", kosatikMode);
  kosatikBtn.setAttribute("aria-pressed", String(kosatikMode));
  kosatikPanel.hidden = !kosatikMode;
  if (kosatikMode) showKosatikQuip();
  else kosatikLine.classList.add("hidden");
}

function toggleImmersive() {
  immersiveMode = !immersiveMode;
  document.body.classList.toggle("immersive", immersiveMode);
  immersiveBtn.textContent = immersiveMode ? "Immersive: On" : "Immersive";
}

function initStarfield() {
  const canvas = document.getElementById("space-bg");
  const ctx = canvas.getContext("2d");
  const stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < 180; i += 1) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        v: Math.random() * 0.2 + 0.03,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.y += s.v;
      if (s.y > canvas.height) {
        s.y = -2;
        s.x = Math.random() * canvas.width;
      }
      ctx.fillStyle = immersiveMode ? "rgba(139,227,255,0.9)" : "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function diagnoseBootFailure() {
  if (window.location.protocol === "file:") {
    return "Відкрито як file:// — потрібен локальний сервер (npx serve .) або деплой на HTTPS.";
  }
  if (typeof window.pako === "undefined") {
    return "Не завантажився vendor/pako/pako.min.js (перевір шлях і заливку папки vendor/).";
  }
  if (!window.KLifeVault) {
    return "Не завантажився klife-vault.js (перевір мережу, Ctrl+F5; інколи блокує AdBlock — вимкни для game.…).";
  }
  try {
    window.KLifeVault.getSpheres();
  } catch (err) {
    return `Vault пошкоджений або pako не розпаковує: ${err.message}`;
  }
  return "Невідома помилка старту.";
}

function startApp() {
  let spheres;
  try {
    spheres = window.KLifeVault.getSpheres();
  } catch (err) {
    passportEl.textContent = `Помилка: ${diagnoseBootFailure()} (${err.message})`;
    loader.classList.add("hidden");
    return;
  }

  renderWeeklyBanner();
  spinWeek();

  import("./scene3d.js")
    .then((mod) => {
      createCompassScene = mod.createCompassScene;
      const canvas3d = document.getElementById("compass-3d");
      compass = createCompassScene(canvas3d, spheres);
    })
    .catch((err) => {
      document.body.classList.add("mode-2d");
      passportEl.textContent += " • 2D режим (3D недоступний — рандомайзер працює)";
      console.warn("3D init failed:", err);
    })
    .finally(() => {
      loader.classList.add("hidden");
    });
}

function boot(attempt = 0) {
  if (!window.KLifeVault || typeof window.pako === "undefined") {
    if (attempt < 50) {
      setTimeout(() => boot(attempt + 1), 100);
      return;
    }
    passportEl.textContent = `Помилка: ${diagnoseBootFailure()}`;
    loader.classList.add("hidden");
    return;
  }
  startApp();
}

spinBtn.addEventListener("click", spinRandom);
weekSpinBtn.addEventListener("click", spinWeek);
copyBtn.addEventListener("click", copyOutcome);
kosatikBtn.addEventListener("click", toggleKosatik);
immersiveBtn.addEventListener("click", toggleImmersive);

initStarfield();
if (document.readyState === "complete") boot();
else window.addEventListener("load", () => boot());

// Hard safety: prevent infinite loader in any runtime edge-case.
window.setTimeout(() => {
  loader.classList.add("hidden");
}, 4500);
