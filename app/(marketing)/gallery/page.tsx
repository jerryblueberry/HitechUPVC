import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "Gallery",
    "The Hi-Tech uPVC project gallery is under development. Browse windows, doors, and panels in the meantime.",
    "/gallery"
  ),
  robots: { index: false, follow: true },
};

export default function GalleryPage() {
  return (
    <ComingSoon
      eyebrow="Gallery"
      title="This page is under development."
      body="Project photography is being framed. Until the gallery opens, the product range is live — windows, doors, and fluted panels, made to measure in Kathmandu."
      primaryHref="/products"
      primaryLabel="Browse products"
      secondaryHref="/contact"
      secondaryLabel="Contact us"
    />
  );
}