"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Columns,
  Code2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Table as TableIcon,
  Link2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  compileMarkdownToHtml,
  calculateMarkdownStats,
  MARKDOWN_TEMPLATES,
  MarkdownStats,
} from "@/lib/calculators/markdown";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface MarkdownPreviewerProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

type ViewMode = "split" | "editor" | "preview" | "html";

export function MarkdownPreviewer({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: MarkdownPreviewerProps) {
  const [markdown, setMarkdown] = useState(MARKDOWN_TEMPLATES[0].content);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const isPt = lang === "pt";

  const compiledHtml = useMemo(() => compileMarkdownToHtml(markdown), [markdown]);
  const stats: MarkdownStats = useMemo(() => calculateMarkdownStats(markdown), [markdown]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    toast.success(isPt ? "Markdown copiado!" : "Markdown copied!");
    logToolUsage("markdown-preview", "copy");
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(compiledHtml);
    setCopiedHtml(true);
    toast.success(isPt ? "HTML renderizado copiado!" : "HTML output copied!");
    logToolUsage("markdown-preview", "copy");
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadFile = (ext: "md" | "html") => {
    const content = ext === "md" ? markdown : compiledHtml;
    const filename = ext === "md" ? "document.md" : "document.html";
    const blob = new Blob([content], {
      type: ext === "md" ? "text/markdown;charset=utf-8" : "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(isPt ? `Arquivo ${filename} baixado!` : `Downloaded ${filename}!`);
    logToolUsage("markdown-preview", "download");
  };

  const insertFormatting = (before: string, after = "") => {
    setMarkdown((prev) => `${prev}\n${before}${after}`);
  };

  const handleClear = () => {
    setMarkdown("");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopyMarkdown);
  }, [markdown]);

  return (
    <div className="space-y-6">
      {/* Top Controls & Template Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              viewMode === "split"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Columns className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isPt ? "Lado a Lado" : "Split View"}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("editor")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              viewMode === "editor"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isPt ? "Editor" : "Editor"}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              viewMode === "preview"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{isPt ? "Preview" : "Preview"}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("html")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              viewMode === "html"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>HTML</span>
          </button>
        </div>

        {/* Templates and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Templates Dropdown */}
          <select
            onChange={(e) => {
              const tmpl = MARKDOWN_TEMPLATES.find((t) => t.name.en === e.target.value);
              if (tmpl) {
                setMarkdown(tmpl.content);
                toast.success(
                  isPt ? `Modelo carregado: ${tmpl.name.pt}` : `Template loaded: ${tmpl.name.en}`
                );
              }
            }}
            defaultValue=""
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
          >
            <option value="" disabled>
              {isPt ? "Carregar modelo pronto..." : "Load sample template..."}
            </option>
            {MARKDOWN_TEMPLATES.map((t) => (
              <option key={t.name.en} value={t.name.en}>
                {isPt ? t.name.pt : t.name.en}
              </option>
            ))}
          </select>

          {/* Export Dropdown / Buttons */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPt ? "Copiar MD" : "Copy MD"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Code2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPt ? "Copiar HTML" : "Copy HTML"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadFile("md")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>.md</span>
          </button>
        </div>
      </div>

      {/* Formatting Quick Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-card p-2 rounded-xl border border-border shadow-xs">
        <button
          type="button"
          onClick={() => insertFormatting("**Texto em Negrito**")}
          title="Negrito (**text**)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("*Texto em Itálico*")}
          title="Itálico (*text*)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("# Título Principal")}
          title="Título 1 (#)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("## Subtítulo")}
          title="Título 2 (##)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("> Citação de destaque")}
          title="Citação (>)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("```typescript\nconsole.log('Hello World');\n```")}
          title="Bloco de Código"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("- [ ] Tarefa pendente\n- [x] Tarefa concluída")}
          title="Lista de Tarefas"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <CheckSquare className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("| Cabeçalho 1 | Cabeçalho 2 |\n| :--- | :--- |\n| Valor 1 | Valor 2 |")}
          title="Tabela"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <TableIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("[Texto do Link](https://exemplo.com)")}
          title="Inserir Link"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("![Legenda da Imagem](https://placehold.co/600x400)")}
          title="Inserir Imagem"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Main Split / Single View Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 min-h-[500px]">
        {/* Editor Area */}
        {(viewMode === "split" || viewMode === "editor") && (
          <div className={cn("space-y-2", viewMode === "split" ? "lg:col-span-6" : "lg:col-span-12")}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5 text-primary" />
                <span>Editor Markdown</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {stats.lines} {isPt ? "linhas" : "lines"}
              </span>
            </div>

            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Escreva ou cole seu conteúdo em Markdown aqui..."
              className="h-[550px] w-full rounded-2xl border border-border bg-card p-4 font-mono text-xs sm:text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden shadow-inner resize-none"
            />
          </div>
        )}

        {/* Rendered HTML Live Preview */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className={cn("space-y-2", viewMode === "split" ? "lg:col-span-6" : "lg:col-span-12")}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                <span>{isPt ? "Preview Renderizado" : "Live HTML Preview"}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ~{stats.readingTimeMinutes} min {isPt ? "de leitura" : "read"}
              </span>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: compiledHtml }}
              className="h-[550px] w-full overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-sm prose dark:prose-invert max-w-none text-foreground"
            />
          </div>
        )}

        {/* Raw HTML Code View */}
        {viewMode === "html" && (
          <div className="lg:col-span-12 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>HTML Output (Raw)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
              >
                {copiedHtml ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHtml ? (isPt ? "Copiado!" : "Copied!") : isPt ? "Copiar HTML" : "Copy HTML"}</span>
              </button>
            </div>

            <pre className="h-[550px] w-full overflow-y-auto rounded-2xl border border-border bg-background p-6 font-mono text-xs text-foreground shadow-inner leading-relaxed whitespace-pre-wrap">
              <code>{compiledHtml}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <span>
            <strong className="text-foreground">{stats.words}</strong> {isPt ? "palavras" : "words"}
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{stats.characters}</strong> {isPt ? "caracteres" : "chars"}
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{stats.charactersNoSpaces}</strong> {isPt ? "sem espaços" : "no spaces"}
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{stats.paragraphs}</strong> {isPt ? "parágrafos" : "paragraphs"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadFile("html")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-bold text-foreground hover:bg-muted transition-colors"
          >
            <Download className="h-3 w-3" />
            <span>{isPt ? "Baixar HTML" : "Export HTML"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
