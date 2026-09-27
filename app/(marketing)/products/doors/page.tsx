import type { Metadata } from "next";
import { CategoryListing } from "@/components/products/CategoryListing";
import { categoryMetadata } from "@/lib/categoryPages";

export const metadata: Metadata = categoryMetadata("doors");
export const dynamic = "force-static";

export default function DoorsPage() {
  return <CategoryListing category="doors" />;
}