import type { Testimonial } from "@/lib/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      className={filled ? "fill-gold" : "fill-charcoal/15"}
    >
      <path d="M12 3.15 14.62 9l6.38.7-4.8 4.4 1.38 6.35L12 17.4l-5.58 3.05 1.38-6.35-4.8-4.4L9.38 9 12 3.15Z" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < rating} />
      ))}
    </div>
  );
}

function QuoteMark() {
  return (
    <svg viewBox="0 0 32 24" aria-hidden className="h-6 w-8 fill-gold/80">
      <path d="M0 24V13.2C0 5.5 4.4 1.2 13.2 0l1.3 2.8C9.6 4.2 7.2 7 6.8 10.4H13V24H0Zm17.5 0V13.2C17.5 5.5 21.9 1.2 30.7 0L32 2.8c-4.9 1.4-7.3 4.2-7.7 7.6H30.5V24H17.5Z" />
    </svg>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] ring-1 ring-charcoal/[0.06] lg:rounded-[2rem] lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <Stars rating={testimonial.rating} />
        <QuoteMark />
      </div>

      <blockquote className="mt-5 text-pretty text-[0.9375rem] leading-relaxed text-charcoal sm:mt-6 sm:text-base">
        {testimonial.quote}
      </blockquote>
      <div className="mt-auto pt-5 sm:pt-6">
        <footer className="border-t border-charcoal/10 pt-4 sm:pt-5">
          <p className="font-medium tracking-tight text-charcoal">{testimonial.name}</p>
          <p className="mt-1 text-sm text-charcoal/50">
            {[testimonial.role, testimonial.projectType].filter(Boolean).join(" · ")}
          </p>
          {testimonial.location ? (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-navy">
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden className="shrink-0 fill-gold">
                <path d="M8 1.25a4.25 4.25 0 0 0-4.25 4.25c0 3.2 4.25 9.25 4.25 9.25s4.25-6.05 4.25-9.25A4.25 4.25 0 0 0 8 1.25Zm0 5.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
              </svg>
              {testimonial.location}
            </p>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  const featured = testimonials[0];
  const rest = testimonials.slice(1);

  if (!featured) return null;

  return (
    <section
      className="section-padding overflow-hidden bg-surface-muted"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-content">
        <RevealOnScroll className="mb-8 max-w-2xl sm:mb-10 lg:mb-14">
          <p className="eyebrow mb-4 text-gold">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="scroll-mt-24 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal lg:scroll-mt-28"
          >
            Trusted across the Kathmandu valley
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-charcoal/60 sm:mt-4 sm:text-lg">
            Homeowners and architects in Nepal, in their own words.
          </p>
        </RevealOnScroll>

        {/* Phone: horizontal snap with a peek of the next card. */}
        <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 touch-manipulation gap-4 overflow-x-auto overscroll-x-contain px-6 pb-1 [scrollbar-width:none] motion-reduce:mx-0 motion-reduce:flex-col motion-reduce:overflow-visible motion-reduce:px-0 md:hidden [&::-webkit-scrollbar]:hidden">
          {[featured, ...rest].map((t) => (
            <div
              key={t.id}
              className="w-[min(19.5rem,85vw)] shrink-0 snap-start motion-reduce:w-full"
            >
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:items-stretch md:gap-4 lg:gap-6">
          <RevealOnScroll className="h-full">
            <TestimonialCard testimonial={featured} />
          </RevealOnScroll>
          {rest.map((t, i) => (
            <RevealOnScroll key={t.id} delay={0.08 * (i + 1)} className="h-full">
              <TestimonialCard testimonial={t} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
