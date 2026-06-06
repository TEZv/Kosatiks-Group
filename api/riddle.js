// Vercel Function: /api/riddle (Node.js runtime, req/res)
//
// GET  /api/riddle?level=1&lang=ua   -> weekly active riddle for level
// GET  /api/riddle?counts=1&riddleId=l1-ua-01&lang=ua
//                                   -> { ok, riddleId, solveCount } from KV
// POST /api/riddle { level, answer, lang, riddleId?, skipPin? }
//                                   -> { ok: 'deep'|'surface'|'wrong'|'skipped',
//                                         level, riddleId, currentRiddle, hint,
//                                         solveCount, internalSolveCount, skipCount }
//
// Riddles live INLINE here (server-only) so they never enter the public
// bundle. Active riddle rotates weekly so the audience encounters fresh
// "echoes" over time. Three riddles per level × two languages = 18 total.
//
// MULTI-LAYER ANSWERS (deep / surface / wrong):
//   - 'deep'    — accepted answer matches the canonical "real" answer. Counts
//                 as solved. KV counter +1.
//   - 'surface' — accepted answer is a "close but not deep" answer. User
//                 gets a "closer" hint revealing the next layer down.
//   - 'wrong'   — anything else. Standard feedback.
//
// HASHED ANSWERS:
//   Accepted answers are stored as SHA-256 hex digests (not plaintext).
//   This keeps the answers out of the public GitHub source. To add a
//   new accepted answer, run:
//     node api/_gen_hash.js "your answer"
//   and paste the hash into the appropriate level below.
//
// Source canon: C:\anteros_series1\repo (books Sviesa/Ausra/Dievas/Vele/
// Ilgesys/Dausos, plus Series 2 Eros, Series 3 A). Sourced from
// SERIES_BIBLE.md, NAMING_AND_MYSTERY_CANON_2026-04-18.md, and
// BOOK_QUOTE_HARVEST_ANTEROS_2026-04-19.md.

const crypto = require('crypto');
const kv = require('./_kv');
const auth = require('./_auth');
const epoch = require('./_epoch');
const limits = require('./_riddle_limits');

// ---- Riddle content (server-only) ----------------------------------------

