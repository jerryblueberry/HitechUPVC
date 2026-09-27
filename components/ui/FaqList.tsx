import type { FAQ } from "@/lib/types";

interface FaqListProps {
  faqs: FAQ[];
}

export function FaqList({ faqs }: FaqListProps) {
  return (
    <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
      {faqs.map((faq) => (
        <details key={faq.id} className="group py-5">
          <summary className="cursor-pointer list-none font-medium tracking-tight text-charcoal marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-6">
              <span className="text-balance">{faq.question}</span>
              <span
                className="mt-0.5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/60 sm:text-base">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}