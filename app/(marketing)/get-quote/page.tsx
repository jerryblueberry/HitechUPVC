import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppLink";
import { telHref, whatsappHref } from "@/lib/constants";
import { getColors, getCompany, getQuote } from "@/lib/getData";
import { pageMetadata } from "@/lib/seo";

const quote = getQuote();

export const metadata: Metadata = pageMetadata(
  quote.seo.title,
  quote.seo.description,
  "/get-quote",
  undefined,
  { keywords: quote.seo.keywords }
);

export default function GetQuotePage() {
  const company = getCompany();
  const { whatsapp, phones } = company.contact;

  return (
    <article className="bg-surface">
      <section className="section-padding page-top" aria-labelledby="quote-title">
        <div className="container-content max-[399px]:px-4">
          <RevealOnScroll priority className="mb-8 max-w-2xl sm:mb-10 lg:mb-14">
            <p className="eyebrow mb-3 text-gold sm:mb-4">{quote.hero.eyebrow}</p>
            <h1
              id="quote-title"
              className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance"
            >
              {quote.hero.title}
            </h1>
            <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-4 sm:text-lg">
              {quote.hero.body}
            </p>
          </RevealOnScroll>

          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-8">
              <QuoteBuilder content={quote} colors={getColors()} whatsapp={whatsapp} />
            </div>

            <aside data-print-hide className="min-w-0 lg:sticky lg:top-28 lg:col-span-4">
              <div className="rounded-3xl bg-white p-6 ring-1 ring-charcoal/[0.05] shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] sm:p-8">
                <p className="eyebrow mb-5 text-gold">{quote.aside.title}</p>
                <ol className="space-y-5">
                  {quote.aside.points.map((point, index) => (
                    <li key={point.title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm text-navy ring-1 ring-gold/25">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">{point.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-charcoal/55">{point.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-3xl bg-navy p-6 text-surface sm:p-8">
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
                <p className="relative font-display text-xl tracking-tight">Prefer to talk?</p>
                <p className="relative mt-1 text-sm text-surface/65">
                  Send photos of your openings or call the workshop directly.
                </p>
                <div className="relative mt-5 flex flex-col gap-2.5">
                  <a
                    href={whatsappHref(whatsapp, quote.whatsappIntro)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-[#1ebe5d] hover:shadow-[0_8px_20px_-8px_rgba(18,43,24,0.6)]"
                  >
                    <WhatsAppIcon size={16} />
                    Chat on WhatsApp
                  </a>
                  {phones[0] && (
                    <a
                      href={telHref(phones[0])}
                      className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-surface/85 ring-1 ring-surface/20 transition-colors duration-300 hover:bg-surface/[0.08] hover:text-surface"
                    >
                      Call {phones[0]}
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
