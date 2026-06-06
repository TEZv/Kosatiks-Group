// POST /api/auth/google { credential } — Google Identity Services id_token

const auth = require('../_auth');
const session = require('../_session');

function rejectMessage(lang) {
  if (lang === 'en') {
    return process.env.AUTHOR_REJECT_EN ||
      "No, no — you are not the ANTEROS author. I've counted you out.";
  }
  return process.env.AUTHOR_REJECT_UA ||
    'Ні-ні, ви не автор ANTEROS — я вас вирахувала.';
}

async function verifyGoogleCredential(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('google_not_configured');
  const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' +
    encodeURIComponent(String(credential || ''));
  const res = await fetch(url);
  if (!res.ok) throw new Error('invalid_token');
  const data = await res.json();
  if (data.aud !== clientId && data.azp !== clientId) throw new Error('audience_mismatch');
  if (data.email_verified !== 'true' && data.email_verified !== true) {
    throw new Error('email_not_verified');
  }
  return {
    email: String(data.email || '').toLowerCase(),
    name: data.name || ''
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};
  const lang = body.lang === 'en' ? 'en' : 'ua';

  try {
    if (!process.env.SESSION_SECRET) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: 'session_not_configured' }));
    }
    const profile = await verifyGoogleCredential(body.credential);
    if (!auth.isAuthorEmail(profile.email)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        ok: false,
        error: 'not_author',
        message: rejectMessage(lang)
      }));
    }
    if (!session.setSessionCookie(res, profile.email)) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: 'cookie_failed' }));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      ok: true,
      author: true,
      email: profile.email.replace(/(.{2}).+(@.+)/, '$1…$2')
    }));
  } catch (err) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      ok: false,
      error: String(err && err.message || 'auth_failed')
    }));
  }
};
