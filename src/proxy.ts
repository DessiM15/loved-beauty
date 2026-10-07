import { NextResponse, type NextRequest } from "next/server";

/**
 * The launch gate. With COMING_SOON=on, every visitor sees the coming-soon
 * page at "/" and every other store URL sends them back there. Anyone who
 * opens any URL with ?preview=<COMING_SOON_KEY> gets a cookie that opens the
 * whole store for 60 days; ?preview=off hands the cookie back.
 *
 * Open to everyone while the gate is up: /coming-soon itself, the API
 * (signups and Shopify webhooks) and every file with an extension (the film,
 * images, sitemap, robots, the options page).
 */
const COOKIE = "lb-preview";
const OPEN_PREFIXES = ["/coming-soon", "/api/"];

export function proxy(req: NextRequest) {
  if (process.env.COMING_SOON !== "on") return NextResponse.next();
  const key = process.env.COMING_SOON_KEY ?? "";
  const { pathname, searchParams } = req.nextUrl;

  const preview = searchParams.get("preview");
  if (preview !== null) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("preview");
    const res = NextResponse.redirect(clean);
    if (key && preview === key) {
      res.cookies.set(COOKIE, key, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 60 });
    } else if (preview === "off") {
      res.cookies.delete(COOKIE);
    }
    return res;
  }

  if (key && req.cookies.get(COOKIE)?.value === key) return NextResponse.next();
  if (OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`))) return NextResponse.next();
  if (pathname === "/") return NextResponse.rewrite(new URL("/coming-soon", req.url));
  return NextResponse.redirect(new URL("/", req.url), 307);
}

export const config = {
  // Skip Next's own files and anything with a file extension.
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
