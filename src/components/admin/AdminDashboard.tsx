"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  AlertTriangle,
  Zap,
  TrendingUp,
  RefreshCw,
  LogOut,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Laptop,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Sparkles,
  BarChart3,
  Layers,
  Flame,
  Activity,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTelemetryData,
  clearTelemetryErrors,
  clearAllTelemetry,
  toggleResolveError,
  ErrorLog,
  VisitorSession,
  ToolUsageEvent,
  SearchQueryEvent,
  SupplyDemandAnalysis,
} from "@/lib/telemetry";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"visitors" | "errors" | "tools" | "market">("visitors");
  const [data, setData] = useState(() => getTelemetryData());
  const [errorSeverityFilter, setErrorSeverityFilter] = useState<string>("all");
  const [errorSearch, setErrorSearch] = useState<string>("");
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const refreshData = () => {
    setData(getTelemetryData());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      setData(getTelemetryData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearErrors = () => {
    if (confirm("Deseja realmente limpar os logs de erro?")) {
      clearTelemetryErrors();
      refreshData();
      setSelectedError(null);
      toast.success("Logs de erros limpos!");
    }
  };

  const handleClearAllData = () => {
    if (confirm("ATENÇÃO: Deseja apagar TODOS os dados reais de telemetria, sessões, buscas e erros?")) {
      clearAllTelemetry();
      refreshData();
      setSelectedError(null);
      toast.success("Todos os dados do Admin foram apagados com sucesso!");
    }
  };

  const handleToggleResolve = (id: string) => {
    toggleResolveError(id);
    refreshData();
  };

  const handleExportErrorsJson = () => {
    const jsonStr = JSON.stringify(data.errors, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `real-error-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exportados em JSON!");
  };

  const handleExportCsv = () => {
    const headers = "ID,Timestamp,Type,ToolId,Severity,Resolved,Message,URL,UserAgent\n";
    const rows = data.errors.map(e =>
      `"${e.id}","${e.timestamp}","${e.type}","${e.toolId || ""}","${e.severity}","${e.resolved}","${e.message.replace(/"/g, '""')}","${e.url}","${e.userAgent}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `real-error-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exportados em CSV!");
  };

  // Filter errors dynamically
  const filteredErrors = data.errors.filter((e) => {
    const matchesSeverity = errorSeverityFilter === "all" || e.severity === errorSeverityFilter;
    const matchesSearch =
      !errorSearch ||
      e.message.toLowerCase().includes(errorSearch.toLowerCase()) ||
      (e.toolId && e.toolId.toLowerCase().includes(errorSearch.toLowerCase())) ||
      e.url.toLowerCase().includes(errorSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const totalPageviews = data.sessions.reduce((acc, s) => acc + s.pageViews, 0);
  const unresolvedErrorsCount = data.errors.filter((e) => !e.resolved).length;

  // Real Dynamic Calculations for Visitors
  const countryCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};

  data.sessions.forEach((s) => {
    countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
    browserCounts[s.browser] = (browserCounts[s.browser] || 0) + 1;
    referrerCounts[s.referrer] = (referrerCounts[s.referrer] || 0) + 1;
  });

  const totalSessionsCount = data.sessions.length || 1;
  const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrowsers = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]);
  const sortedReferrers = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1]);

  // Real Dynamic Calculations for Tool Usage
  const toolExecCounts: Record<string, number> = {};
  const actionCounts: Record<string, number> = {};

  data.toolEvents.forEach((ev) => {
    toolExecCounts[ev.toolId] = (toolExecCounts[ev.toolId] || 0) + 1;
    actionCounts[ev.action] = (actionCounts[ev.action] || 0) + 1;
  });

  const totalToolExecs = data.toolEvents.length || 1;
  const toolDisplayNames: Record<string, string> = {
    "json-formatter": "Formatador & Validador JSON",
    "subnet-calculator": "Calculadora de Sub-rede CIDR",
    "password-generator": "Gerador de Senhas Seguras",
    "hash-generator": "Gerador de Hash (SHA/MD5)",
    "base64-tool": "Codificador Base64",
  };

  const actionDisplayNames: Record<string, string> = {
    format: "Formatar / Validar Payload",
    calculate: "Calcular Sub-rede / Hashes",
    generate: "Gerar Senha Criptográfica",
    copy: "Copiar Resultado (Clipboard)",
    download: "Download de Arquivo",
    upload: "Upload de Arquivo",
    share: "Compartilhar Link",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              DADOS 100% REAIS
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Telemetria ao Vivo</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Painel Executivo & Monitoramento Real
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Atualizar</span>
          </button>

          <button
            type="button"
            onClick={handleClearAllData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors shadow-sm"
            title="Apagar todo o histórico de dados"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Zerar Telemetria</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Real Metric Cards Banner */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Visitantes Reais
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">
            {data.sessions.length}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {totalPageviews} visualizações de página
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Execuções de Ferramentas
            </span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">
            {data.toolEvents.length}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ações executadas pelos usuários
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Erros & Exceções
            </span>
            <AlertTriangle className={cn("h-4 w-4", unresolvedErrorsCount > 0 ? "text-rose-500" : "text-emerald-500")} />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">
            {unresolvedErrorsCount}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {data.errors.length} incidentes no total
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Buscas Realizadas
            </span>
            <Search className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">
            {data.searchQueries.length}
          </div>
          <p className="mt-1 text-[11px] text-indigo-500 font-medium">
            {data.analysis.unmetSearchQueries.length} demandas mapeadas
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border space-x-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("visitors")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap",
            activeTab === "visitors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          <span>Tráfego & Visitantes ({data.sessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("errors")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap",
            activeTab === "errors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Logs de Erros ({data.errors.length})</span>
          {unresolvedErrorsCount > 0 && (
            <span className="rounded-full bg-rose-500/10 px-1.5 py-0.2 font-mono text-[10px] text-rose-500 font-extrabold">
              {unresolvedErrorsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap",
            activeTab === "tools"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Zap className="h-4 w-4" />
          <span>Uso de Ferramentas ({data.toolEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("market")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap",
            activeTab === "market"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Flame className="h-4 w-4 text-amber-500" />
          <span>Análise de Oferta vs. Demanda</span>
        </button>
      </div>

      {/* TAB 1: VISITORS & TRAFFIC (REAL DATA) */}
      {activeTab === "visitors" && (
        <div className="space-y-6">
          {data.sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-bold text-foreground">Nenhum visitante registrado ainda</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Assim que você ou usuários navegarem pelas páginas do portal, as sessões, páginas vistas, países e navegadores aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Real Country Breakdown */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Países & Localização Real
                  </h3>
                  <div className="space-y-3">
                    {sortedCountries.map(([country, count]) => {
                      const pct = Math.round((count / totalSessionsCount) * 100);
                      return (
                        <div key={country} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{country}</span>
                            <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real Browsers & Devices */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Navegadores Reais
                  </h3>
                  <div className="space-y-3">
                    {sortedBrowsers.map(([browser, count]) => {
                      const pct = Math.round((count / totalSessionsCount) * 100);
                      return (
                        <div key={browser} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{browser}</span>
                            <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real Referrers */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Origem do Tráfego Real
                  </h3>
                  <div className="space-y-3">
                    {sortedReferrers.map(([referrer, count]) => {
                      const pct = Math.round((count / totalSessionsCount) * 100);
                      return (
                        <div key={referrer} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium truncate">
                            <span className="truncate">{referrer}</span>
                            <span className="font-mono text-muted-foreground shrink-0">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real Visitor Sessions Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="border-b border-border px-5 py-4 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Sessões Reais de Visitantes
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Histórico cronológico de navegação por usuário
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 text-muted-foreground uppercase tracking-wider text-[11px] border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Sessão ID</th>
                        <th className="px-4 py-3">País / Idioma</th>
                        <th className="px-4 py-3">Navegador / OS</th>
                        <th className="px-4 py-3">Origem</th>
                        <th className="px-4 py-3">Páginas Vistas</th>
                        <th className="px-4 py-3">Último Acesso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-medium">
                      {data.sessions.map((sess) => (
                        <tr key={sess.sessionId} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-primary">
                            {sess.sessionId.slice(0, 14)}...
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{sess.country}</div>
                            <div className="text-[10px] text-muted-foreground">{sess.language}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div>{sess.browser}</div>
                            <div className="text-[10px] text-muted-foreground">{sess.os} • {sess.device}</div>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {sess.referrer}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded bg-muted px-2 py-0.5 font-mono font-bold text-foreground">
                              {sess.pageViews} páginas
                            </span>
                            <div className="mt-1 text-[10px] text-muted-foreground truncate max-w-[180px]">
                              {sess.visitedPages.map(p => p.path).join(" → ")}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground font-mono">
                            {new Date(sess.lastSeen).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: ERROR LOGS (REAL DATA) */}
      {activeTab === "errors" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={errorSearch}
                  onChange={(e) => setErrorSearch(e.target.value)}
                  placeholder="Filtrar por mensagem ou URL..."
                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <select
                value={errorSeverityFilter}
                onChange={(e) => setErrorSeverityFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="all">Todas as Severidades</option>
                <option value="critical">Crítico</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {data.errors.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    title="Exportar CSV"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportErrorsJson}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    title="Exportar JSON"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearErrors}
                    className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                    title="Limpar logs de erros"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Limpar Erros</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Errors Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase tracking-wider text-[11px] border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Severidade</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Mensagem do Erro</th>
                    <th className="px-4 py-3">Ferramenta / Rota</th>
                    <th className="px-4 py-3">Data / Hora</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredErrors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                        <span className="font-semibold text-foreground">Nenhum erro registrado no momento!</span>
                        <p className="text-[11px] text-muted-foreground mt-1">O sistema e as ferramentas estão operando 100% sem falhas.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredErrors.map((err) => (
                      <tr
                        key={err.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors",
                          selectedError?.id === err.id && "bg-muted/30"
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleResolve(err.id)}
                            className="flex items-center gap-1 text-[11px]"
                            title="Alternar resolvido/não resolvido"
                          >
                            {err.resolved ? (
                              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Resolvido</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-500 font-bold">
                                <XCircle className="h-4 w-4" />
                                <span>Pendente</span>
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              err.severity === "critical" && "bg-rose-500/20 text-rose-600 dark:text-rose-400",
                              err.severity === "high" && "bg-orange-500/20 text-orange-600 dark:text-orange-400",
                              err.severity === "medium" && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                              err.severity === "low" && "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            {err.severity}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-muted-foreground uppercase text-[10px]">
                          {err.type}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-xs text-foreground max-w-xs truncate">
                          {err.message}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground font-mono text-[11px]">
                          {err.toolId ? (
                            <span className="font-bold text-foreground">{err.toolId}</span>
                          ) : (
                            <span>{err.url}</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground font-mono">
                          {new Date(err.timestamp).toLocaleString()}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedError(err)}
                            className="rounded border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedError && (
            <div className="rounded-xl border-2 border-border bg-card p-6 shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <h3 className="text-base font-bold text-foreground">
                    Detalhes do Incidente #{selectedError.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedError(null)}
                  className="text-muted-foreground hover:text-foreground text-xs font-bold"
                >
                  Fechar ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">URL: </span>
                  <span className="font-mono font-semibold text-foreground">{selectedError.url}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Data/Hora: </span>
                  <span className="font-mono text-foreground">{new Date(selectedError.timestamp).toLocaleString()}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">User Agent: </span>
                  <span className="font-mono text-[11px] text-foreground break-all">{selectedError.userAgent}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Mensagem
                </label>
                <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs text-rose-600 dark:text-rose-400 break-all">
                  {selectedError.message}
                </div>
              </div>

              {selectedError.stack && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Stack Trace
                  </label>
                  <pre className="rounded-lg bg-muted/50 p-3 font-mono text-[11px] text-muted-foreground overflow-x-auto">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOOLS USAGE METRICS (REAL DATA) */}
      {activeTab === "tools" && (
        <div className="space-y-6">
          {data.toolEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
              <Zap className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-bold text-foreground">Nenhuma execução de ferramenta registrada ainda</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Quando os usuários utilizarem o Formatador JSON, Calculadora Subnet, Gerador de Senhas ou Hashes, cada ação será contabilizada aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Tool Rankings */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground mb-4">
                  Ranking Real de Ferramentas Mais Usadas
                </h3>
                <div className="space-y-4">
                  {Object.entries(toolExecCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([toolId, count], idx) => {
                      const pct = Math.round((count / totalToolExecs) * 100);
                      const name = toolDisplayNames[toolId] || toolId;
                      return (
                        <div key={toolId} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground">#{idx + 1}</span>
                              <span>{name}</span>
                            </div>
                            <div className="font-mono text-primary font-bold">
                              {count} execuções ({pct}%)
                            </div>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Actions Breakdown */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground mb-4">
                  Distribuição Real de Ações
                </h3>
                <div className="space-y-4">
                  {Object.entries(actionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([action, count]) => {
                      const pct = Math.round((count / totalToolExecs) * 100);
                      const name = actionDisplayNames[action] || action;
                      return (
                        <div key={action} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span>{name}</span>
                            <span className="font-mono text-foreground">{count} vezes ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUPPLY & DEMAND ANALYSIS (REAL DATA) */}
      {activeTab === "market" && (
        <div className="space-y-8">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Inteligência de Mercado & Demanda Real</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este módulo analisa em tempo real os termos pesquisados pelos usuários no portal (<kbd className="font-mono">Cmd+K</kbd>) e cruza com a oferta atual de ferramentas, destacando lacunas de mercado para você criar novas ferramentas e capturar mais tráfego orgânico no Google.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Unmet Searches List */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-1">
                Buscas Não Atendidas no Portal (Demanda dos Usuários)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Termos pesquisados por usuários reais onde nenhuma ferramenta foi encontrada
              </p>

              {data.analysis.unmetSearchQueries.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <Search className="mx-auto h-6 w-6 text-muted-foreground/40 mb-2" />
                  Nenhuma busca sem resultado registrada até o momento.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.analysis.unmetSearchQueries.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 p-3"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-foreground">
                          &ldquo;{item.query}&rdquo;
                        </div>
                        <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
                          Categoria sugerida: {item.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-500">
                          {item.count} {item.count === 1 ? "busca" : "buscas"}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                            item.priority === "high" ? "bg-rose-500/10 text-rose-500" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.priority === "high" ? "Alta Prioridade" : "Normal"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Saturation */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-1">
                Oferta vs. Demanda por Categoria
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Distribuição de ferramentas e visualizações reais
              </p>

              <div className="space-y-4">
                {data.analysis.categorySupply.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5 rounded-lg border border-border/60 p-3 bg-muted/10">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{cat.category}</span>
                      <span className="font-mono text-primary font-bold">
                        Score: {cat.demandScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Oferta atual: {cat.toolCount} ferramentas</span>
                      <span>{cat.totalViews} views reais</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cat.demandScore}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Market Recommendations */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-1">
              🚀 Oportunidades de SEO e Novas Ferramentas
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Sugestões baseadas no tráfego e buscas reais do seu portal
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.analysis.marketRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-muted/20 p-5 hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
                        {rec.status.replace("_", " ")}
                      </span>
                      <span className="font-mono text-xs font-bold text-primary">
                        {rec.estimatedMonthlySearches}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground">
                      {rec.suggestedTool}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {rec.rationalePt}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px]">
                    <span className="text-muted-foreground capitalize">
                      Categoria: <strong className="text-foreground">{rec.targetCategory}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Complexidade: <strong className="text-emerald-500 capitalize">{rec.difficulty}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
