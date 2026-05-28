import { t, sphereDisplayName, formatWeekLabel } from "./i18n.js";
import { applyUiLang, initLangToggle } from "./lang-ui.js";
import { loadVault } from "./vault-loader.js";

const spinBtn = document.getElementById("spin-btn");
const weekSpinBtn = document.getElementById("week-spin-btn");
const copyBtn = document.getElementById("copy-btn");
const kosatikBtn = document.getElementById("kosatik-btn");
const immersiveBtn = document.getElementById("immersive-btn");
const reflectionBtn = document.getElementById("reflection-btn");
const reflectionApplyBtn = document.getElementById("reflection-apply-btn");
const reflectionChoiceABtn = document.getElementById("reflection-choice-a");
const reflectionChoiceBBtn = document.getElementById("reflection-choice-b");
const reflectionCustomEl = document.getElementById("reflection-custom");
const reflectionResultEl = document.getElementById("reflection-result");
const compassFocusBtn = document.getElementById("compass-focus-btn");
const compassOrbitBtn = document.getElementById("compass-orbit-btn");
const viewButtons = Array.from(document.querySelectorAll("[data-view-mode]"));
const viewSections = Array.from(document.querySelectorAll("[data-view-section]"));
const cubeStage = document.getElementById("cube-stage");
const cubeCards = Array.from(document.querySelectorAll("[data-cube-card]"));
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
const kosatikLogicInline = document.getElementById("kosatik-logic-inline");
const bookSourceEl = document.getElementById("book-source");
const reflectionPromptEl = document.getElementById("reflection-prompt");

let compass = null;
let lastOutcome = null;
let kosatikMode = false;
let immersiveMode = false;
let weeklyPack = null;
let createCompassScene = null;
let weekSpinActive = false;
let orbitEnabled = true;
let reflectionState = null;
let currentViewMode = "all";
let cubeFocusIndex = 0;
let cubeOrbitAngle = 0;
let cubeOrbitRaf = null;

