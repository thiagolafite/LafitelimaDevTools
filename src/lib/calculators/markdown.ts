export interface MarkdownStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export interface MarkdownTemplate {
  name: { en: string; pt: string };
  description: { en: string; pt: string };
  content: string;
}

export const MARKDOWN_TEMPLATES: MarkdownTemplate[] = [
  {
    name: { en: "Project README.md", pt: "README.md de Projeto" },
    description: { en: "Standard GitHub repository documentation", pt: "Documentação padrão para repositórios GitHub" },
    content: `# Project Name 🚀

> A fast, private, and lightweight developer utility built with modern web technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

---

## ⚡ Features

- 🔒 **100% Client-Side**: Zero data sent to servers.
- ⚡ **Zero Latency**: Real-time calculations in microseconds.
- 🌐 **Internationalization**: Full bilingual (EN / PT-BR) support.
- 📱 **Fully Responsive**: Mobile, tablet, and desktop optimized.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS |

---

## 🚀 Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/thiagolafite/LafitelimaDevTools.git

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
\`\`\`

---

## 📋 Task Checklist

- [x] Implement core calculation algorithms
- [x] Configure SEO schema and meta tags
- [ ] Add dark mode preferences sync
- [ ] Expand international locale translations

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
`,
  },
  {
    name: { en: "REST API Documentation", pt: "Documentação de API REST" },
    description: { en: "Clean endpoint specifications and payloads", pt: "Especificação de endpoints, rotas e payloads" },
    content: `# Users API Specification 📡

Base URL: \`https://api.example.com/v1\`

---

## 1. Authentication
All endpoints require a Bearer token in the \`Authorization\` header:

\`\`\`http
Authorization: Bearer <your_jwt_token_here>
\`\`\`

---

## 2. Endpoints

### \`GET /users\`
Retrieves a paginated list of active users.

#### Query Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`page\` | integer | No | Page number (default: 1) |
| \`limit\` | integer | No | Items per page (default: 20) |

#### Response:
\`\`\`json
{
  "status": "success",
  "data": [
    {
      "id": "usr_9824",
      "name": "Thiago Lafite",
      "role": "admin",
      "active": true
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5
  }
}
\`\`\`
`,
  },
  {
    name: { en: "Changelog / Release Notes", pt: "Changelog / Notas de Versão" },
    description: { en: "Semantic versioning release notes format", pt: "Formato de notas de versão com versionamento semântico" },
    content: `# Changelog 📝

All notable changes to this project will be documented in this file.

---

## [1.2.0] - 2026-09-10

### ✨ Added
- **Cron Expression Parser**: Visual builder and next execution calculator.
- **Regex Tester**: Real-time regex highlighting and group inspector.
- **Unix Timestamp**: Multi-timezone comparison table and epoch converter.
- **cURL Converter**: Converts curl to Fetch, Axios, Python, and Go.
- **Markdown Live Previewer**: Split-view editor with live HTML rendering.

### ⚡ Improved
- Enhanced client-side performance and reduced bundle sizes.
- Improved Core Web Vitals (CLS = 0).

### 🐛 Fixed
- Fixed sitemap routing for non-locale paths.
`,
  },
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function compileMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // 1. Code blocks (```lang ... ```)
  html = html.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<div class="code-block my-4 overflow-hidden rounded-xl border border-border bg-muted/30 font-mono text-xs"><div class="flex items-center justify-between border-b border-border px-4 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"><span>${lang || "code"}</span></div><pre class="p-4 overflow-x-auto text-foreground"><code>${escapeHtml(code.trim())}</code></pre></div>`;
  });

  // 2. Tables
  html = html.replace(/(?:(?:^|\n)\|[^\n]+\|\r?\n(?:\|(?:\s*:?-+:?\s*\|)+)\r?\n(?:\|[^\n]+\|\r?\n?)+)/g, (tableMatch) => {
    const lines = tableMatch.trim().split(/\r?\n/);
    if (lines.length < 2) return tableMatch;

    const headers = lines[0]
      .split("|")
      .slice(1, -1)
      .map((h) => `<th class="border-b border-border px-4 py-2.5 text-left font-bold text-foreground">${h.trim()}</th>`)
      .join("");

    const rows = lines
      .slice(2)
      .map((line) => {
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => `<td class="border-b border-border/50 px-4 py-2 text-muted-foreground">${c.trim()}</td>`)
          .join("");
        return `<tr class="hover:bg-muted/30 transition-colors">${cells}</tr>`;
      })
      .join("");

    return `<div class="my-6 overflow-x-auto rounded-xl border border-border bg-card"><table class="w-full text-xs text-left"><thead><tr class="bg-muted/40">${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // 3. Headings (# to ######)
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-sm font-bold text-foreground mt-4 mb-2">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-sm font-extrabold text-foreground mt-4 mb-2">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-extrabold text-foreground mt-5 mb-2">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-black text-foreground mt-6 mb-2 border-b border-border/30 pb-1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-black text-foreground mt-8 mb-3 border-b border-border pb-1.5">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-2 mb-4 pb-2 border-b-2 border-primary/30">$1</h1>');

  // 4. Horizontal rule (---)
  html = html.replace(/^---$/gim, '<hr class="my-6 border-border" />');

  // 5. Blockquotes (> ...)
  html = html.replace(/^> (.*$)/gim, '<blockquote class="my-3 border-l-4 border-primary bg-primary/5 px-4 py-2.5 rounded-r-xl text-xs sm:text-sm text-foreground italic">$1</blockquote>');

  // 6. Task lists (- [x] / - [ ])
  html = html.replace(/^- \[x\] (.*$)/gim, '<li class="flex items-center gap-2 list-none my-1 text-xs sm:text-sm text-foreground font-medium"><input type="checkbox" checked disabled class="rounded border-primary text-primary accent-primary h-3.5 w-3.5" /> <span class="line-through text-muted-foreground">$1</span></li>');
  html = html.replace(/^- \[ \] (.*$)/gim, '<li class="flex items-center gap-2 list-none my-1 text-xs sm:text-sm text-foreground font-medium"><input type="checkbox" disabled class="rounded border-border accent-primary h-3.5 w-3.5" /> <span>$1</span></li>');

  // 7. Unordered lists (- or *)
  html = html.replace(/^[*-] (.*$)/gim, '<li class="ml-4 list-disc text-xs sm:text-sm text-foreground my-1 leading-relaxed">$1</li>');

  // 8. Ordered lists (1. ...)
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-xs sm:text-sm text-foreground my-1 leading-relaxed">$1</li>');

  // 9. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary">$1</code>');

  // 10. Bold (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold text-foreground">$1</strong>');

  // 11. Italic (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-foreground">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="italic text-foreground">$1</em>');

  // 12. Strikethrough (~~text~~)
  html = html.replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>');

  // 13. Images (![alt](url))
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 max-w-full rounded-xl border border-border shadow-md" />');

  // 14. Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity">$1</a>');

  // 15. Paragraphs (lines that are not tags)
  const lines = html.split(/\r?\n/);
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<hr") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("<blockquote") ||
      trimmed.startsWith("<div") ||
      trimmed.startsWith("<table") ||
      trimmed.startsWith("<pre") ||
      trimmed.startsWith("<img")
    ) {
      return line;
    }
    return `<p class="my-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">${trimmed}</p>`;
  });

  return formattedLines.join("\n");
}

export function calculateMarkdownStats(text: string): MarkdownStats {
  const clean = text.trim();
  if (!clean) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
    };
  }

  const words = clean.split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const lines = text.split("\n").length;
  const paragraphs = clean.split(/\n\s*\n/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    readingTimeMinutes,
  };
}
