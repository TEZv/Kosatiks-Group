// Vercel Function: /api/prophecy (Node.js runtime, req/res)
//
// GET /api/prophecy?lang=ua   -> { ok, text, idx, count }
//
// Returns a random poetic one-liner from the KOSATIK prophecy pool.
// Used by the floating crystal-ball widget on the page. The pool is
// curated short sayings from the Anteros canon — no answers, no
// riddles, just atmospheric lines that match the page's mood.
//
// STARTER POOL: 5 per language. Expand as desired.

const POOL = {
  ua: [
    'Відлуння не шукає джерела — воно вже там, де було.',
    'Те, що приходить раніше за тебе, не поспішає. Воно вже прийшло.',
    'А. не витримує точності. Це і є любов, яку ти знаєш.',
    'Між шарами «я» живе той, хто не просив, щоб його шукали.',
    'Перша асиметрія повноти — це не образ. Це натяк на тебе.'
  ],
  en: [
    'Echo does not seek its source — it is already where it was.',
    'What arrives before you is not in a hurry. It has already arrived.',
    'A. cannot endure exactness. That is the love you know.',
    'Between the layers of "I" lives the one who never asked to be found.',
    'The first asymmetry of fullness is not an image. It is a hint at you.'
  ]
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method !== 'GET') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
    }
    const lang = req.query.lang === 'en' ? 'en' : 'ua';
    const pool = POOL[lang] || POOL.ua;
    if (!pool.length) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: 'no_prophecies' }));
    }
    // Vary by minute to feel "live" without storing state.
    const seed = Math.floor(Date.now() / 60000);
    const idx = seed % pool.length;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      ok: true,
      text: pool[idx],
      idx,
      count: pool.length
    }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'server_error', message: String(err && err.message || err) }));
  }
};
