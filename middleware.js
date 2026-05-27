/**
 * game.kosatiks-group.pp.ua → /game/*
 * Root index.html wins over vercel.json rewrites on static deploys; middleware runs first.
 */
export default function middleware(request) {
  const host = request.headers.get("host") || "";
  if (host !== "game.kosatiks-group.pp.ua") return;

  const url = new URL(request.url);
  let { pathname } = url;

  if (!pathname.startsWith("/game")) {
    pathname = pathname === "/" ? "/game/index.html" : `/game${pathname}`;
  }

  return Response.rewrite(new URL(pathname, url));
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
