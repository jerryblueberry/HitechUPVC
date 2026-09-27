import { getUpvcPngForCategory, getUpvcPngForOpening } from "./upvcAssets";
import type { ProductIndexEntry } from "./types";

/** Real files in /public/images/upvc — index heroImage JPGs are not shipped yet. */
export function productCardImage(product: ProductIndexEntry): string {
  if (product.openingType) return getUpvcPngForOpening(product.openingType);
  return getUpvcPngForCategory(product.category);
}