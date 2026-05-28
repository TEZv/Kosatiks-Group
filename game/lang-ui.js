import { getLang, setLang, t, UI } from "./i18n.js";

const SELECTORS = {
  "[data-i18n]": (el, key) => {
    el.textContent = t(key);
  },
  "[data-i18n-placeholder]": (el, key) => {
    el.setAttribute("placeholder", t(key));
  },
};

export function applyUiLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = t("pageTitle");
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("metaDescription"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.id === "passport") return;
    const key = el.getAttribute("data-i18n");
    if (key && UI[lang][key] !== undefined && typeof UI[lang][key] !== "function") {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && UI[lang][key] !== undefined && typeof UI[lang][key] !== "function") {
      el.setAttribute("placeholder", t(key));
    }
  });

  const note = document.getElementById("content-lang-note");
  if (note) note.textContent = t("contentNote");

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const active = btn.getAttribute("data-lang-btn") === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

export function initLangToggle(onChange) {
  applyUiLang();
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-btn");
      if (lang !== "ua" && lang !== "en") return;
      setLang(lang);
      applyUiLang();
      if (typeof onChange === "function") onChange();
    });
  });
}
