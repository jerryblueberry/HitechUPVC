import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_PATHS, OPENING_TYPE_LABELS } from "@/lib/constants";
import { getColors } from "@/lib/getData";
import type { Product } from "@/lib/types";
import { UpvcConfigurator } from "./UpvcConfigurator";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3 border-b border-charcoal/8">
      <dt className="text-caption text-charcoal/55">{label}</dt>
      <dd className="text-caption font-medium text-charcoal text-right">{value}</dd>
    </div>
  );
}

export function ProductDetailView({ product }: { product: Product }) {
  const colors = getColors().filter((color) => product.colors.includes(color.slug));
  const openingType = product.openingType ?? "fixed";

  const specs: { label: string; value: string }[] = [
    product.profileSystem && { label: "Profile system", value: product.profileSystem },
    product.openingType && {
      label: "Opening type",
      value: OPENING_TYPE_LABELS[product.openingType],
    },
    product.uValue && { label: "U-value", value: product.uValue },
    product.specs?.frameDepth && {
      label: "Frame depth",
      value: String(product.specs.frameDepth),
    },
    product.specs?.chambers && {
      label: "Chambers",
      value: String(product.specs.chambers),
    },
    product.specs?.glazingThickness && {
      label: "Glazing thickness",
      value: String(product.specs.glazingThickness),
    },
    product.warranty && { label: "Warranty", value: product.warranty },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <section className="section-padding bg-surface">
        <div className="container-content">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-caption text-charcoal/50">
              <li>
                <Link href="/products" className="hover:text-charcoal">
                  Products
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={CATEGORY_PATHS[product.category]}
                  className="hover:text-charcoal"
                >
                  {CATEGORY_LABELS[product.category]}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-charcoal">{product.name}</li>
            </ol>
          </nav>

          <div className="max-w-2xl mb-12">
            {product.badges?.length ? (
              <p className="eyebrow mb-3">{product.badges.join(" · ")}</p>
            ) : (
              <p className="eyebrow mb-3">{CATEGORY_LABELS[product.category]}</p>
            )}
            <h1 className="font-display text-h2 text-charcoal mb-4">
              {product.name}
            </h1>
            <p className="text-charcoal/70 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <UpvcConfigurator
            openingType={openingType}
            category={product.category}
            colors={colors}
            productName={product.name}
          />
        </div>
      </section>

      <section className="section-padding bg-surface-muted">
        <div className="container-content grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-display text-h3 text-charcoal mb-6">
              Specification
            </h2>
            <dl>
              {specs.map((spec) => (
                <SpecRow key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-h3 text-charcoal mb-6">Features</h2>
            <ul className="space-y-3 mb-10">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-charcoal/75">
                  <span aria-hidden className="text-gold">
                    —
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {product.glazingOptions?.length ? (
              <>
                <h3 className="eyebrow mb-3">Glazing options</h3>
                <p className="text-charcoal/70">
                  {product.glazingOptions.join(" · ")}
                </p>
              </>
            ) : null}

            <Link
              href="/get-quote"
              className="inline-block mt-10 px-7 py-3.5 rounded-full bg-charcoal text-surface font-medium transition-colors duration-200 hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
            >
              Get a quote for {product.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
