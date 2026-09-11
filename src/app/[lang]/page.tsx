import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  FileJson,
  Network,
  KeyRound,
  Binary,
  Hash,
  Search,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Check,
  Layers,
  Cpu,
  EyeOff,
  Flame,
  Globe,
  Terminal,
  Clock,
  Code2,
  FileText,
  Sliders,
} from "lucide-react";
import {
  siteConfig,
  SupportedLanguage,
  isValidLanguage,
  getTranslations,
} from "@/config/site";
import { toolsRegistry } from "@/config/tools.config";
import { JsonLd } from "@/components/shared/JsonLd";

interface HomePageProps {
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const lang = params?.lang;
  if (!isValidLanguage(lang)) {
    return { title: siteConfig.name };
  }

  const t = getTranslations(lang);
  const canonicalUrl = `${siteConfig.url}/${lang}`;

  return {
    title: t.siteTitle,
    description: t.siteDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en`,
        "pt-BR": `${siteConfig.url}/pt`,
        pt: `${siteConfig.url}/pt`,
        "x-default": `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      title: t.siteTitle,
      description: t.siteDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
  };
}

const iconMap = {
  FileJson,
  Network,
  KeyRound,
  Binary,
  Hash,
  Clock,
  Code2,
  Terminal,
  FileText,
  Sliders,
};

