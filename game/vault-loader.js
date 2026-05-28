/** Load vault: classic script tags in HTML first, then fetch+run if AdBlock blocked scripts. */
const VAULT_URLS = ["./vault.js", "./klife-vault.js", "./vault.bundle.js"];
const V = "20260528h";

function runVaultSource(code) {
  if (!code || !code.includes("KLifeVault")) {
    throw new Error("invalid_vault_source");
  }
  const el = document.createElement("script");
  el.textContent = code;
  document.head.append(el);
  el.remove();
}

export async function loadVault() {
  if (window.KLifeVault) return;

  for (const base of VAULT_URLS) {
    const url = `${base}?v=${encodeURIComponent(V)}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const code = await res.text();
      runVaultSource(code);
      if (window.KLifeVault) return;
    } catch {
      /* try next */
    }
  }

  await loadVaultViaScriptTag();
  if (window.KLifeVault) return;

  throw new Error("vault_unavailable");
}

function loadVaultViaScriptTag() {
  return new Promise((resolve, reject) => {
    let i = 0;
    function next() {
      if (window.KLifeVault) {
        resolve();
        return;
      }
      if (i >= VAULT_URLS.length) {
        reject(new Error("vault_script_tags_failed"));
        return;
      }
      const src = `${VAULT_URLS[i++]}?v=${encodeURIComponent(V)}`;
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => (window.KLifeVault ? resolve() : next());
      s.onerror = () => next();
      document.head.append(s);
    }
    next();
  });
}
