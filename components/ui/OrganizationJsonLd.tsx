import { getCompany } from "@/lib/getData";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export function OrganizationJsonLd() {
  const company = getCompany();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.companyName,
    url: getSiteUrl(),
    logo: company.logo.startsWith("http")
      ? company.logo
      : absoluteUrl(company.logo),
    description: company.tagline,
    telephone: company.contact.phones,
    email: company.contact.emails,
    sameAs: company.social.map((item) => item.url),
    address: company.contact.addresses.map((place) => ({
      "@type": "PostalAddress",
      name: place.label,
      streetAddress: place.address,
      addressCountry: "NP",
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company.contact.whatsapp,
      contactType: "sales",
      areaServed: "NP",
      availableLanguage: ["en", "ne"],
      url: absoluteUrl("/contact"),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
