"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_PATHS, OPENING_TYPE_LABELS } from "@/lib/constants";
import { productCardImage } from "@/lib/productMedia";
import type { ColorSwatch, ProductIndexEntry } from "@/lib/types";

interface ProductCardProps {
  product: ProductIndexEntry;
  colors: ColorSwatch[];
}

function PanelPoster({ name, woodgrain }: { name: string; woodgrain: boolean }) {
  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label={`${name} — fluted uPVC wall panel`}
      style={{
        background: woodgrain
          ? "repeating-linear-gradient(90deg, var(--color-bronze) 0px, var(--color-gold) 6px, var(--color-gold-muted) 10px, var(--color-gold) 14px, var(--color-bronze) 18px)"
          : "repeating-linear-gradient(90deg, var(--color-taupe) 0px, var(--color-cream) 6px, var(--color-surface-muted) 10px, white 14px, var(--color-taupe) 18px)",
      }}
    />
  );
}

export function ProductCard({ product, colors }: ProductCardProps) {
  const href = `${CATEGORY_PATHS[product.category]}/${product.slug}`;
  const swatches = colors.filter((color) => product.colors.includes(color.slug));
  const kind = product.openingType
    ? OPENING_TYPE_LABELS[product.openingType]
    : CATEGORY_LABELS[product.category];
  const image = product.category === "panels" ? null : productCardImage(product);

  return (
    <Link href={href} className="group block min-w-0">
      <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-charcoal/5 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_16px_36px_-24px_rgba(27,27,29,0.14)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_28px_48px_-20px_rgba(27,27,29,0.18)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,white_50%,var(--color-surface)_100%)]">
          {image ? (
            <Image
              src={image}
              alt={`${product.name} — Hi-Tech uPVC ${CATEGORY_LABELS[product.category]}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-7 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.04] sm:p-8"
            />
          ) : (
            <div className="absolute inset-[12%] overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(27,27,29,0.35)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.03]">
              <PanelPoster
                name={product.name}
                woodgrain={product.slug.includes("woodgrain")}
              />
            </div>
          )}
          {product.badges?.[0] && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6875rem] font-medium tracking-wide text-navy ring-1 ring-charcoal/8">
              {product.badges[0]}
            </span>
          )}
        </div>
        <div className="px-5 pb-6 pt-5">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-gold">
            {kind}
          </p>
          <h3 className="mt-1.5 font-display text-[1.45rem] leading-tight tracking-tight text-charcoal">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
            {product.shortDescription}
          </p>
          {swatches.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Available finishes">
              {swatches.map((color) => (
                <li
                  key={color.slug}
                  title={color.name}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-charcoal/15"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">{color.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </Link>
  );
}