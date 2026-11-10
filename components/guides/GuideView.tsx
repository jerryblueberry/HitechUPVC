import Link from "next/link";
import { FaqList } from "@/components/ui/FaqList";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { quoteHref, whatsappHref } from "@/lib/constants";
import type { Company, Guide } from "@/lib/types";

interface GuideViewProps {
  guide: Guide;
  company: Company;
  siblings: Guide[];
}

export function GuideView({ guide, company, siblings }: GuideViewProps) {
  const faqs = guide.faqs.map((faq, index) => ({
    id: `${guide.slug}-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  const otherGuides = siblings.filter((item) => item.slug !== guide.slug);

  return (
    <article className="bg-surface">
      <section className="section-padding page-top">
        <div className="container-content">
          <RevealOnScroll priority className="mb-10 max-w-3xl lg:mb-14">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal/45">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-charcoal">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/guides" className="hover:text-charcoal">
                    Guides
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-charcoal/70">{guide.eyebrow}</li>
              </ol>
            </nav>

            <p className="eyebrow mb-3 text-gold sm:mb-4">{guide.eyebrow}</p>
            <h1 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              {guide.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-lg">
              {guide.summary}
            </p>
            <p className="mt-3 text-xs tracking-wide text-charcoal/40">
              Updated {guide.updated} · Hi-Tech uPVC Profile Industries
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href={quoteHref()} trackLocation={`guide_${guide.slug}`}>
                Get a Free Quote
              </MagneticButton>
              <MagneticButton
                href={whatsappHref(
                  company.contact.whatsapp,
                  `Hi Hi-Tech — I read your guide “${guide.title}” and would like a uPVC quote.`
                )}
                variant="secondary"
                trackLocation={`guide_${guide.slug}_wa`}
              >
                WhatsApp us
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
            <div className="min-w-0 space-y-12">
              {guide.sections.map((section) => (
                <RevealOnScroll key={section.heading} className="max-w-3xl">
                  <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] tracking-tight text-charcoal">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-base">
                    {section.body}
                  </p>
                </RevealOnScroll>
              ))}

              {faqs.length > 0 ? (
                <RevealOnScroll className="max-w-3xl">
                  <p className="eyebrow mb-3 text-gold">FAQ</p>
                  <h2 className="mb-6 font-display text-[clamp(1.5rem,3vw,2rem)] tracking-tight text-charcoal">
                    Questions this guide answers
                  </h2>
                  <FaqList faqs={faqs} />
                </RevealOnScroll>
              ) : null}
            </div>

            <aside className="space-y-10 lg:pt-1">
              <RevealOnScroll>
                <p className="eyebrow mb-3 text-gold">Related</p>
                <ul className="space-y-3">
                  {guide.relatedHrefs.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-navy underline-offset-4 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/service-areas/kathmandu"
                      className="text-sm font-medium text-navy underline-offset-4 hover:underline"
                    >
                      uPVC in Kathmandu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/service-areas/pokhara"
                      className="text-sm font-medium text-navy underline-offset-4 hover:underline"
                    >
                      uPVC in Pokhara
                    </Link>
                  </li>
                </ul>
              </RevealOnScroll>

              {otherGuides.length > 0 ? (
                <RevealOnScroll>
                  <p className="eyebrow mb-3 text-gold">More guides</p>
                  <ul className="space-y-3">
                    {otherGuides.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/guides/${item.slug}`}
                          className="text-sm font-medium text-navy underline-offset-4 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </RevealOnScroll>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
