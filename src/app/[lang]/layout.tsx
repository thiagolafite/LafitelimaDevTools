"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SupportedLanguage } from "@/config/site";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { ClientToaster } from "@/components/layout/ClientToaster";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { trackPageView, logTelemetryError } from "@/lib/telemetry";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: SupportedLanguage };
}) {
  const lang = params?.lang || "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Track pageviews
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  // Global unhandled error listener for telemetry
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      logTelemetryError("unhandled", event.message || "Unknown error", undefined, "high", event.error?.stack);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logTelemetryError("runtime", `Promise rejection: ${event.reason}`, undefined, "medium");
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Register Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar lang={lang} onOpenSearch={() => setIsSearchOpen(true)} />
        <div className="flex-1">{children}</div>
        <Footer lang={lang} />
        <CommandMenu
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          lang={lang}
        />
        <CookieConsent lang={lang} />
        <ClientToaster />
      </div>
    </ThemeProvider>
  );
}
