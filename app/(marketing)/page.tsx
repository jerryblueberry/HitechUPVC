import { Hero } from "@/components/home/Hero";
import { ScrollDoorSequence } from "@/components/home/ScrollDoorSequence";
import { USPStrip } from "@/components/home/USPStrip";
import { ProductCategoryShowcase } from "@/components/home/ProductCategoryShowcase";
import { OpeningTypesExplainer } from "@/components/home/OpeningTypesExplainer";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { StatsCounter } from "@/components/home/StatsCounter";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { CTASection } from "@/components/home/CTASection";
import {
  getCompany,
  getDoors,
  getPanels,
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
          panels: getPanels().length,
        }}
      />
      <OpeningTypesExplainer />
      <BeforeAfterSlider />
      <ProcessTimeline process={company.process} />
      <TestimonialsMarquee testimonials={testimonials} />
      <StatsCounter stats={company.stats} />
      <GalleryTeaser projects={projects} />
      <CTASection />
    </>
  );
}
