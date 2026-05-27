/** Tries several vault filenames (AdBlock often blocks *bundle*). */
export function loadVault() {
  if (window.KLifeVault) return Promise.resolve();
  const urls = ["./vault.js", "./klife-vault.js", "./vault.bundle.js"];
  const v = `?v=${encodeURIComponent("20260528e")}`;

  return new Promise((resolve, reject) => {
    let i = 0;
    function tryNext() {
      if (window.KLifeVault) {
        resolve();
        return;
      }
      if (i >= urls.length) {
        reject(new Error("vault_scripts_failed"));
        return;
      }
      const src = urls[i++] + v;
      const existing = document.querySelector(`script[data-vault-src="${src}"]`);
      if (existing) {
        if (window.KLifeVault) resolve();
        else tryNext();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.dataset.vaultSrc = src;
      s.onload = () => (window.KLifeVault ? resolve() : tryNext());
      s.onerror = () => tryNext();
      document.head.append(s);
    }
    tryNext();
  });
}
