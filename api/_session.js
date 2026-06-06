// Signed HttpOnly session cookie for author wheel access.

const crypto = require('crypto');

const COOKIE_NAME = 'klife_author';
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

function secret() {
  return String(process.env.SESSION_SECRET || '');
}

function sign(payload) {
  const sec = secret();
  if (!sec) return null;
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', sec).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  const sec = secret();
  if (!sec || !token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac('sha256', sec).update(body).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const raw = req.headers.cookie || req.headers.Cookie || '';
  const out = {};
  String(raw).split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function readSession(req) {
  const cookies = parseCookies(req);
  return verify(cookies[COOKIE_NAME]);
}

function setSessionCookie(res, email) {
  const token = sign({
    author: true,
    email: String(email || '').toLowerCase(),
    exp: Date.now() + MAX_AGE_SEC * 1000
  });
  if (!token) return false;
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SEC}`
  ];
  res.setHeader('Set-Cookie', parts.join('; '));
  return true;
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

module.exports = {
  COOKIE_NAME,
  readSession,
  setSessionCookie,
  clearSessionCookie
};
