import type { ReactNode } from "react";
import type { CompanyUSP } from "@/lib/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: Record<string, ReactNode> = {
  energy: (
    <svg {...iconProps}>
      <path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z" />
    </svg>
  ),
  security: (
    <svg {...iconProps}>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  maintenance: (
    <svg {...iconProps}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  ),
  warranty: (
    <svg {...iconProps}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7.5 5-2.5 5 2.5-1.5-7.5" />
    </svg>
  ),
};

/** Headline figure per USP, when the data carries a value */
function Figure({ usp }: { usp: CompanyUSP }) {
  if (!usp.value) return null;

  const unit = usp.icon === "energy" ? "W/m²K" : usp.icon === "warranty" ? "years" : "";
  const numeric = Number(usp.value);

  return (
    <p className="mb-3 flex items-baseline gap-2 font-display text-5xl leading-none tracking-tight text-charcoal">
      {Number.isInteger(numeric) ? <AnimatedCounter value={numeric} /> : usp.value}
      {unit && <span className="font-sans text-base font-medium text-charcoal/45">{unit}</span>}
    </p>
  );
}

interface USPStripProps {
  usps: CompanyUSP[];
}

export function USPStrip({ usps }: USPStripProps) {
  return (
    <section className="bg-surface pt-10 pb-[var(--spacing-section)] sm:pt-12 lg:pt-16 lg:pb-[var(--spacing-section-lg)]">
      <div className="container-content">
        <RevealOnScroll className="mb-10 max-w-2xl lg:mb-14">
          <p className="eyebrow mb-4 text-gold">Why Hi-Tech uPVC</p>
          <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
            Built better, in every detail.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
            Multi-chamber profiles, steel-reinforced frames and hardware tested
            for decades of daily use.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {usps.map((usp, i) => (
            <RevealOnScroll key={usp.title} delay={i * 0.08} className="h-full">
              <article className="group flex h-full min-h-[240px] flex-col rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] ring-1 ring-charcoal/[0.05] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.2)] lg:min-h-[280px]">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted/60 text-charcoal transition-colors duration-500 group-hover:bg-gold/15 group-hover:text-gold"
                  aria-hidden
                >
                  {ICONS[usp.icon]}
                </span>

                <div className="mt-auto pt-10">
                  <Figure usp={usp} />
                  <h3 className="text-lg font-semibold tracking-tight text-charcoal">
                    {usp.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/60">
                    {usp.description}
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
