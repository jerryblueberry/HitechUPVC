import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CTASection } from "@/components/home/CTASection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhyStudioViewer } from "@/components/why/WhyStudioViewer";
import { CATEGORY_BLURBS, CATEGORY_LABELS, CATEGORY_PATHS, whatsappHref } from "@/lib/constants";
import { UPVC_PNG } from "@/lib/upvcAssets";
import type { ColorSwatch, Company, ProductCategory, ProductIndexEntry } from "@/lib/types";

const JUMPS: Array<{
  category: ProductCategory;
  image: string | null;
}> = [
  { category: "windows", image: UPVC_PNG.windowModern },
  { category: "doors", image: UPVC_PNG.doorFrench },
  { category: "panels", image: null },
];

interface ProductsViewProps {
  company: Company;
  products: ProductIndexEntry[];
  colors: ColorSwatch[];
}

export function ProductsView({ company, products, colors }: ProductsViewProps) {
  const counts = {
    windows: products.filter((product) => product.category === "windows").length,
    doors: products.filter((product) => product.category === "doors").length,
    panels: products.filter((product) => product.category === "panels").length,
  };

  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll className="max-w-xl">
            <p className="eyebrow mb-4 text-gold">Our range</p>
            <h1 className="font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {company.hero.headline}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
              {company.hero.subheadline} {company.tagline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href="/contact">Get a Free Quote</MagneticButton>
              <MagneticButton
                href={whatsappHref(
                  company.contact.whatsapp,
                  "Hi Hi-Tech — I’d like to see the uPVC range and request a quote."
                )}
                variant="secondary"
              >
                WhatsApp the workshop
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            <WhyStudioViewer
              openingType="casement"
              posterAlt="White uPVC casement window — Hi-Tech uPVC Kathmandu"
              caption="Live 3D casement · made to measure"
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-padding !pt-0">
        <div className="container-content">
          <RevealOnScroll className="mb-10 max-w-2xl">
            <p className="eyebrow mb-4 text-gold">Browse by family</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Three systems. One workshop in Kathmandu.
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {JUMPS.map((jump, index) => {
              const count = counts[jump.category];
              return (
                <RevealOnScroll key={jump.category} delay={index * 0.08}>
                  <Link
                    href={CATEGORY_PATHS[jump.category]}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white ring-1 ring-charcoal/[0.05] shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-28px_rgba(27,27,29,0.16)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-1">
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-cream)_0%,white_40%,var(--color-surface)_100%)]"
                      />
                      {jump.image ? (
                        <Image
                          src={jump.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-contain p-8 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div
                          className="absolute inset-[14%] overflow-hidden rounded-2xl"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, var(--color-bronze) 0px, var(--color-gold) 6px, var(--color-gold-muted) 10px, var(--color-gold) 14px, var(--color-bronze) 18px)",
                          }}
                          aria-hidden
                        />
                      )}
                    </div>
                    <p className="mt-5 text-[0.8125rem] text-charcoal/45">
                      {count} {count === 1 ? "style" : "styles"}
                    </p>
                    <h3 className="mt-1 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal">
                      {CATEGORY_LABELS[jump.category]}
                    </h3>
                    <p className="mt-2 max-w-[18rem] text-[0.9375rem] leading-relaxed text-charcoal/60">
                      {CATEGORY_BLURBS[jump.category]}
                    </p>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section id="catalogue" className="section-padding !pt-0 scroll-mt-24">
        <div className="container-content">
          <RevealOnScroll className="mb-8 max-w-2xl">
            <p className="eyebrow mb-4 text-gold">The catalogue</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Filter the systems we make.
            </h2>
          </RevealOnScroll>

          <Suspense
            fallback={
              <p className="text-sm text-charcoal/50">Loading catalogue…</p>
            }
          >
            <ProductGrid products={products} colors={colors} />
          </Suspense>
        </div>
      </section>

      <CTASection
        title="Need a size that isn’t on the page?"
        body="Every Hi-Tech system is made to measure. Send openings, a floor plan, or a WhatsApp photo — we’ll spec the profile."
        primaryHref="/contact"
        primaryLabel="Get a Free Quote"
        secondaryHref={whatsappHref(
          company.contact.whatsapp,
          "Hi Hi-Tech — I have openings to measure for uPVC."
        )}
        secondaryLabel="WhatsApp us"
      />
    </article>
  );
}