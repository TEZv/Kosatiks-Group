/**
 * K Life OS subdomains → /k-life-os/*
 * No npm dependency (package.json broke static deploy on Vercel).
 */
const K_LIFE_OS_HOSTS = new Set([
  "k-life-os.kosatiks-group.pp.ua",
  "game.kosatiks-group.pp.ua",
]);
const APP_ROOT = "/k-life-os";

export default function middleware(request) {
  const host = (request.headers.get("host") || "").replace(/:\d+$/, "");
  if (!K_LIFE_OS_HOSTS.has(host)) return;

  const url = new URL(request.url);
  const pathname =
    url.pathname === "/"
      ? `${APP_ROOT}/index.html`
      : url.pathname.startsWith(APP_ROOT)
        ? url.pathname
        : `${APP_ROOT}${url.pathname}`;

  return new Response(null, {
    headers: {
      "x-middleware-rewrite": new URL(pathname, url).toString(),
    },
  });
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
