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
  const STORAGE_AUTHOR_KEY = 'klife_author_key';
  const ENDPOINT = '/api/question';
  let m3Available = false; // updated after first response

  // ---- Author/creator key (v10.1) ----
  // Oksana's author key separates her solves from public counter.
  // Activated via ?author=KEY in the URL (stored in localStorage).
  // Stored locally only; sent as X-Author-Key header to /api/* endpoints.
  function getAuthorKey() {
    return localStorage.getItem(STORAGE_AUTHOR_KEY) || '';
  }
  function setAuthorKey(key) {
    if (key) localStorage.setItem(STORAGE_AUTHOR_KEY, key);
    else localStorage.removeItem(STORAGE_AUTHOR_KEY);
  }
  // Activate from ?author=KEY on page load (only sets if not already set)
  (function maybeActivateAuthorFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      const k = params.get('author');
      if (k) setAuthorKey(k);
    } catch {}
  })();
  function authorHeaders() {
    const k = getAuthorKey();
    return k ? { 'X-Author-Key': k } : {};
  }

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

  /** Keep page i18n, author bar and riddle modal on the same language. */
  function syncGlobalLang(next) {
    if (next !== 'ua' && next !== 'en') return;
    if (HAS_I18N && typeof I18N.setLang === 'function') {
      if (I18N.getLang() !== next) I18N.setLang(next);
      return;
    }
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent('klife:langchange', { detail: { lang: next } }));
  }

  // ---- PIN gate ----
  function fillPinLabels(overlay) {
    const lab = L();
    const title = overlay.querySelector('.pin-gate-title');
    if (title && lab.pinTitle) title.textContent = lab.pinTitle;
    const subtitle = overlay.querySelector('.pin-gate-subtitle');
    if (subtitle && lab.pinSubtitle) subtitle.textContent = lab.pinSubtitle;
    const submit = overlay.querySelector('#pinGateSubmit');
    if (submit && lab.pinSubmit) submit.textContent = lab.pinSubmit;
    const foot = overlay.querySelector('.pin-gate-foot');
    if (foot && lab.pinFoot) foot.textContent = lab.pinFoot;
    const input = overlay.querySelector('#pinGateInput');
    if (input && lab.riddlePlaceholder) input.placeholder = lab.riddlePlaceholder;
  }

  function ensurePinGate() {
    let overlay = document.getElementById('pinGate');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'pinGate';
    overlay.className = 'pin-gate hidden';
    overlay.innerHTML = `
      <div class="pin-gate-card">
        <div class="pin-gate-emoji">🌀</div>
        <h2 class="pin-gate-title"></h2>
        <p class="pin-gate-subtitle"></p>
        <input type="password" id="pinGateInput" class="pin-gate-input" placeholder="••••" autocomplete="off" maxlength="32" />
        <button id="pinGateSubmit" class="pin-gate-submit"></button>
        <div id="pinGateError" class="pin-gate-error"></div>
        <div class="pin-gate-foot"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    fillPinLabels(overlay);

    const input = overlay.querySelector('#pinGateInput');
    const submit = overlay.querySelector('#pinGateSubmit');
    const error = overlay.querySelector('#pinGateError');

    async function trySubmit() {
      const lab = L();
      const pin = input.value.trim();
      if (!pin) {
        error.textContent = lab.pinErrorEmpty || 'Enter PIN';
        return;
      }
      submit.disabled = true;
      submit.textContent = lab.authorSigningIn || lab.pinSubmit || '…';
      error.textContent = '';
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin, sphere: 'Творчість або Самовираження', lang: 'ua', provider: 'groq' })
        });
        if (res.status === 401) {
          error.textContent = lab.pinErrorWrong || 'Wrong PIN';
          input.value = '';
          input.focus();
          return;
        }
        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          const n = data.retryAfter || 60;
          error.textContent = (lab.pinErrorRateLimit || 'Wait {n}s (rate limit)').replace('{n}', n);
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          error.textContent = data.message || (lab.pinErrorGeneric || 'Error: HTTP {status}').replace('{status}', res.status);
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
        error.textContent = (lab.riddleNetworkError || 'Network error') + ': ' + e.message;
      } finally {
        submit.disabled = false;
        submit.textContent = lab.pinSubmit || 'OK';
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
    fillPinLabels(overlay);
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

  // ---- Author Google session (wheel only) ----
  let authorSessionActive = false;
  let googleClientId = null;
  let googleScriptLoading = null;

  function hasWheelAccess() {
    return authorSessionActive || hasPin();
  }

  function showAuthorReject(message) {
    const lab = L();
    let overlay = document.getElementById('authorReject');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'authorReject';
      overlay.className = 'author-reject-overlay hidden';
      overlay.innerHTML = `
        <div class="author-reject-card">
          <div id="authorRejectText"></div>
          <button type="button" id="authorRejectClose">OK</button>
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('#authorRejectClose').onclick = () => overlay.classList.add('hidden');
    }
    overlay.querySelector('#authorRejectText').textContent =
      message || lab.authorNotAuthor || 'Not the author';
    overlay.classList.remove('hidden');
  }

  function showAuthorNeed() {
    const lab = L();
    showAuthorReject(lab.authorNeedSignIn || 'Author sign-in required for the wheel.');
    const bar = document.getElementById('authorBar');
    if (bar) bar.classList.add('author-bar-pulse');
    setTimeout(() => bar && bar.classList.remove('author-bar-pulse'), 2000);
  }

  function ensureAuthorBar() {
    let bar = document.getElementById('authorBar');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = 'authorBar';
    bar.className = 'author-bar';
    bar.innerHTML = `
      <span id="authorBarText" class="author-bar-label"></span>
      <div id="authorBarGuest" class="author-bar-guest">
        <button type="button" id="authorSignInLink" class="author-signin-link"></button>
      </div>
      <div id="authorBarAuthed" class="author-bar-authed" hidden>
        <button type="button" id="authorLogoutBtn" class="author-bar-logout"></button>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelector('#authorSignInLink').addEventListener('click', (e) => {
      e.preventDefault();
      showGoogleSignInPopup();
    });
    bar.querySelector('#authorLogoutBtn').addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
      authorSessionActive = false;
      sessionStorage.removeItem(STORAGE_PIN);
      updateAuthorBarUI();
      initRiddles();
    });
    return bar;
  }

  /** Text-only updates — no innerHTML rebuild, bar height stays fixed. */
  function updateAuthorBarUI() {
    const bar = ensureAuthorBar();
    const lab = L();
    const text = bar.querySelector('#authorBarText');
    const guest = bar.querySelector('#authorBarGuest');
    const authed = bar.querySelector('#authorBarAuthed');
    const signIn = bar.querySelector('#authorSignInLink');
    const logout = bar.querySelector('#authorLogoutBtn');
    if (authorSessionActive) {
      text.className = 'author-bar-ok';
      text.textContent = lab.authorOk || '✓ Author';
      guest.hidden = true;
      authed.hidden = false;
      logout.textContent = lab.authorLogout || 'Sign out';
    } else {
      text.className = 'author-bar-label';
      text.textContent = lab.authorLabel || 'Author?';
      guest.hidden = false;
      authed.hidden = true;
      signIn.textContent = lab.authorSignIn || 'Google sign-in';
    }
  }

  function renderAuthorBar() {
    updateAuthorBarUI();
  }

  async function showGoogleSignInPopup() {
    if (!googleClientId) return;
    let overlay = document.getElementById('authorGooglePopup');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'authorGooglePopup';
      overlay.className = 'author-reject-overlay hidden';
      overlay.innerHTML = `
        <div class="author-google-card">
          <p id="authorGooglePopupTitle" class="author-google-title"></p>
          <div id="googleSignInBtn" class="author-google-btn-slot"></div>
          <button type="button" id="authorGooglePopupClose" class="author-google-close"></button>
        </div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.add('hidden');
      });
      overlay.querySelector('#authorGooglePopupClose').onclick = () => overlay.classList.add('hidden');
    }
    const lab = L();
    overlay.querySelector('#authorGooglePopupTitle').textContent =
      lab.authorSignIn || 'Sign in with Google';
    overlay.querySelector('#authorGooglePopupClose').textContent = 'OK';
    overlay.classList.remove('hidden');
    await bootGoogleButton();
  }

  function loadGoogleScript() {
    if (window.google && window.google.accounts) return Promise.resolve();
    if (googleScriptLoading) return googleScriptLoading;
    googleScriptLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('gsi_load_failed'));
      document.head.appendChild(s);
    });
    return googleScriptLoading;
  }

  async function bootGoogleButton() {
    const host = document.getElementById('googleSignInBtn');
    if (!host || !googleClientId) return;
    const locale = lang() === 'en' ? 'en' : 'uk';
    try {
      await loadGoogleScript();
      if (window.google?.accounts?.id?.cancel) {
        try { window.google.accounts.id.cancel(); } catch {}
      }
      host.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: onGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        locale
      });
      window.google.accounts.id.renderButton(host, {
        theme: 'outline',
        size: 'medium',
        text: 'signin_with',
        shape: 'pill',
        locale
      });
    } catch (e) {
      console.warn('[author] Google button failed:', e);
      host.textContent = L().authorSignIn || 'Google sign-in';
    }
  }

  async function onGoogleCredential(response) {
    const cred = response && response.credential;
    if (!cred) return;
    const lab = L();
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: cred, lang: lang() })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        authorSessionActive = true;
        sessionStorage.removeItem(STORAGE_PIN);
        const pinOverlay = document.getElementById('pinGate');
        if (pinOverlay) pinOverlay.classList.add('hidden');
        const riddleOverlay = document.getElementById('riddleGate');
        if (riddleOverlay) riddleOverlay.classList.add('hidden');
        const completionOverlay = document.getElementById('completionGate');
        if (completionOverlay) completionOverlay.classList.add('hidden');
        const popup = document.getElementById('authorGooglePopup');
        if (popup) popup.classList.add('hidden');
        updateAuthorBarUI();
        probeM3Availability();
        return;
      }
      showAuthorReject(data.message || lab.authorNotAuthor);
    } catch (e) {
      showAuthorReject(lab.riddleNetworkError || 'Network error');
    }
  }

  async function checkAuthorSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) return false;
      const data = await res.json();
      authorSessionActive = !!(data.ok && data.author);
      return authorSessionActive;
    } catch {
      return false;
    }
  }

  async function loadPublicConfig() {
    try {
      const res = await fetch('/api/config');
      if (!res.ok) return;
      const data = await res.json();
      googleClientId = data.googleClientId || null;
    } catch {}
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
    if (!hasWheelAccess()) {
      showAuthorNeed();
      throw new Error('author_required');
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'include',
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
      authorSessionActive = false;
      showAuthorNeed();
      throw new Error('unauthorized');
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
  async function init() {
    await loadPublicConfig();
    await checkAuthorSession();
    renderAuthorBar();
    if (hasWheelAccess()) probeM3Availability();
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
          if (!hasWheelAccess()) {
            showAuthorNeed();
            return [{ q: (L().authorNeedSignIn || 'Author sign-in required.'), a: ['OK'], _idx: -1 }];
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
    hasWheelAccess,
    getPin,
    showPinGate,
    showAuthorNeed,
    checkAuthorSession,
    getPreferredProvider,
    setPreferredProvider,
    renderAuthorBar,
    updateAuthorBarUI,
    syncGlobalLang
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
  const STORAGE_RIDDLE_TOKEN = 'klife_riddle_token';

  function getRiddleToken() {
    try {
      let t = localStorage.getItem(STORAGE_RIDDLE_TOKEN);
      if (!t) {
        t = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : ('klife-' + Math.random().toString(36).slice(2) + Date.now().toString(36));
        localStorage.setItem(STORAGE_RIDDLE_TOKEN, t);
      }
      return t;
    } catch {
      return '';
    }
  }

  function riddleHeaders() {
    const h = { ...authorHeaders() };
    const t = getRiddleToken();
    if (t) h['X-Riddle-Token'] = t;
    return h;
  }

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
    // Re-engagement: even if all riddles are solved, the modal still appears
    // on every page load (cycles weekly) so users can re-read and re-engage.
    // The skip-storage gate (7 days) only applies if the user explicitly
    // hit "skip" before — solving a riddle never locks the gate.
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

  // Weekly-rotating level (1, 2, 3, 1, 2, 3, ...). Used as fallback
  // when all riddles are solved — gives re-engagement with the
  // canon's weekly "echo" cycle.
  function weeklyActiveLevel() {
    const weekIdx = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return (weekIdx % 3) + 1;
  }

  // Pick the level to show in the modal:
  //   - If any level is unsolved, show the first unsolved (encourages completion)
  //   - If all are solved, show the current weekly level (re-engagement)
  function pickActiveLevel() {
    const u = firstUnsolved();
    if (u) return u;
    return weeklyActiveLevel();
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
                    style="font:700 0.78rem/1 Inter,sans-serif;letter-spacing:0.06em;padding:0.42rem 0.85rem;background:transparent;color:#a3b1d6;border:none;border-radius:999px;cursor:pointer;">UA</button>
            <button class="riddle-lang-btn" data-lang="en" type="button" aria-pressed="false"
                    style="font:700 0.78rem/1 Inter,sans-serif;letter-spacing:0.06em;padding:0.42rem 0.85rem;background:transparent;color:#a3b1d6;border:none;border-radius:999px;cursor:pointer;">EN</button>
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
            <span style="margin-left:auto;opacity:0.6;font-size:0.7rem;">· <span id="riddleBookHintLabel"></span></span>
          </div>
        </div>
        <div class="riddle-input-row"
             style="display:flex;gap:0.5rem;align-items:stretch;margin:0;padding:1.2rem 1.4rem 0.8rem 1.4rem;">
          <input type="text" id="riddleInput" class="riddle-input" placeholder="" autocomplete="off" maxlength="64"
                 style="flex:1;padding:0.95rem 1.1rem;font-size:0.98rem;background:rgba(0,0,0,0.45);border:1.5px solid rgba(0,229,255,0.35);border-radius:12px;color:#ffffff;font-family:inherit;outline:none;" />
          <button id="riddleHintBtn" class="riddle-hint-btn" type="button" aria-label=""
                  style="flex-shrink:0;width:44px;height:44px;align-self:center;border-radius:50%;background:rgba(0,0,0,0.45);color:#00e5ff;border:1.5px solid rgba(0,229,255,0.45);cursor:pointer;font:700 1.1rem/1 Georgia,serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(0,229,255,0.15);transition:all 0.2s;margin-right:0.3rem;"
                  onmouseover="this.style.background='rgba(0,229,255,0.18)';this.style.boxShadow='0 0 18px rgba(0,229,255,0.45)';"
                  onmouseout="this.style.background='rgba(0,0,0,0.45)';this.style.boxShadow='0 0 12px rgba(0,229,255,0.15)';">?</button>
          <button id="riddleSubmit" class="riddle-submit" type="button" aria-label=""
                  style="flex-shrink:0;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#00e5ff 0%,#ff2d92 50%,#ffd56a 100%);background-size:200% 200%;color:#ffffff;border:none;cursor:pointer;font:700 1.6rem/1 Inter,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(255,255,255,0.15),0 6px 20px rgba(0,229,255,0.4),0 0 30px rgba(255,45,146,0.3);text-shadow:0 1px 2px rgba(0,0,0,0.5);">→</button>
        </div>
        <div id="riddleFeedback" class="riddle-feedback"
             style="min-height:1.4rem;text-align:center;font-size:0.88rem;margin:0;padding:0 1.4rem;color:rgba(255,255,255,0.75);font-weight:600;"></div>
        <div id="riddleSolveCount" class="riddle-solve-count" aria-live="polite"></div>
        <div id="riddleSkipHint" class="riddle-skip-hint" aria-live="polite"
             style="text-align:center;font-size:0.68rem;color:rgba(255,213,106,0.5);margin:0.1rem 0 0.3rem 0;padding:0 1.4rem;letter-spacing:0.04em;font-style:italic;display:none;"></div>
        <div class="riddle-foot" id="riddleFoot" aria-live="polite"
             style="display:flex;align-items:center;justify-content:center;gap:0.5rem;font-size:0.82rem;margin:0.4rem 0 0 0;padding:0.9rem 1.4rem 1.3rem 1.4rem;border-top:1px dashed rgba(255,45,146,0.35);color:rgba(255,255,255,0.7);font-style:italic;background:linear-gradient(180deg, rgba(255,45,146,0.06) 0%, transparent 100%);border-radius:0 0 18px 18px;">
          <span class="riddle-foot-icon" aria-hidden="true"
                style="font-style:normal;color:#ff2d92;font-size:1rem;text-shadow:0 0 8px rgba(255,45,146,0.6);">📖</span>
          <span class="riddle-foot-book" id="riddleFootBook"
                style="color:rgba(255,255,255,0.9);letter-spacing:0.02em;font-weight:500;"></span>
          <button id="riddleFootDl" type="button" aria-label="Save as image"
                  style="display:none;margin-left:auto;padding:0.45rem 0.85rem;background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid rgba(0,229,255,0.4);border-radius:999px;font:700 0.72rem/1 Inter,sans-serif;letter-spacing:0.05em;cursor:pointer;text-transform:uppercase;transition:all 0.2s;flex-shrink:0;"
                  onmouseover="this.style.background='rgba(0,229,255,0.22)';this.style.boxShadow='0 0 12px rgba(0,229,255,0.35)';"
                  onmouseout="this.style.background='rgba(0,229,255,0.12)';this.style.boxShadow='none';">↓ Save</button>
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
    // Skip hint: small "type the PIN as your answer to skip" tip
    const skipHint = overlay.querySelector('#riddleSkipHint');
    if (skipHint && lab.riddleSkipHint) {
      skipHint.textContent = lab.riddleSkipHint;
      skipHint.style.display = 'block';
    }
    // Author mode indicator (only shown when ?author=KEY was used)
    if (getAuthorKey() && lab.authorModeActive) {
      if (skipHint) {
        const am = document.createElement('div');
        am.style.cssText = 'text-align:center;font-size:0.68rem;color:rgba(255,213,106,0.7);margin:0.1rem 0 0.3rem 0;padding:0 1.4rem;letter-spacing:0.04em;';
        am.textContent = lab.authorModeActive;
        skipHint.after(am);
      }
    }
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
      // v10.2: render the completion modal (badge window). It celebrates the
      // weekly cycle (close / replay / download PNG) without "unlocking" a
      // hub — the user is sent back to K Life OS, not a new area.
      showCompletionModal();
      window.dispatchEvent(new CustomEvent('klife:riddles-complete', { detail: state }));
    }
  }

  // ---- v10.2: download helpers (PNG via html2canvas CDN) ----
  async function downloadElementAsPng(element, filename) {
    if (!window.html2canvas) throw new Error('html2canvas-not-loaded');
    const canvas = await window.html2canvas(element, {
      backgroundColor: '#0a0014',
      scale: 2,
      logging: false,
      useCORS: true
    });
    await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('toBlob-failed'));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve();
      }, 'image/png');
    });
  }

  // Local counter: tracks how many times the user downloaded a riddle/badge
  // (separated from the public solve counter, as requested in v10.2).
  function bumpDownloadLocal(riddleKey) {
    try {
      const raw = localStorage.getItem('klife-riddle-dl') || '{}';
      const map = JSON.parse(raw);
      map[riddleKey] = (map[riddleKey] || 0) + 1;
      localStorage.setItem('klife-riddle-dl', JSON.stringify(map));
    } catch (e) { /* localStorage may be disabled — silently skip */ }
  }

  // ---- v10.2: completion modal (badge window) ----
  // Shown when all 3 riddles are solved. Title: "Відлуння I — пройдено" /
  // "Echo I — completed". Subtitle: "Тиждень N · Anteros · канон". Actions:
  // Download badge as PNG, replay the current weekly level, or close.
  // Does NOT unlock a "main hub" — the user returns to K Life OS as usual.
  function showCompletionModal() {
    const existing = document.getElementById('completionGate');
    if (existing) existing.remove();

    const lab = L();
    const state = riddleRead();
    const weekIdx = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) + 1;
    const seriesLevel = ((weekIdx - 1) % 3) + 1;
    const titleText = lab.riddleCompletionTitle
      ? lab.riddleCompletionTitle(seriesLevel)
      : (lang() === 'en' ? `Echo ${seriesLevel} — completed` : `Відлуння ${seriesLevel} — пройдено`);
    const subText = lab.riddleCompletionSubtitle
      ? lab.riddleCompletionSubtitle(weekIdx)
      : (lang() === 'en' ? `Week ${weekIdx} · Anteros · canon` : `Тиждень ${weekIdx} · Anteros · канон`);
    const bodyText = lab.riddleCompletionBody || '';

    const overlay = document.createElement('div');
    overlay.id = 'completionGate';
    overlay.className = 'pin-gate';
    overlay.innerHTML = `
      <div class="pin-gate-card completion-card" id="completionCard" role="dialog" aria-labelledby="completionTitle"
           style="max-width:520px;width:calc(100vw - 32px);text-align:center;background:linear-gradient(180deg, rgba(26,14,56,0.98) 0%, rgba(12,6,32,1) 100%);border:2px solid rgba(255,213,106,0.4);border-radius:18px;padding:0;box-shadow:0 24px 60px rgba(8,4,24,0.7),0 0 64px rgba(255,213,106,0.18);overflow:hidden;color:#ffffff;">
        <div class="completion-header"
             style="padding:2.2rem 1.4rem 1.2rem 1.4rem;background:radial-gradient(circle at 50% 30%, rgba(255,213,106,0.18) 0%, transparent 70%);">
          <div class="completion-icon" aria-hidden="true"
               style="font-size:3rem;color:#ffd56a;text-shadow:0 0 24px rgba(255,213,106,0.6);line-height:1;margin-bottom:0.4rem;">◈</div>
          <h2 class="completion-title" id="completionTitle"
              style="margin:0;font-family:Georgia,serif;font-size:1.6rem;font-weight:800;color:#ffffff;letter-spacing:0.02em;line-height:1.15;text-shadow:0 2px 8px rgba(255,213,106,0.4);"></h2>
          <p class="completion-subtitle" id="completionSubtitle"
             style="margin:0.4rem 0 0 0;font-size:0.68rem;color:#ffd56a;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;text-shadow:0 0 8px rgba(255,213,106,0.5);"></p>
        </div>
        <div class="completion-body"
             style="padding:1.4rem 1.6rem 1.2rem 1.6rem;background:linear-gradient(180deg,#fff5dc 0%,#ffeec7 100%);color:#1a0a3a;">
          <p style="margin:0;font-family:Georgia,serif;font-size:1.02rem;line-height:1.55;font-style:italic;letter-spacing:0.005em;">${bodyText}</p>
          <div class="completion-list" id="completionList"
               style="margin-top:1rem;padding-top:0.7rem;border-top:1px dashed rgba(141,124,255,0.3);font-family:Inter,sans-serif;font-size:0.74rem;color:rgba(26,10,58,0.65);text-align:left;letter-spacing:0.04em;"></div>
        </div>
        <div class="completion-actions" style="display:flex;flex-direction:column;gap:0.55rem;padding:1.1rem 1.4rem 1.5rem 1.4rem;">
          <button id="completionDownload" type="button"
                  style="font:700 0.85rem/1 Inter,sans-serif;letter-spacing:0.05em;padding:0.95rem 1.2rem;background:linear-gradient(135deg,#00e5ff 0%,#7e74ff 100%);color:#0a0014;border:none;border-radius:12px;cursor:pointer;text-transform:uppercase;box-shadow:0 0 24px rgba(0,229,255,0.35);"></button>
          <button id="completionReplay" type="button"
                  style="font:700 0.78rem/1 Inter,sans-serif;letter-spacing:0.05em;padding:0.72rem 1.2rem;background:transparent;color:#00e5ff;border:1.5px solid rgba(0,229,255,0.4);border-radius:12px;cursor:pointer;text-transform:uppercase;"></button>
          <button id="completionClose" type="button"
                  style="font:500 0.78rem/1 Inter,sans-serif;letter-spacing:0.04em;padding:0.55rem 1.2rem;background:transparent;color:rgba(255,255,255,0.6);border:none;cursor:pointer;"></button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#completionTitle').textContent = titleText;
    overlay.querySelector('#completionSubtitle').textContent = subText;

    // List of solved riddle IDs (parchment, left-aligned, gold dots).
    const listEl = overlay.querySelector('#completionList');
    if (state.solvedRiddles && state.solvedRiddles.length > 0) {
      state.solvedRiddles.forEach((id) => {
        const line = document.createElement('div');
        line.className = 'completion-list-item';
        line.style.cssText = 'padding:0.16rem 0;';
        const dot = document.createElement('span');
        dot.textContent = '◈  ';
        dot.style.color = '#a07c2c';
        const txt = document.createElement('span');
        txt.textContent = id;
        line.appendChild(dot);
        line.appendChild(txt);
        listEl.appendChild(line);
      });
    } else {
      listEl.style.display = 'none';
    }

    // Download button (PNG) — captures the completion card.
    const dlBtn = overlay.querySelector('#completionDownload');
    dlBtn.textContent = '↓ ' + (lab.riddleDownload || 'Download image');
    const dlKey = `badge-${seriesLevel}-w${weekIdx}`;
    dlBtn.onclick = async (e) => {
      e.preventDefault();
      dlBtn.disabled = true;
      const orig = dlBtn.textContent;
      dlBtn.textContent = lab.riddleDownloading || 'Preparing…';
      try {
        await downloadElementAsPng(
          overlay.querySelector('#completionCard'),
          `klife-${dlKey}.png`
        );
        bumpDownloadLocal(dlKey);
        dlBtn.textContent = '✓ ' + (lab.riddleDownloaded || 'Saved');
      } catch (err) {
        console.error('download failed:', err);
        dlBtn.textContent = lab.riddleDownloadFailed || 'Failed';
      }
      setTimeout(() => { dlBtn.textContent = orig; dlBtn.disabled = false; }, 2400);
    };

    // Replay button — re-opens the current weekly level (re-engagement).
    const replayBtn = overlay.querySelector('#completionReplay');
    replayBtn.textContent = '↻ ' + (lab.riddleReplay || 'Play again');
    replayBtn.onclick = () => {
      overlay.remove();
      setTimeout(() => openRiddle(pickActiveLevel()), 200);
    };

    // Close button — dismiss the badge, user stays on K Life OS.
    const closeBtn = overlay.querySelector('#completionClose');
    closeBtn.textContent = lab.riddleClose || 'Close';
    closeBtn.onclick = () => overlay.remove();
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

    let attemptsLeft = RIDDLE_MAX_ATTEMPTS;

    function applyLockedState(hintText) {
      const lab = Lfor(currentLang);
      const hint = (lab.riddleOutOfTries || 'Out of tries.') + (hintText ? ' ' + hintText : '');
      setRiddleFeedback(hint, true);
      input.disabled = true;
      submit.textContent = '×';
      submit.onclick = close;
      submit.disabled = false;
      if (!hintRevealed && hintText) revealHint();
    }

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
        const res = await fetch(`${RIDDLE_ENDPOINT}?level=${level}&lang=${currentLang}`, {
          headers: riddleHeaders()
        });
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
        // External solve count (from Vercel KV or in-memory fallback)
        // v10.2: always visible — shows "Be the first" / "Стань першим" when n=0
        const solveCountEl = overlay.querySelector('#riddleSolveCount');
        if (solveCountEl) {
          const n = Number(data.solveCount) || 0;
          if (n > 0 && lab.riddleSolveCount) {
            solveCountEl.innerHTML = lab.riddleSolveCount(n).replace(/(\d+)/, '<strong>$1</strong>');
          } else if (lab.riddleSolveCountFirst) {
            solveCountEl.innerHTML = lab.riddleSolveCountFirst;
            solveCountEl.classList.add('riddle-solve-count-first');
          } else {
            solveCountEl.textContent = '';
          }
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
        if (typeof data.attemptsLeft === 'number') {
          attemptsLeft = data.attemptsLeft;
        }
        if (data.locked) {
          applyLockedState(currentHintText);
        } else {
          input.disabled = false;
          input.focus();
        }
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
          headers: { 'Content-Type': 'application/json', ...riddleHeaders() },
          body: JSON.stringify({ level, answer: ans, lang: currentLang })
        });
        const data = await res.json();
        // Multi-layer verdict: 'deep' | 'surface' | 'wrong' | 'skipped' | 'locked'
        const verdict = data.ok;
        if (typeof data.attemptsLeft === 'number') {
          attemptsLeft = data.attemptsLeft;
        }
        if (verdict === 'locked' || data.locked) {
          applyLockedState(data.hint || currentHintText);
          return;
        }
        if (verdict === 'skipped') {
          // PIN was used to skip — mark as solved locally, no counter increment.
          const state = riddleRead();
          state.solved[level - 1] = true;
          if (data.riddleId && !state.solvedRiddles.includes(data.riddleId)) {
            state.solvedRiddles.push(data.riddleId);
          }
          riddleWrite(state);
          const lab = L();
          setRiddleFeedback((lab.riddleSkipped || '✓ Skipped.'), false);
          // Submit becomes a green "next" arrow, click moves on
          submit.textContent = '→';
          submit.classList.add('is-next');
          submit.disabled = false;
          submit.onclick = () => {
            close();
            // v10.2: if all 3 are now solved, surface the completion badge
            // (don't auto-advance into another riddle loop).
            const s2 = riddleRead();
            if (s2.solved.every(Boolean)) {
              setTimeout(() => showCompletionModal(), 200);
            } else {
              const next = pickActiveLevel();
              setTimeout(() => openRiddle(next), 200);
            }
          };
        } else if (verdict === 'deep') {
          const state = riddleRead();
          state.solved[level - 1] = true;
          if (data.riddleId && !state.solvedRiddles.includes(data.riddleId)) {
            state.solvedRiddles.push(data.riddleId);
          }
          riddleWrite(state);
          const lab = L();
          setRiddleFeedback((lab.riddleSolved || '✓ Solved.'), false);
          // Update solve count display
          const solveCountEl = overlay.querySelector('#riddleSolveCount');
          if (solveCountEl && lab.riddleSolveCount) {
            const n = Number(data.solveCount) || 0;
            solveCountEl.innerHTML = lab.riddleSolveCount(n).replace(/(\d+)/, '<strong>$1</strong>');
          }
          // v10.2: reveal the per-riddle download button (PNG of the modal)
          const footDl = overlay.querySelector('#riddleFootDl');
          if (footDl) {
            footDl.style.display = 'inline-flex';
            footDl.textContent = '↓ ' + (lab.riddleDownload || 'Download image');
            footDl.onclick = async (e) => {
              e.preventDefault();
              e.stopPropagation();
              footDl.disabled = true;
              const orig = footDl.textContent;
              footDl.textContent = lab.riddleDownloading || 'Preparing…';
              try {
                await downloadElementAsPng(
                  overlay.querySelector('.riddle-card'),
                  `klife-riddle-${data.riddleId || ('l' + level)}-${currentLang}.png`
                );
                bumpDownloadLocal(data.riddleId || ('l' + level));
                footDl.textContent = '✓ ' + (lab.riddleDownloaded || 'Saved');
              } catch (err) {
                console.error('riddle download failed:', err);
                footDl.textContent = lab.riddleDownloadFailed || 'Failed';
              }
              setTimeout(() => { footDl.textContent = orig; footDl.disabled = false; }, 2400);
            };
          }
          // Submit becomes a green "next" arrow, click moves on
          submit.textContent = '→';
          submit.classList.add('is-next');
          submit.disabled = false;
          submit.onclick = () => {
            close();
            // v10.2: if all 3 are now solved, surface the completion badge
            // (don't auto-advance into another riddle loop).
            const s2 = riddleRead();
            if (s2.solved.every(Boolean)) {
              setTimeout(() => showCompletionModal(), 200);
            } else {
              const next = pickActiveLevel();
              setTimeout(() => openRiddle(next), 200);
            }
          };
        } else if (verdict === 'surface') {
          // Closer but not yet — show red herring hint, don't count as wrong attempt
          const lab = Lfor(currentLang);
          const closerHint = (lab.riddleCloser && lab.riddleCloser(data.hint)) || (data.hint || '');
          setRiddleFeedback(closerHint, false);
          // Update solve count display (others have solved it)
          const solveCountEl = overlay.querySelector('#riddleSolveCount');
          if (solveCountEl && lab.riddleSolveCount) {
            const n = Number(data.solveCount) || 0;
            if (n > 0) {
              solveCountEl.innerHTML = lab.riddleSolveCount(n).replace(/(\d+)/, '<strong>$1</strong>');
            }
          }
          submit.disabled = false;
        } else {
          // 'wrong' (or any unexpected verdict) — limits enforced server-side
          const lab = Lfor(currentLang);
          const wrongCount = RIDDLE_MAX_ATTEMPTS - attemptsLeft;
          if (wrongCount >= 1 && data.hint && !hintRevealed) {
            revealHint();
          }
          if (data.locked || attemptsLeft <= 0) {
            applyLockedState(data.hint || currentHintText);
          } else {
            const triesLeft = lab.riddleTriesLeft ? lab.riddleTriesLeft(attemptsLeft) : `Tries left: ${attemptsLeft}.`;
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
          if (typeof window.klifeSetLanguage === 'function') {
            window.klifeSetLanguage(target);
          } else {
            syncGlobalLang(target);
          }
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
    const state = riddleRead();
    if (state.solved.every(Boolean)) {
      // v10.2: all 3 solved → show the completion modal (badge window).
      // This is the re-engagement: the badge is a celebration, not a hub
      // unlock. User can close, replay, or download the PNG.
      setTimeout(() => showCompletionModal(), 600);
    } else {
      // v10.2: at least one unsolved → show the active level's riddle.
      const lvl = pickActiveLevel();
      setTimeout(() => openRiddle(lvl), 600);
    }
  }

  // ---- Crystal ball: click-to-shake, fetches /api/prophecy ----
  function ensureCrystalBall() {
    if (document.getElementById('klifeCrystalBall')) return;
    const wrap = document.createElement('div');
    wrap.id = 'klifeCrystalBall';
    wrap.className = 'klife-crystal-ball';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', 'crystal-ball');
    wrap.innerHTML = '🔮<div class="klife-crystal-ball-tooltip" id="klifeCrystalBallTooltip"></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', async () => {
      if (wrap.classList.contains('is-shaking')) return;
      wrap.classList.add('is-shaking');
      const tip = wrap.querySelector('#klifeCrystalBallTooltip');
      const lab = L();
      if (tip) {
        tip.classList.add('is-visible');
        tip.textContent = lab.crystalBallShake || 'Listening…';
      }
      try {
        const res = await fetch(`/api/prophecy?lang=${lang()}`);
        const data = await res.json();
        if (data.ok && tip) {
          tip.textContent = data.text;
          setTimeout(() => tip.classList.remove('is-visible'), 6000);
        }
      } catch (e) {
        if (tip) tip.textContent = lab.riddleNetworkError || 'Network error.';
        setTimeout(() => tip.classList.remove('is-visible'), 4000);
      }
      setTimeout(() => wrap.classList.remove('is-shaking'), 700);
    });
    // Hover preview (desktop)
    wrap.addEventListener('mouseenter', () => {
      const tip = wrap.querySelector('#klifeCrystalBallTooltip');
      const lab = L();
      if (tip && !wrap.classList.contains('is-shaking')) {
        tip.textContent = lab.crystalBallTooltip || 'Touch to hear a prophecy';
        tip.classList.add('is-visible');
      }
    });
    wrap.addEventListener('mouseleave', () => {
      if (!wrap.classList.contains('is-shaking')) {
        const tip = wrap.querySelector('#klifeCrystalBallTooltip');
        if (tip) tip.classList.remove('is-visible');
      }
    });
  }

  // ---- Daily whisper: small widget, click to reveal today's micro-riddle ----
  function ensureDailyWhisper() {
    if (document.getElementById('klifeDailyWhisper')) return;
    const wrap = document.createElement('div');
    wrap.id = 'klifeDailyWhisper';
    wrap.className = 'klife-daily-whisper';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', 'daily-whisper');
    wrap.innerHTML = '🌀';
    document.body.appendChild(wrap);
    let popup = null;
    wrap.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (popup) {
        popup.classList.toggle('is-visible');
        return;
      }
      const lab = L();
      popup = document.createElement('div');
      popup.className = 'klife-daily-popup';
      popup.innerHTML = `
        <button class="daily-popup-close" type="button" aria-label="close">×</button>
        <div class="daily-popup-prompt">…</div>
        <div class="daily-popup-input-row">
          <input type="text" maxlength="64" autocomplete="off" placeholder="${lab.riddlePlaceholder || ''}">
          <button type="button">${lab.riddleSubmit || 'OK'}</button>
        </div>
        <div class="daily-popup-feedback"></div>
      `;
      document.body.appendChild(popup);
      const closeBtn = popup.querySelector('.daily-popup-close');
      const promptEl2 = popup.querySelector('.daily-popup-prompt');
      const inputEl = popup.querySelector('input');
      const submitBtn = popup.querySelector('.daily-popup-input-row button');
      const feedbackEl = popup.querySelector('.daily-popup-feedback');
      let currentRiddleId = null;
      closeBtn.onclick = () => popup.classList.remove('is-visible');
      try {
        const res = await fetch(`/api/daily?lang=${lang()}`, { headers: authorHeaders() });
        const data = await res.json();
        if (data.ok) {
          promptEl2.textContent = data.prompt;
          currentRiddleId = data.id;
          if (data.solveCount && data.solveCount > 0) {
            const countLine = document.createElement('span');
            countLine.className = 'daily-popup-count';
            countLine.textContent = lab.riddleSolveCount ? lab.riddleSolveCount(data.solveCount) : '';
            feedbackEl.after(countLine);
          }
        } else {
          promptEl2.textContent = lab.riddleLoadError || 'Failed to load.';
        }
      } catch (e2) {
        promptEl2.textContent = lab.riddleNetworkError || 'Network error.';
      }
      popup.classList.add('is-visible');
      setTimeout(() => inputEl.focus(), 50);
      async function sendDaily() {
        const ans = inputEl.value;
        if (!ans.trim()) return;
        submitBtn.disabled = true;
        try {
          const res = await fetch('/api/daily', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authorHeaders() },
            body: JSON.stringify({ answer: ans, lang: lang(), riddleId: currentRiddleId })
          });
          const data = await res.json();
          if (data.ok === 'skipped') {
            feedbackEl.textContent = lab.riddleSkipped || '✓ Skipped.';
            feedbackEl.className = 'daily-popup-feedback is-ok';
            submitBtn.textContent = '✓';
            inputEl.disabled = true;
            return;
          }
          if (data.ok === 'deep') {
            feedbackEl.textContent = lab.dailySolved || '✓ Heard.';
            feedbackEl.className = 'daily-popup-feedback is-ok';
            submitBtn.textContent = '✓';
            inputEl.disabled = true;
          } else {
            feedbackEl.textContent = (data.hint || lab.dailyWrong || '✗');
            feedbackEl.className = 'daily-popup-feedback is-err';
            submitBtn.disabled = false;
          }
        } catch (e) {
          feedbackEl.textContent = lab.riddleNetworkError || 'Network error.';
          feedbackEl.className = 'daily-popup-feedback is-err';
          submitBtn.disabled = false;
        }
      }
      submitBtn.onclick = sendDaily;
      inputEl.onkeydown = (ev) => { if (ev.key === 'Enter') sendDaily(); };
    });
  }

  function initWidgets() {
    if (new URLSearchParams(location.search).get('nowidgets') === '1') return;
    ensureCrystalBall();
    ensureDailyWhisper();
  }

  // Re-render author bar & PIN gate on language change (i18n dispatches 'klife:langchange')
  window.addEventListener('klife:langchange', () => {
    updateAuthorBarUI();
    const pinGate = document.getElementById('pinGate');
    if (pinGate) fillPinLabels(pinGate);
    const googlePopup = document.getElementById('authorGooglePopup');
    if (googlePopup && !googlePopup.classList.contains('hidden')) {
      const lab = L();
      const title = googlePopup.querySelector('#authorGooglePopupTitle');
      if (title) title.textContent = lab.authorSignIn || 'Sign in with Google';
    }
  });

  // ---- Init: also kick off the riddle gate (no conflict with PIN) ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initRiddles(); initWidgets(); });
  } else {
    setTimeout(() => { initRiddles(); initWidgets(); }, 0);
  }
})();
