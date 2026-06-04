/** UI + sphere labels (phase 1). Quotes/topics stay UK until vault EN build (phase 2).
 *  Loaded as a regular defer script so classic scripts (realtime.js) can read
 *  the localized strings from window.__klifeI18n without going through the
 *  ES module graph. UA/EN parity lives in one place — no more inline LABELS
 *  duplicated in realtime.js.
 */

const STORAGE_KEY = "k-life-os-game-lang";

const SPHERE_NAMES = {
  ua: {
    1: "Творчість або самовираження",
    2: "Особистий розвиток або догляд за собою",
    3: "Побут і домашнє господарство",
    4: "Фінанси",
    5: "Батьківство та сім'я",
    6: "Відпочинок і хобі",
    7: "Громада та соціальні зв'язки",
    8: "Фізичне здоров'я",
    9: "Кар'єра або освіта",
    10: "Екологія та благодійність",
    11: "Особисті стосунки",
    12: "Духовність",
  },
  en: {
    1: "Creativity or Self-Expression",
    2: "Personal Development or Self-Care",
    3: "Domestic Life or Household Management",
    4: "Finance",
    5: "Parenting or Family",
    6: "Recreation and Hobbies",
    7: "Community Involvement or Social Connection",
    8: "Physical Health",
    9: "Career or Education",
    10: "Environmental or Charitable Causes",
    11: "Personal Relationship",
    12: "Spirituality",
  },
};

