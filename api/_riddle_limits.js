// Server-side wrong-answer limits for /api/riddle (anti-bruteforce).
// Fingerprint = IP + optional X-Riddle-Token (browser UUID).

const crypto = require('crypto');
const kv = require('./_kv');

const MAX_WRONG = Number(process.env.RIDDLE_MAX_WRONG || 3);

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
  if (xf) return String(xf).split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? String(req.socket.remoteAddress) : 'unknown';
}

function fingerprint(req) {
  const ip = clientIp(req);
  const token = req.headers['x-riddle-token'] || req.headers['X-Riddle-Token'] || '';
  return crypto.createHash('sha256').update(`${ip}|${token}`).digest('hex').slice(0, 24);
}

function wrongKey(riddleId, fp) {
  return `klife:riddle:wrong:${riddleId}:${fp}`;
}

async function getWrongCount(riddleId, fp) {
  const n = await kv.get(wrongKey(riddleId, fp));
  return typeof n === 'number' ? n : (parseInt(n, 10) || 0);
}

async function getAttemptState(req, riddleId) {
  const fp = fingerprint(req);
  const used = await getWrongCount(riddleId, fp);
  const left = Math.max(0, MAX_WRONG - used);
  return {
    maxWrong: MAX_WRONG,
    wrongUsed: used,
    attemptsLeft: left,
    locked: used >= MAX_WRONG,
    fingerprint: fp
  };
}

async function recordWrong(req, riddleId) {
  const fp = fingerprint(req);
  const key = wrongKey(riddleId, fp);
  const used = await kv.incr(key);
  if (used === 1) await kv.expire(key, 8 * 24 * 60 * 60);
  const left = Math.max(0, MAX_WRONG - used);
  return {
    wrongUsed: used,
    attemptsLeft: left,
    locked: used >= MAX_WRONG
  };
}

async function clearWrong(req, riddleId) {
  const fp = fingerprint(req);
  await kv.set(wrongKey(riddleId, fp), 0);
}

module.exports = {
  MAX_WRONG,
  fingerprint,
  getAttemptState,
  recordWrong,
  clearWrong
};
