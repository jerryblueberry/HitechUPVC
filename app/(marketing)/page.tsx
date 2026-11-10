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
  "uPVC Windows & Doors in Kathmandu, Nepal | Hi-Tech uPVC",
  "Hi-Tech uPVC (Hitech uPVC) manufactures uPVC windows, doors, and panels at its Tarakeshwar factory — installed across Kathmandu, Lalitpur, Bhaktapur, Pokhara, and Nepal. Free site measurement.",
  "/",
  undefined,
  { keywords: CORE_KEYWORDS, absoluteTitle: true }
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
        name: `uPVC Windows & Doors in Kathmandu, Nepal | ${company.companyName}`,
        description:
          "Hi-Tech uPVC Profile Industries (Hitech uPVC) manufactures and installs made-to-measure uPVC windows, doors, and panels in Kathmandu and across Nepal.",
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
      <section className="pb-10 pt-2 md:pb-14 md:pt-4" aria-label="Explore Hi-Tech uPVC">
        <div className="container-content">
          <RevealOnScroll className="border-t border-charcoal/[0.08] pt-8 md:pt-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div className="max-w-sm">
                <p className="eyebrow text-gold">Serving Nepal</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal/55 sm:text-base">
                  uPVC windows and doors made in Tarakeshwar — installed across the valley and beyond.
                </p>
              </div>
              <nav
                aria-label="Service areas"
                className="grid grid-cols-2 items-center gap-x-3 gap-y-3 sm:flex sm:flex-wrap sm:justify-end sm:gap-3"
              >
                {[
                  { href: "/service-areas/kathmandu", label: "Kathmandu" },
                  { href: "/service-areas/lalitpur", label: "Lalitpur" },
                  { href: "/service-areas/bhaktapur", label: "Bhaktapur" },
                  { href: "/service-areas/pokhara", label: "Pokhara" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-center text-[0.875rem] font-medium text-navy ring-1 ring-charcoal/[0.08] transition-[color,background-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-navy hover:text-surface hover:shadow-[0_12px_28px_-18px_rgba(14,42,62,0.55)] hover:ring-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 sm:min-w-[7.5rem]"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="translate-x-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      ›
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
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
