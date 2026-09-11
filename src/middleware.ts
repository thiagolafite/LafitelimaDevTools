import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "pt"];
const DEFAULT_LOCALE = "pt";

// Tool slug map for direct shortcuts and locale routing
const SHORT_TOOL_REDIRECTS: Record<string, { lang: string; slug: string }> = {
  // English Slugs
  "json-formatter": { lang: "en", slug: "json-formatter" },
  "subnet-calculator": { lang: "en", slug: "subnet-calculator" },
  "password-generator": { lang: "en", slug: "password-generator" },
  "base64-tool": { lang: "en", slug: "base64-tool" },
  "hash-generator": { lang: "en", slug: "hash-generator" },
  "curl-converter": { lang: "en", slug: "curl-converter" },
  "markdown-preview": { lang: "en", slug: "markdown-preview" },

  // Portuguese Slugs
  "formatador-json": { lang: "pt", slug: "formatador-json" },
  "calculadora-sub-rede": { lang: "pt", slug: "calculadora-sub-rede" },
  "gerador-de-senhas": { lang: "pt", slug: "gerador-de-senhas" },
  "conversor-base64": { lang: "pt", slug: "conversor-base64" },
  "gerador-de-hash": { lang: "pt", slug: "gerador-de-hash" },
  "conversor-curl": { lang: "pt", slug: "conversor-curl" },
  "visualizador-markdown": { lang: "pt", slug: "visualizador-markdown" },

  // Shared Slugs (default to pt)
  cron: { lang: "pt", slug: "cron" },
  regex: { lang: "pt", slug: "regex" },
  timestamp: { lang: "pt", slug: "timestamp" },
};

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

  // 4. Intelligent redirect for /tools/... routes without locale
  if (pathname.startsWith("/tools/")) {
    const slug = pathname.replace("/tools/", "").replace(/\/$/, "");
    const mapping = SHORT_TOOL_REDIRECTS[slug];
    const targetLocale = mapping ? mapping.lang : DEFAULT_LOCALE;
    const targetSlug = mapping ? mapping.slug : slug;
    const url = request.nextUrl.clone();
    url.pathname = `/${targetLocale}/tools/${targetSlug}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 5. Direct short routes (e.g. /cron, /regex, /timestamp, /curl-converter, etc.)
  const cleanPath = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (SHORT_TOOL_REDIRECTS[cleanPath]) {
    const target = SHORT_TOOL_REDIRECTS[cleanPath];
    const url = request.nextUrl.clone();
    url.pathname = `/${target.lang}/tools/${target.slug}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 6. Categories without locale
  if (pathname.startsWith("/categories/")) {
    const cat = pathname.replace("/categories/", "").replace(/\/$/, "");
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/categories/${cat}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 7. Redirect all other unmatched routes to default locale /pt/...
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ads.txt|icon.svg|apple-icon.svg).*)",
  ],
};
