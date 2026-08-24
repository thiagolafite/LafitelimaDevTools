"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Check, Copy, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { encodeBase64, decodeBase64, isValidBase64 } from "@/lib/calculators/base64";
import { SupportedLanguage } from "@/config/site";
import { OutputBox } from "@/components/shared/OutputBox";
import { logToolUsage, logTelemetryError } from "@/lib/telemetry";

interface Base64ToolProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function Base64Tool({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: Base64ToolProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello World! 🚀 lafitelimadev.tools — 100% Client Side.");
  const [urlSafe, setUrlSafe] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const t = {
    en: {
      encodeMode: "Encode Text",
      decodeMode: "Decode Base64",
      urlSafeLabel: "URL-Safe (- and _)",
      inputLabel: mode === "encode" ? "Plain Text / Unicode Input" : "Base64 Input String",
      outputLabel: mode === "encode" ? "Base64 Encoded Result" : "Decoded Plain Text",
      placeholder: mode === "encode" ? "Type or paste text..." : "Paste Base64 string to decode...",
      invalidBase64: "Invalid Base64 string format.",
      sampleBtn: "Load Sample",
    },
    pt: {
      encodeMode: "Codificar Texto",
      decodeMode: "Decodificar Base64",
      urlSafeLabel: "Seguro para URLs (URL-Safe)",
      inputLabel: mode === "encode" ? "Texto Original / Unicode" : "Sequência Base64",
      outputLabel: mode === "encode" ? "Resultado em Base64" : "Texto Decodificado",
      placeholder: mode === "encode" ? "Digite ou cole seu texto..." : "Cole a string Base64 para decodificar...",
      invalidBase64: "Formato Base64 inválido.",
      sampleBtn: "Exemplo",
    },
  }[lang];

  useEffect(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        const res = encodeBase64(input, { urlSafe });
        setOutput(res);
        logToolUsage("base64-tool", "format", undefined, new Blob([input]).size);
      } else {
        if (!isValidBase64(input)) {
          setError(t.invalidBase64);
          setOutput("");
          logTelemetryError("syntax", t.invalidBase64, "base64-tool", "low");
        } else {
          const res = decodeBase64(input, { urlSafe });
          setOutput(res);
          logToolUsage("base64-tool", "format", undefined, new Blob([input]).size);
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error processing Base64";
      setError(errMsg);
      setOutput("");
      logTelemetryError("syntax", errMsg, "base64-tool", "low");
    }
  }, [input, mode, urlSafe, t.invalidBase64]);

  const handleClear = () => {
    setInput("");
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      logToolUsage("base64-tool", "copy");
      toast.success(lang === "pt" ? "Resultado copiado!" : "Result copied!");
    }
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopy);
  }, [onRegisterClear, onRegisterCopy, output]);

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode(mode === "encode" ? "decode" : "encode");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              mode === "encode"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.encodeMode}
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              mode === "decode"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.decodeMode}
          </button>
        </div>

        {/* URL-Safe checkbox & Swap */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
            />
            <span>{t.urlSafeLabel}</span>
          </label>

          {output && (
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Swap input and output"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Swap</span>
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grids */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5 bg-muted/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.inputLabel}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            rows={10}
            className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <OutputBox
          label={t.outputLabel}
          value={output}
          placeholder={t.outputLabel}
          rows={10}
          isMono={true}
        />
      </div>
    </div>
  );
}
