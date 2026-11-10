/**
 * Shared JSON-LD builders for LocalBusiness, WebSite, Product, and page graphs.
 * Keep NAP fields aligned with data/company.json and Google Business Profile.
 */

import type { Company, Guide, Product, ProductCategory } from "./types";
import { CATEGORY_LABELS } from "./constants";
import { absoluteUrl, BRAND_ALIASES, getSiteUrl } from "./seo";

const AREA_SERVED = [
  { "@type": "Country", name: "Nepal" },
  { "@type": "City", name: "Kathmandu" },
  { "@type": "City", name: "Lalitpur" },
  { "@type": "City", name: "Bhaktapur" },
  { "@type": "City", name: "Pokhara" },
  { "@type": "AdministrativeArea", name: "Bagmati Province" },
  { "@type": "AdministrativeArea", name: "Kathmandu Valley" },
];

function logoUrl(company: Company) {
  return company.logo.startsWith("http")
    ? company.logo
    : absoluteUrl(company.logo);
}

function parseLocality(address: string): {
  streetAddress: string;
  addressLocality: string;
  postalCode?: string;
} {
  // e.g. "Bihani Chowk, Tarakeshwar 44600"
  const match = address.match(/^(.*?),\s*([^,]+?)(?:\s+(\d{4,5}))?$/);
  if (!match) {
    return { streetAddress: address, addressLocality: "Kathmandu" };
  }
  return {
    streetAddress: match[1].trim(),
    addressLocality: match[2].trim(),
    postalCode: match[3],
  };
}

export function buildPostalAddress(
  place: Company["contact"]["addresses"][number]
) {
  const parsed = parseLocality(place.address);
  return {
    "@type": "PostalAddress" as const,
    name: place.label,
    streetAddress: parsed.streetAddress,
    addressLocality: parsed.addressLocality,
    addressRegion: "Bagmati Province",
    postalCode: parsed.postalCode ?? "44600",
    addressCountry: "NP",
  };
}

export function buildLocalBusinessGraph(company: Company) {
  const site = getSiteUrl();
  const orgId = `${site}/#organization`;
  const websiteId = `${site}/#website`;

  const departments = company.contact.addresses.map((place, index) => {
    const id = `${site}/#location-${index + 1}`;
    return {
      "@type": "HomeAndConstructionBusiness" as const,
      "@id": id,
      name: `${company.companyName} — ${place.label}`,
      url: absoluteUrl("/contact"),
      image: logoUrl(company),
      telephone: company.contact.phones[0],
      email: company.contact.emails[0],
      address: buildPostalAddress(place),
      geo: {
        "@type": "GeoCoordinates" as const,
        latitude: place.lat,
        longitude: place.lng,
      },
      hasMap: place.mapsUrl,
      parentOrganization: { "@id": orgId },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "HomeAndConstructionBusiness"],
        "@id": orgId,
        name: company.companyName,
        legalName: company.companyName,
        alternateName: [...BRAND_ALIASES],
        url: site,
        logo: logoUrl(company),
        image: logoUrl(company),
        description:
          "Hi-Tech uPVC Profile Industries (Hitech uPVC, part of Hi-Tech Group Nepal) manufactures and installs made-to-measure uPVC windows, doors, and wall panels — factory at Tarakeshwar, serving Kathmandu, Lalitpur, Bhaktapur, Pokhara, and across Nepal.",
        slogan: company.tagline,
        telephone: company.contact.phones,
        email: company.contact.emails,
        sameAs: company.social.map((item) => item.url),
        address: buildPostalAddress(company.contact.addresses[0]),
        geo: {
          "@type": "GeoCoordinates",
          latitude: company.contact.addresses[0].lat,
          longitude: company.contact.addresses[0].lng,
        },
        hasMap: company.contact.addresses[0].mapsUrl,
        areaServed: AREA_SERVED,
        knowsAbout: [
          "uPVC windows",
          "uPVC doors",
          "uPVC wall panels",
          "uPVC profiles",
          "sliding windows",
          "casement windows",
          "tilt and turn windows",
          "French doors",
          "sliding doors",
          "folding doors",
          "double glazing",
          "window installation",
        ],
        makesOffer: [
          { name: "uPVC windows", path: "/products/windows" },
          { name: "uPVC doors", path: "/products/doors" },
          { name: "uPVC wall panels", path: "/products/panels" },
        ].map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${item.name} — made to measure and installed`,
            url: absoluteUrl(item.path),
          },
          areaServed: AREA_SERVED,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: company.contact.whatsapp,
            contactType: "sales",
            areaServed: "NP",
            availableLanguage: ["en", "ne"],
            url: absoluteUrl("/contact"),
          },
        ],
        department: departments.map((d) => ({ "@id": d["@id"] })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site,
        name: company.companyName,
        alternateName: ["Hi-Tech uPVC", "Hitech uPVC"],
        description: company.tagline,
        publisher: { "@id": orgId },
        inLanguage: "en-NP",
      },
      ...departments,
    ],
  };
}

export function buildBreadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProductJsonLd(
  product: Product,
  category: ProductCategory
) {
  const path = `/products/${category}/${product.slug}`;
  const image = product.heroImage.startsWith("http")
    ? product.heroImage
    : absoluteUrl(product.heroImage);

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: absoluteUrl(path),
    priceCurrency: "NPR",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const numericPrice = product.priceFrom?.replace(/[^\d.]/g, "");
  if (numericPrice) {
    offer.price = numericPrice;
  } else {
    offer.priceSpecification = {
      "@type": "PriceSpecification",
      priceCurrency: "NPR",
      description: "Custom quote — contact for pricing",
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": absoluteUrl(path),
        name: product.name,
        description: product.shortDescription,
        image,
        brand: {
          "@type": "Brand",
          name: "Hi-Tech uPVC",
          alternateName: "Hitech uPVC",
        },
        manufacturer: { "@id": `${getSiteUrl()}/#organization` },
        category: CATEGORY_LABELS[category],
        material: "uPVC",
        ...(product.warranty ? { warranty: product.warranty } : {}),
        offers: offer,
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: CATEGORY_LABELS[category], path: `/products/${category}` },
        { name: product.name, path },
      ]),
    ],
  };
}

