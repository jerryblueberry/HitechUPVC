import { Hero } from "@/components/home/Hero";
import { ScrollDoorSequence } from "@/components/home/ScrollDoorSequence";
import { USPStrip } from "@/components/home/USPStrip";
import { ProductCategoryShowcase } from "@/components/home/ProductCategoryShowcase";
import { OpeningTypesExplainer } from "@/components/home/OpeningTypesExplainer";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ProofChapter } from "@/components/home/ProofChapter";
import { CTASection } from "@/components/home/CTASection";
import { whatsappHref } from "@/lib/constants";
import {
  getCompany,
  getDoors,
  getProjects,
  getTestimonials,
  getWindows,
} from "@/lib/getData";

export default function HomePage() {
  const company = getCompany();
  const testimonials = getTestimonials();
  const projects = getProjects();

  return (
    <>
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
      <CTASection
        title="Ready for quieter rooms and cleaner sightlines?"
        body="Book a free site measurement. We measure, make at Tarakeshwar, and fit — with a 10-year warranty on profiles and hardware."
        primaryLabel="Book a free site measurement"
        primaryHref="/get-quote"
        secondaryHref={whatsappHref(company.contact.whatsapp)}
        secondaryLabel="WhatsApp us"
        secondaryIcon="whatsapp"
      />
    </>
  );
}
