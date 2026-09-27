import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { whatsappHref } from "@/lib/constants";
import { getCompany } from "@/lib/getData";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "Get a Quote",
    "A made-to-measure quote form is on the way. Contact Hi-Tech uPVC or write on WhatsApp for sizes and a free quote.",
    "/get-quote"
  ),
  robots: { index: false, follow: true },
};

export default function GetQuotePage() {
  const company = getCompany();

  return (
    <ComingSoon
      eyebrow="Get a quote"
      title="This page is under development."
      body="A step-by-step quote form will arrive here soon. For now, send openings on WhatsApp or write through Contact — we still measure and quote the same week."
      primaryHref="/contact"
      primaryLabel="Contact us"
      secondaryHref={whatsappHref(
        company.contact.whatsapp,
        "Hi Hi-Tech — I’d like a free quote for uPVC windows or doors."
      )}
      secondaryLabel="WhatsApp the workshop"
    />
  );
}