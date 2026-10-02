import type { Company } from "@/lib/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ProcessTimelineProps {
  process: Company["process"];
}

export function ProcessTimeline({ process }: ProcessTimelineProps) {
  return (
    <section
      className="section-padding bg-surface-muted"
      aria-labelledby="process-heading"
    >
      <div className="container-content">
        <RevealOnScroll className="mb-10 max-w-2xl lg:mb-14">
          <p className="eyebrow mb-3 text-gold sm:mb-4">Our Process</p>
          <h2
            id="process-heading"
            className="font-display text-[clamp(1.85rem,4.2vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal"
          >
            From consultation to aftercare
          </h2>
          <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-4 sm:text-base lg:text-lg">
            Five clear steps from the first conversation to ongoing support —
            measured, made, and fitted by our team.
          </p>
        </RevealOnScroll>

        {/*
          Even rhythm: gap lives on the list, not on content height.
          Mobile = vertical spine; lg+ = horizontal spine through markers.
        */}
        <ol className="relative m-0 flex list-none flex-col gap-7 p-0 sm:gap-8 lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Mobile spine — continuous, centred on the marker column */}
          <span
            className="pointer-events-none absolute top-5 bottom-5 left-5 w-px -translate-x-1/2 bg-charcoal/15 sm:top-6 sm:bottom-6 sm:left-6 lg:hidden"
            aria-hidden
          />
          {/* Desktop spine */}
          <span
            className="pointer-events-none absolute top-6 right-[10%] left-[10%] hidden h-px bg-charcoal/15 lg:block"
            aria-hidden
          />

          {process.map((step, i) => (
            <li key={step.step} className="relative min-w-0">
              <RevealOnScroll
                delay={i * 0.06}
                className="flex items-start gap-4 sm:gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm text-surface shadow-[0_6px_18px_-10px_rgba(27,27,29,0.5)] ring-[3px] ring-surface-muted sm:h-12 sm:w-12 sm:text-base lg:mx-auto lg:mb-4 lg:h-12 lg:w-12 lg:text-lg">
                  <span className="tabular-nums leading-none">{step.step}</span>
                </div>

                <div className="min-w-0 flex-1 pt-1 lg:pt-0">
                  <h3 className="font-display text-base tracking-tight text-charcoal sm:text-lg lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/60 sm:mt-1.5 sm:text-[0.9375rem] lg:mx-auto lg:max-w-[13.5rem]">
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