function mulberry32(a) {
  return function () {
    let s = (a += 0x6d2b79f5);
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
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
  return `${sp.icon} S${sp.id}: ${sphereDisplayName(sp)}`;
}

function containsCyrillic(text = "") {
  return /[\u0400-\u04FF]/.test(text);
}

function enSafeText(text, fallbackKey) {
  const lang = document.documentElement.lang === "en" ? "en" : "ua";
  if (lang !== "en") return text;
  if (!text || containsCyrillic(text)) return t(fallbackKey);
  return text;
}

function prettifyBookSource(raw) {
  if (!raw) return "Anteros • Series 1";
  const cleaned = String(raw)
    .replace(/\.(txt|md|json)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b(full|draft|v\d+)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const numbered = cleaned.match(/(\d{1,2})/);
  const bookNo = numbered ? Number(numbered[1]) : null;
  const title = cleaned.replace(/\d{1,2}/, "").trim();
  if (bookNo && title) return `Anteros • Series 1 · Book ${bookNo}: ${title}`;
  if (bookNo) return `Anteros • Series 1 · Book ${bookNo}`;
  return `Anteros • Series 1 · ${cleaned}`;
}

function renderReflectionPrompt(topic, quote, source, primary, secondary) {
  if (!reflectionPromptEl) return;
  const lang = document.documentElement.lang === "en" ? "en" : "ua";
  const promptsUa = [
    `Якщо взяти ідею «${topic}», який один крок ти робиш сьогодні між «${sphereDisplayName(primary)}» і «${sphereDisplayName(secondary)}»?`,
    `У цитаті «${quote}» що для тебе звучить як чесний виклик цього тижня?`,
    `Уяви розмову з книгою «${source}»: яке питання ти їй поставиш зараз, щоб зрушити з місця?`,
  ];
  const promptsEn = [
    `If you apply “${topic}”, what one action do you take today between “${sphereDisplayName(primary)}” and “${sphereDisplayName(secondary)}”?`,
    `In the quote “${quote}”, what feels like your honest challenge this week?`,
    `Imagine talking to “${source}”: what question would you ask it right now to move forward?`,
  ];
  const pool = lang === "en" ? promptsEn : promptsUa;
  reflectionPromptEl.textContent = pool[Math.floor(Math.random() * pool.length)];
  reflectionState = {
    a: t("reflectionChoiceA"),
    b: t("reflectionChoiceB"),
  };
  if (reflectionChoiceABtn) reflectionChoiceABtn.textContent = reflectionState.a;
  if (reflectionChoiceBBtn) reflectionChoiceBBtn.textContent = reflectionState.b;
  if (reflectionResultEl) reflectionResultEl.textContent = t("reflectionResultSeed");
  if (reflectionCustomEl) reflectionCustomEl.value = "";
}

function buildEnTopicPrompt(primary, secondary) {
  return `What one step connects ${sphereDisplayName(primary)} and ${sphereDisplayName(secondary)} this week?`;
}

function updateResult(primary, secondary, rng, weekTopicText) {
  const q1 = window.KLifeVault.getQuote(primary.id, rng);
  const q2 = window.KLifeVault.getQuote(secondary.id, rng);
  const topic1 = weekTopicText || window.KLifeVault.getTopic(primary.id, rng);
  const topic2 = window.KLifeVault.getTopic(secondary.id, rng);
  const lang = document.documentElement.lang === "en" ? "en" : "ua";
  const safeQ1 = enSafeText(q1.t, "enVaultFallbackQuote");
  const safeQ2 = enSafeText(q2.t, "enVaultFallbackQuote");
  const safeT1 = lang === "en" ? buildEnTopicPrompt(primary, secondary) : topic1;
  const safeT2 = lang === "en" ? buildEnTopicPrompt(secondary, primary) : topic2;

  primaryName.textContent = formatSphere(primary);
  primaryQuote.textContent = `«${safeQ1}»`;
  primarySource.textContent = q1.s ? `— ${prettifyBookSource(q1.s)}` : "";
  primaryTopic.textContent = `${t("topic")}: ${safeT1}`;

  secondaryName.textContent = formatSphere(secondary);
  secondaryQuote.textContent = `«${safeQ2}»`;
  secondarySource.textContent = q2.s ? `— ${prettifyBookSource(q2.s)}` : "";
  secondaryTopic.textContent = `${t("topic")}: ${safeT2}`;

  passportEl.textContent = `🧭 [K Life OS] ➜ [S${primary.id}: ${primary.slug}] + [S${secondary.id}: ${secondary.slug}]`;
  if (weekSpinActive) passportEl.textContent += t("weekSpinTag");

  if (compass) {
    compass.spinToSphereId(primary.id);
    compass.setHighlight(primary.id);
  }

  const prettySource = prettifyBookSource(q1.s || q2.s);
  if (bookSourceEl) bookSourceEl.textContent = prettySource;
  renderReflectionPrompt(safeT1, safeQ1, prettySource, primary, secondary);

  lastOutcome = { primary, secondary, t1: safeT1, t2: safeT2, q1: { ...q1, t: safeQ1 }, q2: { ...q2, t: safeQ2 } };
  updateShareLinks(primary, secondary, safeT1);
}

function updateShareLinks(primary, secondary, topic) {
  const shareText = `[K Life OS]: ${primary.icon}+${secondary.icon}. ${topic}`;
  const encoded = encodeURIComponent(shareText);
  const page = encodeURIComponent("https://game.kosatiks-group.pp.ua/");
  shareThreads.href = `https://www.threads.net/intent/post?text=${encoded}%20${page}`;
  shareX.href = `https://twitter.com/intent/tweet?text=${encoded}&url=${page}`;
}

function requireVault() {
  if (!window.KLifeVault || typeof window.pako === "undefined") {
    throw new Error(diagnoseBootFailure());
  }
}

function renderWeeklyBanner() {
  requireVault();
  weeklyPack = window.KLifeVault.getWeeklyPack();
  const lang = document.documentElement.lang === "en" ? "en" : "ua";
  weeklyTitle.textContent = formatWeekLabel(weeklyPack.seed);
  weeklySpheres.textContent = `${formatSphere(weeklyPack.primary)} × ${formatSphere(weeklyPack.secondary)}`;
  weeklyTopic.textContent =
    lang === "en"
      ? `${t("enVaultFallbackWeekly")} ${buildEnTopicPrompt(weeklyPack.primary, weeklyPack.secondary)}`
      : weeklyPack.weekTopic;
}

function spinRandom() {
  try {
    requireVault();
    weekSpinActive = false;
    const rng = Math.random;
    const [primary, secondary] = pickTwoSpheres(rng);
    updateResult(primary, secondary, rng);
    if (kosatikMode) showKosatikQuip();
  } catch (err) {
    passportEl.textContent = `${t("errPrefix")}: ${err.message}`;
  }
}

function spinWeek() {
  try {
    requireVault();
    weekSpinActive = true;
    const pack = window.KLifeVault.getWeeklyPack();
    const rng = mulberry32(pack.seed);
    updateResult(pack.primary, pack.secondary, rng, pack.weekTopic);
    if (kosatikMode) showKosatikQuip();
  } catch (err) {
    passportEl.textContent = `${t("errPrefix")}: ${err.message}`;
  }
}

function showKosatikQuip() {
  let line = window.KLifeVault.getKosatikLine(Math.random);
  if (document.documentElement.lang === "en" && containsCyrillic(line)) {
    line = "Kosatik whisper: choose one honest micro-action and protect your focus.";
  }
  kosatikLine.textContent = line;
  kosatikLine.classList.remove("hidden");
  kosatikQuip.textContent = line;
}

async function copyOutcome() {
  if (!lastOutcome) return;
  const text = [
    t("copyHeader"),
    `${t("copyPrimary")}: ${sphereDisplayName(lastOutcome.primary)}`,
    `${t("copySecondary")}: ${sphereDisplayName(lastOutcome.secondary)}`,
    `${t("copyQuote")}: ${lastOutcome.q1.t}`,
    `${t("copyTopic")}: ${lastOutcome.t1}`,
    "https://game.kosatiks-group.pp.ua/",
  ].join("\n");
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = t("copied");
  setTimeout(() => {
    copyBtn.textContent = t("copy");
  }, 1400);
}

function toggleKosatik() {
  kosatikMode = !kosatikMode;
  document.body.classList.toggle("kosatik-mode", kosatikMode);
  kosatikBtn.setAttribute("aria-pressed", String(kosatikMode));
  kosatikPanel.hidden = !kosatikMode;
  if (kosatikMode) showKosatikQuip();
  else kosatikLine.classList.add("hidden");
  if (kosatikLogicInline) kosatikLogicInline.classList.toggle("hidden", !kosatikMode);
}

function toggleImmersive() {
  immersiveMode = !immersiveMode;
  document.body.classList.toggle("immersive", immersiveMode);
  immersiveBtn.textContent = immersiveMode ? t("immersiveOn") : t("immersive");
}

function resetCompassFocus() {
  cubeFocusIndex = (cubeFocusIndex + 1) % Math.max(cubeCards.length, 1);
  applyCubeLayout();
  if (!compass) return;
  const target = lastOutcome?.primary?.id || weeklyPack?.primary?.id || 1;
  compass.spinToSphereId(target, 2);
  compassFocusBtn?.classList.add("active-pulse");
  window.setTimeout(() => compassFocusBtn?.classList.remove("active-pulse"), 550);
}

function toggleCompassOrbit() {
  orbitEnabled = !orbitEnabled;
  if (compass) compass.setAutoRotate(orbitEnabled);
  compassOrbitBtn.textContent = orbitEnabled ? t("compassOrbit") : t("compassOrbitOff");
  compassOrbitBtn?.classList.toggle("active-pulse", orbitEnabled);
}

function spinReflection() {
  if (!lastOutcome) {
    reflectionPromptEl.textContent = t("reflectionSeed");
    return;
  }
  const prettySource = prettifyBookSource(lastOutcome.q1.s || lastOutcome.q2.s);
  if (bookSourceEl) bookSourceEl.textContent = prettySource;
  renderReflectionPrompt(lastOutcome.t1, lastOutcome.q1.t, prettySource, lastOutcome.primary, lastOutcome.secondary);
}

function pickReflection(choice) {
  if (!reflectionState || !reflectionResultEl) return;
  const text = choice === "a" ? reflectionState.a : reflectionState.b;
  reflectionResultEl.textContent = `${t("reflectionPicked")}: ${text}`;
}

function applyCustomReflection() {
  if (!reflectionResultEl || !reflectionCustomEl) return;
  const raw = reflectionCustomEl.value.trim();
  if (!raw) {
    reflectionResultEl.textContent = t("reflectionNeedCustom");
    return;
  }
  reflectionResultEl.textContent = `${t("reflectionCustomPicked")}: ${raw}`;
}

function setViewMode(mode) {
  currentViewMode = mode;
  viewButtons.forEach((btn) => btn.classList.toggle("active", btn.getAttribute("data-view-mode") === mode));
  viewSections.forEach((el) => {
    const values = (el.getAttribute("data-view-section") || "").split(/\s+/).filter(Boolean);
    const visible = mode === "all" || values.includes(mode) || values.includes("all");
    el.classList.toggle("view-hidden", !visible);
  });
  if (mode !== "all") {
    const idx = cubeCards.findIndex((card) => {
      const values = (card.getAttribute("data-view-section") || "").split(/\s+/).filter(Boolean);
      return values.includes(mode);
    });
    if (idx >= 0) {
      cubeFocusIndex = idx;
      applyCubeLayout();
    }
  }
}

function initViewModeSwitch() {
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-view-mode") || "all";
      setViewMode(mode);
    });
  });
  setViewMode("all");
}

