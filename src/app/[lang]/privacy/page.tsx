import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from "lucide-react";
import {
  siteConfig,
  SupportedLanguage,
  isValidLanguage,
} from "@/config/site";
import { JsonLd } from "@/components/shared/JsonLd";

interface PrivacyPageProps {
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const lang = params?.lang;
  if (!isValidLanguage(lang)) return { title: "Privacy Policy | lafitelimadev.tools" };

  const isPt = lang === "pt";
  const title = isPt ? "Política de Privacidade — lafitelimadev.tools" : "Privacy Policy — lafitelimadev.tools";
  const description = isPt
    ? "Política de Privacidade em conformidade com LGPD e GDPR. Processamento 100% no navegador, cookies do Google AdSense e transparência com seus dados."
    : "Privacy Policy fully compliant with GDPR, CCPA, and LGPD. 100% client-side data processing, Google AdSense cookie disclosure, and privacy terms.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/privacy`,
      languages: {
        en: `${siteConfig.url}/en/privacy`,
        "pt-BR": `${siteConfig.url}/pt/privacy`,
        pt: `${siteConfig.url}/pt/privacy`,
        "x-default": `${siteConfig.url}/en/privacy`,
      },
    },
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const rawLang = params?.lang;
  if (!isValidLanguage(rawLang)) notFound();
  const lang: SupportedLanguage = rawLang;
  const isPt = lang === "pt";

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", item: `${siteConfig.url}/${lang}` },
          { name: isPt ? "Política de Privacidade" : "Privacy Policy", item: `${siteConfig.url}/${lang}/privacy` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>{isPt ? "Conformidade LGPD, GDPR e Google AdSense" : "GDPR, CCPA & AdSense Compliant"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isPt ? "Política de Privacidade" : "Privacy Policy"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isPt ? "Última atualização: 24 de Agosto de 2026" : "Last Updated: August 24, 2026"}
          </p>
        </div>

        {/* Section 1: 100% Client-Side Guarantee */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <EyeOff className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {isPt
                ? "1. Garantia de Processamento 100% no Navegador (Client-Side)"
                : "1. 100% Client-Side Processing Guarantee"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {isPt
              ? "No lafitelimadev.tools, a privacidade técnica não é uma promessa — é uma garantia arquitetural. Todas as ferramentas (Formatador JSON, Calculadora CIDR, Gerador de Senhas, Gerador de Hash e Codificador Base64) são executadas exclusivamente na memória volátil do seu próprio navegador web."
              : "At lafitelimadev.tools, privacy is an architectural guarantee. All tools (JSON Formatter, CIDR Calculator, Password Generator, Hash Generator, and Base64 Tool) execute purely in your local browser's volatile memory via JavaScript and Web Crypto."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isPt ? "Nenhum código JSON é transmitido à nuvem" : "No JSON payloads sent to backends"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isPt ? "Senhas e chaves nunca saem da sua RAM" : "Passwords never touch external servers"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isPt ? "Endereços IP e sub-redes não são gravados" : "IP subnets are calculated strictly offline"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isPt ? "Hashes computados via hardware local" : "Hashes generated via local Web Crypto API"}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cookies and Advertising */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "2. Cookies e Redes de Publicidade (Google AdSense)" : "2. Cookies and Advertising Networks (Google AdSense)"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Para manter este portal gratuito, utilizamos provedores de publicidade de terceiros, incluindo o Google AdSense. O Google e seus parceiros utilizam cookies para veicular anúncios com base nas visitas anteriores dos usuários a este ou a outros sites na Internet."
              : "To support this free service, we display advertisements provided by third-party ad networks, including Google AdSense. Google and its advertising partners use cookies to serve ads based on prior user visits to this or other websites across the web."}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li>
              {isPt
                ? "O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para você com base na sua navegação."
                : "Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet."}
            </li>
            <li>
              {isPt
                ? "Você pode desativar a publicidade personalizada acessando as Configurações de Anúncios do Google (https://adssettings.google.com) ou através do portal da Digital Advertising Alliance (http://www.aboutads.info)."
                : "You may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or via the Digital Advertising Alliance (http://www.aboutads.info)."}
            </li>
          </ul>
        </div>

        {/* Section 3: Analytics and Anonymous Telemetry */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "3. Telemetria e Análise de Tráfego" : "3. Anonymous Analytics & Telemetry"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Coletamos métricas estritamente agregadas e anônimas (como quantidade de visualizações de página, tipo de navegador, sistema operacional e país aproximado) para monitorar a estabilidade do portal e identificar demandas por novas ferramentas. Nenhuma informação pessoal identificável (PII) é associada a essas medições."
              : "We collect strictly aggregated and anonymous metrics (such as pageview counts, device types, browser versions, and approximate country) to ensure uptime and identify missing tools. No Personally Identifiable Information (PII) is ever attached to telemetry records."}
          </p>
        </div>

        {/* Section 4: User Rights */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "4. Seus Direitos (LGPD e GDPR)" : "4. Your Data Protection Rights (GDPR / LGPD / CCPA)"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "De acordo com a Lei Geral de Proteção de Dados (LGPD) e o Regulamento Geral sobre a Proteção de Dados (GDPR), você tem o direito de solicitar esclarecimentos sobre o tratamento de dados, limpar seus dados de armazenamento local a qualquer momento nas configurações do seu navegador e optar pela não coleta de cookies não essenciais."
              : "Under GDPR, CCPA, and LGPD, you maintain the right to understand how data is processed, clear your local storage tokens directly within your browser settings, and reject non-essential cookies via our consent manager."}
          </p>
        </div>

        {/* Section 5: Contact & DPO */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            {isPt ? "5. Contato sobre Privacidade e DPO" : "5. Contact & Privacy Inquiries"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isPt
              ? "Para quaisquer dúvidas, solicitações ou esclarecimentos sobre esta Política de Privacidade, entre em contato através do e-mail:"
              : "For any questions or compliance inquiries regarding this Privacy Policy, contact our team at:"}
          </p>
          <div className="font-mono text-xs font-semibold text-primary">
            {siteConfig.contactEmail}
          </div>
        </div>
      </div>
    </>
  );
}
