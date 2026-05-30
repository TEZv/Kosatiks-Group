/**
 * game.kosatiks-group.pp.ua → /k-life-os/*
 * No npm dependency (package.json broke static deploy on Vercel).
 */
const GAME_HOST = "game.kosatiks-group.pp.ua";
const APP_ROOT = "/k-life-os";

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  if (host !== GAME_HOST) return;

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
