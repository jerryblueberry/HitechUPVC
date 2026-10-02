import Link from "next/link";
import { Suspense } from "react";
import { CTASection } from "@/components/home/CTASection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhyStudioViewer } from "@/components/why/WhyStudioViewer";
import { CATEGORY_BLURBS, CATEGORY_LABELS, CATEGORY_PATHS, quoteHref, whatsappHref } from "@/lib/constants";
import { CATEGORY_PAGES } from "@/lib/categoryPages";
import type { ColorSwatch, Company, ProductCategory, ProductIndexEntry } from "@/lib/types";

interface CategoryViewProps {
  category: ProductCategory;
  company: Company;
  products: ProductIndexEntry[];
  colors: ColorSwatch[];
}

export function CategoryView({ category, company, products, colors }: CategoryViewProps) {
  const copy = CATEGORY_PAGES[category];
  const siblings = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).filter(
    (item) => item !== category
  );

  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll priority className="max-w-xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-caption text-charcoal/50">
                <li>
                  <Link href="/products" className="hover:text-charcoal">
                    Products
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-charcoal/70">{CATEGORY_LABELS[category]}</li>
              </ol>
            </nav>
            <p className="eyebrow mb-4 text-gold">{CATEGORY_LABELS[category]}</p>
            <h1 className="font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {copy.headline}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
              {copy.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href={quoteHref(category)}>Get a Free Quote</MagneticButton>
              <MagneticButton
                href={whatsappHref(company.contact.whatsapp, copy.whatsappPrefill)}
                variant="secondary"
              >
                WhatsApp the workshop
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <RevealOnScroll priority delay={0.12}>
            <WhyStudioViewer
              openingType={copy.openingType}
              category={category}
              posterAlt={copy.posterAlt}
              caption={copy.caption}
            />
          </RevealOnScroll>
        </div>
      </section>

      <section id="catalogue" className="section-padding !pt-0 scroll-mt-24">
        <div className="container-content">
          <RevealOnScroll className="mb-8 max-w-2xl">
            <p className="eyebrow mb-4 text-gold">The catalogue</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {products.length} {CATEGORY_LABELS[category].toLowerCase()} we make to measure.
            </h2>
          </RevealOnScroll>

          <Suspense
            fallback={
              <p className="text-sm text-charcoal/50">Loading catalogue…</p>
            }
          >
            <ProductGrid
              products={products}
              colors={colors}
              lockedCategory={category}
            />
          </Suspense>

          <div className="mt-14 border-t border-charcoal/8 pt-10">
            <p className="eyebrow mb-4 text-gold">Also in the workshop</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {siblings.map((item) => (
                <Link
                  key={item}
                  href={CATEGORY_PATHS[item]}
                  className="group rounded-3xl bg-white px-6 py-6 ring-1 ring-charcoal/5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(27,27,29,0.18)]"
                >
                  <h3 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal">
                    {CATEGORY_LABELS[item]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                    {CATEGORY_BLURBS[item]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy">
                    Explore {CATEGORY_LABELS[item].toLowerCase()}
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      ›
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Need a size that isn’t listed?"
        body="Every Hi-Tech system is made to measure. Send openings, a floor plan, or a WhatsApp photo — we’ll spec the profile."
        primaryHref={quoteHref(category)}
        primaryLabel="Get a Free Quote"
        secondaryHref={whatsappHref(
          company.contact.whatsapp,
          `Hi Hi-Tech — I have openings to measure for uPVC ${CATEGORY_LABELS[category].toLowerCase()}.`
        )}
        secondaryLabel="WhatsApp us"
        secondaryIcon="whatsapp"
      />
    </article>
  );
}