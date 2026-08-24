import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, SupportedLanguage } from "@/config/site";
import {
  toolsRegistry,
  getToolBySlug,
  ToolDefinition,
} from "@/config/tools.config";
import { ToolLayout } from "@/components/shared/ToolLayout";
import { JsonLd } from "@/components/shared/JsonLd";
import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { SubnetCalculator } from "@/components/tools/SubnetCalculator";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { HashGenerator } from "@/components/tools/HashGenerator";

interface ToolPageProps {
  params: {
    lang: SupportedLanguage;
    slug: string;
  };
}

// 1. Programmatic SEO: Generate all static parameters for SSG
export async function generateStaticParams() {
  const params: { lang: SupportedLanguage; slug: string }[] = [];

  for (const tool of toolsRegistry) {
    params.push({ lang: "en", slug: tool.slugs.en });
    params.push({ lang: "pt", slug: tool.slugs.pt });
  }

  return params;
}

// 2. Programmatic SEO: Generate rich metadata with canonicals and hreflang
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { lang, slug } = params;
  const match = getToolBySlug(slug, lang);

  if (!match) {
    return {
      title: `Tool Not Found | ${siteConfig.name}`,
    };
  }

  const { tool } = match;
  const localeData = tool.locales[lang];
  const canonicalUrl = `${siteConfig.url}/${lang}/tools/${slug}`;
  const enUrl = `${siteConfig.url}/en/tools/${tool.slugs.en}`;
  const ptUrl = `${siteConfig.url}/pt/tools/${tool.slugs.pt}`;

  return {
    title: localeData.metaTitle,
    description: localeData.metaDescription,
    keywords: localeData.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        "pt-BR": ptUrl,
        pt: ptUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: localeData.metaTitle,
      description: localeData.metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: localeData.metaTitle,
      description: localeData.metaDescription,
      creator: "@lafitelimadev",
    },
  };
}

// 3. Render Tool Page with Schema.org JSON-LD
export default function ToolPage({ params }: ToolPageProps) {
  const { lang, slug } = params;
  const match = getToolBySlug(slug, lang);

  if (!match) {
    notFound();
  }

  const { tool } = match;
  const localeData = tool.locales[lang];
  const toolUrl = `${siteConfig.url}/${lang}/tools/${slug}`;

  const renderToolComponent = () => {
    switch (tool.componentKey) {
      case "json-formatter":
        return <JsonFormatter lang={lang} />;
      case "subnet-calculator":
        return <SubnetCalculator lang={lang} />;
      case "password-generator":
        return <PasswordGenerator lang={lang} />;
      case "base64-tool":
        return <Base64Tool lang={lang} />;
      case "hash-generator":
        return <HashGenerator lang={lang} />;
      default:
        return <div>Tool component not found</div>;
    }
  };

  return (
    <>
      {/* Schema.org Structured Data Injection */}
      <JsonLd
        webApp={{
          name: localeData.name,
          description: localeData.shortDescription,
          url: toolUrl,
          applicationCategory: "DeveloperApplication",
          inLanguage: lang,
        }}
        faqs={localeData.faqs}
        breadcrumbs={[
          { name: "Home", url: `${siteConfig.url}/${lang}` },
          {
            name: tool.category,
            url: `${siteConfig.url}/${lang}/categories/${tool.category}`,
          },
          { name: localeData.name, url: toolUrl },
        ]}
      />

      <ToolLayout
        toolLocale={localeData}
        lang={lang}
        category={tool.category}
      >
        {renderToolComponent()}
      </ToolLayout>
    </>
  );
}