function initCardTilt() {
  const cards = Array.from(document.querySelectorAll(".glass"));
  cards.forEach((card) => {
    card.classList.add("tilt-card");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  });
}

function applyCubeLayout() {
  if (!cubeStage || window.innerWidth <= 760 || !cubeCards.length) return;
  const step = (Math.PI * 2) / cubeCards.length;
  const radiusX = Math.min(360, Math.max(220, window.innerWidth * 0.22));
  const radiusZ = Math.min(250, Math.max(140, window.innerWidth * 0.15));
  let bestIdx = 0;
  let bestZ = -Infinity;
  cubeCards.forEach((card, i) => {
    const angle = (i - cubeFocusIndex) * step + (cubeOrbitAngle * Math.PI) / 180;
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ;
    const rotateY = (Math.sin(angle) * 14).toFixed(2);
    const scale = (0.86 + ((z + radiusZ) / (radiusZ * 2)) * 0.16).toFixed(3);
    const opacity = (0.24 + ((z + radiusZ) / (radiusZ * 2)) * 0.76).toFixed(3);
    card.style.transform = `translateX(calc(-50% + ${x.toFixed(1)}px)) translateZ(${z.toFixed(1)}px) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = String(100 + Math.round(z));
    if (z > bestZ) {
      bestZ = z;
      bestIdx = i;
    }
  });
  cubeCards.forEach((card, i) => {
    const interactive = i === bestIdx;
    card.style.pointerEvents = interactive ? "auto" : "none";
  });
}

function tickCubeOrbit() {
  if (orbitEnabled && window.innerWidth > 760) {
    cubeOrbitAngle -= 0.1;
    applyCubeLayout();
  }
  cubeOrbitRaf = requestAnimationFrame(tickCubeOrbit);
}

function initCubeStage() {
  if (!cubeStage || !cubeCards.length) return;
  applyCubeLayout();
  window.addEventListener("resize", applyCubeLayout);
  if (!cubeOrbitRaf) cubeOrbitRaf = requestAnimationFrame(tickCubeOrbit);
}

function refreshAfterLangChange() {
  applyUiLang();
  if (reflectionBtn) reflectionBtn.textContent = t("reflectionBtn");
  if (reflectionApplyBtn) reflectionApplyBtn.textContent = t("reflectionApplyBtn");
  if (reflectionChoiceABtn && reflectionState) reflectionChoiceABtn.textContent = reflectionState.a;
  if (reflectionChoiceBBtn && reflectionState) reflectionChoiceBBtn.textContent = reflectionState.b;
  if (reflectionPromptEl && !lastOutcome) reflectionPromptEl.textContent = t("reflectionSeed");
  if (reflectionResultEl && !reflectionState) reflectionResultEl.textContent = t("reflectionResultSeed");
  if (compassOrbitBtn) compassOrbitBtn.textContent = orbitEnabled ? t("compassOrbit") : t("compassOrbitOff");
  if (kosatikLogicInline) kosatikLogicInline.textContent = t("kosatikLogic");
  setViewMode(currentViewMode);
  const canvas3d = document.getElementById("compass-3d");
  if (canvas3d) canvas3d.setAttribute("aria-label", t("compassAria"));
  if (!window.KLifeVault) {
    passportEl.textContent = `${t("errPrefix")}: ${t("passportIdle")}`;
    return;
  }
  try {
    renderWeeklyBanner();
    if (lastOutcome) {
      const pack = weeklyPack || window.KLifeVault.getWeeklyPack();
      const rng = weekSpinActive ? mulberry32(pack.seed) : Math.random;
      const topic = weekSpinActive ? pack.weekTopic : undefined;
      updateResult(lastOutcome.primary, lastOutcome.secondary, rng, topic);
    } else {
      spinWeek();
    }
  } catch (err) {
    passportEl.textContent = `${t("errPrefix")}: ${err.message}`;
  }
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
  if (window.location.protocol === "file:") return t("errFile");
  if (typeof window.pako === "undefined") return t("errPako");
  if (!window.KLifeVault) return t("errVault");
  try {
    window.KLifeVault.getSpheres();
  } catch (err) {
    return `${t("errVaultBroken")}: ${err.message}`;
  }
  return t("errUnknown");
}

function setPassportIdle() {
  passportEl.textContent = t("passportIdle");
}

function startApp() {
  let spheres;
  try {
    requireVault();
    spheres = window.KLifeVault.getSpheres();
    if (!spheres?.length) throw new Error("empty vault spheres");
    renderWeeklyBanner();
    spinWeek();
  } catch (err) {
    setPassportIdle();
    passportEl.textContent = `${t("errPrefix")}: ${err.message}`;
    loader.classList.add("hidden");
    return;
  }

  import("./scene3d.js")
    .then((mod) => {
      createCompassScene = mod.createCompassScene;
      const canvas3d = document.getElementById("compass-3d");
      compass = createCompassScene(canvas3d, spheres);
      compass.setAutoRotate(orbitEnabled);
    })
    .catch((err) => {
      document.body.classList.add("mode-2d");
      passportEl.textContent += t("mode2d");
      console.warn("3D init failed:", err);
    })
    .finally(() => {
      loader.classList.add("hidden");
    });
}

async function waitForPako(maxMs = 8000) {
  const step = 80;
  for (let t0 = 0; t0 < maxMs; t0 += step) {
    if (typeof window.pako !== "undefined") return;
    await new Promise((r) => setTimeout(r, step));
  }
}

async function boot() {
  setPassportIdle();
  await waitForPako();
  try {
    await loadVault();
  } catch {
    /* vault-loader tries script + fetch */
  }
  if (!window.KLifeVault || typeof window.pako === "undefined") {
    passportEl.textContent = `${t("errPrefix")}: ${diagnoseBootFailure()}`;
    loader.classList.add("hidden");
    return;
  }
  try {
    window.KLifeVault.getSpheres();
  } catch (err) {
    passportEl.textContent = `${t("errPrefix")}: ${t("errVaultBroken")}: ${err.message}`;
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
if (reflectionBtn) reflectionBtn.addEventListener("click", spinReflection);
if (reflectionApplyBtn) reflectionApplyBtn.addEventListener("click", applyCustomReflection);
if (reflectionChoiceABtn) reflectionChoiceABtn.addEventListener("click", () => pickReflection("a"));
if (reflectionChoiceBBtn) reflectionChoiceBBtn.addEventListener("click", () => pickReflection("b"));
if (compassFocusBtn) compassFocusBtn.addEventListener("click", resetCompassFocus);
if (compassOrbitBtn) compassOrbitBtn.addEventListener("click", toggleCompassOrbit);

initStarfield();
applyUiLang();
initLangToggle(refreshAfterLangChange);
initViewModeSwitch();
initCardTilt();
initCubeStage();
if (reflectionPromptEl) reflectionPromptEl.textContent = t("reflectionSeed");
if (reflectionResultEl) reflectionResultEl.textContent = t("reflectionResultSeed");

if (document.readyState === "complete") boot();
else window.addEventListener("load", () => boot());

window.setTimeout(() => {
  loader.classList.add("hidden");
}, 4500);
