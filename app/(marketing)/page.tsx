import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ScrollDoorSequence } from "@/components/home/ScrollDoorSequence";
import { USPStrip } from "@/components/home/USPStrip";
import { ProductCategoryShowcase } from "@/components/home/ProductCategoryShowcase";
import { OpeningTypesExplainer } from "@/components/home/OpeningTypesExplainer";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ProofChapter } from "@/components/home/ProofChapter";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { whatsappHref } from "@/lib/constants";
import {
  getCompany,
  getDoors,
  getProjects,
  getTestimonials,
  getWindows,
} from "@/lib/getData";
import { absoluteUrl, CORE_KEYWORDS, getSiteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "uPVC Windows, Doors & Panels in Nepal",
  "Hi-Tech uPVC Profile Industries makes energy-efficient uPVC windows, doors, and panels in Nepal. Tarakeshwar factory — serving Kathmandu, Pokhara, and nationwide.",
  "/",
  undefined,
  { keywords: [...CORE_KEYWORDS] }
);

function HomePageJsonLd() {
  const company = getCompany();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": absoluteUrl("/"),
        url: absoluteUrl("/"),
        name: `${company.companyName} | uPVC Windows, Doors & Panels in Nepal`,
        description:
          "Hi-Tech uPVC Profile Industries manufactures and installs made-to-measure uPVC windows, doors, and panels in Nepal.",
        inLanguage: "en-NP",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: { "@id": `${getSiteUrl()}/#organization` },
        primaryImageOfPage: absoluteUrl("/images/upvc/sequences/hero-lifestyle.webp"),
      }}
    />
  );
}

export default function HomePage() {
  const company = getCompany();
  const testimonials = getTestimonials();
  const projects = getProjects();

  return (
    <>
      <HomePageJsonLd />
      <Hero company={company} />
      <ScrollDoorSequence />
      <USPStrip usps={company.usps} />
      <ProductCategoryShowcase
        counts={{
          windows: getWindows().length,
          doors: getDoors().length,
        }}
      />
      <OpeningTypesExplainer />
      <ProcessTimeline process={company.process} />
      <ProofChapter
        testimonials={testimonials}
        stats={company.stats}
        projects={projects}
      />
      <section className="pb-4 md:pb-6">
        <div className="container-content">
          <RevealOnScroll className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-charcoal/55">
            <span className="font-medium text-charcoal/70">Serving</span>
            <Link
              href="/service-areas/kathmandu"
              className="text-navy underline-offset-4 hover:underline"
            >
              Kathmandu valley
            </Link>
            <Link
              href="/service-areas/pokhara"
              className="text-navy underline-offset-4 hover:underline"
            >
              Pokhara
            </Link>
            <Link href="/products" className="text-navy underline-offset-4 hover:underline">
              All products
            </Link>
            <Link href="/why-upvc" className="text-navy underline-offset-4 hover:underline">
              Why uPVC
            </Link>
          </RevealOnScroll>
        </div>
      </section>
      <CTASection
        title="Ready for quieter rooms and cleaner sightlines?"
        body="Book a free site measurement in Kathmandu or Pokhara. We measure, make at Tarakeshwar, and fit — with a 10-year warranty on profiles and hardware."
        primaryLabel="Book a free site measurement"
        primaryHref="/get-quote"
        secondaryHref={whatsappHref(company.contact.whatsapp)}
        secondaryLabel="WhatsApp us"
        secondaryIcon="whatsapp"
      />
    </>
  );
}
