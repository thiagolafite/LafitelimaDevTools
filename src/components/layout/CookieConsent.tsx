"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { SupportedLanguage } from "@/config/site";

interface CookieConsentProps {
  lang: SupportedLanguage;
}

const STORAGE_KEY = "lafitelimadev_cookie_consent";

export function CookieConsent({ lang }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: true, ads: true, timestamp: new Date().toISOString() }));
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: false, ads: false, timestamp: new Date().toISOString() }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const t = {
    pt: {
      title: "Respeito à sua Privacidade e Conformidade LGPD/GDPR",
      desc: "O lafitelimadev.tools executa 100% das ferramentas diretamente na memória do seu navegador. Utilizamos cookies estritamente necessários e tecnologias padrão de anúncios (Google AdSense) e telemetria anônima para manter a plataforma gratuita.",
      acceptAll: "Aceitar Todos",
      essentialOnly: "Apenas Essenciais",
      privacyLink: "Política de Privacidade",
    },
    en: {
      title: "Privacy First & GDPR/LGPD Compliance",
      desc: "lafitelimadev.tools processes 100% of utilities directly in your local browser memory. We use essential cookies and standard advertising technologies (Google AdSense) to keep this engineering portal free for everyone.",
      acceptAll: "Accept All",
      essentialOnly: "Essential Only",
      privacyLink: "Privacy Policy",
    },
  }[lang];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-slide-down">
      <div className="rounded-2xl border-2 border-primary/20 bg-background/95 p-5 shadow-2xl backdrop-blur-md dark:bg-card/95 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                {t.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.desc}{" "}
                <Link
                  href={`/${lang}/privacy`}
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {t.privacyLink}
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={handleAcceptEssential}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full sm:w-auto"
            >
              {t.essentialOnly}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
