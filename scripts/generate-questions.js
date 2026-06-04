const fs = require('fs');
const path = require('path');

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
  ua: (sphere) => `Ти — мудрий оракул для жінки- підприємиці, яка шукає глибокої саморефлексії.

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
A3: відповідь 3

Приклад для сфери "Кар'єра":
Q1: Після третього проваленого пітчу вона сидить в машині на парковці
A1: Аналізує свої помилки в нотатках
A1: Дзвонить подрузі, щоб виговоритись
A1: Їде в спортзал, щоб випустити емоції`,
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
A3: answer 3

Example for "Career":
Q1: After her third rejected pitch, she sits alone in the car at the parking lot
A1: Analyzes her mistakes in detailed notes
A1: Calls her best friend to vent
A1: Drives to the gym to release the tension`
};

// === Provider abstraction: M3 (primary) + Groq (fallback) ===
const PROVIDERS = {
  m3: {
    name: 'M3',
    url: 'https://api.MiniMax.chat/v1/text/chatcompletion_v2',
    model: 'M3',
    envKey: 'M3_API_KEY',
    headers: (key) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }),
    body: (model, prompt, maxTokens, temperature) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
    }),
    extract: (data) => {
      // M3 may return errors via base_resp
      if (data.base_resp && data.base_resp.status_code !== undefined && data.base_resp.status_code !== 0) {
        throw new Error(`M3 error ${data.base_resp.status_code}: ${data.base_resp.status_msg || 'unknown'}`);
      }
      return data.choices?.[0]?.message?.content?.trim() || '';
    }
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    envKey: 'GROQ_API_KEY',
    headers: (key) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }),
    body: (model, prompt, maxTokens, temperature) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
    }),
    extract: (data) => data.choices?.[0]?.message?.content?.trim() || ''
  }
};

async function callProvider(provider, prompt) {
  const key = process.env[provider.envKey];
  if (!key) throw new Error(`${provider.envKey} not set`);
  const res = await fetch(provider.url, {
    method: 'POST',
    headers: provider.headers(key),
    body: JSON.stringify(provider.body(provider.model, prompt, 700, 1.1))
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`HTTP ${res.status}: ${errBody.substring(0, 200)}`);
  }
  const data = await res.json();
  return provider.extract(data);
}

async function generate(lang, sphere) {
  const prompt = PROMPTS[lang](sphere);
  const primary = (process.env.LLM_PROVIDER || 'm3').toLowerCase();
  const fallback = primary === 'm3' ? 'groq' : 'm3';
  const order = [primary, fallback];

  let lastErr;
  for (const name of order) {
    const provider = PROVIDERS[name];
    if (!process.env[provider.envKey]) {
      console.warn(`  [${provider.name}] API key not set, skipping`);
      continue;
    }
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const text = await callProvider(provider, prompt);
        if (text) return { text, provider: provider.name };
        throw new Error('Empty response from provider');
      } catch (e) {
        lastErr = e;
        if (attempt < maxRetries) {
          console.warn(`  [${provider.name}] attempt ${attempt}/${maxRetries} (${e.message}) — retrying...`);
          await new Promise(r => setTimeout(r, 2000 * attempt));
        }
      }
    }
    console.warn(`  [${provider.name}] all retries failed: ${lastErr?.message}`);
  }
  throw lastErr || new Error('No provider succeeded');
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

(async () => {
  const primary = (process.env.LLM_PROVIDER || 'm3').toLowerCase();
  const providersAvailable = Object.keys(PROVIDERS).filter(n => process.env[PROVIDERS[n].envKey]);
  if (providersAvailable.length === 0) {
    console.error('ERROR: No API keys set! Add M3_API_KEY and/or GROQ_API_KEY to GitHub Secrets.');
    console.error('Repo → Settings → Secrets and variables → Actions → New repository secret');
    console.error('Primary: M3_API_KEY, Fallback: GROQ_API_KEY');
    process.exit(1);
  }
  console.log(`Primary provider: ${primary}`);
  console.log(`Available providers: ${providersAvailable.join(', ')}`);

  const outPath = path.join(__dirname, '..', 'k-life-os', 'questions.json');
  let existing = { ua: {}, en: {} };
  if (fs.existsSync(outPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      console.log(`Loaded existing questions.json (${existing.generatedAt || 'unknown'})`);
    } catch (e) {
      console.warn('Could not parse existing questions.json:', e.message);
    }
  }

  const now = new Date();
  const kyivMs = now.getTime() + 2 * 60 * 60 * 1000;
  const today = new Date(kyivMs).toISOString().slice(0, 10);
  const yesterdayDate = new Date(kyivMs - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  console.log(`\nDaily run for ${today} (yesterday buffer: ${yesterdayDate})`);

  const output = { generatedAt: now.toISOString(), day: today, provider: primary, ua: {}, en: {} };
  let totalAdded = 0, totalKept = 0, totalDropped = 0, totalSkipped = 0;
  for (const lang of ['ua', 'en']) {
    for (const sphere of SPHERES[lang]) {
      const prevItems = Array.isArray(existing?.[lang]?.[sphere]) ? existing[lang][sphere] : [];
      const todayItems = prevItems.filter(it => it._day === today);
      const yesterdayItems = prevItems.filter(it => it._day === yesterdayDate);

      if (todayItems.length >= 3) {
        output[lang][sphere] = todayItems;
        totalKept += todayItems.length;
        totalSkipped++;
        const dropped = prevItems.length - todayItems.length;
        totalDropped += dropped;
        console.log(`✓ ${lang}: ${sphere} (today complete: ${todayItems.length}, dropped ${dropped})`);
        await new Promise(r => setTimeout(r, 200));
        continue;
      }

      const bufferKey = new Set(yesterdayItems.map(it => `${it.q}|${(it.a || []).join('|')}`));
      try {
        const result = await generate(lang, sphere);
        const newItems = parseResponse(result.text);
        if (newItems.length === 0) throw new Error('No valid items parsed');
        const stamped = newItems.map(it => ({ ...it, _day: today, _provider: result.provider }));
        const fresh = stamped.filter(it => !bufferKey.has(`${it.q}|${(it.a || []).join('|')}`));
        const merged = [...yesterdayItems, ...fresh];
        output[lang][sphere] = merged;
        const added = merged.length - yesterdayItems.length;
        const dropped = Math.max(0, prevItems.length - merged.length);
        totalAdded += added;
        totalKept += yesterdayItems.length;
        totalDropped += dropped;
        console.log(`✓ ${lang}: ${sphere} via ${result.provider} (yesterday buffer ${yesterdayItems.length} + today added ${added}, dropped ${dropped})`);
      } catch (e) {
        console.error(`✗ ${lang}: ${sphere} — ${e.message}`);
        output[lang][sphere] = yesterdayItems.length > 0 ? yesterdayItems : (todayItems.length > 0 ? todayItems : null);
      }
      await new Promise(r => setTimeout(r, 800));
    }
  }
  console.log(`\nTotal: kept ${totalKept}, added ${totalAdded}, dropped ${totalDropped}, skipped-regen ${totalSkipped}`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outPath}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
