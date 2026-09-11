"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Search,
  Zap,
  Replace,
  HelpCircle,
  FileCode,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  executeRegex,
  REGEX_PRESETS,
  RegexExecutionResult,
} from "@/lib/calculators/regex";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface RegexTesterProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

const ALL_FLAGS = [
  { flag: "g", name: "global", desc: "Global search (all matches)" },
  { flag: "i", name: "case-insensitive", desc: "Ignore uppercase/lowercase" },
  { flag: "m", name: "multiline", desc: "^ and $ match line boundaries" },
  { flag: "s", name: "dotAll", desc: ". matches newlines as well" },
  { flag: "u", name: "unicode", desc: "Full Unicode support" },
];

export function RegexTester({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: RegexTesterProps) {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState(
    "Contact developer support at support@lafitelima.com.br or admin@company.org. You can also reach out to john.doe+test@gmail.com for feedback."
  );
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<RegexExecutionResult>(() =>
    executeRegex(pattern, flags, testText, replaceText)
  );

  const isPt = lang === "pt";

  useEffect(() => {
    const res = executeRegex(pattern, flags, testText, showReplace ? replaceText : undefined);
    setResult(res);
  }, [pattern, flags, testText, replaceText, showReplace]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  const handleCopyMatches = () => {
    if (result.matches.length === 0) return;
    const text = result.matches.map((m) => m.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(isPt ? "Resultados copiados!" : "Matches copied to clipboard!");
    logToolUsage("regex-tester", "copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPattern("");
    setTestText("");
    setReplaceText("");
    toast.info(isPt ? "Campos limpos!" : "Fields cleared!");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopyMatches);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Pattern & Flags Input Card */}
      <div className="rounded-2xl border-2 border-primary/20 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span>{isPt ? "Expressão Regular (RegExp)" : "Regular Expression"}</span>
          </label>

          {/* Quick Presets Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isPt ? "Exemplos rápidos:" : "Quick Presets:"}
            </span>
            <select
              onChange={(e) => {
                const preset = REGEX_PRESETS.find((p) => p.name.en === e.target.value);
                if (preset) {
                  setPattern(preset.pattern);
                  setFlags(preset.flags);
                  setTestText(preset.sampleText);
                  toast.success(
                    isPt
                      ? `Exemplo carregado: ${preset.name.pt}`
                      : `Preset loaded: ${preset.name.en}`
                  );
                }
              }}
              defaultValue=""
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="" disabled>
                {isPt ? "Selecione um exemplo pronto..." : "Select a quick preset..."}
              </option>
              {REGEX_PRESETS.map((p) => (
                <option key={p.name.en} value={p.name.en}>
                  {isPt ? p.name.pt : p.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pattern Input with Flags */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-border bg-background p-2 shadow-inner">
          <div className="flex flex-1 items-center gap-1.5 px-2">
            <span className="font-mono text-lg font-black text-muted-foreground">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="digite sua regex aqui (ex: [a-z]+)..."
              className="w-full bg-transparent font-mono text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden"
            />
            <span className="font-mono text-lg font-black text-muted-foreground">/</span>
          </div>

          {/* Flags Toggles */}
          <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-3">
            {ALL_FLAGS.map((f) => {
              const active = flags.includes(f.flag);
              return (
                <button
                  key={f.flag}
                  type="button"
                  onClick={() => toggleFlag(f.flag)}
                  title={f.desc}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {f.flag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Regex Error or Match Stats Banner */}
        {result.isValid ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">
                {result.matchCount === 1
                  ? isPt
                    ? "1 correspondência encontrada"
                    : "1 match found"
                  : isPt
                  ? `${result.matchCount} correspondências encontradas`
                  : `${result.matchCount} matches found`}
              </span>
            </div>
            <span className="text-[11px] opacity-75 font-mono">
              {result.executionTimeMs} ms
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive">
            ⚠️ {result.error}
          </div>
        )}
      </div>

      {/* Test Area and Live Highlighter */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Input Text & Live Highlighting */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span>{isPt ? "Texto de Teste" : "Test String"}</span>
            </label>
            <button
              type="button"
              onClick={() => setShowReplace(!showReplace)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all",
                showReplace
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Replace className="h-3.5 w-3.5" />
              <span>{isPt ? "Substituição (Replace)" : "Replace Mode"}</span>
            </button>
          </div>

          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={6}
            placeholder={isPt ? "Cole ou digite o texto para testar a regex..." : "Paste or type text to test regex..."}
            className="w-full rounded-xl border border-border bg-card p-4 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden shadow-inner resize-y"
          />

          {/* Replace Field (Optional) */}
          {showReplace && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <Replace className="h-3.5 w-3.5 text-primary" />
                <span>{isPt ? "Substituir por ($1, $2 para grupos):" : "Replacement Pattern ($1, $2):"}</span>
              </label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="[REDACTED] ou $1..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
              {result.replacedText !== undefined && (
                <div className="mt-3 rounded-lg border border-border/80 bg-background/80 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    {isPt ? "Resultado da Substituição:" : "Replaced Output:"}
                  </span>
                  <pre className="font-mono text-xs text-foreground whitespace-pre-wrap">
                    {result.replacedText}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Visual Highlighting Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>{isPt ? "Destaque Visual em Tempo Real" : "Real-Time Visual Match Highlighter"}</span>
            </span>
            <div className="min-h-[100px] max-h-[250px] overflow-y-auto rounded-xl border border-border bg-background p-4 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
              {result.highlightSegments.map((segment, idx) => {
                if (segment.isMatch) {
                  return (
                    <mark
                      key={idx}
                      className="rounded-md bg-amber-400/30 dark:bg-amber-500/30 text-amber-950 dark:text-amber-200 px-1 py-0.5 font-bold border border-amber-500/40"
                    >
                      {segment.text}
                    </mark>
                  );
                }
                return <span key={idx}>{segment.text}</span>;
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Match List & Groups Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>{isPt ? "Lista de Correspondências" : "Match Details & Groups"}</span>
            </h3>

            {result.matches.length > 0 && (
              <button
                type="button"
                onClick={handleCopyMatches}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-xs"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                <span>{copied ? (isPt ? "Copiado!" : "Copied!") : isPt ? "Copiar Todos" : "Copy All"}</span>
              </button>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1">
            {result.matches.length > 0 ? (
              result.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-3.5 shadow-xs hover:border-primary/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px]">
                        #{idx + 1}
                      </span>
                      <span>Match #{idx + 1}</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Pos: {m.index}-{m.index + m.length} (L{m.line}:C{m.column})
                    </span>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2 font-mono text-xs font-semibold text-foreground break-all border border-border/50">
                    {m.text}
                  </div>

                  {m.groups.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {isPt ? "Grupos de Captura:" : "Capture Groups:"}
                      </span>
                      <div className="space-y-1">
                        {m.groups.map((g) => (
                          <div
                            key={g.index}
                            className="flex items-center justify-between rounded-md bg-background px-2 py-1 text-[11px] font-mono border border-border/60"
                          >
                            <span className="font-bold text-muted-foreground">
                              ${g.index}:
                            </span>
                            <span className="font-semibold text-foreground truncate max-w-[200px]">
                              {g.value || <em className="text-muted-foreground/50">empty</em>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <span className="text-xs font-bold text-muted-foreground">
                  {isPt ? "Nenhuma correspondência encontrada" : "No matches found"}
                </span>
                <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-xs">
                  {isPt
                    ? "Ajuste a expressão regular ou teste com outro texto de entrada."
                    : "Adjust your regular expression or test with a different input string."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
