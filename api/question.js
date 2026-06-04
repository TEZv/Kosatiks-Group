// Vercel Function: /api/question (Node.js runtime, req/res)
//
// POST { pin, sphere, lang, provider? }
// Required env: GROQ_API_KEY, PIN
// Optional:     M3_API_KEY

const SPHERES = {
  ua: [
    "Творчість або Самовираження",
    "Особистий розвиток або Турбота про себе",
    "Домашнє життя або Ведення господарства",
    "Фінанси",
    "Батьківство або Сім'я",
    "Відпочинок і Хобі",
    "Спільнота або Соціальні зв'язки",
    "Фізичне здоров'я",
    "Кар'єра або Освіта",
    "Екологія або Благодійність",
    "Особисті стосунки",
    "Духовність"
  ],
  en: [
    "Creativity or Self-Expression",
    "Personal Development or Self-Care",
    "Domestic Life or Household Management",
    "Finance",
    "Parenting or Family",
    "Recreation and Hobbies",
    "Community Involvement or Social Connection",
    "Physical Health",
    "Career or Education",
    "Environmental or Charitable Causes",
    "Personal Relationship",
    "Spirituality"
  ]
};

const PROMPTS = {
  ua: (sphere) => `Ти — мудрий оракул для жінки-підприємиці, яка шукає глибокої саморефлексії.

Сфера: "${sphere}"

Створи РІВНО 3 ситуативні питання, кожне з яких містить конкретну життєву ситуацію (час, місце, дію, емоцію), де відсутнє "ти/ви" — пиши від 3-ї особи "вона/жінка/людина". Максимум 18 слів на питання.

ДЛЯ КОЖНОГО питання створи РІВНО 3 варіанти відповідей — короткі психологічні реакції (5-10 слів кожна), що показують різні стратегії: уникнення, контроль, прийняття, чи створення нового.

Формат строго (без зайвих символів, без нумерації, без лапок):
Q1: питання
A1: відповідь 1
A1: відповідь 2
A1: відповідь 3
Q2: питання
A2: відповідь 1
A2: відповідь 2
A2: відповідь 3
Q3: питання
A3: відповідь 1
A3: відповідь 2
A3: відповідь 3`,
  en: (sphere) => `You are a wise oracle for a woman entrepreneur seeking deep self-reflection.

Sphere: "${sphere}"

Create EXACTLY 3 situational questions, each containing a concrete life situation (time, place, action, emotion), written in 3rd person ("she/woman/person") — never use "you". Maximum 18 words per question.

For EACH question, create EXACTLY 3 answer variants — short psychological reactions (5-10 words each) showing different strategies: avoidance, control, acceptance, or creating something new.

Format strictly (no extra symbols, no numbering, no quotes):
Q1: question
A1: answer 1
A1: answer 2
A1: answer 3
Q2: question
A2: answer 1
A2: answer 2
A2: answer 3
Q3: question
A3: answer 1
A3: answer 2
A3: answer 3`
};

const PROVIDERS = {
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    envKey: 'GROQ_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extract: (data) => (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || ''
  },
  m3: {
    name: 'M3',
    url: 'https://api.MiniMax.chat/v1/text/chatcompletion_v2',
    model: 'M3',
    envKey: 'M3_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extract: (data) => {
      if (data.base_resp && data.base_resp.status_code !== undefined && data.base_resp.status_code !== 0) {
        throw new Error('M3 ' + data.base_resp.status_code + ': ' + (data.base_resp.status_msg || 'unknown'));
      }
      return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    }
  },
  openrouter: {
    name: 'OpenRouter (M3)',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'minimax/minimax-m3',
    envKey: 'OPENROUTER_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extraHeaders: () => ({
      'HTTP-Referer': 'https://k-life-os.kosatiks-group.pp.ua',
      'X-Title': 'K Life OS'
    }),
    extract: (data) => (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || ''
  }
};

// M3-class providers: any provider that gives access to M3 model.
// When client requests 'm3', we try these in order (direct API first, then OpenRouter).
const M3_CLASS = ['m3', 'openrouter'];
const ALL_PROVIDERS = ['groq', 'm3', 'openrouter'];

const RATE_LIMIT_MS = 60000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return { allowed: false, retryAfter: Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000) };
  }
  rateLimitMap.set(ip, now);
  return { allowed: true };
}

