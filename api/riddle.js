// Vercel Function: /api/riddle (Node.js runtime, req/res)
//
// GET  /api/riddle?level=1&lang=ua   -> { ok, id, level, title, prompt, hint, weekIndex, rotationSize, intro }
// POST /api/riddle { level, answer, lang, riddleId? } -> { ok, level, hint?, correctId? }
//
// Riddles live INLINE here (server-only) so they never enter the public
// bundle. The active riddle for any level rotates weekly so the audience
// encounters fresh "echoes" over time. Three riddles per level × two
// languages = 18 riddles total. Cycle length: 3 weeks.
//
// Source canon: C:\anteros_series1\repo (books Sviesa/Ausra/Dievas/Vele/
// Ilgesys/Dausos, plus Series 2 Eros, Series 3 A). Sourced from
// SERIES_BIBLE.md, NAMING_AND_MYSTERY_CANON_2026-04-18.md, and
// BOOK_QUOTE_HARVEST_ANTEROS_2026-04-19.md.

// ---- Riddle content (server-only) ----------------------------------------

const RIDDLES = {
  1: {
    title: {
      ua: 'Відлуння I · Перша поява',
      en: 'Echo I · First Appearance'
    },
    intro: {
      ua: 'Те, що приходить раніше за того, хто його несе.',
      en: 'What arrives before the one who carries it.'
    },
    items: [
      {
        ua: {
          id: 'l1-ua-01',
          prompt: 'У четвертій книзі я приходжу раніше за того, хто мене несе. Я можу бути внутрішньо величезним, поки залишаюсь зовні тонким. Мене чують раніше, ніж торкаються. Що я?',
          hint: 'Vėlė · Розділ 1 · Kyiv'
        },
        en: {
          id: 'l1-en-01',
          prompt: 'In the fourth book I arrive before the one who carries me. I can be internally enormous while remaining externally thin. I am heard before I am touched. What am I?',
          hint: 'Vėlė · Chapter 1 · Kyiv'
        }
      },
      {
        ua: {
          id: 'l1-ua-02',
          prompt: 'Дівчина в четвертій книзі прокидається в місті під тінню війни. Це місто — не тло, а інструмент. Один з його чотирьох інструментів починається на "з". Що це?',
          hint: 'Vėlė · Розділ 1 · delay / interception / amplification / unfinished arrival'
        },
        en: {
          id: 'l1-en-02',
          prompt: 'The woman in the fourth book wakes in a city under war-shadow. The city is an instrument, not a backdrop. One of its four instruments starts with "d". What is it?',
          hint: 'Vėlė · Chapter 1 · delay / interception / amplification / unfinished arrival'
        }
      },
      {
        ua: {
          id: 'l1-ua-03',
          prompt: 'Дівчина в четвертій книзі прокидається в місті під тінню війни. Назви це місто одним словом.',
          hint: 'Vėlė · Розділ 1'
        },
        en: {
          id: 'l1-en-03',
          prompt: 'The woman in the fourth book wakes in a city under war-shadow. Name the city in one word.',
          hint: 'Vėlė · Chapter 1'
        }
      }
    ]
  },
  2: {
    title: {
      ua: 'Відлуння II · Невидимий тиск',
      en: 'Echo II · The Unseen Pressure'
    },
    intro: {
      ua: 'Хто ти — ворог, союзник, чи система?',
      en: 'Who are you — enemy, ally, or system?'
    },
    items: [
      {
        ua: {
          id: 'l2-ua-01',
          prompt: 'Я не можу витримати всередині себе зв\'язок, занадто точний без мого посередництва. Моя ворожнеча — не театр. Без своєї осі я не зникаю, але стаю тоншим, тихішим, самотнішим. Хто я?',
          hint: 'Публічний шар містики. Відповідь — одне знакомісце.'
        },
        en: {
          id: 'l2-en-01',
          prompt: 'I cannot tolerate within myself a bond too exact, too autonomous, too proportioned without my mediation. My hostility is principled, not theatrical. Without my axis I do not vanish, but become thinner, quieter, lonelier. Who am I?',
          hint: 'The public mystery layer. One character.'
        }
      },
      {
        ua: {
          id: 'l2-ua-02',
          prompt: 'Я не мстива, не холодна. Я люблю. Чого я боюся — то це того, що взаємність вимагатиме від любові стати конкретною, відповідальною, обмеженою, парною, зобов\'язаною. Хто я?',
          hint: 'Серія 1 · Anteros · протилежність А.'
        },
        en: {
          id: 'l2-en-02',
          prompt: 'I am not cold, not merely narcissistic. I love. What I fear is what reciprocity asks love to become: concrete, answerable, bounded, pair-shaped, obligated. Who am I?',
          hint: 'Series 1 · Anteros · counterpart of A.'
        }
      },
      {
        ua: {
          id: 'l2-ua-03',
          prompt: 'Я не зникаю без своєї осі, але стаю тоншим, тихішим, самотнішим. Моя найглибша жестикуляція — прохання: поміть мене, не дайте мені зникнути поруч із тим, на що я відповідаю. Хто я?',
          hint: 'Серія 1 · Anteros · ім\'я відповіді'
        },
        en: {
          id: 'l2-en-03',
          prompt: 'I do not vanish without my axis, but become thinner, quieter, lonelier. My deepest gesture is petition: notice me, do not let me disappear beside what I answer. Who am I?',
          hint: 'Series 1 · Anteros · the answerer'
        }
      }
    ]
  },
  3: {
    title: {
      ua: 'Відлуння III · Перша асиметрія',
      en: 'Echo III · The First Asymmetry'
    },
    intro: {
      ua: 'Те, що починає світ, не вибухом.',
      en: 'What begins the world, not by explosion.'
    },
    items: [
      {
        ua: {
          id: 'l3-ua-01',
          prompt: 'Я не вибух. Я не удар. Я — найлегший порушник спокою з усіх можливих світів. Колись мене назвали першою онтологічною силою повноти, що перестала збігатися із собою. Що я?',
          hint: 'Šviesa · Розділ 1 · початок світу'
        },
        en: {
          id: 'l3-en-01',
          prompt: 'I am not an explosion. I am not an impact. I am the gentlest disturbance in all possible worlds. Once I was named the first ontological pressure of fullness ceasing to coincide with itself. What am I?',
          hint: 'Šviesa · Chapter 1 · the beginning of the world'
        }
      },
      {
        ua: {
          id: 'l3-ua-02',
          prompt: 'Я не приватна власність. Я стаю дисциплінованим спільним надбанням значущості. Я — форма справедливості між часовими шарами "я". Що я?',
          hint: 'Dausos · Розділ 1 · між шарами'
        },
        en: {
          id: 'l3-en-02',
          prompt: 'I do not become private property. I become a disciplined commons of significance. I am a form of justice between temporal layers of the self. What am I?',
          hint: 'Dausos · Chapter 1 · between the layers'
        }
      },
      {
        ua: {
          id: 'l3-ua-03',
          prompt: 'Я — не один з об\'єктів усередині серії. Я — закон правдивої координації між багатьма її світами. Я не повертаюсь до попередньої форми. Що я?',
          hint: 'Dausos · Розділ 2 · що залишається'
        },
        en: {
          id: 'l3-en-03',
          prompt: 'I am not one more object inside the series. I am the law of truthful coordination across its many worlds. I do not return to my first proportion. What am I?',
          hint: 'Dausos · Chapter 2 · what remains'
        }
      }
    ]
  }
};

