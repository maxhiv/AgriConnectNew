import { useEffect } from "react";
import seoMeta from "@shared/seoMeta.json";

interface SEOProps {
  path: string;
  customTitle?: string;
  customDescription?: string;
}

export function useSEO({ path, customTitle, customDescription }: SEOProps) {
  useEffect(() => {
    const meta = (seoMeta.routes as Record<string, { title: string; description: string }>)[path];
    const title = customTitle || meta?.title || seoMeta.siteName;
    const description = customDescription || meta?.description || "";
    const canonical = `${seoMeta.baseUrl}${path}`;

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    let canonical_el = document.querySelector('link[rel="canonical"]');
    if (!canonical_el) {
      canonical_el = document.createElement("link");
      canonical_el.setAttribute("rel", "canonical");
      document.head.appendChild(canonical_el);
    }
    canonical_el.setAttribute("href", canonical);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonical);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement("meta");
      ogType.setAttribute("property", "og:type");
      document.head.appendChild(ogType);
    }
    ogType.setAttribute("content", "website");

    let ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (!ogSiteName) {
      ogSiteName = document.createElement("meta");
      ogSiteName.setAttribute("property", "og:site_name");
      document.head.appendChild(ogSiteName);
    }
    ogSiteName.setAttribute("content", seoMeta.siteName);

  }, [path, customTitle, customDescription]);
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${seoMeta.baseUrl}${item.url}`
    }))
  };
}

export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vantage South",
    "url": seoMeta.baseUrl,
    "logo": `${seoMeta.baseUrl}/logo.png`,
    "description": "Precision agriculture solutions for Southern farmers across Alabama, Mississippi, Northwest Florida, and Central Tennessee.",
    "areaServed": [
      {
        "@type": "State",
        "name": "Alabama"
      },
      {
        "@type": "State",
        "name": "Mississippi"
      },
      {
        "@type": "State",
        "name": "Florida",
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Northwest Florida"
        }
      },
      {
        "@type": "State",
        "name": "Tennessee",
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Central Tennessee"
        }
      }
    ],
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "sales",
      "availableLanguage": "English"
    }
  };
}

export interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
}

export function generateServiceSchema({ name, description, url, areaServed }: ServiceSchemaProps): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": `${seoMeta.baseUrl}${url}`,
    "provider": {
      "@type": "Organization",
      "name": "Vantage South"
    },
    "areaServed": areaServed || ["Alabama", "Mississippi", "Florida", "Tennessee"],
    "serviceType": "Precision Agriculture"
  };
}

export interface ProductSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
  category?: string;
}

export function generateProductSchema({ name, description, url, image, brand, category }: ProductSchemaProps): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "url": `${seoMeta.baseUrl}${url}`,
    ...(image && { "image": image }),
    ...(brand && {
      "brand": {
        "@type": "Brand",
        "name": brand
      }
    }),
    ...(category && { "category": category })
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  telephone?: string;
  email?: string;
  areaServed: string[];
}

export function generateLocalBusinessSchema({ name, description, areaServed }: LocalBusinessSchemaProps): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": seoMeta.baseUrl,
    "areaServed": areaServed.map(area => ({
      "@type": "AdministrativeArea",
      "name": area
    })),
    "priceRange": "$$"
  };
}

interface JsonLdProps {
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export function SEOHead({ path, customTitle, customDescription, schemas }: SEOProps & { schemas?: object[] }) {
  useSEO({ path, customTitle, customDescription });
  
  if (schemas && schemas.length > 0) {
    return <JsonLd data={schemas} />;
  }
  
  return null;
}
