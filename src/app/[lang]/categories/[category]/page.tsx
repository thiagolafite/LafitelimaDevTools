import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
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
  ArrowRight,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { siteConfig, SupportedLanguage } from "@/config/site";
import { toolsRegistry, getToolsByCategory } from "@/config/tools.config";
import { JsonLd } from "@/components/shared/JsonLd";

interface CategoryPageProps {
  params: {
    lang: SupportedLanguage;
    category: string;
  };
}

export async function generateStaticParams() {
  const params: { lang: SupportedLanguage; category: string }[] = [];

  for (const lang of siteConfig.supportedLanguages) {
    for (const cat of siteConfig.categories) {
      params.push({ lang, category: cat.id });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { lang, category } = params;
  const categoryInfo = siteConfig.categories.find((c) => c.id === category);

  if (!categoryInfo) {
    return { title: "Category Not Found" };
  }

  const categoryName = categoryInfo.name[lang];
  const categoryDesc = categoryInfo.description[lang];
  const title = `${categoryName} — ${siteConfig.name}`;
  const canonicalUrl = `${siteConfig.url}/${lang}/categories/${category}`;

  return {
    title,
    description: categoryDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en/categories/${category}`,
        "pt-BR": `${siteConfig.url}/pt/categories/${category}`,
        pt: `${siteConfig.url}/pt/categories/${category}`,
        "x-default": `${siteConfig.url}/en/categories/${category}`,
      },
    },
    openGraph: {
      title,
      description: categoryDesc,
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const { lang, category } = params;
  const categoryInfo = siteConfig.categories.find((c) => c.id === category);

  if (!categoryInfo) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category);
  const categoryName = categoryInfo.name[lang];
  const categoryDesc = categoryInfo.description[lang];
  const t = siteConfig.translations[lang];

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: "Home", url: `${siteConfig.url}/${lang}` },
          {
            name: categoryName,
            url: `${siteConfig.url}/${lang}/categories/${category}`,
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-10">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={`/${lang}`} className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{categoryName}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.privacyBadge}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            {categoryDesc}
          </p>
        </div>

        {/* Tools in Category */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => {
            const IconComponent = iconMap[tool.iconName] || Wrench;
            const locale = tool.locales[lang];
            const toolUrl = `/${lang}/tools/${tool.slugs[lang]}`;

            return (
              <Link
                key={tool.id}
                href={toolUrl}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {locale.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {locale.shortDescription}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>{t.viewTool}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