// ---- Answer keys (server-only) -------------------------------------------
// Lower-cased, punctuation-stripped matching happens in normalize().

const ANSWERS = {
  1: {
    ua: ['голос', 'voice'],
    en: ['voice']
  },
  // Level 1 alt riddles (l1-ua-02 / l1-en-02: "delay" / "з-затримка")
  // Shared answer set below; we add per-riddle override via SPECIFIC_ANSWERS.
  2: {
    ua: ['а.', 'a.', 'a', 'ерос', 'eros', 'антерос', 'anteros'],
    en: ['a.', 'a', 'eros', 'anteros']
  },
  3: {
    ua: [
      'незбіг', 'дисонанс', 'mismatch', 'dissonance', 'non-coincidence', 'asymmetry', 'асиметрія',
      'пам\'ять', 'память', 'memory', 'любов', 'кохання', 'love'
    ],
    en: [
      'mismatch', 'dissonance', 'non-coincidence', 'asymmetry', 'незбіг',
      'memory', 'love'
    ]
  }
};

// Per-riddle answer overrides (riddleId -> array of accepted answers).
// This lets us keep multi-language riddle content while accepting language-
// appropriate answer words. Falls back to ANSWERS[level] if not listed.
const SPECIFIC_ANSWERS = {
  'l1-ua-02': ['затримка', 'delay'],
  'l1-en-02': ['delay'],
  'l1-ua-03': ['київ', 'kyiv'],
  'l1-en-03': ['kyiv', 'київ']
};