const RIDDLES = {
  1: {
    // INVARIANT: `title` is the authorial book name and MUST be identical in
    // `ua` and `en` — never translate. Lithuanian/Greek names (Vėlė, Anteros,
    // Šviesa, Dausos) stay verbatim in both languages so readers can Google
    // them. Only `series` (UA: "Відлуння I/II/III" / EN: "Echo I/II/III") and
    // `chapter` (UA: "Розділ" / EN: "Chapter") change with language.
    title: { ua: 'Vėlė', en: 'Vėlė' },
    series: { ua: 'Відлуння I', en: 'Echo I' },
    intro: {
      ua: 'Те, що приходить раніше за того, хто його несе.',
      en: 'What arrives before the one who carries it.'
    },
    items: [
      {
        ua: {
          id: 'l1-ua-01',
          prompt: 'У четвертій книзі я приходжу раніше за того, хто мене несе. Я можу бути внутрішньо величезним, поки залишаюсь зовні тонким. Мене чують раніше, ніж торкаються. Що я?',
          chapter: 'Vėlė · Розділ 1 · Київ',
          hint: 'те, що чують раніше, ніж торкаються',
          // RED HERRINGS: extra misleading words shown on demand. Each one
          // nudges the solver toward a surface answer ('звук', 'подих',
          // 'шепіт') instead of the deep one ('голос'). The book canon
          // distinguishes voice from sound: voice carries identity, sound
          // is just vibration.
          redHerrings: ['вібрація', 'хвиля', 'vibration']
        },
        en: {
          id: 'l1-en-01',
          prompt: 'In the fourth book I arrive before the one who carries me. I can be internally enormous while remaining externally thin. I am heard before I am touched. What am I?',
          chapter: 'Vėlė · Chapter 1 · Kyiv',
          hint: 'heard before touched',
          redHerrings: ['vibration', 'wave', 'resonance']
        }
      },
      {
        ua: {
          id: 'l1-ua-02',
          prompt: 'Дівчина в четвертій книзі прокидається в місті під тінню війни. Це місто — не тло, а інструмент. Один з його чотирьох інструментів починається на "з". Що це?',
          chapter: 'Vėlė · Розділ 1',
          hint: 'затримка · перехоплення · підсилення · незавершене прибуття',
          redHerrings: ['зал', 'запах', 'hall', 'smell']
        },
        en: {
          id: 'l1-en-02',
          prompt: 'The woman in the fourth book wakes in a city under war-shadow. The city is an instrument, not a backdrop. One of its four instruments starts with "d". What is it?',
          chapter: 'Vėlė · Chapter 1',
          hint: 'delay · interception · amplification · unfinished arrival',
          redHerrings: ['door', 'distance', 'dome']
        }
      },
      {
        ua: {
          id: 'l1-ua-03',
          prompt: 'Дівчина в четвертій книзі прокидається в місті під тінню війни. Назви це місто одним словом.',
          chapter: 'Vėlė · Розділ 1',
          hint: 'місто, назване в одному слові',
          redHerrings: ['Україна', 'Україна', 'Ukraine']
        },
        en: {
          id: 'l1-en-03',
          prompt: 'The woman in the fourth book wakes in a city under war-shadow. Name the city in one word.',
          chapter: 'Vėlė · Chapter 1',
          hint: 'the city, named in one word',
          redHerrings: ['Ukraine', 'country', 'east']
        }
      },
      {
        ua: {
          id: 'l1-ua-04',
          prompt: 'Šviesa починається з того, чого не чутно. Литовською це одне слово. Що це?',
          chapter: 'Šviesa · Розділ 1',
          hint: 'перед першим звуком',
          redHerrings: ['світло', 'промінь', 'light', 'ray']
        },
        en: {
          id: 'l1-en-04',
          prompt: 'Šviesa begins with what cannot be heard. In Lithuanian, one word. What is it?',
          chapter: 'Šviesa · Chapter 1',
          hint: 'before the first sound',
          redHerrings: ['light', 'ray', 'світло', 'промінь']
        }
      },
      {
        ua: {
          id: 'l1-ua-05',
          prompt: 'Vėlė — ім\'я, що кличе те, чого вже нема. Це те, що не має тіла, але є. Литовською.',
          chapter: 'Vėlė · Розділ 1',
          hint: 'те, що маєш, але не торкаєшся',
          redHerrings: ['душа', 'привид', 'soul', 'ghost']
        },
        en: {
          id: 'l1-en-05',
          prompt: 'Vėlė is the name for what has no body, but is. In Lithuanian, one word.',
          chapter: 'Vėlė · Chapter 1',
          hint: 'what you have but do not touch',
          redHerrings: ['soul', 'ghost', 'душа', 'привид']
        }
      }
    ]
  },
  2: {
    title: { ua: 'Anteros', en: 'Anteros' },
    series: { ua: 'Відлуння II', en: 'Echo II' },
    intro: {
      ua: 'Хто ти — ворог, союзник, чи система?',
      en: 'Who are you — enemy, ally, or system?'
    },
    items: [
      {
        ua: {
          id: 'l2-ua-01',
          prompt: 'Я не можу витримати всередині себе зв\'язок, занадто точний без мого посередництва. Моя ворожнеча — не театр. Без своєї осі я не зникаю, але стаю тоншим, тихішим, самотнішим. Хто я?',
          chapter: 'Anteros · Серія 1',
          hint: 'публічний шар містики · відповідь — одне знакомісце',
          redHerrings: ['любов', 'кохання', 'love']
        },
        en: {
          id: 'l2-en-01',
          prompt: 'I cannot tolerate within myself a bond too exact, too autonomous, too proportioned without my mediation. My hostility is principled, not theatrical. Without my axis I do not vanish, but become thinner, quieter, lonelier. Who am I?',
          chapter: 'Anteros · Series 1',
          hint: 'the public mystery layer · one character',
          redHerrings: ['love', 'eros', 'passion']
        }
      },
      {
        ua: {
          id: 'l2-ua-02',
          prompt: 'Я не мстива, не холодна. Я люблю. Чого я боюся — то це того, що взаємність вимагатиме від любові стати конкретною, відповідальною, обмеженою, парною, зобов\'язаною. Хто я?',
          chapter: 'Anteros · Серія 1',
          hint: 'протилежність А.',
          redHerrings: ['ніжність', 'пристрасть', 'tenderness', 'passion']
        },
        en: {
          id: 'l2-en-02',
          prompt: 'I am not cold, not merely narcissistic. I love. What I fear is what reciprocity asks love to become: concrete, answerable, bounded, pair-shaped, obligated. Who am I?',
          chapter: 'Anteros · Series 1',
          hint: 'counterpart of A.',
          redHerrings: ['tenderness', 'passion', 'desire']
        }
      },
      {
        ua: {
          id: 'l2-ua-03',
          prompt: 'Я не зникаю без своєї осі, але стаю тоншим, тихішим, самотнішим. Моя найглибша жестикуляція — прохання: поміть мене, не дайте мені зникнути поруч із тим, на що я відповідаю. Хто я?',
          chapter: 'Anteros · Серія 1',
          hint: 'ім\'я того, хто відповідає',
          redHerrings: ['дитина', 'син', 'child', 'son', 'відповідь']
        },
        en: {
          id: 'l2-en-03',
          prompt: 'A. resists names. A. resists exactness. A. also resists one thing in Šviesa. What is the third thing A. resists?',
          chapter: 'Aušra · Chapter 1',
          hint: 'the third resistance of A.',
          redHerrings: ['silence', 'stillness', 'тиша', 'спокій']
        }
      },
      {
        ua: {
          id: 'l2-ua-04',
          prompt: 'Eros дивиться на те, що є. Anteros — на те, чого нема. Хто я?',
          chapter: 'Anteros · Книга 1',
          hint: 'те, на що вказує А.',
          redHerrings: ['кохання', 'потяг', 'love', 'tug']
        },
        en: {
          id: 'l2-en-04',
          prompt: 'Eros looks at what is. Anteros — at what is not. Who am I?',
          chapter: 'Anteros · Book 1',
          hint: 'what A. points to',
          redHerrings: ['love', 'tug', 'кохання', 'потяг']
        }
      },
      {
        ua: {
          id: 'l2-ua-05',
          prompt: 'Я — перша асиметрія повноти. Šviesa мене не витримує. Литовською це одне слово. Що я?',
          chapter: 'Anteros · Книга 1',
          hint: 'між двома, що мають бути разом',
          redHerrings: ['любов', 'кохання', 'love', 'tug']
        },
        en: {
          id: 'l2-en-05',
          prompt: 'I am the first asymmetry of fullness. Šviesa cannot endure me. In Lithuanian, one word. What am I?',
          chapter: 'Anteros · Book 1',
          hint: 'between two who must be together',
          redHerrings: ['love', 'tug', 'любов', 'кохання']
        }
      }
    ]
  },
  3: {
    title: { ua: 'Šviesa · Dausos', en: 'Šviesa · Dausos' },
    series: { ua: 'Відлуння III', en: 'Echo III' },
    intro: {
      ua: 'Те, що починає світ, не вибухом.',
      en: 'What begins the world, not by explosion.'
    },
    items: [
      {
        ua: {
          id: 'l3-ua-01',
          prompt: 'Я не вибух. Я не удар. Я — найлегший порушник спокою з усіх можливих світів. Колись мене назвали першою онтологічною силою повноти, що перестала збігатися із собою. Що я?',
          chapter: 'Šviesa · Розділ 1',
          hint: 'початок світу, не вибух',
          redHerrings: ['вибух', 'Big Bang', 'вибух']
        },
        en: {
          id: 'l3-en-01',
          prompt: 'I am not an explosion. I am not an impact. I am the gentlest disturbance in all possible worlds. Once I was named the first ontological pressure of fullness ceasing to coincide with itself. What am I?',
          chapter: 'Šviesa · Chapter 1',
          hint: 'the beginning of the world, not by explosion',
          redHerrings: ['explosion', 'big bang', 'noise']
        }
      },
      {
        ua: {
          id: 'l3-ua-02',
          prompt: 'Я не приватна власність. Я стаю дисциплінованим спільним надбанням значущості. Я — форма справедливості між часовими шарами "я". Що я?',
          chapter: 'Dausos · Розділ 1',
          hint: 'між шарами "я"',
          redHerrings: ['час', 'time', 'шар', 'layer']
        },
        en: {
          id: 'l3-en-02',
          prompt: 'I do not become private property. I become a disciplined commons of significance. I am a form of justice between temporal layers of the self. What am I?',
          chapter: 'Dausos · Chapter 1',
          hint: 'between the layers of "I"',
          redHerrings: ['time', 'layer', 'archive']
        }
      },
      {
        ua: {
          id: 'l3-ua-03',
          prompt: 'Я — не один з об\'єктів усередині серії. Я — закон правдивої координації між багатьма її світами. Я не повертаюсь до попередньої форми. Що я?',
          chapter: 'Dausos · Розділ 2',
          hint: 'що залишається після першої форми',
          redHerrings: ['відповідь', 'answer', 'закон', 'law']
        },
        en: {
          id: 'l3-en-03',
          prompt: 'I am not one more object inside the series. I am the law of truthful coordination across its many worlds. I do not return to my first proportion. What am I?',
          chapter: 'Dausos · Chapter 2',
          hint: 'what remains after the first proportion',
          redHerrings: ['answer', 'law', 'echo']
        }
      },
      {
        ua: {
          id: 'l3-ua-04',
          prompt: 'У Dausos мене пам\'ятають тоді, коли забувають. Литовською — одне слово. Що я?',
          chapter: 'Dausos · Розділ 3',
          hint: 'те, що губиться при називанні',
          redHerrings: ['спомин', 'відгомін', 'memory', 'echo']
        },
        en: {
          id: 'l3-en-04',
          prompt: 'In Dausos I am remembered only when forgotten. In Lithuanian — one word. What am I?',
          chapter: 'Dausos · Chapter 3',
          hint: 'what is lost in the naming',
          redHerrings: ['memory', 'echo', 'спомин', 'відгомін']
        }
      },
      {
        ua: {
          id: 'l3-ua-05',
          prompt: 'Šviesa кличе мене, але я приходжу у Vėlė. Литовською — одне слово. Що я?',
          chapter: 'Šviesa · Розділ 4',
          hint: 'те, що не сказано',
          redHerrings: ['відповідь', 'розгадка', 'answer', 'solution']
        },
        en: {
          id: 'l3-en-05',
          prompt: 'Šviesa calls me, but I arrive in Vėlė. In Lithuanian — one word. What am I?',
          chapter: 'Šviesa · Chapter 4',
          hint: 'what is not said',
          redHerrings: ['answer', 'solution', 'відповідь', 'розгадка']
        }
      }
    ]
  }
};

