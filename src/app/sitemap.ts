import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { toolsRegistry } from "@/config/tools.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // 1. Home Pages (EN & PT)
  entries.push({
    url: `${baseUrl}/en`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        "pt-BR": `${baseUrl}/pt`,
        pt: `${baseUrl}/pt`,
        "x-default": `${baseUrl}/en`,
      },
    },
  });

  entries.push({
    url: `${baseUrl}/pt`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        "pt-BR": `${baseUrl}/pt`,
        pt: `${baseUrl}/pt`,
        "x-default": `${baseUrl}/en`,
      },
    },
  });

  // 2. Institutional Pages (About, Privacy, Terms, Contact)
  const institutionalRoutes = ["about", "privacy", "terms", "contact"];
  for (const route of institutionalRoutes) {
    const enUrl = `${baseUrl}/en/${route}`;
    const ptUrl = `${baseUrl}/pt/${route}`;

    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: enUrl,
          "pt-BR": ptUrl,
          pt: ptUrl,
          "x-default": enUrl,
        },
      },
    });

    entries.push({
      url: ptUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: enUrl,
          "pt-BR": ptUrl,
          pt: ptUrl,
          "x-default": enUrl,
        },
      },
    });
  }

  // 3. Category Pages
  for (const cat of siteConfig.categories) {
    entries.push({
      url: `${baseUrl}/en/categories/${cat.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/categories/${cat.id}`,
          "pt-BR": `${baseUrl}/pt/categories/${cat.id}`,
          pt: `${baseUrl}/pt/categories/${cat.id}`,
          "x-default": `${baseUrl}/en/categories/${cat.id}`,
        },
      },
    });

    entries.push({
      url: `${baseUrl}/pt/categories/${cat.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/categories/${cat.id}`,
          "pt-BR": `${baseUrl}/pt/categories/${cat.id}`,
          pt: `${baseUrl}/pt/categories/${cat.id}`,
          "x-default": `${baseUrl}/en/categories/${cat.id}`,
        },
      },
    });
  }

  // 4. Programmatic Tool Pages (EN & PT)
  for (const tool of toolsRegistry) {
    const enUrl = `${baseUrl}/en/tools/${tool.slugs.en}`;
    const ptUrl = `${baseUrl}/pt/tools/${tool.slugs.pt}`;

    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: enUrl,
          "pt-BR": ptUrl,
          pt: ptUrl,
          "x-default": enUrl,
        },
      },
    });

    entries.push({
      url: ptUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: enUrl,
          "pt-BR": ptUrl,
          pt: ptUrl,
          "x-default": enUrl,
        },
      },
    });
  }

  return entries;
}
