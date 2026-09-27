import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "About",
    "The Hi-Tech uPVC workshop story is under development. Visit Why uPVC or Contact in the meantime.",
    "/about"
  ),
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow="About"
      title="This page is under development."
      body="The workshop story, process, and team will arrive here soon. Meanwhile, Why uPVC covers the material — and Contact has every Kathmandu site."
      primaryHref="/why-upvc"
      primaryLabel="Why uPVC"
      secondaryHref="/contact"
      secondaryLabel="Contact us"
    />
  );
}