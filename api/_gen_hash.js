// Hashing helper for riddle answers. Run this to generate hashes for new
// answers you want to add to api/riddle.js.
//
// Usage: node api/_gen_hash.js "your answer"
//
// Output: a single line with the SHA-256 hex of normalize(answer).
//
// The compare side is in api/riddle.js — it hashes the user's input with
// the same normalize() and compares to the stored hashes. This keeps
// accepted answers out of the source tree: even if someone clones the
// public repo, they only see hashes, not the words.

const crypto = require('crypto');

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

const input = process.argv.slice(2).join(' ');
if (!input) {
  console.error('Usage: node _gen_hash.js "<answer>"');
  process.exit(1);
}
console.log(hash(input));