function verifyPin(pin) {
  const expected = process.env.PIN;
  if (!expected) return false;
  if (!pin || pin.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < pin.length; i++) {
    diff |= pin.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

async function callProvider(provider, prompt) {
  const key = process.env[provider.envKey];
  if (!key) throw new Error(provider.envKey + ' not set');
  const headers = {
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    ...(typeof provider.extraHeaders === 'function' ? provider.extraHeaders() : {})
  };
  const res = await fetch(provider.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(provider.body(provider.model, prompt))
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error('HTTP ' + res.status + ': ' + errBody.substring(0, 200));
  }
  const data = await res.json();
  const text = provider.extract(data);
  if (!text) throw new Error('Empty response');
  return text;
}

function parseResponse(text) {
  const result = [];
  let current = null;
  for (const raw of text.split(/\n+/)) {
    const line = raw.replace(/^["']|["']$/g, '').trim();
    if (!line) continue;
    const qm = line.match(/^Q\d+[:\.\)]\s*(.+)$/i);
    const am = line.match(/^A\d+[:\.\)]\s*(.+)$/i);
    if (qm) {
      if (current) result.push(current);
      current = { q: qm[1].trim(), a: [] };
    } else if (am && current) {
      current.a.push(am[1].trim());
    }
  }
  if (current) result.push(current);
  return result
    .filter(item => item.q && item.a.length >= 2)
    .map(item => ({ q: item.q, a: item.a.slice(0, 3) }))
    .slice(0, 3);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

export default async function handler(req, res) {
  try {
    setCors(res);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    // Identify client
    const xff = req.headers['x-forwarded-for'] || '';
    const ip = (typeof xff === 'string' ? xff.split(',')[0].trim() : '') || 'unknown';

    // Rate limit
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      res.setHeader('Retry-After', String(rl.retryAfter));
      return res.status(429).json({ error: 'rate_limit', retryAfter: rl.retryAfter });
    }

    // Parse body (Vercel may give string or object depending on runtime)
    let body = {};
    if (req.body) {
      if (typeof req.body === 'string') {
        try { body = JSON.parse(req.body); } catch { body = {}; }
      } else if (typeof req.body === 'object') {
        body = req.body;
      }
    }
    const pin = body.pin || '';
    const sphere = body.sphere || '';
    const lang = body.lang === 'en' ? 'en' : 'ua';
    const requested = (body.provider || 'groq').toLowerCase();

    // PIN
    if (!verifyPin(pin)) {
      return res.status(401).json({ error: 'invalid_pin' });
    }

    // Validate sphere
    const sphereList = SPHERES[lang];
    if (!sphereList.includes(sphere)) {
      return res.status(400).json({ error: 'invalid_sphere', valid: sphereList });
    }

    // Provider order.
    // When client requests 'm3' (or 'openrouter'), only M3-class providers
    // are tried — never fall back to groq, otherwise the M3 toggle probe
    // would always succeed via groq and the button would never disable.
    const order = [];
    const isM3Class = requested === 'm3' || requested === 'openrouter';
    if (isM3Class) {
      for (const p of M3_CLASS) {
        if (PROVIDERS[p] && process.env[PROVIDERS[p].envKey]) order.push(p);
      }
      if (order.length === 0) {
        return res.status(503).json({ error: 'no_m3_provider' });
      }
    } else {
      if (PROVIDERS.groq && process.env.GROQ_API_KEY) order.push('groq');
      for (const p of M3_CLASS) {
        if (PROVIDERS[p] && process.env[PROVIDERS[p].envKey]) order.push(p);
      }
      if (order.length === 0) {
        return res.status(503).json({ error: 'no_provider_configured' });
      }
    }

    // Try providers
    let text, used, lastErr;
    for (const name of order) {
      try {
        text = await callProvider(PROVIDERS[name], PROMPTS[lang](sphere));
        used = name;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!text) {
      return res.status(500).json({ error: 'generation_failed', message: lastErr && lastErr.message });
    }

    const items = parseResponse(text);
    if (items.length === 0) {
      return res.status(500).json({ error: 'parse_failed', raw: text.substring(0, 200) });
    }

    return res.status(200).json({
      ok: true,
      provider: used,
      sphere,
      lang,
      items
    });
  } catch (e) {
    return res.status(500).json({ error: 'unhandled', message: e && e.message ? e.message : 'unknown' });
  }
}
