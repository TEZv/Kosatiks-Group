// Shared authentication helpers for /api endpoints.
//
// Three independent credentials, all read from Vercel env vars:
//   - HUB_PIN         (default 'lovejjj') — main gate to the hub
//   - RIDDLE_SKIP_PIN (default 'lovej')   — bypass a single riddle
//   - AUTHOR_KEY      (no default,        — header-based author/creator mode
//                       returns false if unset)
//
// All comparisons are constant-time to prevent timing attacks.
//
// Future: this file is the extension point for algorithmic passwords
// (Caesar cipher, device-specific, session-rotating). For now it just
// returns simple equality. The interface is stable.

const crypto = require('crypto');

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function hubPin() {
  return String(process.env.HUB_PIN || 'lovejjj');
}

function skipPin() {
  return String(process.env.RIDDLE_SKIP_PIN || 'lovej');
}

function authorKey() {
  const k = process.env.AUTHOR_KEY;
  return k ? String(k) : null;
}

function isHubPin(input) {
  if (!input) return false;
  return constantTimeEqual(String(input), hubPin());
}

function isSkipPin(input) {
  if (!input) return false;
  return constantTimeEqual(String(input), skipPin());
}

function isAuthorKey(input) {
  const expected = authorKey();
  if (!expected) return false;
  if (!input) return false;
  return constantTimeEqual(String(input), expected);
}

// Strip the answer of any leading/trailing whitespace before checking
// against riddle answers; but for PINs we keep exact match (PIN = exact).
function isSkipPinLoose(input) {
  // Accept with/without trailing whitespace
  return isSkipPin(String(input || '').trim());
}

module.exports = {
  hubPin,
  skipPin,
  authorKey,
  isHubPin,
  isSkipPin,
  isSkipPinLoose,
  isAuthorKey,
  constantTimeEqual
};
