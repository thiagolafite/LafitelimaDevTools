"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Sliders,
  Eye,
  EyeOff,
  List,
} from "lucide-react";
import { toast } from "sonner";
import {
  generatePassword,
  analyzePassword,
  PasswordOptions,
  PasswordAnalysis,
} from "@/lib/calculators/password";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface PasswordGeneratorProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function PasswordGenerator({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    avoidAmbiguous: false,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() =>
    analyzePassword("")
  );
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);

  const t = {
    en: {
      generateBtn: "Regenerate Password",
      lengthLabel: "Password Length",
      optionsTitle: "Character Settings",
      uppercase: "Uppercase (A-Z)",
      lowercase: "Lowercase (a-z)",
      numbers: "Numbers (0-9)",
      symbols: "Symbols (!@#$%^&*)",
      avoidAmbiguous: "Avoid Ambiguous (1, l, I, 0, O)",
      strengthLabel: "Password Strength",
      entropyLabel: "Entropy Score",
      crackTimeLabel: "Estimated Brute-force Crack Time",
      bulkTitle: "Bulk Generation",
      bulk1: "Single",
      bulk5: "5 Passwords",
      bulk10: "10 Passwords",
      copyAll: "Copy All",
      strengthLevels: {
        very_weak: "Very Weak",
        weak: "Weak",
        fair: "Fair / Moderate",
        strong: "Strong",
        very_strong: "Very Strong (Unbreakable)",
      },
    },
    pt: {
      generateBtn: "Gerar Nova Senha",
      lengthLabel: "Tamanho da Senha",
      optionsTitle: "Configuração de Caracteres",
      uppercase: "Letras Maiúsculas (A-Z)",
      lowercase: "Letras Minúsculas (a-z)",
      numbers: "Números (0-9)",
      symbols: "Símbolos Especiais (!@#$%^&*)",
      avoidAmbiguous: "Evitar Ambíguos (1, l, I, 0, O)",
      strengthLabel: "Força da Senha",
      entropyLabel: "Pontuação de Entropia",
      crackTimeLabel: "Tempo Estimado para Quebra (Força Bruta)",
      bulkTitle: "Geração em Lote",
      bulk1: "Individual",
      bulk5: "5 Senhas",
      bulk10: "10 Senhas",
      copyAll: "Copiar Todas",
      strengthLevels: {
        very_weak: "Muito Fraca",
        weak: "Fraca",
        fair: "Razoável",
        strong: "Forte",
        very_strong: "Muito Forte (Inviolável)",
      },
    },
  }[lang];

  const handleGenerate = useCallback(() => {
    const newPwd = generatePassword(options);
    setPassword(newPwd);
    setAnalysis(analyzePassword(newPwd));
    logToolUsage("password-generator", "generate");

    if (bulkCount > 1) {
      const list = Array.from({ length: bulkCount }, () =>
        generatePassword(options)
      );
      setBulkList(list);
    } else {
      setBulkList([]);
    }
  }, [options, bulkCount]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopySingle = (pwdToCopy = password) => {
    if (!pwdToCopy) return;
    navigator.clipboard.writeText(pwdToCopy);
    setCopied(true);
    logToolUsage("password-generator", "copy");
    toast.success(lang === "pt" ? "Senha copiada!" : "Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setOptions({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      avoidAmbiguous: false,
    });
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(() => handleCopySingle());
  }, [onRegisterClear, onRegisterCopy, password]);

  const getStrengthColor = (strength: PasswordAnalysis["strength"]) => {
    switch (strength) {
      case "very_weak":
        return "bg-rose-500 text-rose-500";
      case "weak":
        return "bg-amber-500 text-amber-500";
      case "fair":
        return "bg-yellow-500 text-yellow-500";
      case "strong":
        return "bg-emerald-500 text-emerald-500";
      case "very_strong":
        return "bg-indigo-500 text-indigo-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Primary Password Display Card */}
      <div className="relative rounded-2xl border-2 border-border/80 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto py-2">
            <span
              className={cn(
                "font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-foreground break-all select-all",
                !showPassword && "filter blur-sm select-none"
              )}
            >
              {password}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:rotate-180 duration-300"
              title={t.generateBtn}
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCopySingle(password)}
              className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Strength & Entropy Progress Bar */}
        <div className="mt-6 space-y-2 border-t border-border pt-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span>{t.strengthLabel}:</span>
              <span
                className={cn(
                  "font-bold uppercase tracking-wider",
                  getStrengthColor(analysis.strength).split(" ")[1]
                )}
              >
                {t.strengthLevels[analysis.strength]}
              </span>
            </div>
            <div className="text-muted-foreground font-mono">
              {analysis.entropy} bits ({analysis.score}/100)
            </div>
          </div>

          {/* Meter track */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getStrengthColor(analysis.strength).split(" ")[0]
              )}
              style={{ width: `${Math.max(8, analysis.score)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>{t.crackTimeLabel}:</span>
            <span className="font-semibold text-foreground font-mono">
              {lang === "pt" ? analysis.crackTimePt : analysis.crackTime}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">
              {t.lengthLabel}
            </label>
            <span className="rounded-md border border-border bg-muted/40 px-3 py-1 font-mono text-base font-bold text-foreground">
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                length: parseInt(e.target.value, 10),
              }))
            }
            className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>8 (Minimum)</span>
            <span>20 (Recommended)</span>
            <span>64 (Ultra Secure)</span>
          </div>
        </div>

        {/* Character Set Checkboxes */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t.optionsTitle}
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeUppercase: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs font-medium text-foreground">
                {t.uppercase}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeLowercase: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs font-medium text-foreground">
                {t.lowercase}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeNumbers: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs font-medium text-foreground">
                {t.numbers}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeSymbols: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs font-medium text-foreground">
                {t.symbols}
              </span>
            </label>

            <label className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.avoidAmbiguous}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    avoidAmbiguous: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs font-medium text-foreground">
                {t.avoidAmbiguous}
              </span>
            </label>
          </div>
        </div>

        {/* Bulk Generation Selector */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.bulkTitle}
            </span>
            <div className="flex gap-1.5">
              {[
                { count: 1, label: t.bulk1 },
                { count: 5, label: t.bulk5 },
                { count: 10, label: t.bulk10 },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setBulkCount(item.count)}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                    bulkCount === item.count
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {bulkList.length > 0 && (
            <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/10 p-3">
              {bulkList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card p-2.5 hover:bg-muted/40 transition-colors"
                >
                  <span className="font-mono text-xs font-semibold text-foreground break-all">
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySingle(item)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
