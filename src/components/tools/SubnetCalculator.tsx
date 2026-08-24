"use client";

import React, { useState, useEffect } from "react";
import {
  Network,
  Copy,
  Check,
  Globe,
  Radio,
  Server,
  Hash,
  Binary,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { calculateSubnet, SubnetResult, cidrToMask } from "@/lib/calculators/subnet";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface SubnetCalculatorProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

export function SubnetCalculator({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: SubnetCalculatorProps) {
  const [ipInput, setIpInput] = useState("192.168.1.100");
  const [cidrInput, setCidrInput] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(() =>
    calculateSubnet("192.168.1.100", 24)
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const t = {
    en: {
      ipLabel: "IP Address",
      cidrLabel: "Subnet Mask / CIDR Prefix",
      networkAddress: "Network Address (ID)",
      broadcastAddress: "Broadcast Address",
      usableRange: "Usable Host Range",
      subnetMask: "Subnet Mask",
      wildcardMask: "Wildcard Mask",
      totalHosts: "Total Addresses",
      usableHosts: "Usable Hosts",
      ipClass: "IP Class",
      ipType: "Network Scope",
      binaryView: "Binary Breakdown (32-bit)",
      quickPresets: "Common CIDR Subnets",
      invalidIp: "Please enter a valid IPv4 address (e.g. 192.168.1.1)",
      copyField: "Copy",
      copied: "Copied!",
      firstHost: "First Usable Host",
      lastHost: "Last Usable Host",
      binaryIp: "IP (Binary)",
      binaryMask: "Mask (Binary)",
      binaryNet: "Network (Binary)",
      binaryBcast: "Broadcast (Binary)",
    },
    pt: {
      ipLabel: "Endereço IP",
      cidrLabel: "Máscara de Rede / Prefixo CIDR",
      networkAddress: "Endereço de Rede (ID)",
      broadcastAddress: "Endereço de Broadcast",
      usableRange: "Faixa de IPs Utilizáveis",
      subnetMask: "Máscara de Sub-rede",
      wildcardMask: "Máscara Wildcard",
      totalHosts: "Total de Endereços",
      usableHosts: "Hosts Utilizáveis",
      ipClass: "Classe do IP",
      ipType: "Escopo da Rede",
      binaryView: "Divisão em Binário (32 bits)",
      quickPresets: "Sub-redes CIDR Comuns",
      invalidIp: "Digite um endereço IPv4 válido (ex: 192.168.1.1)",
      copyField: "Copiar",
      copied: "Copiado!",
      firstHost: "Primeiro Host Útil",
      lastHost: "Último Host Útil",
      binaryIp: "IP (Binário)",
      binaryMask: "Máscara (Binário)",
      binaryNet: "Rede (Binário)",
      binaryBcast: "Broadcast (Binário)",
    },
  }[lang];

  useEffect(() => {
    const res = calculateSubnet(ipInput, cidrInput);
    setResult(res);
    if (res) {
      logToolUsage("subnet-calculator", "calculate");
    }
  }, [ipInput, cidrInput]);

  const handleClear = () => {
    setIpInput("192.168.0.1");
    setCidrInput(24);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summary = `lafitelimadev.tools - Subnet Calculation:
IP: ${result.ip}/${result.cidr}
Network ID: ${result.networkAddress}
Broadcast: ${result.broadcastAddress}
Usable Host Range: ${result.firstUsableIp} - ${result.lastUsableIp}
Subnet Mask: ${result.netmask}
Wildcard Mask: ${result.wildcard}
Total Hosts: ${result.totalHosts.toLocaleString()}
Usable Hosts: ${result.usableHosts.toLocaleString()}
Class: ${result.ipClass} (${result.ipType})`;

    navigator.clipboard.writeText(summary);
    logToolUsage("subnet-calculator", "copy");
    toast.success(lang === "pt" ? "Resumo copiado!" : "Summary copied!");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopySummary);
  }, [onRegisterClear, onRegisterCopy, result]);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    logToolUsage("subnet-calculator", "copy");
    toast.success(t.copied);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        {/* IP Address input */}
        <div className="sm:col-span-7">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            {t.ipLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="192.168.1.1"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 font-mono text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* CIDR Prefix Selector */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            {t.cidrLabel}
          </label>
          <div className="relative">
            <select
              value={cidrInput}
              onChange={(e) => setCidrInput(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 font-mono text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Array.from({ length: 33 }, (_, i) => 32 - i).map((prefix) => (
                <option key={prefix} value={prefix}>
                  /{prefix} — {cidrToMask(prefix)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      {result ? (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Network className="h-4 w-4 text-primary" />
                <span>{t.networkAddress}</span>
              </div>
              <div className="mt-2 text-base font-bold font-mono text-foreground break-all">
                {result.networkAddress}
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Radio className="h-4 w-4 text-amber-500" />
                <span>{t.broadcastAddress}</span>
              </div>
              <div className="mt-2 text-base font-bold font-mono text-foreground break-all">
                {result.broadcastAddress}
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Server className="h-4 w-4 text-emerald-500" />
                <span>{t.usableHosts}</span>
              </div>
              <div className="mt-2 text-base font-bold font-mono text-foreground">
                {result.usableHosts.toLocaleString()}
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Globe className="h-4 w-4 text-indigo-500" />
                <span>{t.ipType}</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground truncate">
                {result.ipType}
              </div>
            </div>
          </div>

          {/* Detailed Cards Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="divide-y divide-border">
              {/* Row: Usable IP Range */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                  {t.usableRange}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {result.firstUsableIp} &rarr; {result.lastUsableIp}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `${result.firstUsableIp} - ${result.lastUsableIp}`,
                        "range"
                      )
                    }
                    className="text-muted-foreground hover:text-foreground p-1"
                    title="Copy range"
                  >
                    {copiedField === "range" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row: Subnet Mask */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                  {t.subnetMask}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">
                    {result.netmask}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.netmask, "netmask")}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    {copiedField === "netmask" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row: Wildcard Mask */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                  {t.wildcardMask}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">
                    {result.wildcard}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.wildcard, "wildcard")}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    {copiedField === "wildcard" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row: Total Addresses */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                  {t.totalHosts}
                </div>
                <div className="font-mono text-sm text-foreground">
                  {result.totalHosts.toLocaleString()}
                </div>
              </div>

              {/* Row: IP Class */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                  {t.ipClass}
                </div>
                <div className="font-medium text-sm text-foreground">
                  {result.ipClass}
                </div>
              </div>
            </div>
          </div>

          {/* Binary Representation Breakdown */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Binary className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {t.binaryView}
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between min-w-[380px] pb-2 border-b border-border/40">
                <span className="text-muted-foreground">{t.binaryIp}</span>
                <span className="text-foreground tracking-wider font-semibold">
                  {result.binaryIp}
                </span>
              </div>
              <div className="flex items-center justify-between min-w-[380px] pb-2 border-b border-border/40">
                <span className="text-muted-foreground">{t.binaryMask}</span>
                <span className="text-primary tracking-wider font-semibold">
                  {result.binaryMask}
                </span>
              </div>
              <div className="flex items-center justify-between min-w-[380px] pb-2 border-b border-border/40">
                <span className="text-muted-foreground">{t.binaryNet}</span>
                <span className="text-foreground tracking-wider font-semibold">
                  {result.binaryNetwork}
                </span>
              </div>
              <div className="flex items-center justify-between min-w-[380px]">
                <span className="text-muted-foreground">{t.binaryBcast}</span>
                <span className="text-amber-500 tracking-wider font-semibold">
                  {result.binaryBroadcast}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {t.quickPresets}
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { prefix: 8, label: "/8 (Class A - 16M hosts)" },
                { prefix: 16, label: "/16 (Class B - 65K hosts)" },
                { prefix: 24, label: "/24 (Class C - 254 hosts)" },
                { prefix: 26, label: "/26 (62 hosts)" },
                { prefix: 28, label: "/28 (14 hosts)" },
                { prefix: 30, label: "/30 (2 hosts - P2P)" },
                { prefix: 31, label: "/31 (RFC 3021)" },
              ].map((preset) => (
                <button
                  key={preset.prefix}
                  type="button"
                  onClick={() => setCidrInput(preset.prefix)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    cidrInput === preset.prefix
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          {t.invalidIp}
        </div>
      )}
    </div>
  );
}