const UI = {
  ua: {
    pageTitle: "[K Life OS] — Куди мене занесе?",
    metaDescription:
      "Інтерактивний 3D-компас 12 сфер [K Life OS]. Рандомайзер, тема тижня, цитати з серії Anteros.",
    loader: "Завантажую всесвіт [K Life OS]…",
    compassAria: "3D компас 12 сфер",
    h1: "Куди мене занесе сьогодні?",
    kosatik: "🐋 Косатик",
    immersive: "Immersive",
    immersiveOn: "Immersive: увімк.",
    identity: "K Identity",
    weeklyLabel: "Тема тижня (спільна для всіх)",
    randomTitle: "Живий рандом",
    viewAll: "Усе",
    viewWeekly: "Тиждень",
    viewRandom: "Рандом",
    viewRoute: "Маршрут",
    viewBook: "Книга",
    compassTitle: "3D-компас [K Life OS]",
    compassHint: "Тягни мишею: обертай сцену. Колесо: zoom.",
    compassFocus: "Фокус",
    compassOrbit: "Орбіта: ON",
    compassOrbitOff: "Орбіта: OFF",
    passportTitle: "Системний паспорт",
    passportIdle: "🧭 [K Life OS] — натисни «Рандомайзер» або «Спін тижня»",
    spin: "Рандомайзер сфер",
    weekSpin: "Спін тижня",
    copy: "Скопіювати",
    copied: "Скопійовано ✓",
    route: "Твій маршрут",
    primary: "Головна сфера",
    secondary: "Додаткова сфера",
    topic: "Топік",
    weekSpinTag: " • 🗓️ Спін тижня",
    mode2d: " • 2D режим (3D недоступний — рандомайзер працює)",
    kosatikTitle: "Кит-Кіт Косатик",
    kosatikDefault: "Бекстейдж-режим увімкнено.",
    kosatikLogic:
      "Логіка Kosatik: м’яка іронія + чесний фокус. Це режим, де ми не героїзуємо хаос, а шукаємо маленький реальний крок.",
    kosatikLines: [
      "Обрала м’який крок — тепер захищай фокус.",
      "Питання вже є. Тепер обери, чи з ним щось робити.",
      "Не героїзуй хаос. Зроби маленьке.",
      "Ти не мусиш бути натхненною. Достатньо бути чесною.",
      "Один реальний крок важливіший за десять ідей у голові.",
      "Фокус — це не талант, а звичка.",
      "Спокій — це не відсутність хаосу, а навичка не рятувати всіх одразу.",
      "Сьогодні можна не все. Можна одне — і влучити.",
      "Не чекай натхнення. Використай 15 хвилин.",
      "Слухай себе так само уважно, як слухаєш клієнтів.",
      "Ти вже знаєш, що робити. Просто ще не вирішила.",
      "Сміливість — не кричати голосніше, а обирати тихіше.",
    ],
    contentNote:
      "Цитати й топіки зараз українською (канон Anteros). Англомовна бібліотека — у наступному оновленні.",
    providerQuick: "Швидко",
    quick: "Швидко",
    providerQuickTitle: "Швидко · безкоштовно, миттєво (Groq)",
    quickTitle: "Швидко · безкоштовно, миттєво (Groq)",
    providerDeep: "Глибоко",
    deep: "Глибоко",
    providerDeepTitle: "Глибоко · філософська глибина (M3 · MiniMax-M3)",
    deepTitle: "Глибоко · філософська глибина (M3 · MiniMax-M3)",
    providerDeepUnavailableTitle:
      "Глибоко недоступне — потрібен M3_API_KEY / OPENROUTER_API_KEY на сервері",
    deepUnavailable: "Глибоко недоступне — потрібен M3_API_KEY / OPENROUTER_API_KEY на сервері",
    deepBackendOpenRouter: "Глибоко через OpenRouter (дешевше)",
    deepBackendDirect: "Глибоко через MiniMax direct",
    weekLabel: (w, y) => `Тиждень ${w}, ${y}`,
    copyHeader: "[K Life OS] — маршрут",
    copyPrimary: "Головна сфера",
    copySecondary: "Додаткова сфера",
    copyQuote: "Цитата",
    copyTopic: "Топік",
    bookLabTitle: "Поговорити з книги",
    anterosMainLink: "Anteros сайт",
    anterosAntiFanLink: "Anti-Fan",
    reflectionBtn: "Новий роздум",
    reflectionSeed: "Натисни «Новий роздум», щоб отримати питання з поточного маршруту.",
    reflectionChooseTitle: "Обери резонанс",
    reflectionCustomTitle: "Твій варіант",
    reflectionCustomPlaceholder: "Яка твоя відповідь на цей роздум?",
    reflectionApplyBtn: "Зафіксувати мій варіант",
    reflectionChoiceA: "A: Обираю м’який крок і стабілізую ритм.",
    reflectionChoiceB: "B: Йду в напругу і перевіряю межу чесності.",
    reflectionResultSeed: "Тут з’явиться обрана позиція.",
    reflectionPicked: "Обрано",
    reflectionCustomPicked: "Мій варіант",
    reflectionNeedCustom: "Спершу впиши свій варіант у поле.",
    enVaultFallbackQuote: "Ukrainian canon quote is available in UA mode.",
    enVaultFallbackTopic: "What one real step can you take this week?",
    enVaultFallbackWeekly:
      "Weekly prompt is generated from Ukrainian canon. Full EN quote/topic pack is in progress.",
    errFile: "Відкрито як file:// — потрібен локальний сервер (npx serve .) або деплой на HTTPS.",
    errPako: "Не завантажився vendor/pako/pako.min.js.",
    errVault:
      "Не завантажились дані vault (vault.js). Ctrl+Shift+R; вимкни AdBlock для game.… або спробуй інкогніто.",
    errVaultBroken: "Vault пошкоджений або pako не розпаковує",
    errUnknown: "Невідома помилка старту.",
    errPrefix: "Помилка",
    // ---- Riddle / "Echoes" gate (Anteros canon) ----
    riddleEmoji: "◈",
    riddleTitle: "Відлуння",
    riddleSubtitle: "Anteros · канон",
    riddleSubmit: "Відповісти",
    riddleNext: "Далі →",
    riddleClose: "Закрити",
    riddlePlaceholder: "Твоя відповідь",
    riddleSolved: "✓ Почуто.",
    riddleEmpty: "Введи відповідь",
    riddleWrong: "✗ Не зовсім.",
    riddleHint: "Підказка",
    riddleHintRevealed: "✓ Підказку розкрито",
    riddleHintBook: "Звідки",
    riddleOutOfTries: "Спроби вичерпано. Підказка:",
    riddleTriesLeft: (n) => `Залишилось спроб: ${n}.`,
    riddleNetworkError: "Мережева помилка — спробуй пізніше.",
    riddleLoadError: "Не вдалося завантажити загадку.",
    riddleEchoLevel: (n) => `Відлуння ${n} / 3`,
    riddleBook: (title) => (title ? `${title}` : ""),
    riddleLevelWord: (n) => ["перше", "друге", "третє"][n - 1] || `${n}-те`,
    riddleLangLabel: "Мова",
  },
  en: {
    pageTitle: "[K Life OS] — Where will it take me?",
    metaDescription:
      "Interactive 3D compass of 12 [K Life OS] spheres. Randomizer, weekly theme, quotes from Anteros.",
    loader: "Loading the [K Life OS] universe…",
    compassAria: "3D compass of 12 spheres",
    h1: "Where will it take me today?",
    kosatik: "🐋 Kosatik",
    immersive: "Immersive",
    immersiveOn: "Immersive: On",
    identity: "K Identity",
    weeklyLabel: "Weekly theme (shared for everyone)",
    randomTitle: "Live random",
    viewAll: "All",
    viewWeekly: "Weekly",
    viewRandom: "Random",
    viewRoute: "Route",
    viewBook: "Book",
    compassTitle: "3D [K Life OS] compass",
    compassHint: "Drag to rotate scene. Wheel to zoom.",
    compassFocus: "Focus",
    compassOrbit: "Orbit: ON",
    compassOrbitOff: "Orbit: OFF",
    passportTitle: "System passport",
    passportIdle: "🧭 [K Life OS] — tap Randomizer or Week spin",
    spin: "Sphere randomizer",
    weekSpin: "Week spin",
    copy: "Copy",
    copied: "Copied ✓",
    route: "Your route",
    primary: "Primary sphere",
    secondary: "Secondary sphere",
    topic: "Topic",
    weekSpinTag: " • 🗓️ Week spin",
    mode2d: " • 2D mode (3D unavailable — randomizer still works)",
    kosatikTitle: "Kit-Kit Kosatik",
    kosatikDefault: "Backstage mode on.",
    kosatikLogic:
      "Kosatik logic: gentle irony + honest focus. This mode avoids chaos-glorification and looks for one real action.",
    kosatikLines: [
      "Picked a gentle step? Now protect the focus.",
      "The question is already there. Choose what to do with it.",
      "Don't glorify chaos. Make it small.",
      "You don't have to be inspired. Just honest.",
      "One real step matters more than ten ideas in your head.",
      "Focus is a habit, not a talent.",
      "Calm isn't the absence of chaos — it's the skill of not rescuing everyone at once.",
      "Today, one thing done right beats ten done halfway.",
      "Don't wait for inspiration. Use 15 minutes.",
      "Listen to yourself as carefully as you listen to clients.",
      "You already know what to do. You just haven't decided yet.",
      "Courage isn't shouting louder. It's choosing quieter.",
    ],
    contentNote:
      "UI is English. Quotes and topics are shown from the Ukrainian canon (Anteros) until EN vault is generated.",
    providerQuick: "Quick",
    quick: "Quick",
    providerQuickTitle: "Quick · free, instant (Groq)",
    quickTitle: "Quick · free, instant (Groq)",
    providerDeep: "Deep",
    deep: "Deep",
    providerDeepTitle: "Deep · philosophical depth (M3 · MiniMax-M3)",
    deepTitle: "Deep · philosophical depth (M3 · MiniMax-M3)",
    providerDeepUnavailableTitle:
      "Deep unavailable — M3_API_KEY / OPENROUTER_API_KEY required on the server",
    deepUnavailable: "Deep unavailable — M3_API_KEY / OPENROUTER_API_KEY required on the server",
    deepBackendOpenRouter: "Deep via OpenRouter (cheaper)",
    deepBackendDirect: "Deep via MiniMax direct",
    weekLabel: (w, y) => `Week ${w}, ${y}`,
    copyHeader: "[K Life OS] — route",
    copyPrimary: "Primary sphere",
    copySecondary: "Secondary sphere",
    copyQuote: "Quote",
    copyTopic: "Topic",
    bookLabTitle: "Talk with the book",
    anterosMainLink: "Anteros site",
    anterosAntiFanLink: "Anti-Fan",
    reflectionBtn: "New reflection",
    reflectionSeed: "Tap “New reflection” to get a question from your current route.",
    reflectionChooseTitle: "Choose your resonance",
    reflectionCustomTitle: "Your own option",
    reflectionCustomPlaceholder: "What is your answer to this reflection?",
    reflectionApplyBtn: "Save my option",
    reflectionChoiceA: "A: I choose a gentle step and stabilize my rhythm.",
    reflectionChoiceB: "B: I enter tension and test the edge of honesty.",
    reflectionResultSeed: "Your selected position will appear here.",
    reflectionPicked: "Selected",
    reflectionCustomPicked: "My option",
    reflectionNeedCustom: "Write your own option first.",
    enVaultFallbackQuote: "Ukrainian canon quote is available in UA mode.",
    enVaultFallbackTopic: "What one real step can you take this week?",
    enVaultFallbackWeekly:
      "Weekly prompt is generated from Ukrainian canon. Full EN quote/topic pack is in progress.",
    errFile: "Opened as file:// — use a local server (npx serve .) or HTTPS deploy.",
    errPako: "vendor/pako/pako.min.js did not load.",
    errVault:
      "Vault data did not load (vault.js). Ctrl+Shift+R; disable AdBlock for game.… or try incognito.",
    errVaultBroken: "Vault corrupt or pako failed to decompress",
    errUnknown: "Unknown startup error.",
    errPrefix: "Error",
    // ---- Riddle / "Echoes" gate (Anteros canon) ----
    riddleEmoji: "◈",
    riddleTitle: "Echo",
    riddleSubtitle: "Anteros · canon",
    riddleSubmit: "Answer",
    riddleNext: "Next →",
    riddleClose: "Close",
    riddlePlaceholder: "Your answer",
    riddleSolved: "✓ Heard.",
    riddleEmpty: "Type an answer",
    riddleWrong: "✗ Not quite.",
    riddleHint: "Hint",
    riddleHintRevealed: "✓ Hint revealed",
    riddleHintBook: "From",
    riddleOutOfTries: "Out of tries. Hint:",
    riddleTriesLeft: (n) => `Tries left: ${n}.`,
    riddleNetworkError: "Network error — try again later.",
    riddleLoadError: "Failed to load the riddle.",
    riddleEchoLevel: (n) => `Echo ${n} / 3`,
    riddleBook: (title) => (title ? `${title}` : ""),
    riddleLevelWord: (n) => ["first", "second", "third"][n - 1] || `${n}th`,
    riddleLangLabel: "Language",
  },
};

function getLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ua") return saved;
  const html = document.documentElement.lang;
  return html === "en" ? "en" : "ua";
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

function t(key, ...args) {
  const lang = getLang();
  const v = UI[lang][key] ?? UI.ua[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
}

function sphereDisplayName(sphere) {
  const lang = getLang();
  return SPHERE_NAMES[lang][sphere.id] || sphere.name;
}

function formatWeekLabel(seed) {
  const w = seed % 100;
  const y = Math.floor(seed / 100);
  return t("weekLabel")(w, y);
}

// Expose a single namespace so classic scripts (realtime.js) and any future
// ES module can pull strings from the same source of truth.
if (typeof window !== "undefined") {
  window.__klifeI18n = {
    UI,
    SPHERE_NAMES,
    t,
    getLang,
    setLang,
    sphereDisplayName,
    formatWeekLabel,
  };
}
