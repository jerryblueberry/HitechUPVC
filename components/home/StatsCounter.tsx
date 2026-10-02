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
    <section className="section-padding bg-navy text-surface" aria-label="Company figures">
      <div className="container-content">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <RevealOnScroll
              key={item.label}
              delay={i * 0.08}
              className={`px-5 py-8 sm:px-8 lg:px-10 lg:py-2 ${
                i % 2 === 1 ? "border-l border-surface/15" : ""
              } ${i >= 2 ? "border-t border-surface/15 lg:border-t-0" : ""} ${
                i > 0 ? "lg:border-l lg:border-surface/15" : ""
              }`}
            >
              <p
                className="font-display text-[clamp(2.35rem,5.5vw,3.75rem)] leading-none tracking-tight text-surface tabular-nums"
                aria-label={`${item.value.toLocaleString("en-US")}${item.suffix} ${item.label}`}
              >
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-3 max-w-[12ch] text-sm leading-snug text-surface/55 sm:mt-4">
                {item.label}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
