import type { Metadata } from "next";
import { finalPrice, site } from "@/config/site";
import { homePath, type Lang } from "./i18n";

const titles = {
  bn: "তাহয়াস কার ট্রেনিং সেন্টার | লক্ষ্মীপুরে ড্রাইভিং স্কুল",
  en: "Tahyas Car Training Center | Driving School in Lakshmipur",
};
const descriptions = {
  bn: "লক্ষ্মীপুরে ড্রাইভিং ট্রেনিং — অভিজ্ঞ প্রশিক্ষক, আধুনিক গাড়ি, প্র্যাকটিক্যাল ক্লাস ও নারীদের জন্য বিশেষ ব্যবস্থা। গাড়ি চালানো শিখুন মাত্র ৳১০,০০০ অফারে। WhatsApp: 01320381356",
  en: "Driving school in Lakshmipur, Bangladesh — experienced trainers, modern cars, practical lessons and special care for women. Learn to drive with the ৳10,000 offer. WhatsApp: 01320381356",
};

export function buildMetadata(lang: Lang): Metadata {
  const url = new URL(homePath(lang), site.url).toString();
  return {
    metadataBase: new URL(site.url),
    title: titles[lang],
    description: descriptions[lang],
    keywords:
      lang === "bn"
        ? ["লক্ষ্মীপুরে ড্রাইভিং ট্রেনিং", "গাড়ি চালানো শিখুন", "ড্রাইভিং স্কুল লক্ষ্মীপুর", "নারী ড্রাইভিং ট্রেনিং", "ড্রাইভিং কোর্স"]
        : ["driving school Lakshmipur", "learn driving Bangladesh", "car training Lakshmipur", "women driving training"],
    alternates: {
      canonical: url,
      languages: { "bn-BD": "/", "en-BD": "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name[lang],
      title: titles[lang],
      description: descriptions[lang],
      locale: lang === "bn" ? "bn_BD" : "en_US",
      images: [{ url: "/images/brand/og.jpg", width: 1200, height: 630, alt: site.name[lang] }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descriptions[lang],
      images: ["/images/brand/og.jpg"],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
    formatDetection: { telephone: false },
    other: { "geo.region": "BD-51", "geo.placename": "Lakshmipur", "geo.position": `${site.geo.lat};${site.geo.lng}` },
  };
}

/** Structured data so Google understands this is a local driving school. */
export function jsonLd(lang: Lang) {
  const url = new URL(homePath(lang), site.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": ["DrivingSchool", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: site.name[lang],
    alternateName: site.name[lang === "bn" ? "en" : "bn"],
    slogan: site.slogan[lang],
    description: descriptions[lang],
    url,
    image: new URL("/images/brand/logo-badge.jpg", site.url).toString(),
    logo: new URL("/images/brand/icon-512.png", site.url).toString(),
    telephone: "+" + site.whatsapp.number,
    priceRange: "৳",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address[lang],
      addressLocality: site.addressParts.locality,
      addressRegion: site.addressParts.region,
      addressCountry: site.addressParts.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`,
    areaServed: [{ "@type": "City", name: lang === "bn" ? "লক্ষ্মীপুর" : "Lakshmipur" }],
    knowsLanguage: ["bn", "en"],
    ...(site.facebook ? { sameAs: [site.facebook] } : {}),
    makesOffer: {
      "@type": "Offer",
      name: site.pricing.label[lang],
      price: finalPrice,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "bn" ? "ড্রাইভিং কোর্স" : "Driving courses",
      itemListElement: site.courses.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name: c.title[lang], description: c.desc[lang] },
      })),
    },
  };
}

export function faqJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faqs.map((f) => ({
      "@type": "Question",
      name: f.q[lang],
      acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
    })),
  };
}

/** Metadata for the driving-licence guide page. */
export function licenseMetadata(lang: Lang, meta: { title: Record<Lang, string>; description: Record<Lang, string> }): Metadata {
  const path = lang === "bn" ? "/license" : "/en/license";
  const url = new URL(path, site.url).toString();
  return {
    title: meta.title[lang],
    description: meta.description[lang],
    alternates: { canonical: url, languages: { "bn-BD": "/license", "en-BD": "/en/license", "x-default": "/license" } },
    openGraph: {
      type: "article", url, title: meta.title[lang], description: meta.description[lang],
      siteName: site.name[lang], locale: lang === "bn" ? "bn_BD" : "en_US",
      images: [{ url: "/images/brand/og.jpg", width: 1200, height: 630, alt: site.name[lang] }],
    },
  };
}

/** Breadcrumb + HowTo + FAQ structured data for the licence guide. */
export function licenseJsonLd(
  lang: Lang,
  g: { title: Record<Lang, string>; steps: { title: Record<Lang, string>; body: Record<Lang, string> }[]; faqs: { q: Record<Lang, string>; a: Record<Lang, string> }[]; crumbHome: Record<Lang, string>; crumb: Record<Lang, string> },
) {
  const home = new URL(homePath(lang), site.url).toString();
  const url = new URL(lang === "bn" ? "/license" : "/en/license", site.url).toString();
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: g.crumbHome[lang], item: home },
        { "@type": "ListItem", position: 2, name: g.crumb[lang], item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: g.title[lang],
      step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title[lang], text: s.body[lang] })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
    },
  ];
}

/** Metadata for any extra guide page available at /<slug> (bn) and /en/<slug> (en). */
export function pageMetadata(lang: Lang, slug: string, meta: { title: Record<Lang, string>; description: Record<Lang, string> }): Metadata {
  const bn = `/${slug}`;
  const en = `/en/${slug}`;
  const url = new URL(lang === "bn" ? bn : en, site.url).toString();
  return {
    title: meta.title[lang],
    description: meta.description[lang],
    alternates: { canonical: url, languages: { "bn-BD": bn, "en-BD": en, "x-default": bn } },
    openGraph: {
      type: "article", url, title: meta.title[lang], description: meta.description[lang],
      siteName: site.name[lang], locale: lang === "bn" ? "bn_BD" : "en_US",
      images: [{ url: "/images/brand/og.jpg", width: 1200, height: 630, alt: site.name[lang] }],
    },
  };
}
