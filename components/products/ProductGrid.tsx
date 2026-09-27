"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_LABELS, OPENING_TYPE_LABELS } from "@/lib/constants";
import type { ColorSwatch, OpeningType, ProductCategory, ProductIndexEntry } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const CATEGORIES: Array<"all" | ProductCategory> = ["all", "windows", "doors", "panels"];

interface ProductGridProps {
  products: ProductIndexEntry[];
  colors: ColorSwatch[];
  lockedCategory?: ProductCategory;
}

function chipClass(active: boolean) {
  return `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-charcoal text-surface"
      : "bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:text-charcoal"
  }`;
}

export function ProductGrid({ products, colors, lockedCategory }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const category = lockedCategory ?? ((searchParams.get("category") ?? "all") as "all" | ProductCategory);
  const opening = searchParams.get("type");
  const finish = searchParams.get("color");

  const openingOptions = useMemo(() => {
    const types = new Set<OpeningType>();
    products.forEach((product) => {
      if (product.openingType) types.add(product.openingType);
    });
    return Array.from(types);
  }, [products]);

  const finishOptions = useMemo(() => {
    const used = new Set(products.flatMap((product) => product.colors));
    return colors.filter((color) => used.has(color.slug));
  }, [products, colors]);

  const visible = useMemo(() => {
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (opening && product.openingType !== opening) return false;
      if (finish && !product.colors.includes(finish)) return false;
      return true;
    });
  }, [products, category, opening, finish]);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-6 mb-8 border-b border-charcoal/8 bg-surface/95 px-6 py-3 backdrop-blur-md md:top-20 lg:mx-0 lg:px-0">
        <div className="flex flex-col gap-3">
          {!lockedCategory && (
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Category">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setParam("category", item)}
                  className={chipClass(category === item)}
                  aria-pressed={category === item}
                >
                  {item === "all" ? "All" : CATEGORY_LABELS[item]}
                </button>
              ))}
            </div>
          )}
          {openingOptions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Opening type">
              <button
                type="button"
                onClick={() => setParam("type", null)}
                className={chipClass(!opening)}
                aria-pressed={!opening}
              >
                All openings
              </button>
              {openingOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setParam("type", type)}
                  className={chipClass(opening === type)}
                  aria-pressed={opening === type}
                >
                  {OPENING_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Finish">
            <button
              type="button"
              onClick={() => setParam("color", null)}
              className={chipClass(!finish)}
              aria-pressed={!finish}
            >
              All finishes
            </button>
            {finishOptions.map((color) => (
              <button
                key={color.slug}
                type="button"
                onClick={() => setParam("color", color.slug)}
                className={`${chipClass(finish === color.slug)} inline-flex items-center gap-2`}
                aria-pressed={finish === color.slug}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-charcoal/15"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden
                />
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-5 text-sm text-charcoal/50" aria-live="polite">
        {visible.length} {visible.length === 1 ? "system" : "systems"}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-3xl bg-white px-6 py-12 text-center text-charcoal/55 ring-1 ring-charcoal/5">
          No products match those filters. Try All, or another opening type.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <motion.div
                key={`${product.category}-${product.slug}`}
                layout={!reducedMotion}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} colors={colors} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}