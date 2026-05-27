/** UI + sphere labels (phase 1). Quotes/topics stay UK until vault EN build (phase 2). */

const STORAGE_KEY = "k-life-os-game-lang";

export const SPHERE_NAMES = {
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

export const UI = {
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
    passportTitle: "Системний паспорт",
    passportIdle: "🧭 [K Life OS] — натисни «Рандомайзер» або «Спін тижня»",
    spin: "Рандомайзер сфер",
    weekSpin: "Спін тижня",
    copy: "Скопіювати",
    copied: "Скопійовано ✓",
    route: "Твій маршрут",
    primary: "Primary",
    secondary: "Secondary",
    topic: "Топік",
    weekSpinTag: " • 🗓️ Спін тижня",
    mode2d: " • 2D режим (3D недоступний — рандомайзер працює)",
    kosatikTitle: "Кит-Кіт Косатик",
    kosatikDefault: "Бекстейдж-режим увімкнено.",
    contentNote:
      "Цитати й топіки зараз українською (канон Anteros). Англомовна бібліотека — у наступному оновленні.",
    weekLabel: (w, y) => `Тиждень ${w}, ${y}`,
    copyHeader: "[K Life OS] — маршрут",
    copyQuote: "Цитата",
    copyTopic: "Топік",
    errFile: "Відкрито як file:// — потрібен локальний сервер (npx serve .) або деплой на HTTPS.",
    errPako: "Не завантажився vendor/pako/pako.min.js.",
    errVault:
      "Не завантажились дані vault (vault.js). Ctrl+Shift+R; вимкни AdBlock для game.… або спробуй інкогніто.",
    errVaultBroken: "Vault пошкоджений або pako не розпаковує",
    errUnknown: "Невідома помилка старту.",
    errPrefix: "Помилка",
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
    passportTitle: "System passport",
    passportIdle: "🧭 [K Life OS] — tap Randomizer or Week spin",
    spin: "Sphere randomizer",
    weekSpin: "Week spin",
    copy: "Copy",
    copied: "Copied ✓",
    route: "Your route",
    primary: "Primary",
    secondary: "Secondary",
    topic: "Topic",
    weekSpinTag: " • 🗓️ Week spin",
    mode2d: " • 2D mode (3D unavailable — randomizer still works)",
    kosatikTitle: "Kit-Kit Kosatik",
    kosatikDefault: "Backstage mode on.",
    contentNote:
      "Quotes and topics are in Ukrainian (Anteros canon) for now. English library — next update.",
    weekLabel: (w, y) => `Week ${w}, ${y}`,
    copyHeader: "[K Life OS] — route",
    copyQuote: "Quote",
    copyTopic: "Topic",
    errFile: "Opened as file:// — use a local server (npx serve .) or HTTPS deploy.",
    errPako: "vendor/pako/pako.min.js did not load.",
    errVault:
      "Vault data did not load (vault.js). Ctrl+Shift+R; disable AdBlock for game.… or try incognito.",
    errVaultBroken: "Vault corrupt or pako failed to decompress",
    errUnknown: "Unknown startup error.",
    errPrefix: "Error",
  },
};

export function getLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ua") return saved;
  const html = document.documentElement.lang;
  return html === "en" ? "en" : "ua";
}

export function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

export function t(key) {
  const lang = getLang();
  return UI[lang][key] ?? UI.ua[key] ?? key;
}

export function sphereDisplayName(sphere) {
  const lang = getLang();
  return SPHERE_NAMES[lang][sphere.id] || sphere.name;
}

export function formatWeekLabel(seed) {
  const w = seed % 100;
  const y = Math.floor(seed / 100);
  return t("weekLabel")(w, y);
}
