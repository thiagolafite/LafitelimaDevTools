import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Zap, Code2 } from "lucide-react";
import { SupportedLanguage, siteConfig, getTranslations } from "@/config/site";
import { toolsRegistry } from "@/config/tools.config";

interface FooterProps {
  lang: SupportedLanguage;
}

export function Footer({ lang }: FooterProps) {
  const t = getTranslations(lang);
  const currentYear = new Date().getFullYear();
  const isPt = lang === "pt";

  return (
    <footer className="mt-auto border-t border-border bg-card/60 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand & Privacy Statement */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight">
                lafitelimadev<span className="text-primary">.tools</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              {t.siteDescription}
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Client-Side Web Crypto & In-Memory Execution</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero Server Storage / LGPD & GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Ultra Low-Latency Static Architecture</span>
              </div>
            </div>
          </div>

          {/* Categorized Tools Columns */}
          {siteConfig.categories.slice(0, 2).map((category) => {
            const categoryTools = toolsRegistry.filter(
              (tool) => tool.category === category.id
            );
            const catName = category.name[lang] || category.name.en;
            return (
              <div key={category.id}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {catName}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {categoryTools.map((tool) => {
                    const toolLocale = tool.locales[lang] || tool.locales.en;
                    const toolSlug = tool.slugs[lang] || tool.slugs.en;
                    return (
                      <li key={tool.id}>
                        <Link
                          href={`/${lang}/tools/${toolSlug}`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                        >
                          {toolLocale.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Institutional & Legal Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isPt ? "Institucional & Legal" : "Company & Legal"}
            </h3>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  {isPt ? "Sobre Nós" : "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  {isPt ? "Política de Privacidade" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  {isPt ? "Termos de Uso" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  {isPt ? "Contato & Suporte" : "Contact & Support"}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[11px] font-mono text-muted-foreground/60 hover:text-foreground"
                >
                  Admin Telemetry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row text-xs text-muted-foreground">
          <p>© {currentYear} lafitelimadev.tools. {t.footerRights}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/en"
              className={lang === "en" ? "font-bold text-foreground" : "hover:text-foreground"}
            >
              English (US)
            </Link>
            <span>•</span>
            <Link
              href="/pt"
              className={lang === "pt" ? "font-bold text-foreground" : "hover:text-foreground"}
            >
              Português (BR)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
