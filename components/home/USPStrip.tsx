import type { CompanyUSP } from "@/lib/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

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

function unitFor(icon: string) {
  if (icon === "energy") return "W/m²K";
  if (icon === "warranty") return "years";
  return "";
}

function Figure({ usp }: { usp: CompanyUSP }) {
  if (!usp.value) return null;

  const numeric = Number(usp.value);
  const unit = unitFor(usp.icon);

  return (
    <p className="flex items-baseline gap-2 font-display text-[clamp(2.35rem,3.4vw,3.25rem)] leading-none tracking-tight text-charcoal tabular-nums">
      {Number.isInteger(numeric) ? (
        <AnimatedCounter value={numeric} />
      ) : (
        usp.value
      )}
      {unit ? (
        <span className="font-sans text-sm font-medium tracking-normal text-charcoal/70">
          {unit}
        </span>
      ) : null}
    </p>
  );
}

/** Hairline dividers — one grid, no floating cards. Same rhythm as StatsCounter. */
function cellShell(index: number) {
  return [
    "h-full px-0 py-8 sm:px-8 sm:py-9",
    index > 0 ? "border-t border-charcoal/12 sm:border-t-0" : "",
    index >= 2 ? "sm:border-t sm:border-charcoal/12" : "",
    index % 2 === 1 ? "sm:border-l sm:border-charcoal/12" : "",
  ].join(" ");
}

function SpecPoint({
  usp,
  index,
  mode,
}: {
  usp: CompanyUSP;
  index: number;
  mode: "stack" | "grid";
}) {
  const col = LG_COL[index] ?? LG_COL[0];
  const rule = LG_DIVIDER[index] ?? "";

  if (mode === "stack") {
    return (
      <>
        <h3 className="font-display text-xl leading-tight tracking-tight text-charcoal sm:text-[1.35rem]">
          {usp.title}
        </h3>
        <div
          className="mt-4 min-h-[2.75rem] sm:min-h-[3rem]"
          aria-hidden={!usp.value}
        >
          <Figure usp={usp} />
        </div>
        <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-charcoal/70 sm:mt-4">
          {usp.description}
        </p>
      </>
    );
  }

  return (
    <>
      <h3
        className={`font-display text-[1.35rem] leading-snug tracking-tight text-charcoal ${col} lg:row-start-1 lg:px-10 lg:pt-10 ${rule}`}
      >
        {usp.title}
      </h3>
      <div
        className={`flex min-h-[3.5rem] items-end ${col} lg:row-start-2 lg:px-10 lg:pt-4 ${rule}`}
        aria-hidden={!usp.value}
      >
        <Figure usp={usp} />
      </div>
      <p
        className={`text-sm leading-relaxed text-charcoal/70 ${col} lg:row-start-3 lg:px-10 lg:pt-4 lg:pb-10 ${rule}`}
      >
        {usp.description}
      </p>
    </>
  );
}

interface USPStripProps {
  usps: CompanyUSP[];
}

export function USPStrip({ usps }: USPStripProps) {
  return (
    <section
      className="bg-surface pt-10 pb-[var(--spacing-section)] sm:pt-12 lg:pt-16 lg:pb-[var(--spacing-section-lg)]"
      aria-labelledby="why-hitech-heading"
    >
      <div className="container-content">
        <RevealOnScroll className="max-w-2xl lg:max-w-3xl">
          <p className="eyebrow mb-4 text-gold">Why Hi-Tech uPVC</p>
          <h2
            id="why-hitech-heading"
            className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal"
          >
            Built better, in every detail.
          </h2>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-charcoal/70 sm:text-lg">
            Multi-chamber profiles, steel-reinforced frames and hardware tested
            for decades of daily use.
          </p>
        </RevealOnScroll>

        <div className="mt-12 border-t border-charcoal/12 sm:mt-14 lg:mt-16">
          {/* Tablet and phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden">
            {usps.map((usp, i) => (
              <RevealOnScroll
                key={usp.title}
                delay={i * 0.06}
                className={cellShell(i)}
              >
                <SpecPoint usp={usp} index={i} mode="stack" />
              </RevealOnScroll>
            ))}
          </div>

          {/* Desktop: shared rows — motion wrappers would break display:contents */}
          <div className="hidden grid-cols-4 grid-rows-[auto_auto_auto] lg:grid">
            {usps.map((usp, i) => (
              <div key={usp.title} className="contents">
                <SpecPoint usp={usp} index={i} mode="grid" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
