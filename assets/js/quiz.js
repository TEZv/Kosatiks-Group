// === MIND LAB v72: UI RESTORE + GOLD TIMER ===

// Конфігурація рівнів
const matrixLevels = [
  { gridSize: 4, count: 4, timeView: 1000, timeAction: 5000 },
  { gridSize: 5, count: 5, timeView: 1200, timeAction: 6000 },
  { gridSize: 6, count: 6, timeView: 1500, timeAction: 7000 },
];

const reflexConfig = { timePerClick: 2000 };

// Локалізація
const i18n = {
  en: {
    lives: "LINK STABILITY",
    watch: "MEMORIZE PATTERN",
    recon: "RECONSTRUCT",
    catch: "NEURAL REFLEX: CATCH 5",
    level: "LVL",
    failTitle: "⚠️ CONNECTION UNSTABLE",
    failDesc: "Pattern integrity lost. Rerouting to reflex protocol...",
    failReflex: "Reflex sync failed. Rebooting system...",
    failTime: "TIMEOUT. LINK SEVERED.",
    finalTitle: "NEURAL LINK ESTABLISHED",
    finalDesc:
      "System is ready for input.<br>Let's configure your unique profile.",
    finalBtn: "Proceed to Profile Form 🚀",
  },
  ua: {
    lives: "СТАБІЛЬНІСТЬ",
    watch: "ЗАПАМ'ЯТАЙ ПАТЕРН",
    recon: "ВІДТВОРИ",
    catch: "НЕЙРО-РЕФЛЕКС: ЗЛОВИ 5",
    level: "РІВ",
    failTitle: "⚠️ ЗВ'ЯЗОК НЕСТАБІЛЬНИЙ",
    failDesc:
      "Цілісність патерну втрачено. Перенаправлення на тест рефлексів...",
    failReflex: "Синхронізація рефлексів провалена. Перезавантаження...",
    failTime: "ЧАС ВИЧЕРПАНО. ЗВ'ЯЗОК РОЗІРВАНО.",
    finalTitle: "НЕЙРО-ЛІНК ВСТАНОВЛЕНО",
    finalDesc:
      "Система готова до введення даних.<br>Давай налаштуємо твій унікальний профіль.",
    finalBtn: "Перейти до Анкети 🚀",
  },
};

const gameSteps = [{ type: "matrix" }, { type: "reaction" }];

let gameState = {
  step: 0,
  matrixLevelIndex: 0,
  lang: "en",
  lives: 3,
  gameTimer: null,
};

