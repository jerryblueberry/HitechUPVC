import type { CompanyStats } from "@/lib/types";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const LG_COL = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
] as const;

const LG_DIVIDER = [
  "",
  "lg:border-l lg:border-charcoal/12",
  "lg:border-l lg:border-charcoal/12",
  "lg:border-l lg:border-charcoal/12",
] as const;

type StatItem = {
  label: string;
  value: number;
  suffix: string;
};

function cellShell(index: number) {
  return [
    "h-full px-0 py-8 sm:px-8 sm:py-9",
    index > 0 ? "border-t border-charcoal/12 sm:border-t-0" : "",
    index >= 2 ? "sm:border-t sm:border-charcoal/12" : "",
    index % 2 === 1 ? "sm:border-l sm:border-charcoal/12" : "",
  ].join(" ");
}

function StatFigure({ item }: { item: StatItem }) {
  return (
    <p
      className="font-display text-[clamp(2.35rem,5.5vw,3.5rem)] leading-none tracking-tight text-charcoal tabular-nums"
      aria-label={`${item.value.toLocaleString("en-US")}${item.suffix} ${item.label}`}
    >
      <AnimatedCounter value={item.value} suffix={item.suffix} />
    </p>
  );
}

function StatPoint({
  item,
  index,
  mode,
}: {
  item: StatItem;
  index: number;
  mode: "stack" | "grid";
}) {
  const col = LG_COL[index] ?? LG_COL[0];
  const rule = LG_DIVIDER[index] ?? "";

  if (mode === "stack") {
    return (
      <>
        <StatFigure item={item} />
        <p className="mt-3 max-w-[14ch] text-sm leading-snug text-charcoal/70 sm:mt-4">
          {item.label}
        </p>
      </>
    );
  }

  return (
    <>
      <div
        className={`flex min-h-[3.5rem] items-end ${col} lg:row-start-1 lg:px-10 lg:pt-10 ${rule}`}
      >
        <StatFigure item={item} />
      </div>
      <p
        className={`max-w-[14ch] text-sm leading-snug text-charcoal/70 ${col} lg:row-start-2 lg:px-10 lg:pt-4 lg:pb-10 ${rule}`}
      >
        {item.label}
      </p>
    </>
  );
}

interface StatsCounterProps {
  stats: CompanyStats;
  /** Inside ProofChapter — no outer section padding */
  embedded?: boolean;
}

export function StatsCounter({ stats, embedded = false }: StatsCounterProps) {
  const items: StatItem[] = [
    { label: "Years in business", value: stats.yearsInBusiness, suffix: "+" },
    { label: "Installations", value: stats.installations, suffix: "+" },
    { label: "Cities served", value: stats.citiesServed, suffix: "" },
    ...(stats.satisfactionRate
      ? [
          {
            label: "Customer satisfaction",
            value: stats.satisfactionRate,
            suffix: "%",
          },
        ]
      : []),
  ];

  const grid = (
    <div className="container-content">
      <div className="border-t border-charcoal/12">
        <div className="grid grid-cols-2 lg:hidden">
          {items.map((item, i) => (
            <RevealOnScroll
              key={item.label}
              delay={i * 0.06}
              className={cellShell(i)}
            >
              <StatPoint item={item} index={i} mode="stack" />
            </RevealOnScroll>
          ))}
        </div>

        <div className="hidden grid-cols-4 grid-rows-[auto_auto] lg:grid">
          {items.map((item, i) => (
            <div key={item.label} className="contents">
              <StatPoint item={item} index={i} mode="grid" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="pb-12 sm:pb-14 lg:pb-16" aria-label="Company figures">
        {grid}
      </div>
    );
  }

  return (
    <section className="section-padding bg-surface" aria-label="Company figures">
      {grid}
    </section>
  );
}
