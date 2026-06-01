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

async function generate(lang, sphere) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');
  const prompt = PROMPTS[lang](sphere);
  const maxRetries = 3;
  let lastErr;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content: prompt }], temperature: 1.1, max_tokens: 700 })
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = `HTTP ${res.status}: ${JSON.stringify(data).substring(0, 200)}`;
        if (res.status === 429 || res.status >= 500) {
          console.warn(`  attempt ${attempt}/${maxRetries} (${errMsg}) — retrying...`);
          await new Promise(r => setTimeout(r, 2000 * attempt));
          lastErr = new Error(errMsg);
          continue;
        }
        throw new Error(errMsg);
      }
      const text = data.choices?.[0]?.message?.content?.trim() || '';
      if (!text) {
        console.error(`  Empty response: ${JSON.stringify(data).substring(0, 300)}`);
        throw new Error('Empty response from Groq');
      }
      return parseResponse(text);
    } catch (e) {
      lastErr = e;
      if (attempt < maxRetries && (e.message.includes('fetch') || e.message.includes('network'))) {
        console.warn(`  attempt ${attempt}/${maxRetries} (${e.message}) — retrying...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
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
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error('ERROR: GROQ_API_KEY environment variable is not set!');
    console.error('Go to GitHub repo → Settings → Secrets → Actions → New repository secret');
    console.error('Name: GROQ_API_KEY, Value: gsk_...');
    process.exit(1);
  }
  console.log(`API key loaded: ${key.substring(0, 8)}...`);
  
  const output = { generatedAt: new Date().toISOString(), ua: {}, en: {} };
  for (const lang of ['ua', 'en']) {
    for (const sphere of SPHERES[lang]) {
      try {
        const items = await generate(lang, sphere);
        if (items.length === 0) throw new Error('No valid items parsed');
        output[lang][sphere] = items;
        console.log(`\u2713 ${lang}: ${sphere} (${items.length} q x ${items[0].a.length} a)`);
      } catch (e) {
        console.error(`\u2717 ${lang}: ${sphere} \u2014 ${e.message}`);
        output[lang][sphere] = null;
      }
      await new Promise(r => setTimeout(r, 800));
    }
  }
  const outPath = path.join(__dirname, '..', 'k-life-os', 'questions.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outPath}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