// === INIT ===
function drawQuizShell() {
  const m = document.getElementById("quizModal");
  if (m.innerHTML.includes('id="quiz-content-area"')) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .matrix-cell { transition: all 0.2s ease; box-shadow: 0 0 5px rgba(0,0,0,0.5); border-radius:4px; }
    .matrix-cell.active { background: #465d5b !important; border-color: #fff !important; box-shadow: 0 0 15px #465d5b; transform: scale(1.05); }
    .matrix-cell.error { background: #822 !important; transform: scale(0.95); box-shadow: 0 0 10px #822; }
    .matrix-cell.success-hold { background: #465d5b !important; opacity: 1; border:1px solid #fff; } 
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    .pulse-text { animation: pulse 1.2s infinite; font-family: monospace; letter-spacing: 2px; }
    .status-bar { display:flex; justify-content:space-between; width:100%; max-width:240px; margin:0 auto 5px; font-family: monospace; font-size:11px; color:#666; padding-bottom:5px; }
    .lives-icons { letter-spacing:3px; color: #465d5b; text-shadow: 0 0 5px #465d5b; }
    .lives-icons.dmg { color: #822; text-shadow: none; opacity:0.3; }
    .timer-bar-bg { width: 100%; height: 3px; background: #222; margin: 0 auto 15px; border-radius: 2px; overflow: hidden; max-width: 240px; }
    .timer-bar-fill { height: 100%; background: #e0b06b; width: 0%; transition: width 0.1s linear; } /* CHANGED TO GOLD */
  `;
  document.head.appendChild(style);

  m.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-top-bar" style="display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:#0b0b0c; border-bottom:1px solid #222;">
        <div style="font-weight:800; color:#fff; font-size:11px; opacity:0.7; letter-spacing:1px;">[ MIND LAB v72 ]</div>
        <div style="display:flex; gap:10px;">
           <button onclick="setQuizLang('en')" class="lang-btn" style="background:transparent; border:none; color:#666; font-size:10px; cursor:pointer; font-weight:700;">EN</button>
           <button onclick="setQuizLang('ua')" class="lang-btn" style="background:transparent; border:none; color:#666; font-size:10px; cursor:pointer; font-weight:700;">UA</button>
           <button onclick="closeQuiz()" style="background:transparent; border:none; color:#666; cursor:pointer; font-size:16px; margin-left:10px;">✕</button>
        </div>
      </div>
      <div id="quiz-content-area" class="game-area" style="padding:30px; text-align:center; min-height:400px; display:flex; flex-direction:column; justify-content:center; align-items:center;"></div>
    </div>`;
}

window.openQuiz = function () {
  const m = document.getElementById("quizModal");
  if (!m) return;
  drawQuizShell();
  m.style.display = "flex";
  setTimeout(() => m.classList.add("open"), 10);

  const globalLang = localStorage.getItem("lang") || "en";
  gameState.lang = globalLang;

  gameState.step = 0;
  gameState.matrixLevelIndex = 0;
  gameState.lives = 3;
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);

  updateLangUI();
  renderStep();
};

window.closeQuiz = function () {
  const m = document.getElementById("quizModal");
  m.classList.remove("open");
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);
  setTimeout(() => (m.style.display = "none"), 300);
};

window.setQuizLang = (l) => {
  gameState.lang = l;
  updateLangUI();
};

function updateLangUI() {
  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((b) => {
    if (b.innerText.toLowerCase() === gameState.lang) b.style.color = "#fff";
    else b.style.color = "#666";
  });
}

// === RENDERER ===
function renderStep() {
  const area = document.getElementById("quiz-content-area");
  const t = i18n[gameState.lang];

  if (gameState.gameTimer) clearInterval(gameState.gameTimer);

  if (gameState.step >= gameSteps.length) {
    area.innerHTML = `
       <div class="fade-in">
         <div style="font-size:60px; margin-bottom:20px; text-shadow: 0 0 20px rgba(70,93,91,0.5);">🧠</div>
         <h2 style="color:#fff; margin-bottom:10px; letter-spacing:1px; font-size:18px;">${t.finalTitle}</h2>
         <p style="color:#888; font-size:13px; max-width:300px; margin:0 auto 30px; line-height:1.5;">${t.finalDesc}</p>
         <button onclick="goToForm()" style="padding:14px 30px; background:#465d5b; color:#fff; border-radius:30px; border:none; font-weight:700; cursor:pointer; box-shadow:0 10px 30px rgba(70, 93, 91, 0.3); transition:transform 0.2s;">${t.finalBtn}</button>
       </div>`;
    return;
  }

  const s = gameSteps[gameState.step];
  if (s.type === "matrix") renderMatrixGame(area);
  if (s.type === "reaction") renderReactionGame(area);
}

window.goToForm = () => {
  closeQuiz();
  const formTab = document.getElementById("tabEmbed");
  if (formTab) formTab.click();
};

// === HELPER: LIVE UPDATE UI ===
function updateLivesUI() {
  const livesDiv =
    document.querySelector(".status-bar span:nth-child(2)") ||
    document.getElementById("reflex-lives");
  if (!livesDiv) return;

  let livesHtml = "";
  for (let k = 0; k < 3; k++) {
    const cls = k < gameState.lives ? "" : "dmg";
    livesHtml += `<span class="lives-icons ${cls}">⚡</span>`;
  }

  if (livesDiv.id === "reflex-lives") livesDiv.innerHTML = `[${livesHtml}]`;
  else livesDiv.innerHTML = `${i18n[gameState.lang].lives} [${livesHtml}]`;
}

// === MATRIX GAME ===
function renderMatrixGame(area) {
  const config = matrixLevels[gameState.matrixLevelIndex];
  const size = config.gridSize;
  const cellSize = size === 4 ? 50 : size === 5 ? 42 : 36;
  const gap = 8;
  const t = i18n[gameState.lang];

  let livesHtml = "";
  for (let i = 0; i < 3; i++) {
    const cls = i < gameState.lives ? "" : "dmg";
    livesHtml += `<span class="lives-icons ${cls}">⚡</span>`;
  }

  let g = `<div class="matrix-grid" style="display:grid; grid-template-columns:repeat(${size},1fr); gap:${gap}px; margin:0 auto; width:fit-content;">`;
  for (let i = 0; i < size * size; i++) {
    g += `<div class="matrix-cell" id="c-${i}" onclick="hitMatrix(${i})" 
             style="width:${cellSize}px; height:${cellSize}px; background:#1a1a1c; border-radius:4px; cursor:pointer; border:1px solid #333;"></div>`;
  }
  g += `</div>`;

  area.innerHTML = `
    <div class="fade-in" style="width:100%;">
      <div class="status-bar">
         <span>${t.level} 0${gameState.matrixLevelIndex + 1}</span>
         <span>${t.lives} [${livesHtml}]</span>
      </div>
      
      <div class="timer-bar-bg"><div id="matrix-timer" class="timer-bar-fill"></div></div>
      
      <div style="height:30px; margin-bottom:5px;">
        <h3 id="st" class="pulse-text" style="color:#465d5b; font-size:14px; margin:0;">${t.watch}</h3>
      </div>
      
      ${g}
    </div>`;

  setTimeout(runMatrixSeq, 800);
}

function runMatrixSeq() {
  gameState.locked = true;
  gameState.clicks = [];

  const config = matrixLevels[gameState.matrixLevelIndex];
  const totalCells = config.gridSize * config.gridSize;
  const arr = Array.from({ length: totalCells }, (_, i) => i)
    .sort(() => 0.5 - Math.random())
    .slice(0, config.count);
  gameState.pat = arr;

  // Show
  arr.forEach((i) => {
    const el = document.getElementById(`c-${i}`);
    if (el) el.classList.add("active");
  });

  // Hide & Timer
  setTimeout(() => {
    document.querySelectorAll(".matrix-cell").forEach((c) => {
      c.classList.remove("active");
    });
    const st = document.getElementById("st");
    if (st) {
      st.innerText = i18n[gameState.lang].recon;
      st.style.color = "#fff";
      st.classList.remove("pulse-text");
    }
    gameState.locked = false;

    // START TIMER (GOLD)
    startGenericTimer("matrix-timer", config.timeAction, () => {
      gameState.locked = true;
      gameState.lives = 0;
      showFailScreen(i18n[gameState.lang].failTime);
    });
  }, config.timeView);
}

window.hitMatrix = (i) => {
  if (gameState.locked) return;
  const el = document.getElementById(`c-${i}`);
  if (gameState.clicks.includes(i)) return;

  if (gameState.pat.includes(i)) {
    // HIT
    el.classList.add("success-hold");
    gameState.clicks.push(i);

    if (gameState.clicks.length === gameState.pat.length) {
      if (gameState.gameTimer) clearInterval(gameState.gameTimer);
      gameState.locked = true;

      setTimeout(() => {
        gameState.matrixLevelIndex++;
        gameState.lives = 3;

        if (gameState.matrixLevelIndex >= matrixLevels.length) {
          gameState.step++;
          renderStep();
        } else {
          renderMatrixGame(document.getElementById("quiz-content-area"));
        }
      }, 400);
    }
  } else {
    // MISS
    el.classList.add("error");
    setTimeout(() => el.classList.remove("error"), 200);

    gameState.lives--;
    updateLivesUI();

    if (gameState.lives <= 0) {
      if (gameState.gameTimer) clearInterval(gameState.gameTimer);
      gameState.locked = true;
      showFailScreen(i18n[gameState.lang].failDesc);
    }
  }
};

// === REACTION GAME ===
function renderReactionGame(area) {
  const t = i18n[gameState.lang];
  gameState.lives = 3;

  let livesHtml = "";
  for (let i = 0; i < 3; i++) {
    const cls = i < gameState.lives ? "" : "dmg";
    livesHtml += `<span class="lives-icons ${cls}">⚡</span>`;
  }

  area.innerHTML = `
    <div class="fade-in" style="width:100%;">
       <div class="status-bar" style="justify-content:center; flex-direction:column; align-items:center; border:none; margin-bottom:5px;">
         <div style="margin-bottom:5px;">${t.catch}</div>
         <div id="reflex-lives" style="font-size:10px; margin-bottom:5px;">[${livesHtml}]</div>
       </div>
       
       <div class="timer-bar-bg" style="width:150px;"><div id="reflex-timer" class="timer-bar-fill"></div></div>
       
       <div style="height:280px; width:100%; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
          <div id="target" onclick="hitTarget()" 
               style="width:50px; height:50px; background:#e0b06b; border-radius:50%; position:absolute; cursor:pointer; 
                      box-shadow:0 0 20px rgba(224, 176, 107, 0.6); transition: transform 0.05s;"></div>
       </div>
    </div>
  `;
  gameState.targetsHit = 0;
  moveTarget();
}

window.hitTarget = () => {
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);

  gameState.targetsHit++;
  const t = document.getElementById("target");
  t.style.transform = "scale(0.8)";
  setTimeout(() => (t.style.transform = "scale(1)"), 50);

  if (gameState.targetsHit >= 5) {
    gameState.step++;
    renderStep();
  } else {
    moveTarget();
  }
};

function moveTarget() {
  const t = document.getElementById("target");
  if (!t) return;

  const maxX = 120;
  const maxY = 90;
  const x = Math.random() * (maxX * 2) - maxX;
  const y = Math.random() * (maxY * 2) - maxY;
  t.style.left = `calc(50% + ${x}px)`;
  t.style.top = `calc(50% + ${y}px)`;

  const colors = ["#e0b06b", "#465d5b", "#a461d8"];
  t.style.background = colors[Math.floor(Math.random() * colors.length)];

  startGenericTimer("reflex-timer", reflexConfig.timePerClick, () => {
    handleReflexMiss();
  });
}

function handleReflexMiss() {
  gameState.lives--;
  updateLivesUI();

  const t = document.getElementById("target");
  if (t) {
    t.style.boxShadow = "0 0 30px #ff0000";
    setTimeout(
      () => (t.style.boxShadow = "0 0 20px rgba(224, 176, 107, 0.6)"),
      300,
    );
  }

  if (gameState.lives <= 0) {
    showFailScreen(i18n[gameState.lang].failReflex);
  } else {
    moveTarget();
  }
}

// === GENERIC TIMER LOGIC ===
function startGenericTimer(elementId, durationMs, onComplete) {
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);

  const fill = document.getElementById(elementId);
  if (!fill) return;

  let left = durationMs;
  fill.style.width = "100%";
  fill.style.background = "#e0b06b"; // GOLD

  gameState.gameTimer = setInterval(() => {
    left -= 50;
    const pct = (left / durationMs) * 100;
    fill.style.width = `${pct}%`;

    if (pct < 30) fill.style.background = "#ff5555"; // RED

    if (left <= 0) {
      clearInterval(gameState.gameTimer);
      onComplete();
    }
  }, 50);
}

// === UI RESTORED (OLD STYLE) ===
function showFailScreen(msg) {
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);

  const area = document.getElementById("quiz-content-area");
  const t = i18n[gameState.lang];

  // Minimalist Style (No red borders)
  area.innerHTML = `
      <div class="fade-in">
         <div style="font-size:50px; margin-bottom:20px;">⚠️</div>
         <h2 style="color:#ff5555; margin-bottom:10px;">${t.failTitle}</h2>
         <p style="color:#aaa; font-size:13px; max-width:300px; margin:0 auto;">${msg}</p>
         <div class="pulse-text" style="margin-top:30px; font-size:11px; color:#666;">>>> REROUTING >>></div>
      </div>
    `;

  setTimeout(() => {
    gameState.step++;
    renderStep();
  }, 7500);
}
