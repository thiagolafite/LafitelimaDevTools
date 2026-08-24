# Guia Completo: Publicando o TechTools Hub no Ar e Indexando no Google

Este guia contém todos os parâmetros, comandos e passos práticos para colocar o **TechTools Hub** em produção e garantir indexação máxima nos motores de busca do Google.

---

## 1. Parâmetros de Configuração (.env)

Crie ou configure as variáveis no seu provedor de hospedagem (Vercel, Cloudflare, VPS):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Domínio público oficial com HTTPS (sem barra no final) | `https://techtools-hub.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Código de verificação do Google Search Console | `abcd1234efgh5678ijkl` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID de medição do Google Analytics 4 | `G-ABC123XYZ` |
| `NEXT_PUBLIC_ADMIN_PIN` | Senha de acesso ao seu painel privado `/admin` | `SuaSenhaForte2026!` |

---

## 2. Opções Recomendadas de Deploy (100% Gratuito / Serverless)

### Opção A: Vercel (Recomendado para Next.js)
1. Instale o CLI da Vercel (se desejar via terminal):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Ou conecte seu repositório GitHub diretamente em [vercel.com/new](https://vercel.com/new).
3. Em **Environment Variables**, adicione os 4 parâmetros da tabela acima.
4. Clique em **Deploy**. Seu site estará no ar em menos de 1 minuto com CDN global e SSL automático.

### Opção B: Cloudflare Pages / Netlify
1. Conecte o repositório.
2. Comando de Build: `npm run build`
3. Diretório de Saída: `.next`

### Opção C: VPS / Docker / Servidor Node.js
```bash
# Build e execução de produção
npm run build
npm run start -p 3000
```

---

## 3. Passo a Passo para Indexar no Google

### Passo 1: Adicionar a Propriedade no Google Search Console
1. Acesse o [Google Search Console](https://search.google.com/search-console).
2. Clique em **Adicionar Propriedade**.
3. Escolha **Prefixo do URL** e digite o seu domínio (ex: `https://techtools-hub.com`).
4. Selecione o método de verificação **Tag HTML**.
5. Copie o valor do código dentro de `content="..."` e cole na variável de ambiente `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
6. Faça o deploy e clique em **Verificar** no Google.

### Passo 2: Enviar o Sitemap Dinâmico
1. No menu lateral do Google Search Console, clique em **Sitemaps**.
2. No campo "Adicionar um novo sitemap", digite:
   ```
   sitemap.xml
   ```
3. Clique em **Enviar**.
4. O Google irá ler automaticamente todas as URLs em Português (`/pt/...`) e Inglês (`/en/...`) com suas respectivas tags `hreflang` e canonicals.

### Passo 3: Ativar o Google Analytics 4 (GA4)
1. Acesse o [Google Analytics](https://analytics.google.com/).
2. Crie uma propriedade Web e copie o **ID de Medição** (inicia com `G-`).
3. Adicione à variável `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. O script oficial `gtag.js` será injetado automaticamente de forma otimizada no `<head>`.

### Passo 4: Testar Resultados Ricos e Schema.org
1. Acesse o [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Digite qualquer URL do seu site (ex: `https://techtools-hub.com/pt/tools/formatador-json`).
3. O validador do Google confirmará a presença válida de:
   - ✅ **WebApplication**: Informando categoria de desenvolvedor e preço grátis.
   - ✅ **FAQPage**: Perguntas e respostas expandidas diretamente nos snippets de busca do Google.
   - ✅ **BreadcrumbList**: Navegação estruturada em migalhas de pão.

---

## 4. Acessando seu Painel de Administrador

Após publicar o site:
- Acesse a rota: `https://seusite.com/admin`
- Digite o PIN configurado em `NEXT_PUBLIC_ADMIN_PIN` (padrão: `admin123`).
- Você poderá acompanhar:
  - Visitantes em tempo real, países e navegadores;
  - Logs de erros e exceções de sintaxe de usuários;
  - Ranking de ferramentas e ações mais usadas;
  - Análise de **Oferta vs. Demanda** com termos pesquisados pelos visitantes no seu portal.
