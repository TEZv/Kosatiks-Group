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
  ua: (sphere) => `Ти — мудрий оракул. Напиши 3 різні глибокі, провокаційні, ситуативні питання для роздумів (максимум 20 слів кожне) для сфери життя "${sphere}". Питання мають спонукати до саморефлексії. Кожне питання — окремий рядок, без нумерації та лапок.`,
  en: (sphere) => `You are a wise oracle. Write 3 different deep, provocative, situational questions for reflection (max 20 words each) for the life sphere "${sphere}". Each question should encourage self-reflection. Each question on a new line, no numbering, no quotes.`
};

async function generate(lang, sphere) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');
  const prompt = PROMPTS[lang](sphere);
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content: prompt }], temperature: 0.9, max_tokens: 200 })
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`  HTTP ${res.status}: ${JSON.stringify(data).substring(0, 200)}`);
    throw new Error(`HTTP ${res.status}`);
  }
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  if (!text) {
    console.error(`  Empty response: ${JSON.stringify(data).substring(0, 300)}`);
    throw new Error('Empty response from Groq');
  }
  const lines = text.split(/\n+/).map(l => l.replace(/^[\d\.\-\)\(\*\u2022]+\s*/, '').replace(/^["']|["']$/g, '').trim()).filter(l => l.length > 5);
  return lines.slice(0, 3);
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
        const qs = await generate(lang, sphere);
        output[lang][sphere] = qs;
        console.log(`\u2713 ${lang}: ${sphere} (${qs.length} variants)`);
      } catch (e) {
        console.error(`\u2717 ${lang}: ${sphere} \u2014 ${e.message}`);
        output[lang][sphere] = null;
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  const outPath = path.join(__dirname, '..', 'k-life-os', 'questions.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outPath}`);
})();
