import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Shield,
  Zap,
  Lock,
  Cpu,
  Globe2,
  CheckCircle2,
  Users,
  Code2,
  ArrowRight,
  ServerOff,
} from "lucide-react";
import {
  siteConfig,
  SupportedLanguage,
  isValidLanguage,
  getTranslations,
} from "@/config/site";
import { JsonLd } from "@/components/shared/JsonLd";

interface AboutPageProps {
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const lang = params?.lang;
  if (!isValidLanguage(lang)) return { title: "About | lafitelimadev.tools" };

  const isPt = lang === "pt";
  const title = isPt ? "Sobre Nós — lafitelimadev.tools" : "About Us — lafitelimadev.tools";
  const description = isPt
    ? "Conheça a missão, arquitetura técnica e compromisso de privacidade inegociável da plataforma lafitelimadev.tools."
    : "Discover the engineering mission, client-side architecture, and uncompromising privacy standards behind lafitelimadev.tools.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/about`,
      languages: {
        en: `${siteConfig.url}/en/about`,
        "pt-BR": `${siteConfig.url}/pt/about`,
        pt: `${siteConfig.url}/pt/about`,
        "x-default": `${siteConfig.url}/en/about`,
      },
    },
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const rawLang = params?.lang;
  if (!isValidLanguage(rawLang)) notFound();
  const lang: SupportedLanguage = rawLang;
  const isPt = lang === "pt";

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", item: `${siteConfig.url}/${lang}` },
          { name: isPt ? "Sobre Nós" : "About Us", item: `${siteConfig.url}/${lang}/about` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            {isPt ? "Nossa Missão" : "Our Mission"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isPt
              ? "Engenharia de Alta Performance com Privacidade Absoluta"
              : "High-Performance Developer Tools with Zero Compromises"}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {isPt
              ? "O lafitelimadev.tools nasceu para resolver uma dor crônica da comunidade técnica: ferramentas online cheias de anúncios intrusivos, lentidão de servidores e risco constante de vazamento de dados corporativos."
              : "lafitelimadev.tools was engineered to solve a pervasive problem across the developer community: cluttered online utilities plagued with intrusive ads, slow backend latency, and risks of sensitive corporate data leakage."}
          </p>
        </div>

        {/* The 3 Core Engineering Pillars */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "Nossos Pilares Fundamentais de Engenharia" : "Our Core Architectural Pillars"}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ServerOff className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPt ? "1. 100% Client-Side" : "1. 100% Client-Side"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isPt
                  ? "Toda a computação — de cálculos de sub-redes a geração de senhas criptográficas e formatação de JSON — ocorre exclusivamente no motor JavaScript e Web Crypto do seu navegador."
                  : "All computation — from IPv4 subnetting to CSPRNG password generation and JSON formatting — runs entirely within your browser's local JavaScript & Web Crypto engine."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPt ? "2. Zero Latência" : "2. Zero Latency"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isPt
                  ? "Sem roundtrips de rede. As páginas são geradas estaticamente (SSG) e entregues globalmente via Edge CDN, garantindo respostas instantâneas em microssegundos."
                  : "No backend bottlenecks. Pages are statically pre-rendered (SSG) and served over global Edge CDNs for sub-millisecond calculation speeds."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPt ? "3. Conteúdo Técnico Aprofundado" : "3. In-Depth Documentation"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isPt
                  ? "Não fornecemos apenas a ferramenta: incluímos a teoria matemática, especificações RFC, fórmulas de entropia e casos práticos de uso para o seu time."
                  : "We provide comprehensive technical documentation, RFC specifications, mathematical formulations, and practical real-world workflows alongside each tool."}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Transparency */}
        <div className="rounded-2xl border border-border bg-muted/20 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            {isPt ? "Transparência & Monetização Ética" : "Transparency & Ethical Monetization"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Para manter a plataforma 100% gratuita para desenvolvedores, empresas e estudantes de todo o mundo sem cobrar assinaturas ou vender dados, veiculamos anúncios não intrusivos através de redes respeitadas (como Google AdSense). Não utilizamos anúncios invasivos, pop-ups enganosos ou redirecionamentos maliciosos."
              : "To maintain this platform 100% free for developers, startups, and students worldwide without subscriptions or paywalls, we display non-intrusive advertisements via trusted partners like Google AdSense. We strictly prohibit pop-ups, disruptive interstitials, or deceptive redirects."}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isPt ? "Pronto para acelerar seu fluxo de trabalho?" : "Ready to speed up your engineering workflow?"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPt ? "Experimente nosso catálogo completo de ferramentas." : "Explore our full suite of privacy-first utilities."}
            </p>
          </div>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors shrink-0"
          >
            <span>{isPt ? "Ver Ferramentas" : "Explore Tools"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
