import React from "react";

interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  inLanguage: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url?: string;
  item?: string;
}

interface JsonLdProps {
  webApp?: WebApplicationSchemaProps;
  faqs?: FaqItem[];
  breadcrumbs?: BreadcrumbItem[];
}

export function JsonLd({ webApp, faqs, breadcrumbs }: JsonLdProps) {
  const schemas: Record<string, unknown>[] = [];

  if (webApp) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: webApp.name,
      description: webApp.description,
      url: webApp.url,
      applicationCategory: webApp.applicationCategory,
      operatingSystem: webApp.operatingSystem || "All Modern Web Browsers",
      inLanguage: webApp.inLanguage,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      permissions: "No special permissions required. 100% Client-Side execution.",
    });
  }

  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url || item.item,
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
