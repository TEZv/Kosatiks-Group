/**
 * game.kosatiks-group.pp.ua → /game/*
 * No npm dependency (package.json broke static deploy on Vercel).
 */
const GAME_HOST = "game.kosatiks-group.pp.ua";

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  if (host !== GAME_HOST) return;

  const url = new URL(request.url);
  const pathname =
    url.pathname === "/"
      ? "/game/index.html"
      : url.pathname.startsWith("/game")
        ? url.pathname
        : `/game${url.pathname}`;

  return new Response(null, {
    headers: {
      "x-middleware-rewrite": new URL(pathname, url).toString(),
    },
  });
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
