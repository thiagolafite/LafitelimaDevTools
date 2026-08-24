"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Share2,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  BookOpen,
  Lock,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SupportedLanguage, siteConfig, getTranslations } from "@/config/site";
import { ToolLocaleData } from "@/config/tools.config";
import { AdBanner } from "@/components/shared/AdBanner";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  toolLocale: ToolLocaleData;
  lang: SupportedLanguage;
  category: string;
  onClear?: () => void;
  onCopyAll?: () => void;
  children: React.ReactNode;
  actionsSlot?: React.ReactNode;
}

export function ToolLayout({
  toolLocale,
  lang,
  category,
  onClear,
  onCopyAll,
  children,
  actionsSlot,
}: ToolLayoutProps) {
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const [copiedLink, setCopiedLink] = useState(false);
  const t = getTranslations(lang);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success(t.shareToast);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const matchedCat = siteConfig.categories.find((c) => c.id === category);
  const categoryName = matchedCat ? (matchedCat.name[lang] || matchedCat.name.en) : category;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground transition-colors font-medium">
          {lang === "pt" ? "Início" : "Home"}
        </Link>
        <span>/</span>
        <Link
          href={`/${lang}/categories/${category}`}
          className="hover:text-foreground capitalize transition-colors font-medium"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{toolLocale.name}</span>
      </nav>

      {/* Header Section */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.privacyBadge}</span>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center gap-2">
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-colors"
                title={t.clearButton}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.clearButton}</span>
              </button>
            )}

            {onCopyAll && (
              <button
                type="button"
                onClick={onCopyAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-colors"
                title={t.copyButton}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{t.copyButton}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-colors"
              title={t.shareButton}
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Shared</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{t.shareButton}</span>
                </>
              )}
            </button>

            {actionsSlot}
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {toolLocale.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {toolLocale.shortDescription}
        </p>
      </header>

      {/* Tool Main Interactive Workspace */}
      <main className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        {children}
      </main>

      {/* Primary Responsive AdBanner (Right below interactive tool) */}
      <AdBanner slot="in-content" />

      {/* Deep Explanatory Technical Guide ("How it Works") */}
      {toolLocale.howItWorks && (
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {toolLocale.howItWorks.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "pt" ? "Fundamentação técnica e casos práticos de engenharia" : "Technical architecture and practical engineering workflows"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {toolLocale.howItWorks.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {toolLocale.howItWorks.steps && toolLocale.howItWorks.steps.length > 0 && (
            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "pt" ? "Guia Passo a Passo" : "Step-by-Step Execution Guide"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {toolLocale.howItWorks.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/80 bg-muted/20 p-4 transition-all hover:bg-muted/40"
                  >
                    <span className="font-mono text-xs font-bold text-primary block mb-1">
                      {step.title}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Technical FAQ Accordion */}
      {toolLocale.faqs && toolLocale.faqs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {t.faqTitle}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === "pt" ? "Dúvidas técnicas e especificações sobre esta ferramenta" : "Frequently asked technical questions and specs"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {toolLocale.faqs.map((faq, idx) => {
              const isOpen = openFaqIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-colors shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/40 bg-muted/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Secondary Bottom AdBanner */}
      <AdBanner slot="footer-banner" />
    </div>
  );
}
