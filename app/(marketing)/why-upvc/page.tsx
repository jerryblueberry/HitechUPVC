import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/ui/FaqJsonLd";
import { WhyUpvcView } from "@/components/why/WhyUpvcView";
import {
  getCompany,
  getDoors,
  getFAQs,
  getPanels,
  getProjects,
  getWindows,
} from "@/lib/getData";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "Why uPVC Doors & Windows Are Better in Kathmandu";
const DESCRIPTION =
  "Why choose uPVC over wood or aluminium in Kathmandu? Hi-Tech uPVC Profile Industries explains insulation, dust control, noise reduction, and monsoon-ready windows and doors for Nepal homes.";

export const metadata: Metadata = pageMetadata(TITLE, DESCRIPTION, "/why-upvc", undefined, {
  keywords: [
    "uPVC Kathmandu",
    "uPVC windows Nepal",
    "uPVC doors Kathmandu",
    "why uPVC",
    "uPVC vs wood",
    "uPVC vs aluminium",
    "uPVC windows Kathmandu",
    "maintenance free windows Nepal",
    "double glazed windows Kathmandu",
    "uPVC manufacturer Nepal",
    "Hi-Tech uPVC",
    "uPVC profiles Tarakeshwar",
  ],
});

function WhyPageJsonLd() {
  const company = getCompany();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/why-upvc"),
        url: absoluteUrl("/why-upvc"),
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@type": "WebSite", name: company.companyName, url: absoluteUrl("/") },
        about: {
          "@type": "Thing",
          name: "uPVC doors and windows in Kathmandu",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Why uPVC",
            item: absoluteUrl("/why-upvc"),
          },
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

export default function WhyUpvcPage() {
  const company = getCompany();
  const faqs = getFAQs("why-upvc");
  const projects = getProjects();
  const counts = {
    windows: getWindows().length,
    doors: getDoors().length,
    panels: getPanels().length,
  };

  return (
    <>
      <WhyPageJsonLd />
      <FaqJsonLd faqs={faqs} />
      <WhyUpvcView
        company={company}
        faqs={faqs}
        projects={projects}
        counts={counts}
      />
    </>
  );
}