export function buildContactPageJsonLd(_company: Company) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": absoluteUrl("/contact"),
        url: absoluteUrl("/contact"),
        name: "Contact Hi-Tech uPVC Profile Industries",
        description:
          "Visit Hi-Tech uPVC in Tarakeshwar, Lambagar, or Tokha — or message us on WhatsApp for a free site measurement in Kathmandu and across Nepal.",
        inLanguage: "en-NP",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        mainEntity: { "@id": `${getSiteUrl()}/#organization` },
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  };
}

export function buildQuotePageJsonLd(_company: Company) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/get-quote"),
        url: absoluteUrl("/get-quote"),
        name: "Get a Free uPVC Quote",
        description:
          "Request a free quote for made-to-measure uPVC windows, doors, and panels from Hi-Tech uPVC Profile Industries in Nepal.",
        inLanguage: "en-NP",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: { "@id": `${getSiteUrl()}/#organization` },
      },
      {
        "@type": "Service",
        name: "Made-to-measure uPVC windows, doors, and panels",
        provider: { "@id": `${getSiteUrl()}/#organization` },
        areaServed: AREA_SERVED,
        serviceType: "uPVC fabrication and installation",
        url: absoluteUrl("/get-quote"),
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: "Get a Quote", path: "/get-quote" },
      ]),
    ],
  };
}

export function buildGuideIndexJsonLd(guides: Guide[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl("/guides"),
        url: absoluteUrl("/guides"),
        name: "uPVC Guides for Kathmandu & Nepal",
        description:
          "Practical Hi-Tech uPVC guides on window prices, uPVC vs aluminium and wood, Kathmandu climate, lifespan, and choosing doors.",
        inLanguage: "en-NP",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: { "@id": `${getSiteUrl()}/#organization` },
        hasPart: guides.map((guide) => ({
          "@type": "Article",
          "@id": absoluteUrl(`/guides/${guide.slug}`),
          headline: guide.title,
          description: guide.description,
          url: absoluteUrl(`/guides/${guide.slug}`),
        })),
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
    ],
  };
}

export function buildGuideJsonLd(guide: Guide) {
  const path = `/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": absoluteUrl(path),
        url: absoluteUrl(path),
        headline: guide.title,
        description: guide.description,
        dateModified: guide.updated,
        inLanguage: "en-NP",
        author: { "@id": `${getSiteUrl()}/#organization` },
        publisher: { "@id": `${getSiteUrl()}/#organization` },
        mainEntityOfPage: absoluteUrl(path),
        about: [
          { "@type": "Thing", name: "uPVC windows" },
          { "@type": "Thing", name: "uPVC doors" },
          { "@type": "Place", name: "Kathmandu" },
          { "@type": "Country", name: "Nepal" },
        ],
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "article p"],
        },
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: guide.title, path },
      ]),
    ],
  };
}

export function buildServiceAreaJsonLd(area: {
  slug: string;
  name: string;
  title: string;
  description: string;
}) {
  const path = `/service-areas/${area.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl(path),
        url: absoluteUrl(path),
        name: area.title,
        description: area.description,
        inLanguage: "en-NP",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: {
          "@type": "Service",
          name: `uPVC windows, doors, and panels in ${area.name}`,
          provider: { "@id": `${getSiteUrl()}/#organization` },
          areaServed: { "@type": "City", name: area.name },
          serviceType: "uPVC fabrication and installation",
        },
      },
      buildBreadcrumb([
        { name: "Home", path: "/" },
        { name: area.name, path },
      ]),
    ],
  };
}
