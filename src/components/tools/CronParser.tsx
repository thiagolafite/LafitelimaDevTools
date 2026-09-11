"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Sliders,
  CalendarClock,
  HelpCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseCronExpression,
  CRON_PRESETS,
  CronParseResult,
} from "@/lib/calculators/cron";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface CronParserProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function CronParser({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: CronParserProps) {
  const [expression, setExpression] = useState("*/15 9-18 * * 1-5");
  const [activeTab, setActiveTab] = useState<"parser" | "builder">("parser");
  const [parseResult, setParseResult] = useState<CronParseResult>(() =>
    parseCronExpression("*/15 9-18 * * 1-5")
  );
  const [copied, setCopied] = useState(false);

  // Builder States
  const [builderMinute, setBuilderMinute] = useState("*/15");
  const [builderHour, setBuilderHour] = useState("9-18");
  const [builderDom, setBuilderDom] = useState("*");
  const [builderMonth, setBuilderMonth] = useState("*");
  const [builderDow, setBuilderDow] = useState("1-5");

  const isPt = lang === "pt";

  useEffect(() => {
    const res = parseCronExpression(expression);
    setParseResult(res);
  }, [expression]);

  const handleCopy = () => {
    if (!expression) return;
    navigator.clipboard.writeText(expression);
    setCopied(true);
    toast.success(isPt ? "Expressão cron copiada!" : "Cron expression copied!");
    logToolUsage("cron-parser", "copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setExpression("* * * * *");
    toast.info(isPt ? "Expressão redefinida!" : "Expression reset!");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopy);
  }, [expression]);

  const updateBuilderExpression = (
    min = builderMinute,
    hr = builderHour,
    dom = builderDom,
    mon = builderMonth,
    dow = builderDow
  ) => {
    const newExpr = `${min} ${hr} ${dom} ${mon} ${dow}`;
    setExpression(newExpr);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("parser")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              activeTab === "parser"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{isPt ? "Analisador & Execuções" : "Parser & Next Runs"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("builder")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              activeTab === "builder"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>{isPt ? "Construtor Visual (Generator)" : "Visual Generator"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>{isPt ? "Copiado!" : "Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isPt ? "Copiar Cron" : "Copy Cron"}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Expression Input Card */}
      <div className="rounded-2xl border-2 border-primary/20 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            <span>{isPt ? "Expressão Cron (5 Campos Padrão)" : "Cron Expression (5 Standard Fields)"}</span>
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">
            minuto hora dia mês dia-da-semana
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            className="w-full rounded-xl border border-border bg-background px-4 py-3.5 font-mono text-lg sm:text-xl font-bold tracking-widest text-primary focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />
        </div>

        {/* Human Readable Translation Banner */}
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl p-4 transition-colors",
            parseResult.isValid
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          <Sparkles className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
              {isPt ? "Significado em Português Claro:" : "Human-Readable Schedule:"}
            </span>
            <p className="text-sm sm:text-base font-bold leading-relaxed">
              {parseResult.isValid
                ? isPt
                  ? parseResult.humanReadable.pt
                  : parseResult.humanReadable.en
                : parseResult.error}
            </p>
          </div>
        </div>
      </div>

      {/* View 1: Parser & Next Executions */}
      {activeTab === "parser" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Fields Breakdown Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                <span>{isPt ? "Decomposição dos 5 Campos" : "5 Fields Breakdown"}</span>
              </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="divide-y divide-border">
                {parseResult.fields.map((field, idx) => (
                  <div
                    key={field.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {isPt ? field.namePt : field.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {isPt ? field.descriptionPt : field.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        {field.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 font-mono">
                        ({field.allowedRange})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Templates / Presets */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                {isPt ? "Exemplos e Presets Comuns" : "Quick Common Presets"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CRON_PRESETS.map((preset) => (
                  <button
                    key={preset.expression}
                    type="button"
                    onClick={() => {
                      setExpression(preset.expression);
                      toast.success(
                        isPt
                          ? `Carregado: ${preset.name.pt}`
                          : `Loaded: ${preset.name.en}`
                      );
                    }}
                    className={cn(
                      "flex flex-col text-left rounded-lg border p-2.5 transition-all hover:border-primary hover:bg-muted/50",
                      expression === preset.expression
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background/60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {isPt ? preset.name.pt : preset.name.en}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-primary">
                        {preset.expression}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {isPt ? preset.description.pt : preset.description.en}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Executions List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Play className="h-4 w-4 text-emerald-500" />
              <span>{isPt ? "Próximos 5 Disparos Exatos" : "Next 5 Execution Times"}</span>
            </h3>

            <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
              {parseResult.nextExecutions.length > 0 ? (
                <div className="space-y-2.5">
                  {parseResult.nextExecutions.map((date, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border/70 bg-background/80 p-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {date.toLocaleDateString(isPt ? "pt-BR" : "en-US", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground">
                            {date.toLocaleTimeString(isPt ? "pt-BR" : "en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {Math.round((date.getTime() - Date.now()) / (1000 * 60))}{" "}
                        {isPt ? "minutos" : "mins"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  {isPt
                    ? "Nenhuma execução futura encontrada para esta expressão."
                    : "No upcoming executions found for this expression."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Visual Builder */}
      {activeTab === "builder" && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {isPt ? "Construtor Visual de Expressões" : "Interactive Cron Builder"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isPt
                ? "Selecione a frequência desejada em cada campo para montar sua expressão cron automaticamente."
                : "Select the frequency for each field to generate your cron expression visually."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Minute Selector */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isPt ? "1. Minutos" : "1. Minutes"}
              </label>
              <select
                value={builderMinute}
                onChange={(e) => {
                  setBuilderMinute(e.target.value);
                  updateBuilderExpression(e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="*">{isPt ? "A cada minuto (*)" : "Every minute (*)"}</option>
                <option value="*/5">{isPt ? "A cada 5 minutos (*/5)" : "Every 5 mins (*/5)"}</option>
                <option value="*/10">{isPt ? "A cada 10 minutos (*/10)" : "Every 10 mins (*/10)"}</option>
                <option value="*/15">{isPt ? "A cada 15 minutos (*/15)" : "Every 15 mins (*/15)"}</option>
                <option value="*/30">{isPt ? "A cada 30 minutos (*/30)" : "Every 30 mins (*/30)"}</option>
                <option value="0">{isPt ? "No minuto 0 (:00)" : "At minute 0 (:00)"}</option>
                <option value="30">{isPt ? "No minuto 30 (:30)" : "At minute 30 (:30)"}</option>
              </select>
            </div>

            {/* Hour Selector */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isPt ? "2. Horas" : "2. Hours"}
              </label>
              <select
                value={builderHour}
                onChange={(e) => {
                  setBuilderHour(e.target.value);
                  updateBuilderExpression(undefined, e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="*">{isPt ? "A cada hora (*)" : "Every hour (*)"}</option>
                <option value="*/2">{isPt ? "A cada 2 horas (*/2)" : "Every 2 hours (*/2)"}</option>
                <option value="*/6">{isPt ? "A cada 6 horas (*/6)" : "Every 6 hours (*/6)"}</option>
                <option value="0">{isPt ? "À meia-noite (00:00)" : "At midnight (00:00)"}</option>
                <option value="9-18">{isPt ? "Horário comercial (09h às 18h)" : "Business hours (9 AM - 6 PM)"}</option>
                <option value="12">{isPt ? "Ao meio-dia (12:00)" : "At noon (12:00)"}</option>
              </select>
            </div>

            {/* Day of Month Selector */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isPt ? "3. Dia do Mês" : "3. Day of Month"}
              </label>
              <select
                value={builderDom}
                onChange={(e) => {
                  setBuilderDom(e.target.value);
                  updateBuilderExpression(undefined, undefined, e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="*">{isPt ? "Todos os dias (*)" : "Every day (*)"}</option>
                <option value="1">{isPt ? "Dia 1º do mês (1)" : "1st day of month (1)"}</option>
                <option value="15">{isPt ? "Dia 15 do mês (15)" : "15th day of month (15)"}</option>
                <option value="1,15">{isPt ? "Dias 1 e 15 (1,15)" : "1st & 15th (1,15)"}</option>
                <option value="*/2">{isPt ? "Dias alternados (*/2)" : "Every other day (*/2)"}</option>
              </select>
            </div>

            {/* Month Selector */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isPt ? "4. Mês" : "4. Month"}
              </label>
              <select
                value={builderMonth}
                onChange={(e) => {
                  setBuilderMonth(e.target.value);
                  updateBuilderExpression(undefined, undefined, undefined, e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="*">{isPt ? "Todos os meses (*)" : "Every month (*)"}</option>
                <option value="*/3">{isPt ? "A cada trimestre (*/3)" : "Every quarter (*/3)"}</option>
                <option value="1">{isPt ? "Apenas Janeiro (1)" : "January only (1)"}</option>
                <option value="6">{isPt ? "Apenas Junho (6)" : "June only (6)"}</option>
                <option value="12">{isPt ? "Apenas Dezembro (12)" : "December only (12)"}</option>
              </select>
            </div>

            {/* Day of Week Selector */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isPt ? "5. Dia da Semana" : "5. Day of Week"}
              </label>
              <select
                value={builderDow}
                onChange={(e) => {
                  setBuilderDow(e.target.value);
                  updateBuilderExpression(undefined, undefined, undefined, undefined, e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="*">{isPt ? "Todos os dias (*)" : "Every day (*)"}</option>
                <option value="1-5">{isPt ? "Segunda a Sexta (1-5)" : "Monday to Friday (1-5)"}</option>
                <option value="0,6">{isPt ? "Finais de semana (Sáb/Dom)" : "Weekends only (Sat/Sun)"}</option>
                <option value="0">{isPt ? "Apenas Domingo (0)" : "Sunday only (0)"}</option>
                <option value="1">{isPt ? "Apenas Segunda (1)" : "Monday only (1)"}</option>
                <option value="5">{isPt ? "Apenas Sexta-feira (5)" : "Friday only (5)"}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
