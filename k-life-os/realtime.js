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
    // try M3 once to see if the server has the key
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: getPin(), sphere: 'Творчість або Самовираження', lang: 'ua', provider: 'm3' })
      });
      m3Available = res.status !== 503;
    } catch {
      m3Available = false;
    }
    const tog = document.getElementById('providerToggle');
    if (tog) {
      tog.querySelectorAll('[data-provider]').forEach(b => {
        const isM3 = b.dataset.provider === 'm3';
        if (isM3 && !m3Available) {
          b.disabled = true;
          b.title = 'M3_API_KEY не налаштовано на сервері';
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
    const tog = document.createElement('div');
    tog.id = 'providerToggle';
    tog.className = 'provider-toggle';
    tog.innerHTML = `
      <button class="provider-btn active" data-provider="groq" title="Groq (безкоштовно)">Groq</button>
      <button class="provider-btn" data-provider="m3" title="M3 (потребує M3_API_KEY)" disabled>M3</button>
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
})();
