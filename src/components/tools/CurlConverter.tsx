"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Copy,
  Check,
  Sparkles,
  Code2,
  FileCode,
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseCurlCommand,
  generateCodeSnippets,
  GeneratedCodeSnippets,
  ParsedCurl,
} from "@/lib/calculators/curl";
import { SupportedLanguage } from "@/config/site";
import { cn } from "@/lib/utils";
import { logToolUsage } from "@/lib/telemetry";

interface CurlConverterProps {
  lang: SupportedLanguage;
  onRegisterClear?: (fn: () => void) => void;
  onRegisterCopy?: (fn: () => void) => void;
}

const SAMPLE_CURLS = [
  {
    name: "POST JSON with Auth",
    cmd: `curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my_secret_token_123" \\
  -d '{"name": "Thiago Lafite", "email": "thiago@lafitelima.com.br", "role": "admin"}'`,
  },
  {
    name: "GET with Query & Headers",
    cmd: `curl -X GET "https://api.github.com/repos/thiagolafite/LafitelimaDevTools/stargazers?per_page=100" \\
  -H "Accept: application/vnd.github.v3+json" \\
  -H "User-Agent: LafitelimaDevTools-Client"`,
  },
  {
    name: "PUT Update Resource",
    cmd: `curl -X PUT https://api.stripe.com/v1/customers/cus_12345 \\
  -u "sk_test_51Mz...:" \\
  -d "description=Premium Subscriber"`,
  },
  {
    name: "DELETE Resource",
    cmd: `curl -X DELETE https://api.example.com/v1/sessions/sess_9824 \\
  -H "Authorization: Bearer eyJhbGciOi..."`,
  },
];

type LanguageKey = keyof GeneratedCodeSnippets;

const CODE_LANGUAGES: { key: LanguageKey; name: string; langLabel: string }[] = [
  { key: "jsFetch", name: "JavaScript (Fetch)", langLabel: "javascript" },
  { key: "jsAxios", name: "JavaScript / TS (Axios)", langLabel: "typescript" },
  { key: "pythonRequests", name: "Python (requests)", langLabel: "python" },
  { key: "goNetHttp", name: "Go (net/http)", langLabel: "go" },
  { key: "phpCurl", name: "PHP (cURL)", langLabel: "php" },
  { key: "nodeHttps", name: "Node.js (https)", langLabel: "javascript" },
  { key: "csharpHttpClient", name: "C# (.NET HttpClient)", langLabel: "csharp" },
  { key: "rustReqwest", name: "Rust (reqwest)", langLabel: "rust" },
];

export function CurlConverter({
  lang,
  onRegisterClear,
  onRegisterCopy,
}: CurlConverterProps) {
  const [curlInput, setCurlInput] = useState(SAMPLE_CURLS[0].cmd);
  const [selectedLang, setSelectedLang] = useState<LanguageKey>("jsFetch");
  const [parsed, setParsed] = useState<ParsedCurl>(() => parseCurlCommand(SAMPLE_CURLS[0].cmd));
  const [snippets, setSnippets] = useState<GeneratedCodeSnippets>(() =>
    generateCodeSnippets(parseCurlCommand(SAMPLE_CURLS[0].cmd))
  );
  const [copied, setCopied] = useState(false);

  const isPt = lang === "pt";

  useEffect(() => {
    try {
      const p = parseCurlCommand(curlInput);
      setParsed(p);
      const s = generateCodeSnippets(p);
      setSnippets(s);
    } catch {
      // Fallback
    }
  }, [curlInput]);

  const activeSnippet = snippets[selectedLang] || "";

  const handleCopyCode = () => {
    if (!activeSnippet) return;
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    toast.success(isPt ? "Código copiado para a área de transferência!" : "Code copied to clipboard!");
    logToolUsage("curl-converter", "copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCurlInput("");
  };

  useEffect(() => {
    if (onRegisterClear) onRegisterClear(handleClear);
    if (onRegisterCopy) onRegisterCopy(handleCopyCode);
  }, [activeSnippet]);

  return (
    <div className="space-y-6">
      {/* Input cURL Command Card */}
      <div className="rounded-2xl border-2 border-primary/20 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span>{isPt ? "Comando cURL de Origem" : "cURL Command Input"}</span>
          </label>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
              {isPt ? "Exemplos:" : "Examples:"}
            </span>
            {SAMPLE_CURLS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => {
                  setCurlInput(sample.cmd);
                  toast.success(isPt ? `Exemplo ${sample.name} carregado!` : `Loaded ${sample.name}`);
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all",
                  curlInput === sample.cmd
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background/80 text-muted-foreground hover:text-foreground"
                )}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={curlInput}
          onChange={(e) => setCurlInput(e.target.value)}
          rows={5}
          placeholder="Cole seu comando curl aqui..."
          className="w-full rounded-xl border border-border bg-background p-4 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-inner resize-y"
        />

        {/* Parsed Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
            {parsed.method}
          </span>
          <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-foreground truncate max-w-[280px] sm:max-w-md">
            {parsed.url}
          </span>
          <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
            {Object.keys(parsed.headers).length} {isPt ? "cabeçalhos" : "headers"}
          </span>
          {parsed.data && (
            <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Payload {parsed.jsonData ? "(JSON)" : "(Raw)"}
            </span>
          )}
          {parsed.auth && (
            <span className="rounded-md bg-amber-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Basic Auth
            </span>
          )}
        </div>
      </div>

      {/* Generated Code Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Language Tabs */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {CODE_LANGUAGES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedLang(item.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                  selectedLang === item.key
                    ? "bg-card text-primary shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all ml-4 shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{isPt ? "Copiado!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{isPt ? "Copiar Código" : "Copy Code"}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative p-4 sm:p-6 bg-background/90">
          <pre className="font-mono text-xs sm:text-sm text-foreground overflow-x-auto leading-relaxed whitespace-pre">
            <code>{activeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
