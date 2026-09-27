import type { Metadata } from "next";
import { CategoryListing } from "@/components/products/CategoryListing";
import { categoryMetadata } from "@/lib/categoryPages";

export const metadata: Metadata = categoryMetadata("panels");
export const dynamic = "force-static";

export default function PanelsPage() {
  return <CategoryListing category="panels" />;
}