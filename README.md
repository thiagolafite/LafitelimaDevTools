# lafitelimadev.tools 🚀

> **Ferramentas Rápidas, Privadas e 100% no Navegador (Client-Side) para Desenvolvedores, Redes e Cibersegurança.**

Plataforma de alta performance construída em **Next.js 14+ (App Router)** com geração estática (**SSG**), suporte bilíngue nativo (**PT-BR e EN**), painel administrativo com telemetria 100% real e arquitetura pronta para aprovação imediata no **Google AdSense**.

---

## ⚡ Principais Funcionalidades

- 🔒 **100% Client-Side / Zero Data Leakage**: Todos os cálculos, senhas, hashes, conversões e payloads JSON são processados na RAM local do navegador via Web Crypto API e JavaScript puro.
- ⚡ **Zero Latência**: Sem requisições de backend para cálculos. Respostas instantâneas em microssegundos.
- 🌐 **Suporte Bilíngue Nativo (i18n)**: Roteamento por subpastas (`/[lang]/...`) com tags `hreflang` e sitemap dinâmico.
- 🔍 **SEO Programático & Schema.org**: Rich snippets para `WebApplication`, `FAQPage` e `BreadcrumbList`.
- 📊 **Painel Administrativo com Telemetria Real (`/admin`)**:
  - Tráfego de visitantes, países, navegadores e sessões ao vivo.
  - Ranking de ferramentas e distribuição de ações.
  - Registro de erros e exceções não tratadas.
  - Inteligência de mercado: Análise de Oferta vs. Demanda baseada em termos pesquisados pelos usuários no portal (<kbd>Cmd+K</kbd>).
- 💰 **Pronto para Monetização (Google AdSense)**:
  - Containers responsivos (`AdBanner.tsx`) com prevenção total de Cumulative Layout Shift (**CLS = 0**) e **Lazy Loading**.
  - Conteúdo didático aprofundado e guias técnicos em cada ferramenta para evitar "Thin Content".
  - Páginas institucionais obrigatórias: **Sobre Nós**, **Política de Privacidade (LGPD/GDPR)**, **Termos de Uso** e **Contato**.
  - Banner de consentimento de cookies (`CookieConsent.tsx`).

---

## 🛠️ Catálogo de Ferramentas

1. **Formatador & Validador JSON** (`/pt/tools/formatador-json` / `/en/tools/json-formatter`):
   - Validador com linha e coluna exatas do erro de sintaxe, indentação (2, 4 espaços, Tab) e minificador.
2. **Calculadora de Sub-rede CIDR IPv4** (`/pt/tools/calculadora-subnet` / `/en/tools/subnet-calculator`):
   - Network ID, Broadcast, hosts utilizáveis, máscara decimal, Wildcard Cisco e representação binária de 32 bits.
3. **Gerador de Senhas Criptográficas** (`/pt/tools/gerador-de-senhas` / `/en/tools/password-generator`):
   - Geração CSPRNG via `window.crypto.getRandomValues()`, medição de Entropia de Shannon em bits e simulação de ataque de força bruta.
4. **Codificador & Decodificador Base64** (`/pt/tools/codificador-base64` / `/en/tools/base64-tool`):
   - Suporte completo a UTF-8 (sem quebra de acentos ou emojis), modo URL-Safe (RFC 4648) e swap instantâneo.
5. **Gerador de Hashes Criptográficos** (`/pt/tools/gerador-de-hash` / `/en/tools/hash-generator`):
   - Cálculo simultâneo de SHA-256, SHA-512, SHA-384, SHA-1 e MD5 em tempo real.

---

## 💻 Stack Tecnológica

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide Icons](https://lucide.dev/)
- **Temas**: [next-themes](https://github.com/pacocoursey/next-themes) (Claro / Escuro / Sistema)
- **Notificações**: [Sonner](https://sonner.emilkowal.ski/)

---

## 📄 Licença
Este projeto está sob a licença MIT. Desenvolvido por **Lafite Lima Dev**.
