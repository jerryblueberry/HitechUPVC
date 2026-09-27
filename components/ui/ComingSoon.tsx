import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function ComingSoon({
  eyebrow,
  title,
  body,
  primaryHref = "/contact",
  primaryLabel = "Contact us",
  secondaryHref = "/products",
  secondaryLabel = "Browse products",
}: ComingSoonProps) {
  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll className="max-w-xl">
            <p className="eyebrow mb-4 text-gold">{eyebrow}</p>
            <h1 className="font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
              {body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href={primaryHref}>{primaryLabel}</MagneticButton>
              <MagneticButton href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            <div className="relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-charcoal/5 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.18)]">
              <div className="flex aspect-[4/5] flex-col justify-end bg-[linear-gradient(180deg,var(--color-cream)_0%,white_46%,var(--color-surface)_100%)] p-8 sm:aspect-[5/4] lg:aspect-[4/5]">
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-gold">
                  In the workshop
                </p>
                <p className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal">
                  Arriving soon.
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal/50">
                  This page is being built to the same standard as the rest of
                  the site.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </article>
  );
}