import type { Metadata } from "next";
import { ContactExperience } from "@/components/ui/ContactExperience";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getCompany } from "@/lib/getData";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Visit Hi-Tech uPVC in Tarakeshwar, Lambagar, or Tokha. Send a message or write on WhatsApp and Instagram @hitechgroupnepal.",
  "/contact"
);

export default function ContactPage() {
  const company = getCompany();
  const { phones, emails, whatsapp, addresses } = company.contact;

  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content">
          <RevealOnScroll className="mb-8 max-w-2xl sm:mb-10 lg:mb-14">
            <p className="eyebrow mb-3 text-gold sm:mb-4">Contact</p>
            <h1 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Visit us, or send a message.
            </h1>
            <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-4 sm:text-lg">
              Three Hi-Tech sites in the Kathmandu valley. Write below, or tap
              WhatsApp — we reply on both.
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
