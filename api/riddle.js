// Vercel Function: /api/riddle (Node.js runtime, req/res)
//
// GET  /api/riddle?level=1&lang=ua   -> { id, prompt, hint }
// POST /api/riddle { level, answer, lang } -> { ok, level, hint? }
//
// Anwers live in data/riddles.json (server-only). This file is read at
// cold-start. In dev/test Vercel caches the module, so changes to riddles.json
// require a redeploy (which is fine — riddles are hand-curated).

const path = require('path');
const fs = require('fs');

let RIDDLES = null;
function loadRiddles() {
  if (RIDDLES) return RIDDLES;
  const file = path.join(process.cwd(), 'data', 'riddles.json');
  RIDDLES = JSON.parse(fs.readFileSync(file, 'utf8'));
  return RIDDLES;
}

function langOf(req, body) {
  const q = (req.query && req.query.lang) || '';
  if (q === 'ua' || q === 'en') return q;
  const b = (body && body.lang) || '';
  if (b === 'ua' || b === 'en') return b;
  return 'ua';
}

function getPrompt(level, lang) {
  const R = loadRiddles();
  const lvl = R.levels[String(level)];
  if (!lvl) return null;
  const item = lvl[lang] || lvl.ua;
  return {
    id: item.id,
    level: Number(level),
    title: (lvl.title && (lvl.title[lang] || lvl.title.ua)) || '',
    prompt: item.prompt,
    hint: item.hint
  };
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[\.\u2026]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkAnswer(level, answer, lang) {
  const R = loadRiddles();
  const ans = R.answers[String(level)];
  if (!ans) return false;
  const list = ans[lang] || ans.ua || [];
  const norm = normalize(answer);
  if (!norm) return false;
  return list.some((a) => normalize(a) === norm);
}

module.exports = async function handler(req, res) {
  // CORS — only for k-life-os domain. Public POST is acceptable since
  // answers are public-spirit (curiosities), not secrets.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method === 'GET') {
      const level = req.query.level || '1';
      const lang = langOf(req, null);
      const item = getPrompt(level, lang);
      if (!item) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'no_such_level' }));
      }
      const R = loadRiddles();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: true,
        level: item.level,
        id: item.id,
        title: item.title,
        prompt: item.prompt,
        hint: item.hint,
        intro: R.intro[lang] || R.intro.ua
      }));
    }

    if (req.method === 'POST') {
      // Body may be parsed already (Vercel) or a string (older runtimes).
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};
      const level = Number(body.level || 1);
      const lang = langOf(req, body);
      const answer = body.answer || '';

      if (!Number.isInteger(level) || level < 1 || level > 3) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'bad_level' }));
      }

      const ok = checkAnswer(level, answer, lang);
      const item = getPrompt(level, lang);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok,
        level,
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
