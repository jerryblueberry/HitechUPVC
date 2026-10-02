"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_LABELS, OPENING_TYPE_LABELS } from "@/lib/constants";
import type { ColorSwatch, OpeningType, ProductCategory, ProductIndexEntry } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const CATEGORIES: Array<"all" | ProductCategory> = ["all", "windows", "doors", "panels"];
const ease = [0.22, 1, 0.36, 1] as const;

interface ProductGridProps {
  products: ProductIndexEntry[];
  colors: ColorSwatch[];
  lockedCategory?: ProductCategory;
}

function Chip({
  active,
  onClick,
  pressed,
  children,
}: {
  active: boolean;
  onClick: () => void;
  pressed: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        active
          ? "bg-charcoal text-surface"
          : "bg-charcoal/[0.05] text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );
}

function ChipRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
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

  const showCategory = !lockedCategory;
  const showOpening = openingOptions.length > 0;
  const rowCount = (showCategory ? 1 : 0) + (showOpening ? 1 : 0) + 1;

  return (
    <div>
      {/*
        One horizontal rhythm with container-content: sticky bleeds edge-to-edge
        for the hairline, then px-6 / lg:px-0 so chips align with the grid below.
      */}
      <div className="sticky top-16 z-20 -mx-6 mb-8 border-b border-charcoal/[0.06] bg-surface px-6 py-3 lg:top-20 lg:mx-0 lg:px-0">
        <div className={`flex flex-col ${rowCount > 1 ? "gap-2.5" : "gap-0"}`}>
          {showCategory && (
            <ChipRow label="Category">
              {CATEGORIES.map((item) => (
                <Chip
                  key={item}
                  active={category === item}
                  pressed={category === item}
                  onClick={() => setParam("category", item)}
                >
                  {item === "all" ? "All" : CATEGORY_LABELS[item]}
                </Chip>
              ))}
            </ChipRow>
          )}
          {showOpening && (
            <ChipRow label="Opening type">
              <Chip
                active={!opening}
                pressed={!opening}
                onClick={() => setParam("type", null)}
              >
                All openings
              </Chip>
              {openingOptions.map((type) => (
                <Chip
                  key={type}
                  active={opening === type}
                  pressed={opening === type}
                  onClick={() => setParam("type", type)}
                >
                  {OPENING_TYPE_LABELS[type]}
                </Chip>
              ))}
            </ChipRow>
          )}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <ChipRow label="Finish">
                <Chip
                  active={!finish}
                  pressed={!finish}
                  onClick={() => setParam("color", null)}
                >
                  All finishes
                </Chip>
                {finishOptions.map((color) => {
                  const active = finish === color.slug;
                  return (
                    <Chip
                      key={color.slug}
                      active={active}
                      pressed={active}
                      onClick={() => setParam("color", color.slug)}
                    >
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${
                          active ? "ring-1 ring-surface/50" : "ring-1 ring-charcoal/15"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-hidden
                      />
                      {color.name}
                    </Chip>
                  );
                })}
              </ChipRow>
            </div>
            <p
              className="shrink-0 text-sm tabular-nums text-charcoal/40"
              aria-live="polite"
            >
              {visible.length} {visible.length === 1 ? "system" : "systems"}
            </p>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-[2rem] bg-white px-6 py-14 text-center text-charcoal/55 ring-1 ring-charcoal/[0.05]">
          No products match those filters. Try All, or another opening type.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <motion.div
                key={`${product.category}-${product.slug}`}
                layout={!reducedMotion}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease }}
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
