// Vercel KV helper with in-memory fallback for local dev / pre-KV-setup testing.
//
// Usage:
//   const kv = require('./_kv');
//   await kv.incr('klife:riddle:solve:l1-ua-01');   // atomic increment
//   const n = await kv.get('klife:riddle:solve:l1-ua-01');
//
// In production (after Oksana creates a KV store in Vercel dashboard, the
// env vars KV_REST_API_URL and KV_REST_API_TOKEN are auto-set), this uses
// @vercel/kv. In dev / pre-setup, it uses a per-instance Map. The fallback
// is good enough for a test phase — counters reset on cold start, but
// the architecture is in place for the real KV swap.
//
// IMPORTANT: This file is server-only. Vercel functions source is not in
// the public bundle, but the file IS in the GitHub repo. Keep it free of
// secrets, prompts, or riddle answers.

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

let _kvClient = null;
async function getClient() {
  if (!HAS_KV) return null;
  if (_kvClient) return _kvClient;
  // Lazy require so the package is only loaded when KV env vars are set.
  // Avoids a cold-start penalty in dev where KV isn't configured.
  const { kv } = require('@vercel/kv');
  _kvClient = kv;
  return _kvClient;
}

// In-memory fallback (test phase). Per-instance; resets on cold start.
const _mem = (globalThis.__klifeKVMem ||= new Map());

module.exports = {
  isPersistent() { return HAS_KV; },

  async get(key) {
    const client = await getClient();
    if (client) return await client.get(key);
    return _mem.has(key) ? _mem.get(key) : null;
  },

  async set(key, value, opts) {
    const client = await getClient();
    if (client) {
      // @vercel/kv set accepts { ex: ttlSeconds } for TTL
      if (opts && opts.ex) return await client.set(key, value, { ex: opts.ex });
      return await client.set(key, value);
    }
    _mem.set(key, value);
    return 'OK';
  },

  async incr(key) {
    const client = await getClient();
    if (client) return await client.incr(key);
    const next = (_mem.get(key) || 0) + 1;
    _mem.set(key, next);
    return next;
  },

  async expire(key, seconds) {
    const client = await getClient();
    if (client) return await client.expire(key, seconds);
    // No-op for in-memory; the Map entry persists until cold start anyway.
    return 0;
  }
};
