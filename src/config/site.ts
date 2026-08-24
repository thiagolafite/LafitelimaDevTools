export type SupportedLanguage = "en" | "pt";

export interface CategoryInfo {
  id: string;
  name: {
    en: string;
    pt: string;
  };
  description: {
    en: string;
    pt: string;
  };
  icon: string;
}

export const siteConfig = {
  name: "lafitelimadev.tools",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lafitelimadev.tools",
  ogImage: "https://lafitelimadev.tools/og.png",
  creator: "Lafite Lima Dev",
  contactEmail: "contact@lafitelimadev.tools",
  defaultLanguage: "en" as SupportedLanguage,
  supportedLanguages: ["en", "pt"] as const,
  // Google SEO, AdSense & Verification Parameters
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  adSenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN || "admin123",
  translations: {
    en: {
      siteTitle: "lafitelimadev.tools — Fast, 100% Client-Side Developer & Network Utilities",
      siteDescription:
        "Free, private, zero-latency developer and network tools by Lafite Lima Dev. Format JSON, calculate CIDR IPv4 subnets, generate cryptographic passwords, compute SHA/MD5 hashes with 100% client-side execution.",
      heroTitle: "Fast, Private & 100% Client-Side Developer Tools",
      heroSubtitle:
        "Developer, network and security utilities executed directly inside your browser. Zero backend tracking, zero server latency, complete privacy.",
      searchPlaceholder: "Search tools (e.g. JSON Formatter, Subnet CIDR, SHA256, Password)...",
      searchShortcut: "Cmd + K",
      categoriesTitle: "Browse by Category",
      featuredToolsTitle: "Featured Developer Tools",
      allToolsTitle: "All Engineering Utilities",
      whyUsTitle: "Why lafitelimadev.tools?",
      privacyFeatureTitle: "100% Client-Side Execution",
      privacyFeatureDesc:
        "All calculations and processing happen exclusively inside your browser memory. No credentials, tokens or payloads ever touch an external server.",
      speedFeatureTitle: "Blazing Fast & Zero Latency",
      speedFeatureDesc:
        "No network roundtrips for processing. Native WebAssembly, Web Crypto, and optimized JS algorithms run in microseconds.",
      seoFeatureTitle: "In-Depth Technical Guides",
      speedFeatureSeo: "Deep technical references, RFC standards, and step-by-step guides built for modern engineering teams.",
      faqSectionTitle: "Frequently Asked Questions",
      footerRights: "All rights reserved. Built for developers, sysadmins & cybersecurity pros.",
      viewTool: "Open Tool",
      copiedToast: "Copied to clipboard!",
      shareToast: "Link copied to clipboard!",
      clearButton: "Clear",
      copyButton: "Copy",
      shareButton: "Share",
      howItWorks: "How It Works & Technical Architecture",
      faqTitle: "Frequently Asked Questions",
      privacyBadge: "100% Client-Side / Zero Data Sent to Servers",
      navAbout: "About",
      navPrivacy: "Privacy Policy",
      navTerms: "Terms of Use",
      navContact: "Contact",
    },
    pt: {
      siteTitle: "lafitelimadev.tools — Ferramentas Rápidas 100% Client-Side para Desenvolvedores e Redes",
      siteDescription:
        "Utilitários gratuitos, privados e de alta performance por Lafite Lima Dev. Formatador JSON, Calculadora de Sub-rede CIDR, Gerador de Senhas e Hashes sem envio de dados para servidores.",
      heroTitle: "Ferramentas Rápidas, Privadas e 100% no seu Navegador",
      heroSubtitle:
        "Utilitários de desenvolvimento, redes e segurança executados diretamente na memória do seu navegador. Zero rastreamento, zero latência de servidor e privacidade absoluta.",
      searchPlaceholder: "Buscar ferramentas (ex: JSON, Subnet CIDR, SHA256, Senha)...",
      searchShortcut: "Ctrl + K",
      categoriesTitle: "Navegue por Categorias",
      featuredToolsTitle: "Ferramentas em Destaque",
      allToolsTitle: "Todos os Utilitários",
      whyUsTitle: "Por que o lafitelimadev.tools?",
      privacyFeatureTitle: "100% Client-Side",
      privacyFeatureDesc:
        "Todos os cálculos e processamentos ocorrem exclusivamente na sua máquina. Nenhuma senha, JSON ou payload é enviado para a nuvem.",
      speedFeatureTitle: "Execução Instantânea",
      speedFeatureDesc:
        "Sem requisições de backend para processamento. Algoritmos nativos de Web Crypto e JS puro executados em microssegundos.",
      seoFeatureTitle: "Guias Técnicos Aprofundados",
      speedFeatureSeo: "Tabelas de referência, padrões RFC e guias passo a passo estruturados para engenheiros de software.",
      faqSectionTitle: "Perguntas Frequentes",
      footerRights: "Todos os direitos reservados. Feito para desenvolvedores, sysadmins e profissionais de cibersegurança.",
      viewTool: "Abrir Ferramenta",
      copiedToast: "Copiado para a área de transferência!",
      shareToast: "Link copiado para a área de transferência!",
      clearButton: "Limpar",
      copyButton: "Copiar",
      shareButton: "Compartilhar",
      howItWorks: "Como Funciona e Arquitetura Técnica",
      faqTitle: "Perguntas Frequentes",
      privacyBadge: "100% Client-Side / Zero Dados Enviados a Servidores",
      navAbout: "Sobre Nós",
      navPrivacy: "Privacidade",
      navTerms: "Termos de Uso",
      navContact: "Contato",
    },
  },
  categories: [
    {
      id: "developer",
      name: { en: "Developer Tools", pt: "Desenvolvimento" },
      description: {
        en: "JSON formatters, syntax validators, diff inspectors and utilities for programmers.",
        pt: "Formatadores de JSON, validadores de sintaxe, inspetores e utilitários para programadores.",
      },
      icon: "Code2",
    },
    {
      id: "network",
      name: { en: "Network & Sysadmin", pt: "Redes & Infraestrutura" },
      description: {
        en: "CIDR subnet calculators, IPv4 converters, wildcard masks and cloud VPC network tools.",
        pt: "Calculadoras de sub-rede CIDR, conversores IPv4, máscaras wildcard e redes VPC.",
      },
      icon: "Network",
    },
    {
      id: "security",
      name: { en: "Security & Cryptography", pt: "Segurança & Criptografia" },
      description: {
        en: "High-entropy password generators, SHA/MD5 hash generators and cryptographic utilities.",
        pt: "Geradores de senhas com entropia, hashes SHA/MD5 e utilitários criptográficos.",
      },
      icon: "ShieldCheck",
    },
    {
      id: "converters",
      name: { en: "Converters & Encoders", pt: "Conversores & Formatos" },
      description: {
        en: "Base64, URL encoding, Hex converters with full UTF-8 Unicode support.",
        pt: "Base64, URL encoding, conversores Hex com suporte completo a UTF-8.",
      },
      icon: "Binary",
    },
  ] as CategoryInfo[],
};

export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return lang === "en" || lang === "pt";
}

export function getTranslations(lang?: string) {
  if (lang === "pt") return siteConfig.translations.pt;
  return siteConfig.translations.en;
}
