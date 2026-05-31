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
  ua: (sphere) => `Ти — мудрий оракул. Напиши одне глибоке, провокаційне, ситуативне питання для роздумів (максимум 20 слів) для сфери життя "${sphere}". Питання має спонукати до саморефлексії. Не використовуй лапки.`,
  en: (sphere) => `You are a wise oracle. Write one deep, provocative, situational question for reflection (max 20 words) for the life sphere "${sphere}". The question should encourage self-reflection. No quotes.`
};

async function generate(lang, sphere) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');
  const prompt = PROMPTS[lang](sphere);
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'user', content: prompt }], temperature: 0.9, max_tokens: 80 })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, '') || null;
}

(async () => {
  const output = { generatedAt: new Date().toISOString(), ua: {}, en: {} };
  for (const lang of ['ua', 'en']) {
    for (const sphere of SPHERES[lang]) {
      try {
        const q = await generate(lang, sphere);
        output[lang][sphere] = q;
        console.log(`\u2713 ${lang}: ${sphere}`);
      } catch (e) {
        console.error(`\u2717 ${lang}: ${sphere} \u2014 ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  const outPath = path.join(__dirname, '..', 'k-life-os', 'questions.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outPath}`);
})();
