import type { Company } from "@/lib/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ProcessTimelineProps {
  process: Company["process"];
}

export function ProcessTimeline({ process }: ProcessTimelineProps) {
  return (
    <section className="section-padding">
      <div className="container-content">
        <RevealOnScroll>
          <p className="eyebrow mb-4">Our Process</p>
          <h2 className="font-display text-h2 text-navy mb-12">
            From consultation to aftercare
          </h2>
        </RevealOnScroll>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-surface-muted" aria-hidden />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {process.map((step, i) => (
              <RevealOnScroll key={step.step} delay={i * 0.08}>
                <div className="relative text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy text-surface font-display text-xl mb-4 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-display text-lg text-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-charcoal/70">{step.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
