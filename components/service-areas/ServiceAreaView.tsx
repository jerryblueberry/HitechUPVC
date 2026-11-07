import Link from "next/link";
import { FaqList } from "@/components/ui/FaqList";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { quoteHref, whatsappHref } from "@/lib/constants";
import type { Company, ServiceArea } from "@/lib/types";

interface ServiceAreaViewProps {
  area: ServiceArea;
  company: Company;
  siblings: ServiceArea[];
}

export function ServiceAreaView({
  area,
  company,
  siblings,
}: ServiceAreaViewProps) {
  const faqs = area.faqs.map((faq, index) => ({
    id: `${area.slug}-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content">
          <RevealOnScroll priority className="mb-10 max-w-3xl lg:mb-14">
            <p className="eyebrow mb-3 text-gold sm:mb-4">{area.eyebrow}</p>
            <h1 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {area.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-lg">
              {area.body}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href={quoteHref()} trackLocation={`service_${area.slug}`}>
                Get a Free Quote
              </MagneticButton>
              <MagneticButton
                href={whatsappHref(
                  company.contact.whatsapp,
                  `Hi Hi-Tech — I’m in ${area.name} and would like a uPVC quote.`
                )}
                variant="secondary"
                trackLocation={`service_${area.slug}_wa`}
              >
                WhatsApp us
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {area.bullets.map((bullet) => (
              <p
                key={bullet}
                className="rounded-2xl bg-cream/50 px-5 py-4 text-sm leading-relaxed text-charcoal/75 ring-1 ring-charcoal/[0.04]"
              >
                {bullet}
              </p>
            ))}
          </RevealOnScroll>

          <RevealOnScroll className="mb-16 max-w-3xl">
            <p className="eyebrow mb-3 text-gold">Also explore</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] tracking-tight text-charcoal">
              Windows, doors, and panels — made to measure.
            </h2>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
              <Link href="/products/windows" className="text-navy underline-offset-4 hover:underline">
                uPVC windows
              </Link>
              <Link href="/products/doors" className="text-navy underline-offset-4 hover:underline">
                uPVC doors
              </Link>
              <Link href="/products/panels" className="text-navy underline-offset-4 hover:underline">
                uPVC panels
              </Link>
              <Link href="/why-upvc" className="text-navy underline-offset-4 hover:underline">
                Why uPVC
              </Link>
            </div>
          </RevealOnScroll>

          {faqs.length > 0 ? (
            <RevealOnScroll className="mb-16 max-w-3xl">
              <p className="eyebrow mb-3 text-gold">FAQ</p>
              <h2 className="mb-6 font-display text-[clamp(1.5rem,3vw,2rem)] tracking-tight text-charcoal">
                {area.name} questions we hear often
              </h2>
              <FaqList faqs={faqs} />
            </RevealOnScroll>
          ) : null}

          <RevealOnScroll className="max-w-3xl border-t border-charcoal/10 pt-10">
            <p className="eyebrow mb-3 text-gold">Other areas</p>
            <ul className="flex flex-wrap gap-4 text-sm font-medium text-navy">
              {siblings
                .filter((item) => item.slug !== area.slug)
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/service-areas/${item.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      uPVC in {item.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/contact" className="underline-offset-4 hover:underline">
                  All contact locations
                </Link>
              </li>
            </ul>
          </RevealOnScroll>
        </div>
      </section>
    </article>
  );
}
