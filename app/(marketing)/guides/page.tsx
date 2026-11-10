import type { Metadata } from "next";
import { GuidesIndexView } from "@/components/guides/GuidesIndexView";
import { JsonLd } from "@/components/ui/JsonLd";
import { getGuides } from "@/lib/getData";
import { buildGuideIndexJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const TITLE = "uPVC Guides for Kathmandu & Nepal";
const DESCRIPTION =
  "Hi-Tech uPVC guides on window prices in Nepal, uPVC vs aluminium and wood, best windows for Kathmandu climate, lifespan, and choosing doors — written for homeowners in Kathmandu, Lalitpur, Bhaktapur, and Pokhara.";

export const metadata: Metadata = pageMetadata(TITLE, DESCRIPTION, "/guides", undefined, {
  keywords: [
    "uPVC guides Nepal",
    "uPVC window price Nepal",
    "uPVC vs aluminium Kathmandu",
    "uPVC vs wood Nepal",
    "best windows Kathmandu",
    "uPVC doors guide",
    "Hi-Tech uPVC guides",
  ],
});

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <>
      <JsonLd data={buildGuideIndexJsonLd(guides)} />
      <GuidesIndexView guides={guides} />
    </>
  );
}
