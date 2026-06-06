// Vercel Function: /api/daily (Node.js runtime, req/res)
//
// GET  /api/daily?lang=ua   -> { ok, id, level, prompt, dayIndex, rotationSize }
// POST /api/daily { answer, lang, riddleId? }
//                            -> { ok: 'deep'|'surface'|'wrong', riddleId, hint, solveCount }
//
// Daily micro-riddles are GLOBAL (not per-level) — one riddle per day,
// rotates through a pool of single-sentence koans/flashes. Designed for
// casual engagement: no big modal, no penalty for wrong, no hints.
//
// STARTER POOL: 3 entries × 2 langs = 6 riddles. Expand the pool to
// 7+ per language for a full week without repetition. The data lives
// here (server-only, never in the public bundle) so it can be curated
// by editing this file and committing — or moved to Vercel KV later
// for hot updates without deploys.

const crypto = require('crypto');
const kv = require('./_kv');
const auth = require('./_auth');

function currentDayIndex() {
  // Day index since epoch — daily micro-riddles rotate each calendar day.
  return Math.floor(Date.now() / (24 * 60 * 60 * 1000));
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

// ---- Daily micro-riddle pool (server-only) -------------------------------
// Each entry is a single sentence with one (or several) acceptable
// "deep" answers. No hints, no chapters, no red herrings — pure koan.

const DAILY = {
  ua: [
    {
      id: 'd-ua-01',
      prompt: 'Я там, де А. не витримує точності. Що я?',
      // deep hashes
      deep: [
        hash('зв\'язок'),
        hash('звязок'),
        hash('connection'),
        hash('любов'),
        hash('кохання'),
        hash('love'),
        hash('ерос'),
        hash('eros')
      ],
      // hint shown on 'surface' or 'wrong' — one short nudge
      surfaceHint: 'між двома, що стають одним'
    },
    {
      id: 'd-ua-02',
      prompt: 'Я — відлуння без джерела. Що я?',
      deep: [
        hash('пам\'ять'),
        hash('память'),
        hash('memory'),
        hash('спогад'),
        hash('memories')
      ],
      surfaceHint: 'тримає те, чого вже нема'
    },
    {
      id: 'd-ua-03',
      prompt: 'Без мене А. не існує. Зі мною — не витримує. Що я?',
      deep: [
        hash('зв\'язок'),
        hash('connection'),
        hash('bond'),
        hash('міст'),
        hash('bridge')
      ],
      surfaceHint: 'те, що тримає дві сторони разом'
    }
  ],
  en: [
    {
      id: 'd-en-01',
      prompt: 'I am where A. cannot endure exactness. What am I?',
      deep: [
        hash('connection'),
        hash('love'),
        hash('eros'),
        hash('bond')
      ],
      surfaceHint: 'between two becoming one'
    },
    {
      id: 'd-en-02',
      prompt: 'I am an echo without a source. What am I?',
      deep: [
        hash('memory'),
        hash('memories'),
        hash('remembrance')
      ],
      surfaceHint: 'holds what is no longer here'
    },
    {
      id: 'd-en-03',
      prompt: 'Without me A. does not exist. With me — A. cannot endure. What am I?',
      deep: [
        hash('connection'),
        hash('bond'),
        hash('bridge')
      ],
      surfaceHint: 'what holds two sides together'
    }
  ]
};

function getDaily(lang, dayIdx) {
  const pool = DAILY[lang] || DAILY.ua;
  if (!pool.length) return null;
  const item = pool[dayIdx % pool.length];
  return {
    id: item.id,
    level: 0, // 0 = daily (not part of the 3-level main cycle)
    prompt: item.prompt,
    dayIndex: dayIdx,
    rotationSize: pool.length
  };
}

function classifyDaily(riddleId, answer) {
  const item = [...DAILY.ua, ...DAILY.en].find((x) => x.id === riddleId);
  if (!item) return { verdict: 'wrong', surfaceHint: '' };
  const h = hash(answer);
  if (item.deep.includes(h)) return { verdict: 'deep', surfaceHint: item.surfaceHint || '' };
  return { verdict: 'wrong', surfaceHint: item.surfaceHint || '' };
}

async function incrementSolveCount(riddleId, kind) {
  const prefix = kind === 'internal' ? 'klife:daily:solve:internal:' : 'klife:daily:solve:';
  return await kv.incr(`${prefix}${riddleId}`);
}

async function getSolveCount(riddleId, kind) {
  const prefix = kind === 'internal' ? 'klife:daily:solve:internal:' : 'klife:daily:solve:';
  const n = await kv.get(`${prefix}${riddleId}`);
  return typeof n === 'number' ? n : (parseInt(n, 10) || 0);
}

async function incrementSkipCount(riddleId) {
  return await kv.incr(`klife:daily:skip:${riddleId}`);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Author-Key');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method === 'GET') {
      const lang = req.query.lang === 'en' ? 'en' : 'ua';
      const item = getDaily(lang, currentDayIndex());
      if (!item) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'no_dailies' }));
      }
      const solveCount = await getSolveCount(item.id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: true, ...item,
        solveCount,
        solveCountPersistent: kv.isPersistent()
      }));
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};
      const lang = body.lang === 'en' ? 'en' : 'ua';
      const answer = body.answer || '';
      const requestedId = body.riddleId || null;
      const skipPinInput = body.skipPin || '';
      const authorHeader = req.headers['x-author-key'] || req.headers['X-Author-Key'];
      const isAuthor = auth.isAuthorKey(authorHeader);
      const item = getDaily(lang, currentDayIndex());
      const riddleId = requestedId || (item && item.id);
      if (!riddleId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'no_daily' }));
      }
      if (auth.isSkipPin(skipPinInput)) {
        const skipCount = await incrementSkipCount(riddleId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          ok: 'skipped',
          riddleId,
          currentRiddle: item,
          solveCount: await getSolveCount(riddleId),
          internalSolveCount: isAuthor ? await getSolveCount(riddleId, 'internal') : null,
          skipCount
        }));
      }
      const { verdict, surfaceHint } = classifyDaily(riddleId, answer);
      let solveCount = null;
      let internalSolveCount = null;
      if (verdict === 'deep') {
        if (isAuthor) {
          internalSolveCount = await incrementSolveCount(riddleId, 'internal');
          solveCount = await getSolveCount(riddleId);
        } else {
          solveCount = await incrementSolveCount(riddleId);
        }
      } else {
        solveCount = await getSolveCount(riddleId);
        if (isAuthor) internalSolveCount = await getSolveCount(riddleId, 'internal');
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: verdict,
        riddleId,
        currentRiddle: item,
        hint: verdict === 'deep' ? undefined : surfaceHint,
        solveCount,
        internalSolveCount,
        authorMode: isAuthor
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
