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

  // ---- Inline i18n (self-contained: realtime.js is a non-module IIFE) ----
  // Mirrors the keys added to i18n.js so the provider toggle speaks UA/EN
  // without needing to import the module.
  const LABELS = {
    ua: {
      quick: 'Швидко',
      quickTitle: 'Швидко · безкоштовно, миттєво (Groq)',
      deep: 'Глибоко',
      deepTitle: 'Глибоко · філософська глибина (M3 · MiniMax-M3)',
      deepUnavailable: 'Глибоко недоступне — потрібен M3_API_KEY / OPENROUTER_API_KEY на сервері',
      deepBackendOpenRouter: 'Глибоко через OpenRouter (дешевше)',
      deepBackendDirect: 'Глибоко через MiniMax direct',
    },
    en: {
      quick: 'Quick',
      quickTitle: 'Quick · free, instant (Groq)',
      deep: 'Deep',
      deepTitle: 'Deep · philosophical depth (M3 · MiniMax-M3)',
      deepUnavailable: 'Deep unavailable — M3_API_KEY / OPENROUTER_API_KEY required on the server',
      deepBackendOpenRouter: 'Deep via OpenRouter (cheaper)',
      deepBackendDirect: 'Deep via MiniMax direct',
    },
  };
  function L() {
    return document.documentElement.lang === 'en' ? LABELS.en : LABELS.ua;
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
      <div class="pin-gate-card riddle-card" role="dialog" aria-labelledby="riddleTitle" aria-describedby="riddlePrompt">
        <div class="pin-gate-emoji" id="riddleEmoji">🎯</div>
        <h2 class="pin-gate-title" id="riddleTitle">Відлуння</h2>
        <p class="pin-gate-subtitle" id="riddleSubtitle">Anteros · канон</p>
        <p class="riddle-prompt" id="riddlePrompt"></p>
        <input type="text" id="riddleInput" class="pin-gate-input" placeholder="" autocomplete="off" maxlength="64" />
        <button id="riddleSubmit" class="pin-gate-submit">Відповісти</button>
        <div id="riddleFeedback" class="pin-gate-error"></div>
        <div class="pin-gate-foot" id="riddleFoot"></div>
        <button id="riddleSkip" class="riddle-skip" type="button">Пропустити · нагадати через 7 днів</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function fillRiddleLabels(overlay) {
    const lab = L();
    const title = overlay.querySelector('#riddleTitle');
    const subtitle = overlay.querySelector('#riddleSubtitle');
    const submit = overlay.querySelector('#riddleSubmit');
    const input = overlay.querySelector('#riddleInput');
    const skip = overlay.querySelector('#riddleSkip');
    if (title) title.textContent = lab.riddleTitle;
    if (subtitle) subtitle.textContent = lab.riddleSubtitle;
    if (submit) submit.textContent = lab.riddleSubmit;
    if (input) input.placeholder = lab.riddlePlaceholder;
    if (skip) skip.textContent = lab.riddleSkip;
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
    fillRiddleLabels(overlay);
    const promptEl = overlay.querySelector('#riddlePrompt');
    const footEl = overlay.querySelector('#riddleFoot');
    const submit = overlay.querySelector('#riddleSubmit');
    const input = overlay.querySelector('#riddleInput');
    const skip = overlay.querySelector('#riddleSkip');
    setRiddleFeedback('', false);
    input.value = '';
    input.disabled = false;
    submit.disabled = false;

    let attempts = 0;
    let hintShown = false;

    function close() {
      overlay.classList.add('hidden');
    }
    function dismissForDays() {
      localStorage.setItem(RIDDLE_SKIP_STORAGE, String(Date.now()));
      close();
    }

    skip.onclick = dismissForDays;

    async function loadPrompt() {
      try {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'ua';
        const res = await fetch(`${RIDDLE_ENDPOINT}?level=${level}&lang=${lang}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'unknown');
        promptEl.textContent = data.prompt;
        const lab = L();
        const meta = data.weekIndex !== undefined
          ? `${lab.riddleEchoLevel(level)} · ${data.title || ''} · ${lab.riddleWeek(data.weekIndex, data.rotationSize || 1)}`
          : `${lab.riddleEchoLevel(level)} · ${data.title || ''}`;
        footEl.textContent = meta.trim();
        input.focus();
      } catch (e) {
        promptEl.textContent = L().riddleLoadError;
        submit.disabled = true;
        input.disabled = true;
      }
    }

    async function submitAnswer() {
      const ans = input.value;
      if (!ans.trim()) {
        setRiddleFeedback(L().riddleEmpty, true);
        return;
      }
      submit.disabled = true;
      try {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'ua';
        const res = await fetch(RIDDLE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level, answer: ans, lang })
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
          setRiddleFeedback(lab.riddleSolved, false);
          submit.textContent = lab.riddleNext;
          submit.disabled = false;
          submit.onclick = () => {
            close();
            const next = firstUnsolved();
            if (next) setTimeout(() => openRiddle(next), 200);
            else showEchoBadge();
          };
        } else {
          attempts += 1;
          const lab = L();
          if (attempts >= RIDDLE_MAX_ATTEMPTS) {
            // Show hint, lock further input, change button to "close".
            setRiddleFeedback(`${lab.riddleOutOfTries} ${data.hint || ''}`.trim(), true);
            input.disabled = true;
            submit.textContent = lab.riddleClose;
            submit.onclick = close;
            hintShown = true;
          } else {
            const left = RIDDLE_MAX_ATTEMPTS - attempts;
            setRiddleFeedback(`${lab.riddleWrong} ${lab.riddleTriesLeft(left)}`, true);
            submit.disabled = false;
          }
        }
      } catch (e) {
        setRiddleFeedback(L().riddleNetworkError, true);
        submit.disabled = false;
      }
    }

    submit.onclick = submitAnswer;
    input.onkeydown = (e) => { if (e.key === 'Enter') submitAnswer(); };

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

  // ---- Inline i18n labels (extended for riddles) ----
  // Append into the same LABELS object defined above so existing L() works.
  Object.assign(LABELS.ua, {
    riddleTitle: 'Відлуння',
    riddleSubtitle: 'Anteros · канон',
    riddleSubmit: 'Відповісти',
    riddleNext: 'Далі →',
    riddleClose: 'Закрити',
    riddlePlaceholder: 'одне слово чи знак',
    riddleSkip: 'Пропустити · нагадати через 7 днів',
    riddleSolved: '✓ Почуто. Перехід далі…',
    riddleEmpty: 'Введи відповідь',
    riddleWrong: '✗ Не зовсім.',
    riddleOutOfTries: 'Спроби вичерпано. Підказка:',
    riddleTriesLeft: (n) => `Залишилось спроб: ${n}.`,
    riddleNetworkError: 'Мережева помилка — спробуй пізніше.',
    riddleLoadError: 'Не вдалося завантажити загадку.',
    riddleEchoLevel: (n) => `Відлуння ${n} / 3`,
    riddleWeek: (w, n) => `тиждень ${w + 1} · ${n} у ротації`,
  });
  Object.assign(LABELS.en, {
    riddleTitle: 'Echo',
    riddleSubtitle: 'Anteros · canon',
    riddleSubmit: 'Answer',
    riddleNext: 'Next →',
    riddleClose: 'Close',
    riddlePlaceholder: 'one word or mark',
    riddleSkip: 'Skip · remind me in 7 days',
    riddleSolved: '✓ Heard. Moving on…',
    riddleEmpty: 'Type an answer',
    riddleWrong: '✗ Not quite.',
    riddleOutOfTries: 'Out of tries. Hint:',
    riddleTriesLeft: (n) => `Tries left: ${n}.`,
    riddleNetworkError: 'Network error — try again later.',
    riddleLoadError: 'Failed to load the riddle.',
    riddleEchoLevel: (n) => `Echo ${n} / 3`,
    riddleWeek: (w, n) => `week ${w + 1} · ${n} in rotation`,
  });
})();
