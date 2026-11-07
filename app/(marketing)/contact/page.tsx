import type { Metadata } from "next";
import Link from "next/link";
import { ContactExperience } from "@/components/ui/ContactExperience";
import { JsonLd } from "@/components/ui/JsonLd";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getCompany } from "@/lib/getData";
import { buildContactPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact Hi-Tech uPVC in Kathmandu",
  "Visit Hi-Tech uPVC Profile Industries in Tarakeshwar, Lambagar, or Tokha. WhatsApp or email for a free site measurement across Kathmandu, Pokhara, and Nepal.",
  "/contact",
  undefined,
  {
    keywords: [
      "Hi-Tech uPVC contact",
      "uPVC Kathmandu contact",
      "uPVC Tarakeshwar",
      "uPVC quote Nepal",
      "Hi-Tech WhatsApp",
    ],
  }
);

export default function ContactPage() {
  const company = getCompany();
  const { phones, emails, whatsapp, addresses } = company.contact;

  return (
    <article className="bg-surface">
      <JsonLd data={buildContactPageJsonLd(company)} />
      <section className="section-padding page-top">
        <div className="container-content">
          <RevealOnScroll priority className="mb-8 max-w-2xl sm:mb-10 lg:mb-14">
            <p className="eyebrow mb-3 text-gold sm:mb-4">Contact</p>
            <h1 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Visit us in Kathmandu — or send a message.
            </h1>
            <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-4 sm:text-lg">
              Three Hi-Tech sites in the Kathmandu valley for uPVC windows,
              doors, and panels. We also serve{" "}
              <Link
                href="/service-areas/pokhara"
                className="font-medium text-navy underline-offset-4 hover:underline"
              >
                Pokhara
              </Link>{" "}
              and projects across Nepal. Read more about installs in{" "}
              <Link
                href="/service-areas/kathmandu"
                className="font-medium text-navy underline-offset-4 hover:underline"
              >
                Kathmandu
              </Link>
              . Write below, or tap WhatsApp.
            </p>
          </RevealOnScroll>

          <ContactExperience
            locations={addresses}
            whatsapp={whatsapp}
            phones={phones}
            emails={emails}
          />
        </div>
      </section>
    </article>
  );
}
