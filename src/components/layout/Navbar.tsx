"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Moon,
  Sun,
  Laptop,
  Languages,
  Wrench,
  ChevronDown,
  Menu,
  X,
  Code2,
} from "lucide-react";
import { SupportedLanguage, siteConfig, getTranslations } from "@/config/site";
import { getToolBySlug } from "@/config/tools.config";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang: SupportedLanguage;
  onOpenSearch: () => void;
}

export function Navbar({ lang, onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = getTranslations(lang);

  // Calculate alternate language path for the current page
  const getAlternatePath = (targetLang: SupportedLanguage): string => {
    if (!pathname) return `/${targetLang}`;

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0 || (segments.length === 1 && (segments[0] === "en" || segments[0] === "pt"))) {
      return `/${targetLang}`;
    }

    if (segments.length >= 2 && (segments[1] === "about" || segments[1] === "privacy" || segments[1] === "terms" || segments[1] === "contact")) {
      return `/${targetLang}/${segments[1]}`;
    }

    if (segments.length >= 3 && segments[1] === "categories") {
      const category = segments[2];
      return `/${targetLang}/categories/${category}`;
    }

    if (segments.length >= 3 && segments[1] === "tools") {
      const currentSlug = segments[2];
      const match = getToolBySlug(currentSlug);
      if (match) {
        const targetSlug = match.tool.slugs[targetLang];
        return `/${targetLang}/tools/${targetSlug}`;
      }
    }

    return `/${targetLang}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black leading-none tracking-tight">
                lafitelimadev<span className="text-primary">.tools</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight mt-0.5">
                100% Client-Side
              </span>
            </div>
          </Link>

          {/* Desktop Categories Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.categories.map((cat) => {
              const href = `/${lang}/categories/${cat.id}`;
              const isActive = pathname?.startsWith(href) || false;
              const catName = cat.name[lang] || cat.name.en;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {catName}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions (Search, Language, Theme, Mobile toggle) */}
        <div className="flex items-center gap-2">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={t.searchPlaceholder}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline-block pr-2">{t.searchPlaceholder}</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              {lang === "pt" ? "Ctrl K" : "⌘ K"}
            </kbd>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              aria-label="Select Language"
            >
              <Languages className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-1.5 w-32 rounded-lg border border-border bg-card p-1 shadow-lg animate-fade-in">
                  <Link
                    href={getAlternatePath("en")}
                    onClick={() => setIsLangMenuOpen(false)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      lang === "en"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>English</span>
                    <span className="text-[10px] opacity-75">EN</span>
                  </Link>
                  <Link
                    href={getAlternatePath("pt")}
                    onClick={() => setIsLangMenuOpen(false)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      lang === "pt"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>Português</span>
                    <span className="text-[10px] opacity-75">PT-BR</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {isThemeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsThemeMenuOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-1.5 w-32 rounded-lg border border-border bg-card p-1 shadow-lg animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme("light");
                      setIsThemeMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      theme === "light"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      theme === "dark"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme("system");
                      setIsThemeMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      theme === "system"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Laptop className="h-3.5 w-3.5" />
                    <span>System</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground md:hidden hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="border-b border-border bg-card px-4 py-3 md:hidden animate-slide-down space-y-3">
          <div className="space-y-1">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t.categoriesTitle}
            </p>
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${lang}/categories/${cat.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {cat.name[lang] || cat.name.en}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-2 space-y-1">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {lang === "pt" ? "Institucional" : "Company"}
            </p>
            <Link
              href={`/${lang}/about`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {lang === "pt" ? "Sobre Nós" : "About Us"}
            </Link>
            <Link
              href={`/${lang}/privacy`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {lang === "pt" ? "Privacidade" : "Privacy Policy"}
            </Link>
            <Link
              href={`/${lang}/terms`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {lang === "pt" ? "Termos de Uso" : "Terms"}
            </Link>
            <Link
              href={`/${lang}/contact`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {lang === "pt" ? "Contato" : "Contact"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
