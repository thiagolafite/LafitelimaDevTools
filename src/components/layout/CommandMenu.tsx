"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileJson,
  Network,
  KeyRound,
  Binary,
  Hash,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SupportedLanguage, siteConfig } from "@/config/site";
import { toolsRegistry, ToolDefinition } from "@/config/tools.config";
import { logSearchQuery } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

const iconMap = {
  FileJson,
  Network,
  KeyRound,
  Binary,
  Hash,
};

export function CommandMenu({ isOpen, onClose, lang }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  // Filter tools based on query across both languages
  const filteredTools = toolsRegistry.filter((tool) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const currentLocale = tool.locales[lang];
    const enLocale = tool.locales.en;
    const ptLocale = tool.locales.pt;

    const matchesName =
      currentLocale.name.toLowerCase().includes(q) ||
      enLocale.name.toLowerCase().includes(q) ||
      ptLocale.name.toLowerCase().includes(q);

    const matchesDesc =
      currentLocale.shortDescription.toLowerCase().includes(q) ||
      enLocale.shortDescription.toLowerCase().includes(q) ||
      ptLocale.shortDescription.toLowerCase().includes(q);

    const matchesKeywords =
      currentLocale.keywords.some((k) => k.toLowerCase().includes(q)) ||
      enLocale.keywords.some((k) => k.toLowerCase().includes(q)) ||
      ptLocale.keywords.some((k) => k.toLowerCase().includes(q));

    const matchesCategory = tool.category.toLowerCase().includes(q);

    return matchesName || matchesDesc || matchesKeywords || matchesCategory;
  });

  // Track search query with telemetry on enter or selection
  const handleSelect = (tool: ToolDefinition) => {
    logSearchQuery(query || tool.locales[lang].name, filteredTools.length, lang);
    onClose();
    router.push(`/${lang}/tools/${tool.slugs[lang]}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredTools.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      logSearchQuery(query, filteredTools.length, lang);
      if (filteredTools.length > 0 && filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const t = siteConfig.translations[lang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3 bg-muted/20">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredTools.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <p>{lang === "pt" ? "Nenhuma ferramenta encontrada para:" : "No tools found for:"}</p>
              <p className="font-mono text-primary mt-1 font-semibold">&ldquo;{query}&rdquo;</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {lang === "pt" ? "Essa busca foi registrada para inclusão em futuras atualizações!" : "This query was logged for our roadmap!"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTools.map((tool, idx) => {
                const IconComponent = iconMap[tool.iconName] || Sparkles;
                const isSelected = idx === selectedIndex;
                const locale = tool.locales[lang];

                return (
                  <div
                    key={tool.id}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg p-3 text-left transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md border",
                          isSelected
                            ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                            : "border-border bg-muted text-foreground"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-none">
                          {locale.name}
                        </div>
                        <div
                          className={cn(
                            "mt-1 text-xs line-clamp-1",
                            isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {locale.shortDescription}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider",
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {tool.category}
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-3.5 w-3.5",
                          isSelected
                            ? "text-primary-foreground"
                            : "text-muted-foreground opacity-50"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 bg-muted/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="rounded border border-border bg-card px-1 font-mono">↑</kbd>
            <kbd className="rounded border border-border bg-card px-1 font-mono">↓</kbd>
            <span>Select:</span>
            <kbd className="rounded border border-border bg-card px-1 font-mono">Enter</kbd>
          </div>
          <div>
            <kbd className="rounded border border-border bg-card px-1 font-mono">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