// ---- Hashed accepted answers (deep / surface) ----------------------------
// SHA-256(normalize(answer)).hex — see api/_gen_hash.js to add new ones.
// `deep` counts as solved; `surface` returns a "closer" hint.

const HASHED_ANSWERS = {
  'l1-ua-01': {
    deep: ['45684330785e57712cb74f7766fb773f55cc27e8d2b3cfd2e551616772cc6eb2', 'c57d7e92019708b614c90fa3685cd644f543a60153fb99ec9b67c381a245fb2a'],
    surface: ['fd5cac5630dddd7c7c802cb7b8be2d794559f79641e5e329678e16e2dce0d073', '13692e0882fef6d08f12ceb7e9588c6f1c2cb8831a903b9f37a96d29f77fa29c', 'dd29442deca69f52c50006b831cb216edf78a7da33748f0a80ff19f2ebe57ecd', '367a1c592458c1b0ab948e37f993feeda943b0a03b70ee6633c51beb78de8ed8', 'a4f98b8adbd2f4188311a0debe028fba5e625fd8511442cc884e0c8c564f0abb', 'ba7955598f2007bc8cee7329ece0f63ee59f2dbb40d59ad17aadfee76b1092ae']
  },
  'l1-en-01': {
    deep: ['c57d7e92019708b614c90fa3685cd644f543a60153fb99ec9b67c381a245fb2a'],
    surface: ['dd29442deca69f52c50006b831cb216edf78a7da33748f0a80ff19f2ebe57ecd', '367a1c592458c1b0ab948e37f993feeda943b0a03b70ee6633c51beb78de8ed8', 'ba7955598f2007bc8cee7329ece0f63ee59f2dbb40d59ad17aadfee76b1092ae', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d']
  },
  'l1-ua-02': {
    deep: ['014ecc90cdd85e598eb0845098672460e4579051282ee8dd3aa4c0575bcfdcae'],
    surface: ['cb164d718a1539ca93c37762921cb6477a89ce980343f2249f1113120f87eece', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d', 'f7a8fa6e8b9eabd4fefc30f6f1906424f2d4c0cbfdd4181163278b798962945a', '5770493b3670f93e56295092b9a8bc504b2873de16c4316837e59f60eb6e8125', '0bb09d80600eec3eb9d7793a6f859bedde2a2d83899b70bd78e961ed674b32f4', '265f550427038ad9782715a69a77cfb0fd33c51ab73d4c8ba9684759b8fef938', '6210c0bf05396716df932f0729df69de0533933e5ad9871fd07b61811c4c28df']
  },
  'l1-en-02': {
    deep: ['6e16db102267e6e7de7f08f9c28836861561b6ac5a9aec0d26e263c37267f54e'],
    surface: ['092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d', '0bb09d80600eec3eb9d7793a6f859bedde2a2d83899b70bd78e961ed674b32f4', '6210c0bf05396716df932f0729df69de0533933e5ad9871fd07b61811c4c28df', '54d5dbf0124e59afba31626db737667cba02fa73560691be0cdb0e7cab9b1fc7', '3fdb7e873db12844fd1c1064932fe36f39148927c31fdac71a09695c7bb157be']
  },
  'l1-ua-03': {
    deep: ['e574b8438a7d7344c26cabcf5f8cb99a133aa0b00524d8a988f3d968289b3a51'],
    surface: ['2758b6f2f672de2449c133cf0ed6a1bff386dc1803f10e53e646e89834e57848', '622f3b3d4c637d1a95b42c0a0df13df496663b6b58d60d643fb7557a0d0ccb41', '11a62c23412b77477a71481aa2dc7323bcc61d076c8449076c4c58a8356c1bb1', 'bd08022e8fb80701512cd13c5f36b2ee06065bcde73329f41423dbd086c27281']
  },
  'l1-en-03': {
    deep: ['a55f0487a136e099bc3e59643494cd39031f4a96e8570277a4d5bb9f6a32b259'],
    surface: ['11a62c23412b77477a71481aa2dc7323bcc61d076c8449076c4c58a8356c1bb1', 'bd08022e8fb80701512cd13c5f36b2ee06065bcde73329f41423dbd086c27281', '4007848811fc570115980cc1ba4a67637bf05b0da56e7cc40063b55528ea7dcd']
  },
  'l2-ua-01': {
    deep: ['823c4eb3e895adc925a755d89cea1c6c46954c999d23604e0091788b75496159', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'],
    surface: ['1b8a3cfd4ff3ec924ae695ac55ea5ddb017ed226098c1031c0235d24ebbd14d7', '0a9651c4c5a5e300281afc2eef44dfe08b5a85e798d7c681320578bfcae07d00', '39ca526aca58f977a22752c79a088897aa6cebf9e27470c1658749d899cdd99a', '6610cc55246908a68b83fd56d0b36411fc28559d85b90f7e30b9f0e21b86a730', 'c5cffb9e60232cdf6f395101a5987dcb1b5df343397604bfeca92cba411c784f']
  },
  'l2-en-01': {
    deep: ['ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'],
    surface: ['0a9651c4c5a5e300281afc2eef44dfe08b5a85e798d7c681320578bfcae07d00', '6610cc55246908a68b83fd56d0b36411fc28559d85b90f7e30b9f0e21b86a730', '7692c3ad3540bb803c020b3aee66cd8887123234ea0c6e7143c0add73ff431ed']
  },
  'l2-ua-02': {
    deep: ['d6ba355a99fe53d2317bb15c3d91b2332f51914e394f9ed7a6d6969eb0dbd922', '0741d778caf60eb3f7654af5c4db499d9e411bf943e946f63c5f290d01963054'],
    surface: ['6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', 'b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', '1b8a3cfd4ff3ec924ae695ac55ea5ddb017ed226098c1031c0235d24ebbd14d7', '1d77012a68d475d9ad0b213dbc69949a52c18f1acc608d4320cb0e37c7e97e78']
  },
  'l2-en-02': {
    deep: ['0741d778caf60eb3f7654af5c4db499d9e411bf943e946f63c5f290d01963054'],
    surface: ['686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', '0a9651c4c5a5e300281afc2eef44dfe08b5a85e798d7c681320578bfcae07d00']
  },
  'l2-ua-03': {
    deep: ['1b8a3cfd4ff3ec924ae695ac55ea5ddb017ed226098c1031c0235d24ebbd14d7', '0a9651c4c5a5e300281afc2eef44dfe08b5a85e798d7c681320578bfcae07d00'],
    surface: ['cd0c15c27bbb0a701209bc65b7f71efaefb16bc44b84fbd2a0dffc5dd5e077b6', '0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', '915d6932bd5b234ea47dda45daebfd44c214969813383b3c68c421d639a43902', 'ddc9e669194254cef019a29d3619a2c16592e5d52e1a81e98b01bd52319149a3', '2e4d189f2ee190d8f5a5ec02a10a0e2f79fd0dc441c3e9d2f4bc5cd7ba5657d7', '98aa6675482552881925fe70d82559692d811b3bcd33f53b9a702c24d5322696']
  },
  'l2-en-03': {
    deep: ['0a9651c4c5a5e300281afc2eef44dfe08b5a85e798d7c681320578bfcae07d00'],
    surface: ['0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', 'ddc9e669194254cef019a29d3619a2c16592e5d52e1a81e98b01bd52319149a3', '98aa6675482552881925fe70d82559692d811b3bcd33f53b9a702c24d5322696', 'a9f4b3d22a523fdada41c85c175425bcd15b32b4cd0f54d9433accd52d7195a1']
  },
  'l3-ua-01': {
    deep: ['a41427d3994d5296a535d6d97693a04c2978b2138d440619aa3cf371b2381a8a', '5acbfff1b086e0f920c5857527976199018afe0cbf16e28d42c7eb9c683508e5'],
    surface: ['b6c69f98cb5752537e9cbd412872779ff748df49fe5c56b1b1a05baa227d7717', '83ffe96a1061597023eb4c8658105e6237b61d6abfbb413cff0276996e91022e', '032725c7e4a37e3adeb874d3b953f673897ef41b60e4f4992daee834d9857e67', '2f5d76c20123e6568fa98b6a5adc5516e64e8e5394b16bf1cb07f69f48ef0cb3', '530ebf184d94867f44e4e3c98d796e6698652e37aa3148b66ac0cddcb56b0ea2', 'e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b', '54d3880f6c82b83bcd51f86d979e228f08eb4cbbb05418dca1be6c86c2832c25']
  },
  'l3-en-01': {
    deep: ['5acbfff1b086e0f920c5857527976199018afe0cbf16e28d42c7eb9c683508e5'],
    surface: ['83ffe96a1061597023eb4c8658105e6237b61d6abfbb413cff0276996e91022e', '2f5d76c20123e6568fa98b6a5adc5516e64e8e5394b16bf1cb07f69f48ef0cb3', 'e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b']
  },
  'l3-ua-02': {
    deep: ['c495af67eae4196604cf14fc522198b8bc842134c330c4f0a24df88fa428e187', '63e0c823d3774068bfe2ade4116201501a19ebdd1e15e0a98127858304b3d03b', 'c064fbca9d9de8dd9bb0624984403b28d0da807a69365d4f7fb09123ecb0c405'],
    surface: ['70986eb703d74a81ba6f1caecf97450e4cbc6d9ef5664a4b06982353c1ed87c7', 'dac1d7cfa95021764849fd102524e141488c5e3a90f861dbb5a12d9ac8584f85', '9b21f5cf014c9efb35110dcccf3a74eab7fb903d1ca2f4054b3dad9ffabb7727', '06c604b332b386b6cce8355ccf27fffd3a98b7a7a5b9b3a550c039c6ebae38e4', '3b717961ddfdfb919640a578d8ddb5b267fe8ece1b63aba1a1d98a589c07c7e8', '336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e', '6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131']
  },
  'l3-en-02': {
    deep: ['c064fbca9d9de8dd9bb0624984403b28d0da807a69365d4f7fb09123ecb0c405'],
    surface: ['dac1d7cfa95021764849fd102524e141488c5e3a90f861dbb5a12d9ac8584f85', '06c604b332b386b6cce8355ccf27fffd3a98b7a7a5b9b3a550c039c6ebae38e4', '336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131']
  },
  'l3-ua-03': {
    deep: ['6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', 'b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2'],
    surface: ['cd0c15c27bbb0a701209bc65b7f71efaefb16bc44b84fbd2a0dffc5dd5e077b6', '0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', 'cb164d718a1539ca93c37762921cb6477a89ce980343f2249f1113120f87eece', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d', '4b5bdecd1314d10f4e7a7dba1fd69a104d3720510c59f8e156b45f9571dcb380', '8f1f74adf65864c86d3d471ea8ca9e329d4282489edc156c99604264090774bf', 'f58940a313992e6838ac3fc1f2356916cf8b53c42920a3f59cabc510f1236ec9']
  },
  'l3-en-03': {
    deep: ['686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131'],
    surface: ['0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d', '8f1f74adf65864c86d3d471ea8ca9e329d4282489edc156c99604264090774bf', 'f58940a313992e6838ac3fc1f2356916cf8b53c42920a3f59cabc510f1236ec9', '40b149bf4da1c2ad94b531e3ef41a48025b72ee1055a6e69ded73eaf625f2074']
  },
  // v10.1: 6 new riddles (L1-04/05, L2-04/05, L3-04/05) with canon-deep
  // (Lithuanian) and surface (common) answer layers.
  'l1-ua-04': {
    deep: ['530ebf184d94867f44e4e3c98d796e6698652e37aa3148b66ac0cddcb56b0ea2', '60375cf20abc591333f5f5e6eb596080279b23f5586932da2e2d05ee12cd2d0d', '54d3880f6c82b83bcd51f86d979e228f08eb4cbbb05418dca1be6c86c2832c25', 'e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b'],
    surface: ['4cadd51462c6068081c4f20672559297fe594dd8579534b803ae8b45e775bec7', '265f550427038ad9782715a69a77cfb0fd33c51ab73d4c8ba9684759b8fef938', 'fc95cad4da251f0b294d3dc11a4abf487ff8fa3558add02e1e7457066d9d053e', '6210c0bf05396716df932f0729df69de0533933e5ad9871fd07b61811c4c28df']
  },
  'l1-en-04': {
    deep: ['e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b', '60375cf20abc591333f5f5e6eb596080279b23f5586932da2e2d05ee12cd2d0d', '008f0747f4e27c8462baa991a538025bcc2dd143e78422f1afbdfcd9e757a20f', 'fc95cad4da251f0b294d3dc11a4abf487ff8fa3558add02e1e7457066d9d053e'],
    surface: ['2b4b2eadf7b2aece598d2f2ad4637361614a738a7cdf1a457d8b46db072184d5', 'c2e10c20bf46daf0ba03f725218b012544a3d0d3b37334eeb1d4d81e5406e478', '2e09d5210db8417757b0f875c276d0cb877b22514e9a3583d2d8d7445368a027', '6210c0bf05396716df932f0729df69de0533933e5ad9871fd07b61811c4c28df']
  },
  'l1-ua-05': {
    deep: ['bcb9eee0f9a230a07246591467927f909964d00bf1fd527d84d8f9b618f029b0', '07257531f67dd502c09e9c583654f11b9b7196e1aefdda3464e4e6dbd12b929a', '3d1263ce10f8d8106159119d8b28c06ab93a38a21911a7ab3180bdd4360aaa22', 'd1918f93a4ada5b6777c00bb3f692215eff9aacbe6b6857e42ec82830383a248'],
    surface: ['c29ae6a78463f9f21e022d63a0e79512ee32e68d06a60a20ff82c96efe5b4ca2', '5770493b3670f93e56295092b9a8bc504b2873de16c4316837e59f60eb6e8125', 'ead6ef03d61ee60c533d6d450c50a1e559a8a37f6b796a4094cd0dac6b744428', '0bb09d80600eec3eb9d7793a6f859bedde2a2d83899b70bd78e961ed674b32f4']
  },
  'l1-en-05': {
    deep: ['07257531f67dd502c09e9c583654f11b9b7196e1aefdda3464e4e6dbd12b929a', 'bcb9eee0f9a230a07246591467927f909964d00bf1fd527d84d8f9b618f029b0', 'ae0facccf0a3723adefbdfe700c097b6c843dbfd06e5cd325602ec13b2361f8b', 'a68999add325ba9952ddf20a853ab998393e4488b8229c0fb7fc9dbc5be26ae8'],
    surface: ['ead6ef03d61ee60c533d6d450c50a1e559a8a37f6b796a4094cd0dac6b744428', '0bb09d80600eec3eb9d7793a6f859bedde2a2d83899b70bd78e961ed674b32f4', '3d1263ce10f8d8106159119d8b28c06ab93a38a21911a7ab3180bdd4360aaa22', '5770493b3670f93e56295092b9a8bc504b2873de16c4316837e59f60eb6e8125']
  },
  'l2-ua-04': {
    deep: ['823c4eb3e895adc925a755d89cea1c6c46954c999d23604e0091788b75496159', '823c4eb3e895adc925a755d89cea1c6c46954c999d23604e0091788b75496159', '24b17f91cfb0eca9125019378f6b6e87641927590af178fbff010090b190b187', 'abb190c293cddae4f7c2c7c7b2aa229554cdaf66138a82d2fff4c6691e03f213'],
    surface: ['b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2', '5e79cdd04fe7e4e57f1c6483446d04d995375953bce52512d024a3988574ea13', '6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131']
  },
  'l2-en-04': {
    deep: ['ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '24b17f91cfb0eca9125019378f6b6e87641927590af178fbff010090b190b187', 'ae79db51521c7b09620120c74df02d7fe7fd2210eae835b43932fa067f25c0b4'],
    surface: ['686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', 'e6bbc6867045359448c8c73edf19c8a7f9b5dba5de1f7e6899214626cd5e03d8', 'b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2', '5e79cdd04fe7e4e57f1c6483446d04d995375953bce52512d024a3988574ea13']
  },
  'l2-ua-05': {
    deep: ['a8470f0a7a7f4b5db845bb2c5bf52a63a93b877966294402d38731471ab0f9b6', '9e3a6b183cc6a86ba86f42f5adedd863f48aa41d283c474a7abebfd9759e43c0', 'a8470f0a7a7f4b5db845bb2c5bf52a63a93b877966294402d38731471ab0f9b6', 'b6ae4c5a0614d0ff81916dd804985e5c62b59c61f01080f2a207ecc96f022fa3', 'd31f4d5cd0af85602b3eb53d3f4862410fe7b8d0a1556f67a1ad088bcbe0322f', 'f21dea74d898cfeaf836ecc99ad0331bade09711ff927365e91ada2ff4cb5caf'],
    surface: ['6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', 'b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2', '686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', 'e6bbc6867045359448c8c73edf19c8a7f9b5dba5de1f7e6899214626cd5e03d8']
  },
  'l2-en-05': {
    deep: ['f21dea74d898cfeaf836ecc99ad0331bade09711ff927365e91ada2ff4cb5caf', 'b6ae4c5a0614d0ff81916dd804985e5c62b59c61f01080f2a207ecc96f022fa3', 'd31f4d5cd0af85602b3eb53d3f4862410fe7b8d0a1556f67a1ad088bcbe0322f', 'b38d9d168c3aedf156f4f249b81adaef4b738790510573f57b502cca0c35f16f'],
    surface: ['686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131', 'e6bbc6867045359448c8c73edf19c8a7f9b5dba5de1f7e6899214626cd5e03d8', '6d0a272932351cd7ec0c7ebce6f47d670c698416ecc317dd89ee016fb0562bb8', 'b3e1153dea52e265c6dd254c96bc3cdfb72994ec6380ce03bf258afb0b0868f2']
  },
  'l3-ua-04': {
    deep: ['2ebbbeeb43dddfcb6f142ee890d5a41e818687de651a403433f022f07badcea5', '2ebbbeeb43dddfcb6f142ee890d5a41e818687de651a403433f022f07badcea5', 'dce6664f9b871f0a329ba77fe64ff93a56094f029f2637fbb223d240fe22bda5', '2fb4c726daacc43a36ff4db0e4788df8999810528a79c661227d4640f7b18371', '82a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce89'],
    surface: ['e9cecebc499e5ac0f24ee88b98ffcb0421ec50a818cb5dff9f31adad8054cb46', '3bb07a4487e23ba5d911461c696c6c64706a2d855c893cfe25c75cbfc14e6df9', 'c064fbca9d9de8dd9bb0624984403b28d0da807a69365d4f7fb09123ecb0c405', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d']
  },
  'l3-en-04': {
    deep: ['82a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce89', '2fb4c726daacc43a36ff4db0e4788df8999810528a79c661227d4640f7b18371', '88465a3277d40a412c39d2e23739ca1456bc97a51256a069910d7edcc80c1787'],
    surface: ['c064fbca9d9de8dd9bb0624984403b28d0da807a69365d4f7fb09123ecb0c405', '092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d', 'e9cecebc499e5ac0f24ee88b98ffcb0421ec50a818cb5dff9f31adad8054cb46', '3bb07a4487e23ba5d911461c696c6c64706a2d855c893cfe25c75cbfc14e6df9']
  },
  'l3-ua-05': {
    deep: ['530ebf184d94867f44e4e3c98d796e6698652e37aa3148b66ac0cddcb56b0ea2', '60375cf20abc591333f5f5e6eb596080279b23f5586932da2e2d05ee12cd2d0d', '54d3880f6c82b83bcd51f86d979e228f08eb4cbbb05418dca1be6c86c2832c25', 'e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b'],
    surface: ['cd0c15c27bbb0a701209bc65b7f71efaefb16bc44b84fbd2a0dffc5dd5e077b6', '236046c0954b96c283fce8c17c85025f55c72fef8a7103f6904dd15c7e19d019', '0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', '8270f2824111e04d9278c01a92b388147d9d02e0b50d946d25d00db375ff1282']
  },
  'l3-en-05': {
    deep: ['e6c18fdbe59783dfefef3595cd288bcb7ce912d36854b5e8faaef31235d9031b', '60375cf20abc591333f5f5e6eb596080279b23f5586932da2e2d05ee12cd2d0d', 'fc95cad4da251f0b294d3dc11a4abf487ff8fa3558add02e1e7457066d9d053e'],
    surface: ['0db52f4076c082518412afd3dd3576e2cb0c63703fd7fed5e23ade60efef31d9', '8270f2824111e04d9278c01a92b388147d9d02e0b50d946d25d00db375ff1282', 'cd0c15c27bbb0a701209bc65b7f71efaefb16bc44b84fbd2a0dffc5dd5e077b6', '236046c0954b96c283fce8c17c85025f55c72fef8a7103f6904dd15c7e19d019']
  }
};

// ---- Helpers --------------------------------------------------------------

function currentWeekIndex() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[\.\u2026,!?;:\u2014\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function hash(s) {
  return crypto.createHash('sha256').update(normalize(s)).digest('hex');
}

function getItem(level, lang, weekIdx) {
  const lvl = RIDDLES[level];
  if (!lvl) return null;
  const item = lvl.items[weekIdx % lvl.items.length];
  const localized = item[lang] || item.ua;
  const get = (obj) => (obj && (obj[lang] || obj.ua)) || '';
  return {
    id: localized.id,
    level: Number(level),
    title: get(lvl.title),
    series: get(lvl.series),
    chapter: localized.chapter || '',
    hint: localized.hint || '',
    redHerrings: localized.redHerrings || [],
    prompt: localized.prompt,
    intro: get(lvl.intro),
    weekIndex: weekIdx,
    rotationSize: lvl.items.length
  };
}

// Returns 'deep' | 'surface' | 'wrong'. Never throws on missing riddleId.
function classifyAnswer(riddleId, answer) {
  const sets = HASHED_ANSWERS[riddleId];
  if (!sets) return 'wrong';
  const h = hash(answer);
  if (!h) return 'wrong';
  if (sets.deep.includes(h)) return 'deep';
  if (sets.surface.includes(h)) return 'surface';
  return 'wrong';
}

async function incrementSolveCount(riddleId, kind) {
  // kind: 'public' (default) | 'internal' (creator/author)
  const prefix = kind === 'internal' ? 'klife:riddle:solve:internal:' : 'klife:riddle:solve:';
  const key = `${prefix}${riddleId}`;
  return await kv.incr(key);
}

async function getSolveCount(riddleId, kind) {
  const prefix = kind === 'internal' ? 'klife:riddle:solve:internal:' : 'klife:riddle:solve:';
  const key = `${prefix}${riddleId}`;
  const n = await kv.get(key);
  return typeof n === 'number' ? n : (parseInt(n, 10) || 0);
}

async function incrementSkipCount(riddleId) {
  const key = `klife:riddle:skip:${riddleId}`;
  return await kv.incr(key);
}

// ---- HTTP handler ---------------------------------------------------------

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Author-Key, X-Riddle-Token');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method === 'GET') {
      // Sub-route: ?counts=1&riddleId=... — read solve counter from KV
      if (req.query.counts === '1' || req.query.counts === 'true') {
        const id = req.query.riddleId || '';
        if (!id) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ ok: false, error: 'missing_riddleId' }));
        }
        const n = await getSolveCount(id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: true, riddleId: id, solveCount: n }));
      }

      // Sub-route: ?counts=all — read counters for all known riddles
      if (req.query.counts === 'all') {
        const all = {};
        for (const lvl of Object.values(RIDDLES)) {
          for (const item of lvl.items) {
            for (const lang of ['ua', 'en']) {
              const loc = item[lang];
              if (!loc) continue;
              all[loc.id] = await getSolveCount(loc.id);
            }
          }
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: true, counts: all }));
      }

      // Main: weekly active riddle for a level
      const level = Number(req.query.level || 1);
      const lang = req.query.lang === 'en' ? 'en' : 'ua';
      if (!RIDDLES[level]) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'no_such_level' }));
      }
      const item = getItem(level, lang, currentWeekIndex());
      const solveCount = await getSolveCount(item.id);
      const attemptState = await limits.getAttemptState(req, item.id);
      const ep = epoch.resolveEpoch();
      const letter = epoch.letterForWeek(ep.epochIndex, ep.weekInEpoch, lang);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: true, ...item,
        solveCount,
        solveCountPersistent: kv.isPersistent(),
        attemptsLeft: attemptState.attemptsLeft,
        locked: attemptState.locked,
        maxAttempts: attemptState.maxWrong,
        epoch: {
          start: epoch.EPOCH_START_ISO,
          globalWeek: ep.globalWeek,
          epochIndex: ep.epochIndex,
          weekInEpoch: ep.weekInEpoch,
          book: ep.epoch && ep.epoch.book,
          preStart: ep.preStart,
          letterIndex: ep.weekInEpoch,
          letterOnDeep: letter ? letter.char : null,
          sentenceStatus: letter ? letter.status : null
        }
      }));
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
      const skipPinInput = body.skipPin || '';

      if (!RIDDLES[level]) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'bad_level' }));
      }

      const item = getItem(level, lang, currentWeekIndex());
      const riddleId = requestedId || item.id;

      // Author/creator mode: header X-Author-Key -> internal counter.
      // Constant-time compare against AUTHOR_KEY env var.
      const authorHeader = req.headers['x-author-key'] || req.headers['X-Author-Key'];
      const isAuthor = auth.isAuthorSession(req) || auth.isAuthorKey(authorHeader);

      // Skip PIN: matches RIDDLE_SKIP_PIN -> verdict 'skipped' (no counter,
      // no wrong attempts, but we still log it for stats).
      if (auth.isSkipPin(skipPinInput)) {
        const skipCount = await incrementSkipCount(riddleId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          ok: 'skipped',
          level,
          riddleId,
          currentRiddle: item,
          solveCount: await getSolveCount(riddleId),
          internalSolveCount: isAuthor ? await getSolveCount(riddleId, 'internal') : null,
          skipCount
        }));
      }

      if (!isAuthor) {
        const pre = await limits.getAttemptState(req, riddleId);
        if (pre.locked) {
          const fullHint = (item && (item.chapter || '')) +
            (item && item.hint ? ' · ' + item.hint : '');
          res.statusCode = 429;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            ok: 'locked',
            level,
            riddleId,
            currentRiddle: item,
            hint: fullHint,
            attemptsLeft: 0,
            locked: true,
            maxAttempts: pre.maxWrong,
            solveCount: await getSolveCount(riddleId)
          }));
        }
      }

      const verdict = classifyAnswer(riddleId, answer);

      // On 'deep': increment KV counter (public OR internal, not both).
      // 'surface' and 'wrong' don't count.
      let solveCount = null;
      let internalSolveCount = null;
      let attemptMeta = await limits.getAttemptState(req, riddleId);
      if (verdict === 'deep') {
        if (!isAuthor) await limits.clearWrong(req, riddleId);
        if (isAuthor) {
          internalSolveCount = await incrementSolveCount(riddleId, 'internal');
          solveCount = await getSolveCount(riddleId);
        } else {
          solveCount = await incrementSolveCount(riddleId);
        }
      } else if (verdict === 'wrong' && !isAuthor) {
        attemptMeta = await limits.recordWrong(req, riddleId);
        solveCount = await getSolveCount(riddleId);
        if (isAuthor) internalSolveCount = await getSolveCount(riddleId, 'internal');
      } else {
        solveCount = await getSolveCount(riddleId);
        if (isAuthor) internalSolveCount = await getSolveCount(riddleId, 'internal');
      }

      // Build the hint payload. The "fullHint" is what the user sees
      // when they want to know more. For 'surface', we expose one
      // additional red herring to nudge them deeper.
      const fullHint = (verdict === 'deep') ? undefined : (
        (item && (item.chapter || '')) +
        (item && item.hint ? ' · ' + item.hint : '') +
        (verdict === 'surface' && item && item.redHerrings && item.redHerrings.length
          ? ' · ще: ' + item.redHerrings.join(' · ')
          : '')
      );

      const ep = epoch.resolveEpoch();
      const letter = verdict === 'deep'
        ? epoch.letterForWeek(ep.epochIndex, ep.weekInEpoch, lang)
        : null;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: verdict,                 // 'deep' | 'surface' | 'wrong'
        level,
        riddleId,
        currentRiddle: item,
        hint: fullHint,
        solveCount,
        internalSolveCount,
        authorMode: isAuthor,
        attemptsLeft: attemptMeta.attemptsLeft,
        locked: attemptMeta.locked,
        maxAttempts: attemptMeta.maxWrong,
        epoch: {
          globalWeek: ep.globalWeek,
          epochIndex: ep.epochIndex,
          weekInEpoch: ep.weekInEpoch,
          book: ep.epoch && ep.epoch.book,
          letter: letter ? {
            index: letter.index,
            char: letter.char,
            display: letter.display,
            status: letter.status
          } : null
        }
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
