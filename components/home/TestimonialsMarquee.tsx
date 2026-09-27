import type { Testimonial } from "@/lib/types";
import { Marquee } from "@/components/ui/Marquee";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-80 p-6 rounded-lg bg-surface border border-surface-muted">
      <div className="flex gap-1 mb-3 text-gold" aria-label={`${testimonial.rating} stars`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="text-sm text-charcoal/80 mb-4 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="font-medium text-navy text-sm">{testimonial.name}</p>
      <p className="text-xs text-charcoal/50">{testimonial.projectType}</p>
    </div>
  );
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  return (
    <section className="section-padding bg-surface-muted overflow-hidden">
      <div className="container-content mb-8">
        <RevealOnScroll>
          <p className="eyebrow mb-4">Testimonials</p>
          <h2 className="font-display text-h2 text-navy">Trusted by homeowners & architects</h2>
        </RevealOnScroll>
      </div>

      <Marquee className="pb-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </Marquee>
    </section>
  );
}
