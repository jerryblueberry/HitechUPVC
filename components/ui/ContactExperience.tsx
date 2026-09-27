"use client";

import { useState } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { telHref, whatsappHref } from "@/lib/constants";
import type { CompanyAddress } from "@/lib/types";
import { ContactForm } from "./ContactForm";

interface ContactExperienceProps {
  locations: CompanyAddress[];
  whatsapp: string;
  phones: string[];
  emails: string[];
}

export function ContactExperience({
  locations,
  whatsapp,
  phones,
  emails,
}: ContactExperienceProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-10">
      <div className="grid min-w-0 items-start gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="order-1 flex min-w-0 flex-col gap-4 lg:order-2 lg:col-span-5">
          <div className="rounded-3xl bg-white p-5 ring-1 ring-charcoal/5 shadow-[0_24px_60px_-32px_rgba(27,27,29,0.28)] sm:rounded-[2rem] sm:p-6 lg:p-8">
            <p className="eyebrow mb-3 text-gold sm:mb-4">Reach us</p>
            <h2 className="font-display text-[clamp(1.4rem,6vw,1.85rem)] leading-tight tracking-tight text-charcoal">
              WhatsApp is the fastest reply.
            </h2>
            <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              <li className="flex min-w-0 items-center gap-3">
                <WhatsAppLink number={whatsapp} buttonClassName="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
                <a
                  href={whatsappHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 break-words text-[0.9375rem] font-medium text-navy hover:text-gold sm:text-base"
                >
                  {whatsapp}
                </a>
              </li>
              {phones.map((phone) => (
                <li key={phone} className="min-w-0">
                  <a
                    href={telHref(phone)}
                    className="block py-0.5 text-[0.9375rem] text-charcoal/70 hover:text-navy sm:text-base"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              {emails.map((address) => (
                <li key={address} className="min-w-0">
                  <a
                    href={`mailto:${address}`}
                    className="block break-words py-0.5 text-[0.9375rem] text-charcoal/70 hover:text-navy sm:text-base"
                  >
                    {address}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-5 ring-1 ring-charcoal/5 sm:rounded-[2rem] sm:p-6">
            <p className="eyebrow mb-3 text-gold sm:mb-4">Sites</p>
            <ol className="flex flex-col gap-3">
              {locations.map((loc, i) => {
                const selected = i === active;
                return (
                  <li key={loc.mapsUrl} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={`flex w-full min-w-0 items-start gap-3 rounded-2xl p-3.5 text-left ring-1 transition-colors duration-300 sm:p-4 ${
                        selected
                          ? "bg-surface ring-charcoal/15"
                          : "bg-surface/50 ring-transparent hover:bg-surface hover:ring-charcoal/10"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-medium tabular-nums ${
                          selected ? "bg-charcoal text-surface" : "bg-charcoal/[0.06] text-charcoal/70"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-base leading-tight tracking-tight text-charcoal sm:text-lg">
                          {loc.label}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-charcoal/60">
                          {loc.address}
                        </span>
                        <a
                          href={loc.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="mt-2 inline-block text-sm font-medium text-navy hover:text-gold"
                        >
                          Directions ›
                        </a>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-charcoal/5 shadow-[0_24px_60px_-32px_rgba(27,27,29,0.35)] sm:rounded-[2rem]">
        {locations[active] && (
          <iframe
            key={locations[active].embedUrl}
            title={locations[active].label}
            src={locations[active].embedUrl}
            className="h-[16rem] w-full max-w-full border-0 sm:h-[26rem] lg:h-[32rem]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
    </div>
  );
}
