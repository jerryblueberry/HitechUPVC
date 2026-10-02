import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { getAbout, getCompany } from "@/lib/getData";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const about = getAbout();

export const metadata: Metadata = pageMetadata(
  about.seo.title,
  about.seo.description,
  "/about",
  undefined,
  { keywords: about.seo.keywords }
);

function AboutPageJsonLd() {
  const company = getCompany();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": absoluteUrl("/about"),
        url: absoluteUrl("/about"),
        name: about.seo.title,
        description: about.seo.description,
        inLanguage: "en-NP",
        isPartOf: { "@type": "WebSite", name: company.companyName, url: absoluteUrl("/") },
        mainEntity: {
          "@type": "Organization",
          name: company.companyName,
          url: absoluteUrl("/"),
          logo: absoluteUrl(company.logo),
          slogan: company.tagline,
          email: company.contact.emails[0],
          telephone: company.contact.phones[0],
          areaServed: about.serviceAreas.regions
            .flatMap((region) => region.areas)
            .filter((area) => !area.toLowerCase().includes("request"))
            .map((name) => ({ "@type": "Place", name }))
            .concat({ "@type": "Country", name: "Nepal" }),
          knowsAbout: about.services.items.map((item) => item.title),
          sameAs: company.social.map((s) => s.url),
          location: company.contact.addresses.map((site) => ({
            "@type": "Place",
            name: site.label,
            hasMap: site.mapsUrl,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address,
              addressRegion: "Bagmati Province",
              addressCountry: "NP",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: site.lat,
              longitude: site.lng,
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <AboutView about={about} company={getCompany()} />
    </>
  );
}
