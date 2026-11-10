import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { quoteHref } from "@/lib/constants";
import type { Guide } from "@/lib/types";

interface GuidesIndexViewProps {
  guides: Guide[];
}

export function GuidesIndexView({ guides }: GuidesIndexViewProps) {
  return (
    <section className="section-padding page-top bg-surface">
      <div className="container-content">
        <RevealOnScroll priority className="mb-12 max-w-3xl lg:mb-16">
          <p className="eyebrow mb-3 text-gold sm:mb-4">Guides</p>
          <h1 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
            uPVC buying guides for Kathmandu and Nepal.
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-lg">
            Clear answers on prices, uPVC vs aluminium and wood, Kathmandu
            climate, lifespan, and choosing doors — from Hi-Tech uPVC Profile
            Industries in Tarakeshwar.
          </p>
          <div className="mt-7">
            <MagneticButton href={quoteHref()} trackLocation="guides_index">
              Get a Free Quote
            </MagneticButton>
          </div>
        </RevealOnScroll>

        <ul className="divide-y divide-charcoal/[0.08] border-y border-charcoal/[0.08]">
          {guides.map((guide, index) => (
            <li key={guide.slug}>
              <RevealOnScroll delay={index * 0.04}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex cursor-pointer flex-col gap-3 py-8 transition-colors sm:flex-row sm:items-end sm:justify-between sm:gap-10"
                >
                  <div className="max-w-2xl">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
                      {guide.eyebrow}
                    </p>
                    <h2 className="mt-2 font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight tracking-tight text-charcoal transition-colors group-hover:text-navy">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal/60">
                      {guide.summary}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-navy">
                    Read guide
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      ›
                    </span>
                  </span>
                </Link>
              </RevealOnScroll>
            </li>
          ))}
        </ul>

        <RevealOnScroll className="mt-14 flex flex-wrap gap-x-6 gap-y-3 text-sm text-charcoal/55">
          <span className="font-medium text-charcoal/70">Also explore</span>
          <Link href="/why-upvc" className="text-navy underline-offset-4 hover:underline">
            Why uPVC
          </Link>
          <Link href="/products" className="text-navy underline-offset-4 hover:underline">
            Products
          </Link>
          <Link
            href="/service-areas/kathmandu"
            className="text-navy underline-offset-4 hover:underline"
          >
            Kathmandu
          </Link>
          <Link
            href="/service-areas/lalitpur"
            className="text-navy underline-offset-4 hover:underline"
          >
            Lalitpur
          </Link>
          <Link
            href="/service-areas/bhaktapur"
            className="text-navy underline-offset-4 hover:underline"
          >
            Bhaktapur
          </Link>
          <Link
            href="/service-areas/pokhara"
            className="text-navy underline-offset-4 hover:underline"
          >
            Pokhara
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
