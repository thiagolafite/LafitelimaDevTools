import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "pt"];
const DEFAULT_LOCALE = "pt";

// Map of English tool slugs to redirect directly to /en/tools/...
const EN_TOOL_SLUGS = [
  "json-formatter",
  "subnet-calculator",
  "password-generator",
  "base64-tool",
  "hash-generator",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip paths that don't need localization
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/apple-icon.svg" ||
    pathname === "/ads.txt" ||
    pathname.includes(".") // Static files like .png, .jpg, .svg, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Check if the path already starts with a supported locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. Handle root path
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 4. Intelligent redirect for tool routes without locale
  if (pathname.startsWith("/tools/")) {
    const slug = pathname.replace("/tools/", "").replace(/\/$/, "");
    const targetLocale = EN_TOOL_SLUGS.includes(slug) ? "en" : "pt";
    const url = request.nextUrl.clone();
    url.pathname = `/${targetLocale}/tools/${slug}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 5. Redirect all other unmatched routes to default locale /pt/...
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url, { status: 308 });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.svg|apple-icon.svg).*)",
  ],
};
