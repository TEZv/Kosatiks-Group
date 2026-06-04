// Vercel Function: /api/question
// Real-time question generation via Groq (M3 fallback if M3_API_KEY set)
//
// POST { pin, sphere, lang, provider? }
//   pin      — required, must match Vercel env PIN
//   sphere   — required, e.g. "Творчість або Самовираження"
//   lang     — "ua" | "en" (default "ua")
//   provider — "groq" | "m3" (default: first available)
//
// Required env vars:
//   GROQ_API_KEY   — Groq API key
//   PIN            — Access PIN (set in Vercel env, never commit)
// Optional:
//   M3_API_KEY   — M3 API key (enables M3 provider + toggle in UI)

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

// In-memory rate limit (per-instance, ~1 min). For production use Upstash/KV.
const RATE_LIMIT_MS = 60_000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return { allowed: false, retryAfter: Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000) };
  }
  rateLimitMap.set(ip, now);
  // Cleanup old entries to prevent memory leak
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
  // constant-time-ish comparison
  if (pin.length !== expected.length) return false;
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
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: CORS });
  }

  // Identify client (Vercel provides x-forwarded-for; first IP in chain)
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: 'rate_limit', retryAfter: rl.retryAfter }), {
      status: 429,
      headers: { ...CORS, 'Retry-After': String(rl.retryAfter) }
    });
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: CORS });
  }

  const { pin, sphere, lang: langIn, provider: providerIn } = body;

  // PIN
  if (!verifyPin(pin || '')) {
    return new Response(JSON.stringify({ error: 'invalid_pin' }), { status: 401, headers: CORS });
  }

  // Validate sphere
  const lang = (langIn === 'en') ? 'en' : 'ua';
  const sphereList = SPHERS_OK(lang);
  if (!sphere || !sphereList.includes(sphere)) {
    return new Response(JSON.stringify({ error: 'invalid_sphere', valid: sphereList }), { status: 400, headers: CORS });
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
    return new Response(JSON.stringify({ error: 'no_provider_configured' }), { status: 503, headers: CORS });
  }

  // Try providers in order
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
    return new Response(JSON.stringify({ error: 'generation_failed', message: lastErr?.message }), {
      status: 500, headers: CORS
    });
  }

  const items = parseResponse(text);
  if (items.length === 0) {
    return new Response(JSON.stringify({ error: 'parse_failed', raw: text.substring(0, 200) }), {
      status: 500, headers: CORS
    });
  }

  return new Response(JSON.stringify({
    ok: true,
    provider: used,
    sphere,
    lang,
    items
  }), { status: 200, headers: CORS });
}

function SPHERS_OK(lang) { return SPHERES[lang]; }
