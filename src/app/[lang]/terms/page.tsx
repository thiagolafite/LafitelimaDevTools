import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, AlertCircle } from "lucide-react";
import {
  siteConfig,
  SupportedLanguage,
  isValidLanguage,
} from "@/config/site";
import { JsonLd } from "@/components/shared/JsonLd";

interface TermsPageProps {
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const lang = params?.lang;
  if (!isValidLanguage(lang)) return { title: "Terms of Use | lafitelimadev.tools" };

  const isPt = lang === "pt";
  const title = isPt ? "Termos de Uso — lafitelimadev.tools" : "Terms of Service — lafitelimadev.tools";
  const description = isPt
    ? "Termos e condições de uso da plataforma lafitelimadev.tools. Isenção de garantias, responsabilidade e propriedade intelectual."
    : "Terms of service and legal conditions for lafitelimadev.tools. As-is warranty disclaimer, intellectual property, and acceptable use.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/terms`,
      languages: {
        en: `${siteConfig.url}/en/terms`,
        pt: `${siteConfig.url}/pt/terms`,
      },
    },
  };
}

export default function TermsPage({ params }: TermsPageProps) {
  const rawLang = params?.lang;
  if (!isValidLanguage(rawLang)) notFound();
  const lang: SupportedLanguage = rawLang;
  const isPt = lang === "pt";

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", item: `${siteConfig.url}/${lang}` },
          { name: isPt ? "Termos de Uso" : "Terms of Use", item: `${siteConfig.url}/${lang}/terms` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Scale className="h-4 w-4" />
            <span>{isPt ? "Condições Legais e de Uso" : "Legal Terms & Conditions"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isPt ? "Termos de Uso" : "Terms of Service"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isPt ? "Última atualização: 24 de Agosto de 2026" : "Last Updated: August 24, 2026"}
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "1. Aceitação dos Termos" : "1. Acceptance of Terms"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Ao acessar ou utilizar qualquer utilitário fornecido pelo lafitelimadev.tools, você concorda em cumprir integralmente estes Termos de Uso. Caso não concorde com qualquer termo aqui estabelecido, solicitamos que não utilize nossos serviços."
              : "By accessing or using any utility provided by lafitelimadev.tools, you agree to be bound by these Terms of Service. If you do not agree with any provision herein, you must immediately discontinue use of the platform."}
          </p>
        </div>

        {/* Section 2: Disclaimer of Warranties (AS-IS) */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{isPt ? "2. Isenção de Garantias ('No Estado em que se Encontra' / AS-IS)" : "2. Disclaimer of Warranties (AS-IS)"}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isPt
              ? "Todos os utilitários, cálculos, parsers e ferramentas de segurança são fornecidos 'no estado em que se encontram' ('AS-IS'), sem qualquer garantia expressa ou implícita de adequação a um propósito específico ou infalibilidade. Embora apliquemos os mais rigorosos padrões da indústria e testes automatizados, o usuário é o único responsável por validar qualquer configuração crítica ou credencial antes de implantá-la em ambientes de produção."
              : "All utilities, mathematical calculations, parsers, and cryptographic generators are provided on an 'AS-IS' basis without warranties of any kind, express or implied. While we employ rigorous industry best practices and algorithmic verification, users remain solely responsible for validating mission-critical infrastructure configurations or cryptographic keys before production deployment."}
          </p>
        </div>

        {/* Section 3: Limitation of Liability */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "3. Limitação de Responsabilidade" : "3. Limitation of Liability"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Em nenhuma circunstância a equipe do lafitelimadev.tools será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou da incapacidade de usar as ferramentas, incluindo, sem limitação, perda de dados ou interrupção de negócios."
              : "In no event shall lafitelimadev.tools or its maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the tools, including but not limited to loss of data, security misconfigurations, or business interruption."}
          </p>
        </div>

        {/* Section 4: Acceptable Use */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "4. Uso Aceitável" : "4. Acceptable Use Policy"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "Você concorda em utilizar o lafitelimadev.tools exclusivamente para finalidades legítimas de engenharia, educação e segurança defensiva. É expressamente proibido tentar realizar ataques de negação de serviço (DDoS), engenharia reversa maliciosa ou automações abusivas que degradem a experiência de outros usuários."
              : "You agree to use lafitelimadev.tools exclusively for lawful software engineering, educational, and defensive cybersecurity purposes. You must not attempt denial-of-service attacks, automated scraping that degrades platform stability, or any malicious exploitation."}
          </p>
        </div>

        {/* Section 5: Intellectual Property */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {isPt ? "5. Propriedade Intelectual" : "5. Intellectual Property"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPt
              ? "O design, logotipos, código-fonte e guias didáticos do lafitelimadev.tools são protegidos por leis de direitos autorais. Os dados de entrada e saída gerados pelas ferramentas pertencem única e exclusivamente a você."
              : "The interface design, brand assets, technical documentation, and layout of lafitelimadev.tools are protected by copyright laws. All input data and generated outputs belong exclusively to you."}
          </p>
        </div>

        {/* Section 6: Contact */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-2">
          <h3 className="text-sm font-bold text-foreground">
            {isPt ? "Dúvidas sobre estes Termos?" : "Questions Regarding Terms?"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isPt ? "Fale conosco pelo e-mail:" : "Contact our team at:"}{" "}
            <span className="font-mono text-primary font-semibold">{siteConfig.contactEmail}</span>
          </p>
        </div>
      </div>
    </>
  );
}
