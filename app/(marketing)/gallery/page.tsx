import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/GalleryView";
import { CTASection } from "@/components/home/CTASection";
import { getCompany, getProjects } from "@/lib/getData";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "Project Gallery";
const DESCRIPTION =
  "Installations across Kathmandu, our Tarakeshwar factory floor, and studio product photography — Hi-Tech uPVC windows, doors, and panels in place.";

export const metadata: Metadata = pageMetadata(TITLE, DESCRIPTION, "/gallery", undefined, {
  keywords: [
    "uPVC gallery Nepal",
    "uPVC project photos Kathmandu",
    "Hi-Tech uPVC installations",
    "uPVC factory Tarakeshwar",
    "window door panel photography",
  ],
});

function GalleryJsonLd() {
  const company = getCompany();
  const projects = getProjects();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl("/gallery"),
        url: absoluteUrl("/gallery"),
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: {
          "@type": "WebSite",
          name: company.companyName,
          url: absoluteUrl("/"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Gallery",
            item: absoluteUrl("/gallery"),
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Hi-Tech uPVC gallery",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          description: project.description,
          url: absoluteUrl(`/gallery#${project.slug}`),
        })),
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

export default function GalleryPage() {
  const projects = getProjects();

  return (
    <>
      <GalleryJsonLd />
      <section className="page-top bg-surface pb-[var(--spacing-section)] lg:pb-[var(--spacing-section-lg)]">
        <div className="container-content">
          <GalleryView projects={projects} />
        </div>
      </section>

      <CTASection
        title="Want your project in this gallery?"
        body="Tell us about your openings — we will measure, make, and fit, then add your finish to the record."
        primaryHref="/get-quote"
        primaryLabel="Get a Free Quote"
        secondaryHref="/contact"
        secondaryLabel="WhatsApp us"
        secondaryIcon="whatsapp"
      />
    </>
  );
}
