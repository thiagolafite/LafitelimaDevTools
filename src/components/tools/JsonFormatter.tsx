"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Minimize2,
  Maximize2,
  Copy,
  Sparkles,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { validateAndFormatJson, JsonValidationResult } from "@/lib/calculators/json";
import { formatBytes } from "@/lib/utils";
import { SupportedLanguage } from "@/config/site";
import { OutputBox } from "@/components/shared/OutputBox";
import { logToolUsage, logTelemetryError } from "@/lib/telemetry";

interface JsonFormatterProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

const SAMPLE_JSON = `{
  "platform": "lafitelimadev.tools",
  "version": 1.0,
  "clientSide": true,
  "features": [
    "Instant formatting",
    "Syntax validation",
    "Line error detection",
    "Zero server logs"
  ],
  "stats": {
    "supportedLanguages": ["en", "pt"],
    "privacyScore": 100
  }
}`;

export function JsonFormatter({ lang, onRegisterClear, onRegisterCopy }: JsonFormatterProps) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indentOption, setIndentOption] = useState<"2" | "4" | "tab" | "minify">("2");
  const [result, setResult] = useState<JsonValidationResult>(() =>
    validateAndFormatJson(SAMPLE_JSON, "2")
  );

  const t = {
    en: {
      inputLabel: "Raw JSON Input",
      outputLabel: "Formatted Output",
      placeholder: "Paste or type raw JSON here...",
      indent2: "2 Spaces",
      indent4: "4 Spaces",
      indentTab: "Tab",
      minify: "Minify",
      validJson: "Valid JSON",
      invalidJson: "Syntax Error",
      sampleBtn: "Load Sample",
      uploadBtn: "Upload .json",
      downloadBtn: "Download .json",
      lines: "Lines",
      size: "Size",
      keys: "Keys",
      depth: "Max Depth",
      errorAt: "Error at line",
      col: "col",
    },
    pt: {
      inputLabel: "Entrada JSON Bruta",
      outputLabel: "JSON Formatado",
      placeholder: "Cole ou digite seu JSON aqui...",
      indent2: "2 Espaços",
      indent4: "4 Espaços",
      indentTab: "Tabulação",
      minify: "Minificar",
      validJson: "JSON Válido",
      invalidJson: "Erro de Sintaxe",
      sampleBtn: "Exemplo",
      uploadBtn: "Carregar .json",
      downloadBtn: "Baixar .json",
      lines: "Linhas",
      size: "Tamanho",
      keys: "Chaves",
      depth: "Profundidade",
      errorAt: "Erro na linha",
      col: "col",
    },
  }[lang];

  useEffect(() => {
    const res = validateAndFormatJson(input, indentOption);
    setResult(res);

    if (input.trim()) {
      if (res.isValid) {
        logToolUsage("json-formatter", "format", undefined, new Blob([input]).size);
      } else if (res.error) {
        logTelemetryError("syntax", res.error, "json-formatter", "low");
      }
    }
  }, [input, indentOption]);

  const handleClear = () => {
    setInput("");
  };

  const handleCopyFormatted = () => {
    if (result.formatted) {
      navigator.clipboard.writeText(result.formatted);
      logToolUsage("json-formatter", "copy");
      toast.success(lang === "pt" ? "JSON copiado!" : "JSON copied!");
    }
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopyFormatted);
  }, [onRegisterClear, onRegisterCopy, result.formatted]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      logToolUsage("json-formatter", "upload", undefined, file.size);
      toast.success(lang === "pt" ? "Arquivo carregado!" : "File loaded!");
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!result.formatted) return;
    const blob = new Blob([result.formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = indentOption === "minify" ? "payload.min.json" : "payload.formatted.json";
    a.click();
    URL.revokeObjectURL(url);
    logToolUsage("json-formatter", "download");
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        {/* Indentation Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setIndentOption("2")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              indentOption === "2"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.indent2}
          </button>
          <button
            type="button"
            onClick={() => setIndentOption("4")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              indentOption === "4"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.indent4}
          </button>
          <button
            type="button"
            onClick={() => setIndentOption("tab")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              indentOption === "tab"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.indentTab}
          </button>
          <button
            type="button"
            onClick={() => setIndentOption("minify")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              indentOption === "minify"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.minify}
          </button>
        </div>

        {/* Quick Sample / File Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInput(SAMPLE_JSON)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t.sampleBtn}</span>
          </button>

          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Upload className="h-3.5 w-3.5" />
            <span>{t.uploadBtn}</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {result.isValid && result.formatted && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t.downloadBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Validation Status Banner */}
      {input.trim() && (
        <div>
          {result.isValid ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{t.validJson}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t.invalidJson}: </span>
                <span>{result.error}</span>
                {result.errorLine && (
                  <span className="ml-2 rounded bg-destructive/20 px-1.5 py-0.5 font-mono text-[11px]">
                    {t.errorAt} {result.errorLine}
                    {result.errorColumn ? `, ${t.col} ${result.errorColumn}` : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editors Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Raw Input Box */}
        <div className="flex flex-col rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.inputLabel}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatBytes(new Blob([input]).size)}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            rows={14}
            className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Output / Formatted Box */}
        <OutputBox
          label={t.outputLabel}
          value={result.formatted || ""}
          placeholder={t.outputLabel}
          rows={14}
          isMono={true}
        />
      </div>

      {/* Stats summary bar */}
      {result.isValid && result.stats && input.trim() && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground">{t.lines}</div>
            <div className="mt-0.5 text-base font-bold font-mono text-foreground">
              {result.stats.linesCount}
            </div>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground">{t.size}</div>
            <div className="mt-0.5 text-base font-bold font-mono text-foreground">
              {formatBytes(result.stats.sizeBytes)}
            </div>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground">{t.keys}</div>
            <div className="mt-0.5 text-base font-bold font-mono text-foreground">
              {result.stats.keysCount}
            </div>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground">{t.depth}</div>
            <div className="mt-0.5 text-base font-bold font-mono text-foreground">
              {result.stats.depth}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
