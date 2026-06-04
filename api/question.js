// Vercel Function: /api/question (Node.js runtime, Express-style req/res)
//
// POST { pin, sphere, lang, provider? }
//   pin      — required, must match Vercel env PIN
//   sphere   — required
//   lang     — "ua" | "en" (default "ua")
//   provider — "groq" | "m3"
//
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
    extract: (data) => data.choices?.[0]?.message?.content?.trim() || ''
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
        throw new Error(`M3 ${data.base_resp.status_code}: ${data.base_resp.status_msg || 'unknown'}`);
      }
      return data.choices?.[0]?.message?.content?.trim() || '';
    }
  }
};

// In-memory rate limit (per-instance)
const RATE_LIMIT_MS = 60_000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return { allowed: false, retryAfter: Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000) };
  }
  rateLimitMap.set(ip, now);
  if (rateLimitMap.size > 500) {
    for (const [k, v] of rateLimitMap) {
      if (now - v > RATE_LIMIT_MS * 5) rateLimitMap.delete(k);
    }
  }
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
  if (!key) throw new Error(`${provider.envKey} not set`);
  const res = await fetch(provider.url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(provider.body(provider.model, prompt))
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`HTTP ${res.status}: ${errBody.substring(0, 200)}`);
  }
  const data = await res.json();
  const text = provider.extract(data);
  if (!text) throw new Error('Empty response from provider');
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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Identify client
  const xff = req.headers['x-forwarded-for'] || '';
  const ip = (typeof xff === 'string' ? xff.split(',')[0].trim() : '') ||
             req.headers['x-real-ip'] ||
             'unknown';

  // Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'rate_limit', retryAfter: rl.retryAfter });
  }

  // Parse body (Vercel auto-parses JSON if Content-Type is application/json)
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { pin, sphere, lang: langIn, provider: providerIn } = body;

  // PIN
  if (!verifyPin(pin || '')) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(401).json({ error: 'invalid_pin' });
  }

  // Validate sphere
  const lang = (langIn === 'en') ? 'en' : 'ua';
  const sphereList = SPHERES[lang];
  if (!sphere || !sphereList.includes(sphere)) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(400).json({ error: 'invalid_sphere', valid: sphereList });
  }

  // Resolve provider order
  const requested = (providerIn || 'groq').toLowerCase();
  const order = [];
  if (PROVIDERS[requested] && process.env[PROVIDERS[requested].envKey]) {
    order.push(requested);
  }
  const other = requested === 'm3' ? 'groq' : 'm3';
  if (PROVIDERS[other] && process.env[PROVIDERS[other].envKey]) {
    order.push(other);
  }
  if (order.length === 0) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(503).json({ error: 'no_provider_configured' });
  }

  // Try providers
  let text, used;
  let lastErr;
  for (const name of order) {
    const provider = PROVIDERS[name];
    try {
      text = await callProvider(provider, PROMPTS[lang](sphere));
      used = name;
      break;
    } catch (e) {
      lastErr = e;
    }
  }

  if (!text) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(500).json({ error: 'generation_failed', message: lastErr?.message });
  }

  const items = parseResponse(text);
  if (items.length === 0) {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(500).json({ error: 'parse_failed', raw: text.substring(0, 200) });
  }

  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json({
    ok: true,
    provider: used,
    sphere,
    lang,
    items
  });
}