// ---- Helpers --------------------------------------------------------------

function currentWeekIndex() {
  // ISO-ish week number since epoch. Stable across server restarts.
  const now = Date.now();
  return Math.floor(now / (7 * 24 * 60 * 60 * 1000));
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[\.\u2026,!?;:\u2014\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getItem(level, lang, weekIdx) {
  const lvl = RIDDLES[level];
  if (!lvl) return null;
  const item = lvl.items[weekIdx % lvl.items.length];
  const localized = item[lang] || item.ua;
  return {
    id: localized.id,
    level: Number(level),
    title: (lvl.title && (lvl.title[lang] || lvl.title.ua)) || '',
    prompt: localized.prompt,
    hint: localized.hint,
    intro: (lvl.intro && (lvl.intro[lang] || lvl.intro.ua)) || '',
    weekIndex: weekIdx,
    rotationSize: lvl.items.length
  };
}

function getAnswersFor(riddleId, level, lang) {
  if (SPECIFIC_ANSWERS[riddleId]) return SPECIFIC_ANSWERS[riddleId];
  const ans = ANSWERS[level];
  if (!ans) return [];
  return ans[lang] || ans.ua || [];
}

function checkAnswer(level, riddleId, answer, lang) {
  const accepted = getAnswersFor(riddleId, level, lang);
  const norm = normalize(answer);
  if (!norm) return false;
  return accepted.some((a) => normalize(a) === norm);
}

// ---- HTTP handler ---------------------------------------------------------

module.exports = async function handler(req, res) {
  // CORS — the riddle is for engagement, not secrecy. Prompts are non-sensitive.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method === 'GET') {
      const level = Number(req.query.level || 1);
      const lang = req.query.lang === 'en' ? 'en' : 'ua';
      if (!RIDDLES[level]) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'no_such_level' }));
      }
      const item = getItem(level, lang, currentWeekIndex());
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, ...item }));
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};
      const level = Number(body.level || 1);
      const lang = body.lang === 'en' ? 'en' : 'ua';
      const answer = body.answer || '';
      const requestedId = body.riddleId || null;

      if (!RIDDLES[level]) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'bad_level' }));
      }

      // If client didn't pass a riddleId, validate against the current week's
      // riddle for that level (server picks it).
      const item = getItem(level, lang, currentWeekIndex());
      const riddleId = requestedId || item.id;
      const ok = checkAnswer(level, riddleId, answer, lang);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok,
        level,
        riddleId,
        // Always echo the canonical current riddle so the client can sync state
        currentRiddle: item,
        hint: ok ? undefined : (item && item.hint)
      }));
    }

    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'server_error', message: String(err && err.message || err) }));
  }
};
