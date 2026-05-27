import { rewrite } from "@vercel/functions";

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

  return rewrite(new URL(pathname, url));
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
