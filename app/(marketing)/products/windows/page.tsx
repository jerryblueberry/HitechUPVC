import type { Metadata } from "next";
import { CategoryListing } from "@/components/products/CategoryListing";
import { categoryMetadata } from "@/lib/categoryPages";

export const metadata: Metadata = categoryMetadata("windows");
export const dynamic = "force-static";

export default function WindowsPage() {
  return <CategoryListing category="windows" />;
}