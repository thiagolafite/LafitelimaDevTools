"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Hash, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { computeAllHashes, HashResults } from "@/lib/calculators/hash";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface HashGeneratorProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function HashGenerator({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: HashGeneratorProps) {
  const [input, setInput] = useState("lafitelimadev.tools");
  const [isUppercase, setIsUppercase] = useState(false);
  const [copiedAlg, setCopiedAlg] = useState<string | null>(null);
  const [hashes, setHashes] = useState<HashResults>({
    md5: "",
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });

  const t = {
    en: {
      inputLabel: "Input String / Payload",
      placeholder: "Type text to generate cryptographic hashes in real-time...",
      uppercaseLabel: "Uppercase Hex",
      sampleBtn: "Sample Text",
      algorithms: {
        sha256: "SHA-256 (Industry Standard / 256-bit)",
        sha512: "SHA-512 (High Security / 512-bit)",
        sha384: "SHA-384 (384-bit)",
        sha1: "SHA-1 (Legacy / 160-bit)",
        md5: "MD5 (Checksum / 128-bit)",
      },
    },
    pt: {
      inputLabel: "Texto / String de Entrada",
      placeholder: "Digite o texto para gerar hashes criptográficos em tempo real...",
      uppercaseLabel: "Hexadecimal Maiúsculo",
      sampleBtn: "Texto de Exemplo",
      algorithms: {
        sha256: "SHA-256 (Padrão da Indústria / 256 bits)",
        sha512: "SHA-512 (Alta Segurança / 512 bits)",
        sha384: "SHA-384 (384 bits)",
        sha1: "SHA-1 (Legado / 160 bits)",
        md5: "MD5 (Checksum / 128 bits)",
      },
    },
  }[lang];

  useEffect(() => {
    let isCancelled = false;
    if (input.trim()) {
      computeAllHashes(input).then((res) => {
        if (!isCancelled) {
          setHashes(res);
          logToolUsage("hash-generator", "calculate", undefined, new Blob([input]).size);
        }
      });
    } else {
      setHashes({ md5: "", sha1: "", sha256: "", sha384: "", sha512: "" });
    }
    return () => {
      isCancelled = true;
    };
  }, [input]);

  const handleClear = () => {
    setInput("");
  };

  const handleCopyAll = () => {
    const summary = `lafitelimadev.tools - Hashes for "${input}":
MD5: ${hashes.md5}
SHA-1: ${hashes.sha1}
SHA-256: ${hashes.sha256}
SHA-384: ${hashes.sha384}
SHA-512: ${hashes.sha512}`;
    navigator.clipboard.writeText(summary);
    logToolUsage("hash-generator", "copy");
    toast.success(lang === "pt" ? "Todos os hashes copiados!" : "All hashes copied!");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopyAll);
  }, [onRegisterClear, onRegisterCopy, hashes]);

  const copyHash = (hash: string, alg: string) => {
    if (!hash) return;
    const finalHash = isUppercase ? hash.toUpperCase() : hash.toLowerCase();
    navigator.clipboard.writeText(finalHash);
    setCopiedAlg(alg);
    logToolUsage("hash-generator", "copy");
    toast.success(lang === "pt" ? `${alg} copiado!` : `${alg} copied!`);
    setTimeout(() => setCopiedAlg(null), 2000);
  };

  const algList = [
    { key: "sha256", name: "SHA-256", title: t.algorithms.sha256, val: hashes.sha256, secure: true },
    { key: "sha512", name: "SHA-512", title: t.algorithms.sha512, val: hashes.sha512, secure: true },
    { key: "sha384", name: "SHA-384", title: t.algorithms.sha384, val: hashes.sha384, secure: true },
    { key: "sha1", name: "SHA-1", title: t.algorithms.sha1, val: hashes.sha1, secure: false },
    { key: "md5", name: "MD5", title: t.algorithms.md5, val: hashes.md5, secure: false },
  ];

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.inputLabel}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={(e) => setIsUppercase(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
              />
              <span>{t.uppercaseLabel}</span>
            </label>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          rows={4}
          className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Hashes output list */}
      <div className="space-y-3">
        {algList.map((item) => {
          const displayedValue = item.val
            ? isUppercase
              ? item.val.toUpperCase()
              : item.val.toLowerCase()
            : "";

          return (
            <div
              key={item.key}
              className="overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-border/80"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    ({item.title})
                  </span>
                  {item.secure ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                      Secure
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                      Non-cryptographic
                    </span>
                  )}
                </div>

                {displayedValue && (
                  <button
                    type="button"
                    onClick={() => copyHash(item.val, item.name)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {copiedAlg === item.name ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5 font-mono text-xs text-foreground break-all select-all">
                {displayedValue || (
                  <span className="text-muted-foreground/60 italic">
                    Waiting for input...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
