import type { CompanyStats } from "@/lib/types";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface StatsCounterProps {
  stats: CompanyStats;
}

export function StatsCounter({ stats }: StatsCounterProps) {
  const items = [
    { label: "Years in business", value: stats.yearsInBusiness, suffix: "+" },
    { label: "Installations", value: stats.installations, suffix: "+" },
    { label: "Cities served", value: stats.citiesServed, suffix: "" },
    ...(stats.satisfactionRate
      ? [{ label: "Customer satisfaction", value: stats.satisfactionRate, suffix: "%" }]
      : []),
  ];

  return (
    <section className="section-padding bg-navy text-surface">
      <div className="container-content">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((item, i) => (
            <RevealOnScroll key={item.label} delay={i * 0.08}>
              <p className="font-display text-4xl lg:text-5xl text-gold mb-2">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="text-sm text-surface/70">{item.label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
