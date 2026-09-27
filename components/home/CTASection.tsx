import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface CTASectionProps {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CTASection({
  title = "Ready to transform your space?",
  body = "Get a free, no-obligation quote. Our team will guide you from product selection to installation.",
  primaryHref = "/get-quote",
  primaryLabel = "Get a Free Quote",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: CTASectionProps) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-charcoal opacity-95"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-20 animate-pulse motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, var(--color-gold) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-content relative z-10 text-center text-surface">
        <RevealOnScroll>
          <h2 className="font-display text-h2 mb-4">{title}</h2>
          <p className="text-surface/70 mb-8 max-w-xl mx-auto">{body}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton href={primaryHref} variant="primary" className="!bg-gold !text-charcoal hover:!bg-gold/90">
              {primaryLabel}
            </MagneticButton>
            <MagneticButton href={secondaryHref} variant="secondary" className="!border-surface/30 !text-surface hover:!border-gold hover:!text-gold">
              {secondaryLabel}
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
