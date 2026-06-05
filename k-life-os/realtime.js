// K Life OS — Real-time questions + PIN gate + provider toggle
// Requires: /api/question endpoint (Vercel Function)
//
// Behavior:
// 1. On page load: check sessionStorage for PIN. If missing → show PIN gate overlay.
// 2. PIN gate: input + submit. On 200 → save PIN, hide overlay, enable spin.
// 3. When user spins: override generateQuestions() to call /api/question first.
//    Fallback to cached questions.json if API fails (graceful degradation).
// 4. Provider toggle in modal: Groq (default) | M3 (if M3_API_KEY is set server-side).
//    Stored in localStorage. Sent to API on each request.

(function () {
  'use strict';

  const STORAGE_PIN = 'klife_pin';
  const STORAGE_PROVIDER = 'klife_provider';
  const ENDPOINT = '/api/question';
  let m3Available = false; // updated after first response

  // ---- i18n: read from window.__klifeI18n (set by i18n.js, loaded first) ----
  // i18n.js is the single source of truth for every localized string used
  // here. No more inline LABELS object. If i18n.js somehow fails to load
  // (e.g. CSP or a deploy glitch), the page will show key names instead of
  // strings — a clear signal, not a silent fallback to stale text.
  const I18N = window.__klifeI18n;
  const HAS_I18N = !!I18N;
  function lang() {
    if (HAS_I18N) return I18N.getLang();
    const html = document.documentElement.lang;
    return html === 'en' ? 'en' : 'ua';
  }
  function L() {
    if (HAS_I18N) return I18N.UI[lang()] || I18N.UI.ua || {};
    return {};
  }
  function Lfor(l) {
    if (HAS_I18N) return I18N.UI[l] || I18N.UI.ua || {};
    return {};
  }

  // ---- PIN gate ----
  function ensurePinGate() {
    let overlay = document.getElementById('pinGate');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'pinGate';
    overlay.className = 'pin-gate hidden';
    overlay.innerHTML = `
      <div class="pin-gate-card">
        <div class="pin-gate-emoji">🌀</div>
        <h2 class="pin-gate-title">Кільце Сфер</h2>
        <p class="pin-gate-subtitle">Приватний доступ · Введи PIN</p>
        <input type="password" id="pinGateInput" class="pin-gate-input" placeholder="••••" autocomplete="off" maxlength="32" />
        <button id="pinGateSubmit" class="pin-gate-submit">Увійти</button>
        <div id="pinGateError" class="pin-gate-error"></div>
        <div class="pin-gate-foot">🔒 Ліміти захищені · Запити кешуються на 1 хв</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#pinGateInput');
    const submit = overlay.querySelector('#pinGateSubmit');
    const error = overlay.querySelector('#pinGateError');

    async function trySubmit() {
      const pin = input.value.trim();
      if (!pin) {
        error.textContent = 'Введи PIN';
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Перевіряю…';
      error.textContent = '';
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin, sphere: 'Творчість або Самовираження', lang: 'ua', provider: 'groq' })
        });
        if (res.status === 401) {
          error.textContent = 'Невірний PIN';
          input.value = '';
          input.focus();
          return;
        }
        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          error.textContent = `Зачекай ${data.retryAfter || 60}с (rate limit)`;
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          error.textContent = data.message || `Помилка: HTTP ${res.status}`;
          return;
        }
        // success
        sessionStorage.setItem(STORAGE_PIN, pin);
        overlay.classList.add('hidden');
        // re-enable any pending spin
        document.querySelectorAll('button[disabled]').forEach(b => {
          if (b.id === 'spinBtn' || b.id === 'randomBtn' || b.id === 'week-spin-btn') b.disabled = false;
        });
        // also call /api/question?provider= to check if M3 is available
        probeM3Availability();
      } catch (e) {
        error.textContent = 'Мережева помилка: ' + e.message;
      } finally {
        submit.disabled = false;
        submit.textContent = 'Увійти';
      }
    }

    submit.addEventListener('click', trySubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') trySubmit();
    });

    return overlay;
  }

  function showPinGate() {
    const overlay = ensurePinGate();
    overlay.classList.remove('hidden');
    const input = overlay.querySelector('#pinGateInput');
    setTimeout(() => input.focus(), 100);
  }

  function hasPin() {
    return !!sessionStorage.getItem(STORAGE_PIN);
  }

  function getPin() {
    return sessionStorage.getItem(STORAGE_PIN) || '';
  }

  // ---- Provider toggle (in modal) ----
  function getPreferredProvider() {
    return localStorage.getItem(STORAGE_PROVIDER) || 'groq';
  }

  function setPreferredProvider(p) {
    localStorage.setItem(STORAGE_PROVIDER, p);
    // refresh the toggle UI
    const tog = document.getElementById('providerToggle');
    if (tog) tog.querySelectorAll('[data-provider]').forEach(b => {
      b.classList.toggle('active', b.dataset.provider === p);
    });
  }

  async function probeM3Availability() {
    // Server tries M3-class providers (m3 direct → openrouter). Only 200
    // counts as "available" — a stale M3_API_KEY would return 500, which
    // we must NOT interpret as "M3 works".
    let usedProvider = null;
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: getPin(), sphere: 'Творчість або Самовираження', lang: 'ua', provider: 'm3' })
      });
      m3Available = res.ok;
      if (m3Available) {
        try {
          const data = await res.json();
          usedProvider = data.provider;
        } catch {}
      }
    } catch {
      m3Available = false;
    }
    const tog = document.getElementById('providerToggle');
    if (tog) {
      const lab = L();
      tog.querySelectorAll('[data-provider]').forEach(b => {
        const isM3 = b.dataset.provider === 'm3';
        if (isM3) {
          if (!m3Available) {
            b.disabled = true;
            b.title = lab.deepUnavailable;
          } else {
            b.disabled = false;
            b.title = usedProvider === 'openrouter'
              ? lab.deepBackendOpenRouter
              : lab.deepBackendDirect;
          }
        } else {
          b.disabled = false;
        }
      });
    }
  }

  function injectProviderToggle() {
    if (document.getElementById('providerToggle')) return;
    const modalHeader = document.querySelector('.modal-header');
    if (!modalHeader) return;
    const lab = L();
    const tog = document.createElement('div');
    tog.id = 'providerToggle';
    tog.className = 'provider-toggle';
    tog.innerHTML = `
      <button class="provider-btn active" data-provider="groq" title="${lab.quickTitle}">${lab.quick}</button>
      <button class="provider-btn" data-provider="m3" title="${lab.deepTitle}" disabled>${lab.deep}</button>
    `;
    modalHeader.appendChild(tog);
    tog.querySelectorAll('[data-provider]').forEach(b => {
      b.addEventListener('click', () => {
        if (b.disabled) return;
        setPreferredProvider(b.dataset.provider);
      });
    });
    // restore from localStorage
    setPreferredProvider(getPreferredProvider());
  }

  // ---- Real-time question fetch ----
  async function fetchQuestions(sphere, lang) {
    if (!hasPin()) {
      showPinGate();
      throw new Error('pin_required');
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: getPin(),
        sphere,
        lang,
        provider: getPreferredProvider()
      })
    });
    if (res.status === 401) {
      sessionStorage.removeItem(STORAGE_PIN);
      showPinGate();
      throw new Error('invalid_pin');
    }
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(`rate_limit:${data.retryAfter || 60}`);
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'unknown');
    // if we got M3 in response, update availability
    if (data.provider === 'm3') m3Available = true;
    if (data.provider === 'groq') m3Available = false;
    return data.items;
  }

  // ---- Hint under questions ----
  function injectHint() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const card = modal.querySelector('.modal-card');
    if (!card) return;
    if (document.getElementById('modalHint')) return;
    const hint = document.createElement('div');
    hint.id = 'modalHint';
    hint.className = 'modal-hint-inline';
    hint.innerHTML = '💡 <b>Підказка:</b> Скопіюй питання для Reels, поста або сторіз. Або обери інший варіант відповіді — кожна веде до іншого сценарію.';
    card.appendChild(hint);
  }

  // ---- Init ----
  function init() {
    if (!hasPin()) {
      showPinGate();
    } else {
      probeM3Availability();
    }
    // wait for the modal to be added by app.js
    const observer = new MutationObserver(() => {
      if (document.getElementById('modal')) {
        injectProviderToggle();
        injectHint();
        injectCloseX();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function injectCloseX() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const card = modal.querySelector('.modal-card');
    if (!card || document.getElementById('modalCloseX')) return;
    const header = card.querySelector('.modal-header');
    if (!header) return;
    const closeX = document.createElement('button');
    closeX.id = 'modalCloseX';
    closeX.className = 'modal-close-x';
    closeX.innerHTML = '×';
    closeX.setAttribute('aria-label', 'Close');
    closeX.addEventListener('click', () => modal.classList.remove('active'));
    header.appendChild(closeX);
  }

  // ---- Hook into existing flow ----
  // app.js's onSpinComplete calls generateQuestions(s.short, s.name).
  // We wrap it so that real-time API is tried first.
  let originalGenerate = null;
  function hookGenerate() {
    // Wait for app.js to define generateQuestions
    const check = setInterval(() => {
      if (typeof window.generateQuestions === 'function' && window.generateQuestions !== originalGenerate) {
        clearInterval(check);
        originalGenerate = window.generateQuestions;
        window.generateQuestions = async function (sphereShort, sphereFull) {
          if (!hasPin()) {
            showPinGate();
            return [{ q: 'Введи PIN, щоб отримати питання', a: ['OK'], _idx: -1 }];
          }
          try {
            const lang = document.documentElement.lang === 'en' ? 'en' : 'ua';
            const items = await fetchQuestions(sphereFull, lang);
            return items.map((it, idx) => ({ ...it, _idx: idx }));
          } catch (e) {
            console.warn('[realtime] API failed, falling back to cache:', e.message);
            return await originalGenerate(sphereShort, sphereFull);
          }
        };
      }
    }, 50);
    setTimeout(() => clearInterval(check), 5000);
  }

  // Expose for app.js / debugging
  window.KLifeRealtime = {
    fetchQuestions,
    hasPin,
    getPin,
    showPinGate,
    getPreferredProvider,
    setPreferredProvider
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); hookGenerate(); });
  } else {
    init();
    hookGenerate();
  }

  // ---- Riddle / "Echoes" gate (Anteros canon) ----
  // Three riddles sourced from data/riddles.json (validated server-side).
  // First unsolved level is offered in a modal. Users can skip — gate
  // reappears in 7 days. ?noriddle=1 disables the gate entirely.
  const RIDDLE_STORAGE = 'klife_riddles';
  const RIDDLE_SKIP_STORAGE = 'klife_riddles_skipped_at';
  const RIDDLE_SKIP_DAYS = 7;
  const RIDDLE_MAX_ATTEMPTS = 3;
  const RIDDLE_ENDPOINT = '/api/riddle';

  function riddleRead() {
    try {
      const raw = localStorage.getItem(RIDDLE_STORAGE);
      if (!raw) return { solved: [false, false, false], solvedRiddles: [] };
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.solved) || parsed.solved.length !== 3) {
        return { solved: [false, false, false], solvedRiddles: [] };
      }
      if (!Array.isArray(parsed.solvedRiddles)) parsed.solvedRiddles = [];
      return parsed;
    } catch {
      return { solved: [false, false, false], solvedRiddles: [] };
    }
  }

  function riddleWrite(state) {
    localStorage.setItem(RIDDLE_STORAGE, JSON.stringify(state));
  }

  function riddleShouldShow() {
    if (new URLSearchParams(location.search).get('noriddle') === '1') return false;
    const state = riddleRead();
    if (state.solved.every(Boolean)) return false;
    const skipRaw = localStorage.getItem(RIDDLE_SKIP_STORAGE);
    if (!skipRaw) return true;
    const skippedAt = Number(skipRaw);
    if (!Number.isFinite(skippedAt)) return true;
    const days = (Date.now() - skippedAt) / (1000 * 60 * 60 * 24);
    return days >= RIDDLE_SKIP_DAYS;
  }

  function firstUnsolved() {
    const state = riddleRead();
    for (let i = 0; i < state.solved.length; i++) {
      if (!state.solved[i]) return i + 1;
    }
    return null;
  }

  function ensureRiddleOverlay() {
    let overlay = document.getElementById('riddleGate');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'riddleGate';
    overlay.className = 'pin-gate hidden';
    overlay.innerHTML = `
      <div class="pin-gate-card riddle-card" role="dialog" aria-labelledby="riddleTitle" aria-describedby="riddlePrompt"
           style="max-width:520px;width:calc(100vw - 32px);text-align:left;background:linear-gradient(180deg, rgba(26,14,56,0.97) 0%, rgba(12,6,32,0.99) 100%);border:2px solid transparent;border-radius:18px;padding:0;box-shadow:0 24px 60px rgba(8,4,24,0.7),0 0 48px rgba(255,45,146,0.12);overflow:visible;color:#ffffff;">
        <div class="riddle-header"
             style="display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.9rem;margin:0;padding:1.4rem 1.4rem 1.2rem 1.4rem;background:linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(255,45,146,0.08) 100%);border-bottom:1px solid rgba(0,229,255,0.18);border-radius:18px 18px 0 0;">
          <div class="riddle-level-badge" id="riddleLevelBadge" data-level="1" aria-hidden="true"
               style="width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:1.7rem;font-weight:700;color:#0a0014;background:linear-gradient(135deg,#00e5ff 0%,#7e74ff 100%);box-shadow:0 0 0 1px rgba(255,255,255,0.45),0 0 24px rgba(0,229,255,0.55);flex-shrink:0;">1</div>
          <div class="riddle-header-text" style="min-width:0;">
            <h2 class="riddle-title" id="riddleTitle"
                style="margin:0;font-size:1.5rem;font-weight:800;color:#ffffff;letter-spacing:0.01em;line-height:1.1;text-shadow:0 2px 8px rgba(0,229,255,0.4);">·</h2>
            <p class="riddle-subtitle" id="riddleSubtitle"
               style="margin:0.25rem 0 0 0;font-size:0.68rem;color:#00e5ff;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;text-shadow:0 0 8px rgba(0,229,255,0.5);">·</p>
          </div>
          <div class="riddle-lang-switch" id="riddleLangSwitch" role="group" aria-label="Мова"
               style="display:inline-flex;gap:2px;padding:3px;background:rgba(0,0,0,0.35);border:1px solid rgba(0,229,255,0.3);border-radius:999px;flex-shrink:0;">
            <button class="riddle-lang-btn" data-lang="ua" type="button" aria-pressed="true"
                    style="font:700 0.7rem/1 Inter,sans-serif;letter-spacing:0.08em;padding:0.4rem 0.75rem;background:transparent;color:#a3b1d6;border:none;border-radius:999px;cursor:pointer;">UA</button>
            <button class="riddle-lang-btn" data-lang="en" type="button" aria-pressed="false"
                    style="font:700 0.7rem/1 Inter,sans-serif;letter-spacing:0.08em;padding:0.4rem 0.75rem;background:transparent;color:#a3b1d6;border:none;border-radius:999px;cursor:pointer;">EN</button>
          </div>
        </div>
        <div class="riddle-prompt-block"
             style="position:relative;margin:0;padding:1.5rem 1.4rem 1.0rem 1.4rem;background:linear-gradient(180deg,#fff5dc 0%,#ffeec7 100%);border-radius:0;border-bottom:1px solid rgba(255,213,106,0.5);box-shadow:inset 0 0 0 1px rgba(0,0,0,0.04);">
          <p class="riddle-prompt" id="riddlePrompt"
             style="font-family:Georgia,serif;font-size:1.15rem;line-height:1.6;color:#1a0a3a;margin:0 0 0.7rem 0;font-style:italic;white-space:pre-wrap;letter-spacing:0.005em;font-weight:500;"></p>
          <div class="riddle-book-line" id="riddleBookLine"
               style="display:flex;align-items:center;gap:0.4rem;font:500 0.72rem/1.2 Inter,sans-serif;color:rgba(26,10,58,0.55);letter-spacing:0.04em;padding-top:0.5rem;border-top:1px dashed rgba(141,124,255,0.25);cursor:pointer;transition:color 0.2s;"
               onmouseover="this.style.color='rgba(255,45,146,0.85)'"
               onmouseout="this.style.color='rgba(26,10,58,0.55)'"
               title="Click to reveal hint">
            <span aria-hidden="true" style="font-size:0.85rem;">📖</span>
            <span id="riddleBookRef"></span>
            <span style="margin-left:auto;opacity:0.6;font-size:0.7rem;">· <span id="riddleBookHintLabel">підказка</span></span>
          </div>
        </div>
        <div class="riddle-input-row"
             style="display:flex;gap:0.5rem;align-items:stretch;margin:0;padding:1.2rem 1.4rem 0.8rem 1.4rem;">
          <input type="text" id="riddleInput" class="riddle-input" placeholder="" autocomplete="off" maxlength="64"
                 style="flex:1;padding:0.95rem 1.1rem;font-size:0.98rem;background:rgba(0,0,0,0.45);border:1.5px solid rgba(0,229,255,0.35);border-radius:12px;color:#ffffff;font-family:inherit;outline:none;" />
          <button id="riddleHintBtn" class="riddle-hint-btn" type="button" aria-label="Підказка"
                  style="flex-shrink:0;width:44px;height:44px;align-self:center;border-radius:50%;background:rgba(0,0,0,0.45);color:#00e5ff;border:1.5px solid rgba(0,229,255,0.45);cursor:pointer;font:700 1.1rem/1 Georgia,serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(0,229,255,0.15);transition:all 0.2s;margin-right:0.3rem;"
                  onmouseover="this.style.background='rgba(0,229,255,0.18)';this.style.boxShadow='0 0 18px rgba(0,229,255,0.45)';"
                  onmouseout="this.style.background='rgba(0,0,0,0.45)';this.style.boxShadow='0 0 12px rgba(0,229,255,0.15)';">?</button>
          <button id="riddleSubmit" class="riddle-submit" type="button" aria-label="Відповісти"
                  style="flex-shrink:0;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#00e5ff 0%,#ff2d92 50%,#ffd56a 100%);background-size:200% 200%;color:#ffffff;border:none;cursor:pointer;font:700 1.6rem/1 Inter,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(255,255,255,0.15),0 6px 20px rgba(0,229,255,0.4),0 0 30px rgba(255,45,146,0.3);text-shadow:0 1px 2px rgba(0,0,0,0.5);">→</button>
        </div>
        <div id="riddleFeedback" class="riddle-feedback"
             style="min-height:1.4rem;text-align:center;font-size:0.88rem;margin:0;padding:0 1.4rem;color:rgba(255,255,255,0.75);font-weight:600;"></div>
        <div class="riddle-foot" id="riddleFoot" aria-live="polite"
             style="display:flex;align-items:center;justify-content:center;gap:0.5rem;font-size:0.82rem;margin:0.4rem 0 0 0;padding:0.9rem 1.4rem 1.3rem 1.4rem;border-top:1px dashed rgba(255,45,146,0.35);color:rgba(255,255,255,0.7);font-style:italic;background:linear-gradient(180deg, rgba(255,45,146,0.06) 0%, transparent 100%);border-radius:0 0 18px 18px;">
          <span class="riddle-foot-icon" aria-hidden="true"
                style="font-style:normal;color:#ff2d92;font-size:1rem;text-shadow:0 0 8px rgba(255,45,146,0.6);">📖</span>
          <span class="riddle-foot-book" id="riddleFootBook"
                style="color:rgba(255,255,255,0.9);letter-spacing:0.02em;font-weight:500;"></span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function fillRiddleLabels(overlay, langCode) {
    const lab = langCode ? Lfor(langCode) : L();
    // Title and subtitle are data-driven (book name + series) and are set
    // exclusively by loadPrompt() from the server response. We deliberately
    // do NOT set i18n defaults here — doing so caused a brief flicker of
    // "Відлуння"/"Echo" through the modal on every language switch, before
    // the async fetch resolved and replaced the values with data.title
    // (which is identical in both languages for authorial book names:
    // Vėlė, Anteros, Šviesa · Dausos — all kept verbatim so readers can
    // Google what they mean). The modal HTML hardcodes a "·" placeholder,
    // so on initial open the user sees "·" → book name; on lang switch
    // they see previous data → new data, with no default flicker.
    const setAttr = (sel, attr, key) => {
      const el = overlay.querySelector(sel);
      if (el && lab[key]) el.setAttribute(attr, lab[key]);
    };
    // Language-specific UI: placeholder, aria-labels, and the small "підказка"
    // / "Hint" label next to the book-ref line.
    const input = overlay.querySelector('#riddleInput');
    if (input && lab.riddlePlaceholder) input.placeholder = lab.riddlePlaceholder;
    setAttr('#riddleSubmit', 'aria-label', 'riddleSubmit');
    setAttr('#riddleLangSwitch', 'aria-label', 'riddleLangLabel');
    setAttr('#riddleHintBtn', 'aria-label', 'riddleHint');
    const bookHintLabel = overlay.querySelector('#riddleBookHintLabel');
    if (bookHintLabel && lab.riddleHint) bookHintLabel.textContent = lab.riddleHint;
  }

  // Sync the level badge to the current level.
  function renderRiddleLevel(overlay, level) {
    const badge = overlay.querySelector('#riddleLevelBadge');
    if (badge) {
      badge.dataset.level = String(level);
      badge.textContent = String(level);
    }
  }

  // Sync the UA/EN switcher to the current riddle language.
  function renderRiddleLangSwitch(overlay, currentLang) {
    const switchEl = overlay.querySelector('#riddleLangSwitch');
    if (!switchEl) return;
    switchEl.querySelectorAll('.riddle-lang-btn').forEach((b) => {
      const active = b.dataset.lang === currentLang;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
  }

  function setRiddleFeedback(text, isError) {
    const fb = document.getElementById('riddleFeedback');
    if (!fb) return;
    fb.textContent = text || '';
    fb.classList.toggle('riddle-feedback-error', !!isError);
    fb.classList.toggle('riddle-feedback-ok', !isError && !!text);
  }

  function showEchoBadge() {
    const state = riddleRead();
    if (state.solved.every(Boolean)) {
      // No-op for now — visual badge would be a future enhancement.
      window.dispatchEvent(new CustomEvent('klife:riddles-complete', { detail: state }));
    }
  }

  async function openRiddle(level) {
    const overlay = ensureRiddleOverlay();
    const promptEl = overlay.querySelector('#riddlePrompt');
    const footBook = overlay.querySelector('#riddleFootBook');
    const submit = overlay.querySelector('#riddleSubmit');
    const input = overlay.querySelector('#riddleInput');
    const langSwitch = overlay.querySelector('#riddleLangSwitch');
    const hintBtn = overlay.querySelector('#riddleHintBtn');
    const bookLine = overlay.querySelector('#riddleBookLine');
    const bookRef = overlay.querySelector('#riddleBookRef');
    const bookHintLabel = overlay.querySelector('#riddleBookHintLabel');
    setRiddleFeedback('', false);
    input.value = '';
    input.disabled = false;
    submit.disabled = false;
    submit.textContent = '→';
    submit.classList.remove('is-next');

    // Per-riddle language state. Defaults to the page language, but the
    // user can flip UA/EN inside the modal without changing the rest of
    // the page. Persists within the session, resets on reload.
    let currentLang = lang() === 'en' ? 'en' : 'ua';
    fillRiddleLabels(overlay, currentLang);
    renderRiddleLevel(overlay, level);
    renderRiddleLangSwitch(overlay, currentLang);

    // Hint state (per modal open — resets when the next riddle is opened).
    let hintRevealed = false;
    let currentHintText = '';
    function revealHint() {
      if (hintRevealed) return;
      hintRevealed = true;
      const lab = Lfor(currentLang);
      const header = lab.riddleHintRevealed || '✓ Hint revealed';
      setRiddleFeedback(`${header} · ${currentHintText}`, false);
      if (hintBtn) {
        hintBtn.disabled = true;
        hintBtn.style.opacity = '0.35';
        hintBtn.style.cursor = 'default';
        hintBtn.textContent = '✓';
      }
      if (bookLine) bookLine.style.color = 'rgba(107,255,140,0.8)';
    }
    if (hintBtn) {
      hintBtn.disabled = false;
      hintBtn.style.opacity = '1';
      hintBtn.style.cursor = 'pointer';
      hintBtn.textContent = '?';
      hintBtn.onclick = revealHint;
    }
    if (bookLine) {
      bookLine.onclick = revealHint;
      bookLine.style.color = 'rgba(26,10,58,0.55)';
    }

    let attempts = 0;

    function close() {
      overlay.classList.add('hidden');
    }

    function resetSubmit() {
      submit.textContent = '→';
      submit.classList.remove('is-next');
      submit.onclick = submitAnswer;
      submit.disabled = false;
    }

    async function loadPrompt() {
      try {
        const res = await fetch(`${RIDDLE_ENDPOINT}?level=${level}&lang=${currentLang}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'unknown');
        promptEl.textContent = data.prompt;
        const lab = Lfor(currentLang);
        // Modal title = book name (Vėlė, Anteros, Šviesa · Dausos).
        // Modal subtitle = riddle series label + canon marker.
        const titleEl = overlay.querySelector('#riddleTitle');
        const subtitleEl = overlay.querySelector('#riddleSubtitle');
        if (titleEl) titleEl.textContent = data.title || '·';
        if (subtitleEl) {
          const canon = currentLang === 'en' ? 'Anteros · canon' : 'Anteros · канон';
          subtitleEl.textContent = (data.series || '') + ' · ' + canon;
        }
        // Footer: poetic intro for this level (e.g. "What arrives before
        // the one who carries it.") — gives the riddle its flavor.
        footBook.textContent = data.intro || '';
        // Book reference line = the always-visible book + chapter reference.
        // Lithuanian/authorial names stay verbatim; rest follows prompt lang.
        if (bookRef) {
          bookRef.textContent = data.chapter || '';
        }
        // The full hint (composed when revealed) = chapter + ' · ' + hint.
        currentHintText = (data.chapter || '') + (data.hint ? ' · ' + data.hint : '');
        if (bookHintLabel) {
          bookHintLabel.textContent = lab.riddleHint || 'підказка';
        }
        // Reset hint state on (re)load
        hintRevealed = false;
        if (hintBtn) {
          hintBtn.disabled = false;
          hintBtn.style.opacity = '1';
          hintBtn.style.cursor = 'pointer';
          hintBtn.textContent = '?';
        }
        if (bookLine) bookLine.style.color = 'rgba(26,10,58,0.55)';
        input.focus();
      } catch (e) {
        promptEl.textContent = (Lfor(currentLang).riddleLoadError || 'Failed to load the riddle.');
        submit.disabled = true;
        input.disabled = true;
      }
    }

    async function submitAnswer() {
      const ans = input.value;
      if (!ans.trim()) {
        setRiddleFeedback((L().riddleEmpty || 'Type an answer'), true);
        return;
      }
      submit.disabled = true;
      try {
        const res = await fetch(RIDDLE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level, answer: ans, lang: currentLang })
        });
        const data = await res.json();
        if (data.ok) {
          const state = riddleRead();
          state.solved[level - 1] = true;
          if (data.riddleId && !state.solvedRiddles.includes(data.riddleId)) {
            state.solvedRiddles.push(data.riddleId);
          }
          riddleWrite(state);
          const lab = L();
          setRiddleFeedback((lab.riddleSolved || '✓ Solved.'), false);
          // Submit becomes a green "next" arrow, click moves on
          submit.textContent = '→';
          submit.classList.add('is-next');
          submit.disabled = false;
          submit.onclick = () => {
            close();
            const next = firstUnsolved();
            if (next) setTimeout(() => openRiddle(next), 200);
            else showEchoBadge();
          };
        } else {
          attempts += 1;
          const lab = Lfor(currentLang);
          // After 1 wrong try: auto-reveal the hint (free, once per riddle).
          // The user can still keep guessing up to RIDDLE_MAX_ATTEMPTS.
          if (attempts === 1 && data.hint && !hintRevealed) {
            revealHint();
          }
          if (attempts >= RIDDLE_MAX_ATTEMPTS) {
            // Show final out-of-tries state, lock further input, button → "close".
            const hint = (lab.riddleOutOfTries || 'Out of tries.') + (data.hint ? ' ' + data.hint : '');
            setRiddleFeedback(hint, true);
            input.disabled = true;
            submit.textContent = '×';
            submit.onclick = close;
          } else {
            const left = RIDDLE_MAX_ATTEMPTS - attempts;
            const triesLeft = lab.riddleTriesLeft ? lab.riddleTriesLeft(left) : `Tries left: ${left}.`;
            setRiddleFeedback(`${lab.riddleWrong || '✗ Not quite.'} ${triesLeft}`, true);
            submit.disabled = false;
          }
        }
      } catch (e) {
        setRiddleFeedback((L().riddleNetworkError || 'Network error.'), true);
        submit.disabled = false;
      }
    }

    submit.onclick = submitAnswer;
    input.onkeydown = (e) => { if (e.key === 'Enter') submitAnswer(); };

    // Language switcher: flip currentLang, update button states, refetch
    // the prompt in the new language. Solving state (localStorage) is
    // language-agnostic, so toggling doesn't lose progress.
    if (langSwitch) {
      langSwitch.querySelectorAll('.riddle-lang-btn').forEach((btn) => {
        btn.onclick = () => {
          const target = btn.dataset.lang;
          if (target === currentLang) return;
          currentLang = target;
          renderRiddleLangSwitch(overlay, currentLang);
          fillRiddleLabels(overlay, currentLang);
          setRiddleFeedback('', false);
          input.value = '';
          input.disabled = false;
          resetSubmit();
          loadPrompt();
        };
      });
    }

    overlay.classList.remove('hidden');
    setTimeout(() => input.focus(), 100);
    await loadPrompt();
  }

  function initRiddles() {
    if (!riddleShouldShow()) {
      if (riddleRead().solved.every(Boolean)) showEchoBadge();
      return;
    }
    const next = firstUnsolved();
    if (next) {
      // Small delay so the page finishes booting first.
      setTimeout(() => openRiddle(next), 600);
    }
  }

  // ---- Init: also kick off the riddle gate (no conflict with PIN) ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiddles);
  } else {
    setTimeout(initRiddles, 0);
  }
})();