// Rich, user-friendly presentation profiles for each tool
const toolPresentations: Record<string, {
  badge: { pt: string; en: string };
  whatItIs: { pt: string; en: string };
  whatItDoes: { pt: string[]; en: string[] };
  whyUseIt: { pt: string; en: string };
  tags: string[];
  accentColor: string;
  iconBg: string;
}> = {
  "json-formatter": {
    badge: {
      pt: "Mais Utilizado • APIs & Web",
      en: "Most Popular • APIs & Web",
    },
    whatItIs: {
      pt: "Validador sintático e embelezador de JSON com detecção de erros em tempo real.",
      en: "Lightning-fast JSON syntax validator, beautifier, and structural inspector.",
    },
    whatItDoes: {
      pt: [
        "Organiza e formata JSON desordenado com 2 espaços, 4 espaços ou tabulação.",
        "Localiza a linha e a coluna exata de erros de sintaxe (vírgulas extras, aspas abertas).",
        "Minifica payloads para diminuir tráfego e acelerar requisições em APIs.",
      ],
      en: [
        "Beautifies messy JSON with clean 2-space, 4-space, or tab indentation.",
        "Pinpoints exact line and column numbers of syntax errors in real time.",
        "Minifies JSON payloads to minimize bandwidth and accelerate API responses.",
      ],
    },
    whyUseIt: {
      pt: "100% privado na memória do seu navegador. Nenhum token, payload ou dado corporativo é enviado para servidores externos.",
      en: "100% private in your local browser memory. Zero corporate data, tokens, or customer payloads are ever sent to external backends.",
    },
    tags: ["2/4 Espaços", "Detecção Linha/Coluna", "Minificação", "Upload & Download"],
    accentColor: "border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  "subnet-calculator": {
    badge: {
      pt: "Infraestrutura & Redes",
      en: "Infrastructure & Networking",
    },
    whatItIs: {
      pt: "Calculadora de arquitetura de redes TCP/IP, prefixos CIDR e hosts utilizáveis.",
      en: "Visual IPv4 subnet architecture calculator and CIDR prefix partitioning engine.",
    },
    whatItDoes: {
      pt: [
        "Calcula instantaneamente Endereço de Rede (ID), Broadcast e primeiro/último host útil.",
        "Converte prefixos CIDR (/0 a /32) em Máscaras Decimais e Máscara Wildcard Cisco.",
        "Exibe a divisão completa de 32 bits dos 4 octetos em código binário visual.",
      ],
      en: [
        "Instantly computes Network ID, Broadcast Address, and assignable host IP range.",
        "Converts CIDR prefixes (/0 to /32) into Subnet Masks and Cisco Wildcard masks.",
        "Breaks down 32-bit octets into side-by-side binary representation.",
      ],
    },
    whyUseIt: {
      pt: "Essencial para arquitetos de nuvem (AWS/Azure/GCP VPCs), administradores de infraestrutura e estudos para certificações CCNA.",
      en: "Indispensable for Cloud VPC architects (AWS/Azure/GCP), sysadmins, and Cisco CCNA/CompTIA certification study.",
    },
    tags: ["CIDR /0 a /32", "Wildcard Cisco", "Divisão Binária 32-bit", "Faixa de Hosts Úteis"],
    accentColor: "border-blue-500/30 hover:border-blue-500/60 bg-blue-500/5",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  "password-generator": {
    badge: {
      pt: "Segurança & Criptografia",
      en: "Security & Cryptography",
    },
    whatItIs: {
      pt: "Gerador de credenciais invioláveis com medição de entropia e tempo de quebra.",
      en: "Unbreakable password generator with Shannon entropy scoring and crack-time estimator.",
    },
    whatItDoes: {
      pt: [
        "Gera senhas aleatórias de alta segurança com o gerador CSPRNG nativo do sistema operacional.",
        "Calcula a Entropia de Shannon em bits e estima o tempo para quebra por força bruta.",
        "Permite geração em lote (até 10 senhas) e exclusão de caracteres ambíguos (ex: 1, l, I, 0, O).",
      ],
      en: [
        "Generates cryptographically secure passwords using OS hardware-level CSPRNG entropy.",
        "Calculates Shannon Entropy in bits and simulates offline brute-force crack times.",
        "Supports batch generation (up to 10 passwords) and filters confusing ambiguous characters.",
      ],
    },
    whyUseIt: {
      pt: "Proteção máxima contra ataques de dicionário e clusters de GPU. Suas senhas nunca passam pela internet.",
      en: "Maximum resilience against dictionary attacks and GPU cracking clusters. Generated passwords never touch the network.",
    },
    tags: ["CSPRNG Nativo", "Entropia de Shannon", "Estimativa de Força Bruta", "Geração em Lote"],
    accentColor: "border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  "base64-tool": {
    badge: {
      pt: "Conversores & Formatos",
      en: "Converters & Encoders",
    },
    whatItIs: {
      pt: "Conversor universal de textos, tokens e payloads binários para formato Base64.",
      en: "Universal text, token, and binary payload Base64 encoder and decoder.",
    },
    whatItDoes: {
      pt: [
        "Codifica e decodifica textos comuns, tokens e sequências de autenticação.",
        "Suporte completo a UTF-8 nativo (não quebra caracteres com acentos ou emojis).",
        "Formato seguro para URLs (URL-Safe RFC 4648 substituindo + e / por - e _).",
      ],
      en: [
        "Encodes and decodes plain text, authentication tokens, and data payloads.",
        "Native UTF-8 multi-byte support ensures special characters and emojis never corrupt.",
        "URL-Safe mode (RFC 4648) automatically replaces '+' and '/' with '-' and '_'.",
      ],
    },
    whyUseIt: {
      pt: "Indispensável no dia a dia com APIs REST, webhooks, JWTs e cabeçalhos HTTP sem latência.",
      en: "Essential for software developers integrating REST APIs, webhooks, JWTs, and HTTP headers with zero latency.",
    },
    tags: ["Suporte UTF-8 & Emojis", "Modo URL-Safe", "Swap Entrada/Saída", "Cópia Instantânea"],
    accentColor: "border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  "hash-generator": {
    badge: {
      pt: "Auditoria & Criptografia",
      en: "Security & Checksums",
    },
    whatItIs: {
      pt: "Gerador simultâneo de checksums e hashes criptográficos em tempo real.",
      en: "Real-time simultaneous cryptographic hash and checksum calculation engine.",
    },
    whatItDoes: {
      pt: [
        "Computa simultaneamente SHA-256, SHA-512, SHA-384, SHA-1 e MD5 enquanto você digita.",
        "Aceleração direta por hardware no seu navegador através da Web Crypto API.",
        "Alternância para hexadecimal maiúsculo/minúsculo e cópia em 1 clique.",
      ],
      en: [
        "Simultaneously computes SHA-256, SHA-512, SHA-384, SHA-1, and MD5 digests as you type.",
        "Hardware-accelerated inside your local browser using the native Web Crypto API.",
        "Uppercase/lowercase hex toggle with single-click clipboard copying.",
      ],
    },
    whyUseIt: {
      pt: "Perfeito para verificar integridade de downloads, conferir assinaturas de arquivos e auditorias de segurança.",
      en: "Perfect for verifying file download integrity, comparing release checksums, and cryptography audits.",
    },
    tags: ["SHA-256 / SHA-512", "MD5 Checksum", "Web Crypto API", "Cálculo Simultâneo"],
    accentColor: "border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  "cron-parser": {
    badge: {
      pt: "Agendamentos & Automação",
      en: "Schedules & Automation",
    },
    whatItIs: {
      pt: "Analisador, tradutor em texto claro e construtor visual de expressões cron.",
      en: "Visual cron builder, human-readable translator, and execution calculator.",
    },
    whatItDoes: {
      pt: [
        "Traduz expressões cron de 5 campos para linguagem natural em português claro.",
        "Calcula e lista as próximas 5 datas e horários exatos de disparo com contagem regressiva.",
        "Permite montar expressões visualmente por minuto, hora, dia, mês e dia da semana.",
      ],
      en: [
        "Translates 5-field cron expressions into plain English human-readable schedules.",
        "Computes and displays the next 5 upcoming execution timestamps with countdowns.",
        "Provides visual selectors for minutes, hours, days, months, and weekdays.",
      ],
    },
    whyUseIt: {
      pt: "Evite erros críticos de agendamento em servidores, tarefas em background e pipelines CI/CD.",
      en: "Avoid critical scheduling mistakes on Linux servers, cloud crons, and background queues.",
    },
    tags: ["Tradução em Português", "Próximos 5 Disparos", "Construtor Visual", "Presets Rápidos"],
    accentColor: "border-teal-500/30 hover:border-teal-500/60 bg-teal-500/5",
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  "regex-tester": {
    badge: {
      pt: "Validação & Expressões",
      en: "Validation & Patterns",
    },
    whatItIs: {
      pt: "Testador interativo de Expressões Regulares com realce visual em tempo real.",
      en: "Interactive Regular Expression tester with live match highlighting and group inspector.",
    },
    whatItDoes: {
      pt: [
        "Destaque visual colorido de todos os matches encontrados no texto de teste.",
        "Inspetor de grupos de captura ($1, $2, nomeados) com posições e linhas exatas.",
        "Modo de substituição (replace) em tempo real e biblioteca com exemplos prontos (E-mail, CPF, URL).",
      ],
      en: [
        "Real-time visual color-highlighting of all regex matches in the test string.",
        "Capture group inspector ($1, $2) with exact start/end indices and line numbers.",
        "Live replace mode and built-in preset library (Email, Phone, CPF, IPv4, Date).",
      ],
    },
    whyUseIt: {
      pt: "Depure e valide expressões regulares complexas em microssegundos com total privacidade.",
      en: "Debug and validate complex regexes in microseconds directly in your browser.",
    },
    tags: ["Highlight em Tempo Real", "Grupos de Captura", "Modo Replace", "Presets Prontos"],
    accentColor: "border-rose-500/30 hover:border-rose-500/60 bg-rose-500/5",
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  "timestamp-converter": {
    badge: {
      pt: "Tempo & Fusos Horários",
      en: "Time & Global Epoch",
    },
    whatItIs: {
      pt: "Conversor de Unix Epoch para datas legíveis e tabela de fusos horários mundiais.",
      en: "Unix Epoch to human date converter and multi-timezone comparison table.",
    },
    whatItDoes: {
      pt: [
        "Converte timestamps em segundos e milissegundos para ISO 8601, RFC 2822 e datas locais.",
        "Tabela comparativa em tempo real para Brasília (BRT), UTC, Nova York, Londres e Tóquio.",
        "Relógio Epoch atual em tempo real com botão de cópia e atalhos de ajuste (+1h, +1d, +7d).",
      ],
      en: [
        "Converts seconds and milliseconds to ISO 8601, RFC 2822, and localized date strings.",
        "Side-by-side timezone matrix for Brasília (BRT), UTC, New York, London, and Tokyo.",
        "Live ticking epoch clock with 1-click copying and quick offset adjustments (+1h, +1d).",
      ],
    },
    whyUseIt: {
      pt: "Indispensável para conferir logs de servidores, debugar APIs e converter timestamps de bancos de dados.",
      en: "Essential for debugging API timestamps, server log inspection, and database time conversion.",
    },
    tags: ["Relógio em Tempo Real", "Horário de Brasília", "Fusos Mundiais", "ISO 8601 & RFC"],
    accentColor: "border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/5",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  "curl-converter": {
    badge: {
      pt: "APIs & Integração",
      en: "APIs & Code Generation",
    },
    whatItIs: {
      pt: "Conversor universal de comandos cURL para código Fetch, Axios, Python, Go e PHP.",
      en: "Universal cURL command to Fetch, Axios, Python Requests, Go and PHP code converter.",
    },
    whatItDoes: {
      pt: [
        "Analisa parâmetros (-X, -H, -d, -u, -b, --data-raw) e extrai URLs, headers e payloads.",
        "Gera snippets limpos e funcionais para JavaScript (Fetch/Axios), Python, Go, PHP, C# e Rust.",
        "Formata automaticamente payloads JSON e lida com autenticação Basic/Bearer.",
      ],
      en: [
        "Parses command-line flags (-X, -H, -d, -u, -b) to extract URLs, headers, and bodies.",
        "Generates clean, idiomatic snippets for JavaScript (Fetch/Axios), Python, Go, PHP, and C#.",
        "Auto-formats JSON payloads with proper indentation and maps Basic/Bearer auth.",
      ],
    },
    whyUseIt: {
      pt: "Copie requisições do DevTools do navegador e transforme-as em código limpo para o seu projeto em 1 segundo.",
      en: "Copy requests directly from browser DevTools and turn them into production code in 1 second.",
    },
    tags: ["Fetch & Axios", "Python Requests", "Go net/http", "Formatação JSON"],
    accentColor: "border-orange-500/30 hover:border-orange-500/60 bg-orange-500/5",
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  "markdown-preview": {
    badge: {
      pt: "Documentação & Texto",
      en: "Docs & Writing",
    },
    whatItIs: {
      pt: "Editor Markdown com visualização HTML ao vivo lado a lado e barra de formatação rápida.",
      en: "Split-view real-time Markdown editor with live HTML rendering and quick toolbar.",
    },
    whatItDoes: {
      pt: [
        "Renderização HTML instantânea com suporte completo a tabelas, blocos de código e tarefas.",
        "Barra de atalhos para negrito, itálico, títulos, citações, tabelas, links e imagens.",
        "Estatísticas em tempo real (palavras, caracteres, tempo de leitura) e exportação .md/.html.",
      ],
      en: [
        "Instant live HTML preview supporting GFM tables, code blocks, and interactive task lists.",
        "Quick formatting toolbar for bold, italic, headings, blockquotes, tables, and links.",
        "Real-time stats (word count, characters, reading time) and 1-click .md/.html exports.",
      ],
    },
    whyUseIt: {
      pt: "Escreva e revise READMEs de projetos, especificações de APIs e documentações técnicas com agilidade.",
      en: "Write and review project READMEs, API docs, and technical specifications with speed.",
    },
    tags: ["Split View ao Vivo", "Suporte a Tabelas", "Exportar HTML/MD", "Contador de Palavras"],
    accentColor: "border-sky-500/30 hover:border-sky-500/60 bg-sky-500/5",
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
};

export default function HomePage({ params }: HomePageProps) {
  const rawLang = params?.lang;
  if (!isValidLanguage(rawLang)) {
    notFound();
  }

  const lang: SupportedLanguage = rawLang;
  const t = getTranslations(lang);

  const platformFaqs = [
    {
      question:
        lang === "pt"
          ? "Como o lafitelimadev.tools garante privacidade absoluta?"
          : "How does lafitelimadev.tools guarantee total privacy?",
      answer:
        lang === "pt"
          ? "Todas as ferramentas são executadas exclusivamente através de JavaScript e Web Crypto no seu próprio navegador. Nenhum payload, senha, IP ou código JSON é enviado para servidores externos."
          : "All utilities execute exclusively via JavaScript and Web Crypto inside your browser. No payloads, passwords, IP queries or JSON snippets are ever transmitted to any external backend.",
    },
    {
      question:
        lang === "pt"
          ? "As ferramentas funcionam offline?"
          : "Do these tools work offline?",
      answer:
        lang === "pt"
          ? "Sim. Uma vez que a página é carregada em seu navegador, você pode desconectar a internet e continuar gerando senhas, calculando sub-redes e formatando JSON normalmente."
          : "Yes. Once the page is loaded, you can disconnect from the internet and continue generating passwords, calculating subnets, and formatting JSON without interruption.",
    },
    {
      question:
        lang === "pt"
          ? "O serviço é gratuito para uso comercial?"
          : "Is the platform free for commercial use?",
      answer:
        lang === "pt"
          ? "Sim, 100% gratuito para desenvolvedores, empresas, estudantes e profissionais de segurança sem restrições ou limites de requisições."
          : "Yes, 100% free for developers, enterprises, students, and security professionals with zero limits or request caps.",
    },
  ];

  return (
    <>
      <JsonLd
        webApp={{
          name: siteConfig.name,
          description: t.siteDescription,
          url: `${siteConfig.url}/${lang}`,
          applicationCategory: "DeveloperApplication",
          inLanguage: lang,
        }}
        faqs={platformFaqs}
      />

      <div className="flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t.privacyBadge}</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {lang === "pt" ? (
                <>
                  Ferramentas Rápidas e Privadas <br />
                  <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    100% no seu Navegador
                  </span>
                </>
              ) : (
                <>
                  Fast, Private Developer Utilities <br />
                  <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    100% In-Browser Execution
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              {lang === "pt"
                ? "Produtividade instantânea para desenvolvedores, arquitetos de rede e segurança. Sem cadastro, sem anúncios intrusivos e com zero envio de dados para servidores."
                : "Instant workflow utilities for developers, network engineers, and security teams. Zero login, zero ads, and zero server data leakage."}
            </p>

            {/* Quick Filter Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {siteConfig.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${lang}/categories/${cat.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:border-primary hover:bg-muted/60 transition-all hover:scale-105"
                >
                  <span>{cat.name[lang]}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE PILLARS (Why Developers Love TechTools Hub) */}
        <section className="w-full border-b border-border/60 py-10 bg-muted/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {lang === "pt" ? "Privacidade Absoluta" : "Zero Server Transmission"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "pt"
                      ? "Dados e senhas processados apenas na RAM do seu dispositivo."
                      : "All computation occurs exclusively inside your browser."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {lang === "pt" ? "Velocidade Instantânea" : "Zero Latency Execution"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "pt"
                      ? "Sem requisições de rede. Respostas imediatas em milissegundos."
                      : "No backend roundtrips. Instant sub-millisecond calculation."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {lang === "pt" ? "Focado em Produtividade" : "Developer Centric"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "pt"
                      ? "Atalhos rápidos, cópia em 1 clique e suporte a arquivos grandes."
                      : "1-click copy, quick keyboard shortcuts, and file upload/export."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN SECTION: PRESENTATION OF EACH TOOL (Showcase atraente e intuitivo) */}
        <section className="w-full py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                {lang === "pt" ? "Catálogo de Ferramentas" : "Tool Suite Showcase"}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {lang === "pt"
                  ? "Conheça Todas as Ferramentas Disponíveis"
                  : "Explore Our Full Suite of Utilities"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "pt"
                  ? "Entenda o que cada ferramenta faz, do que se trata e como ela economiza o seu tempo no dia a dia."
                  : "Discover what each utility accomplishes, how it works, and how it accelerates your daily development workflow."}
              </p>
            </div>

            {/* Individual Interactive Tool Presentation Cards */}
            <div className="grid grid-cols-1 gap-8">
              {toolsRegistry.map((tool, index) => {
                const IconComponent = iconMap[tool.iconName] || Wrench;
                const locale = tool.locales[lang];
                const toolUrl = `/${lang}/tools/${tool.slugs[lang]}`;
                const pres = toolPresentations[tool.id as keyof typeof toolPresentations];

                return (
                  <div
                    key={tool.id}
                    className={`relative overflow-hidden rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg bg-card ${
                      pres?.accentColor || "border-border"
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                      {/* Left: Tool Summary & Core Value */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-muted px-3 py-0.5 text-[11px] font-bold text-foreground uppercase tracking-wider">
                            #{index + 1} {tool.category}
                          </span>
                          {pres?.badge && (
                            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary">
                              {pres.badge[lang]}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                              pres?.iconBg || "bg-primary/10 text-primary"
                            }`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-foreground">
                              {locale.name}
                            </h3>
                            <p className="text-xs font-semibold text-primary mt-0.5">
                              {pres?.whatItIs[lang] || locale.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* O que faz (Bullet points intuitivos) */}
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {lang === "pt" ? "O que esta ferramenta faz:" : "Key Capabilities:"}
                          </h4>
                          <div className="space-y-1.5">
                            {(pres?.whatItDoes[lang] || [locale.shortDescription]).map(
                              (point, pIdx) => (
                                <div key={pIdx} className="flex items-start gap-2 text-xs text-foreground">
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                                  <span>{point}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Por que usar (Destaque de Privacidade/Performance) */}
                        {pres?.whyUseIt && (
                          <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs leading-relaxed text-muted-foreground">
                            <span className="font-bold text-foreground">
                              {lang === "pt" ? "💡 Por que usar: " : "💡 Why use it: "}
                            </span>
                            {pres.whyUseIt[lang]}
                          </div>
                        )}
                      </div>

                      {/* Right: Feature Badges & Action Button */}
                      <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-border/80 bg-background/60 p-5 space-y-5 lg:h-full">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                            {lang === "pt" ? "Recursos Principais" : "Highlighted Features"}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {(pres?.tags || [tool.category]).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                          <Link
                            href={toolUrl}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <span>
                              {lang === "pt" ? `Abrir ${locale.name.split(" ")[0]}` : `Open ${locale.name.split(" ")[0]}`}
                            </span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="w-full border-t border-border/60 py-16 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {t.faqSectionTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {platformFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <h3 className="text-sm font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
