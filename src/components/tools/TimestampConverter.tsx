"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Copy,
  Check,
  Globe,
  Calendar,
  Sparkles,
  ArrowDownUp,
  RotateCcw,
  Zap,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseTimestamp,
  dateToTimestamp,
  TimestampDetails,
} from "@/lib/calculators/timestamp";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface TimestampConverterProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function TimestampConverter({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: TimestampConverterProps) {
  const [currentEpochSec, setCurrentEpochSec] = useState(Math.floor(Date.now() / 1000));
  const [currentEpochMs, setCurrentEpochMs] = useState(Date.now());
  const [isClockRunning, setIsClockRunning] = useState(true);

  const [inputTimestamp, setInputTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [result, setResult] = useState<TimestampDetails | null>(() =>
    parseTimestamp(Math.floor(Date.now() / 1000))
  );

  // Date to timestamp state
  const now = new Date();
  const [inputYear, setInputYear] = useState(now.getFullYear());
  const [inputMonth, setInputMonth] = useState(now.getMonth() + 1);
  const [inputDay, setInputDay] = useState(now.getDate());
  const [inputHour, setInputHour] = useState(now.getHours());
  const [inputMinute, setInputMinute] = useState(now.getMinutes());
  const [inputSecond, setInputSecond] = useState(now.getSeconds());
  const [inputTimezone, setInputTimezone] = useState("local");

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isPt = lang === "pt";

  // Real-time ticking clock
  useEffect(() => {
    if (!isClockRunning) return;
    const interval = setInterval(() => {
      const nowMs = Date.now();
      setCurrentEpochMs(nowMs);
      setCurrentEpochSec(Math.floor(nowMs / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockRunning]);

  useEffect(() => {
    const res = parseTimestamp(inputTimestamp);
    setResult(res);
  }, [inputTimestamp]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(isPt ? `${label} copiado!` : `${label} copied!`);
    logToolUsage("timestamp-converter", "copy");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSetNow = () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setInputTimestamp(String(nowSec));
    toast.success(isPt ? "Horário atual definido!" : "Set to current time!");
  };

  const handleApplyOffset = (seconds: number) => {
    const current = Number(inputTimestamp) || Math.floor(Date.now() / 1000);
    setInputTimestamp(String(current + seconds));
  };

  const handleConvertDateToTimestamp = () => {
    const res = dateToTimestamp(
      inputYear,
      inputMonth,
      inputDay,
      inputHour,
      inputMinute,
      inputSecond,
      inputTimezone
    );
    if (res) {
      setInputTimestamp(String(res.timestampSeconds));
      setResult(res);
      toast.success(isPt ? "Data convertida para timestamp!" : "Date converted to timestamp!");
    } else {
      toast.error(isPt ? "Data inválida informada!" : "Invalid date provided!");
    }
  };

  const handleClear = () => {
    setInputTimestamp("");
    setResult(null);
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) {
      onRegisterCopy(() => {
        if (result) handleCopy(String(result.timestampSeconds), "Timestamp (s)");
      });
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Live Current Epoch Banner */}
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isPt ? "Timestamp Unix Atual (Tempo Real)" : "Current Unix Epoch Time"}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                {currentEpochSec}
              </span>
              <span className="font-mono text-xs sm:text-sm text-muted-foreground font-semibold">
                ({currentEpochMs} ms)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(String(currentEpochSec), "Epoch (s)")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              {copiedField === "Epoch (s)" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{isPt ? "Copiar Segundos" : "Copy Seconds"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsClockRunning(!isClockRunning)}
              title={isClockRunning ? "Pausar relógio" : "Retomar relógio"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-xs"
            >
              {isClockRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-emerald-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversion Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Timestamp Converter Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Timestamp to Date */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{isPt ? "Converter Timestamp para Data" : "Convert Timestamp to Date"}</span>
              </label>
              <button
                type="button"
                onClick={handleSetNow}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-primary hover:bg-muted transition-colors"
              >
                <Zap className="h-3 w-3" />
                <span>{isPt ? "Usar Agora" : "Set Now"}</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                value={inputTimestamp}
                onChange={(e) => setInputTimestamp(e.target.value)}
                placeholder="ex: 1789000000 ou 1789000000000"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-base sm:text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              />
              <span className="text-[11px] text-muted-foreground mt-1.5 block">
                {isPt
                  ? "Suporta segundos (10 dígitos) e milissegundos (13 dígitos)."
                  : "Supports both seconds (10 digits) and milliseconds (13 digits)."}
              </span>
            </div>

            {/* Quick Offset Shortcuts */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {isPt ? "Ajustes Rápidos:" : "Quick Adjustments:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "-1h", sec: -3600 },
                  { label: "-1d", sec: -86400 },
                  { label: "+1h", sec: 3600 },
                  { label: "+1d", sec: 86400 },
                  { label: "+7d", sec: 86400 * 7 },
                  { label: "+30d", sec: 86400 * 30 },
                  { label: "+1 Ano", sec: 86400 * 365 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleApplyOffset(item.sec)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-xs font-medium text-foreground hover:border-primary hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Date to Timestamp Generator */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{isPt ? "Converter Data/Hora para Timestamp" : "Convert Date/Time to Timestamp"}</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Dia" : "Day"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={inputDay}
                  onChange={(e) => setInputDay(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Mês" : "Month"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={inputMonth}
                  onChange={(e) => setInputMonth(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Ano" : "Year"}
                </label>
                <input
                  type="number"
                  value={inputYear}
                  onChange={(e) => setInputYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Hora (0-23)" : "Hour (0-23)"}
                </label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={inputHour}
                  onChange={(e) => setInputHour(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Minuto" : "Minute"}
                </label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={inputMinute}
                  onChange={(e) => setInputMinute(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  {isPt ? "Segundo" : "Second"}
                </label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={inputSecond}
                  onChange={(e) => setInputSecond(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground text-center"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <select
                value={inputTimezone}
                onChange={(e) => setInputTimezone(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="local">{isPt ? "Fuso Local do Navegador" : "Local Browser Timezone"}</option>
                <option value="utc">UTC / GMT</option>
              </select>

              <button
                type="button"
                onClick={handleConvertDateToTimestamp}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <ArrowDownUp className="h-3.5 w-3.5" />
                <span>{isPt ? "Gerar Epoch" : "Generate Epoch"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Formatted Output & Multi-Timezone Table */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <>
              {/* Formats Card */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span>{isPt ? "Formatos Padronizados" : "Standard Formats"}</span>
                  </h3>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-bold text-[10px] text-emerald-600 dark:text-emerald-400">
                    {isPt ? result.relativeTime.pt : result.relativeTime.en}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "ISO 8601 (UTC)", val: result.iso8601 },
                    { label: "RFC 2822", val: result.utcString },
                    { label: isPt ? "Data Local" : "Local Format", val: result.localString },
                    { label: "Timestamp (s)", val: String(result.timestampSeconds) },
                    { label: "Timestamp (ms)", val: String(result.timestampMs) },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 p-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-0.5 overflow-hidden pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          {f.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground truncate block">
                          {f.val}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(f.val, f.label)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {copiedField === f.label ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* World Timezones Table */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{isPt ? "Comparação de Fusos Horários Globais" : "World Timezone Comparison"}</span>
                </h3>

                <div className="overflow-hidden rounded-xl border border-border bg-background divide-y divide-border">
                  {result.timezones.map((tz) => (
                    <div
                      key={tz.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-foreground">
                          {isPt ? tz.name.pt : tz.name.en}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {tz.formattedDateTime}
                        </div>
                      </div>
                      <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] font-bold text-primary shrink-0">
                        {tz.utcOffset}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
              <Clock className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <span className="text-sm font-bold text-muted-foreground">
                {isPt ? "Digite um timestamp válido para ver a conversão" : "Enter a valid timestamp to view conversion"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
