import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/home/CTASection";
import { StatsCounter } from "@/components/home/StatsCounter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { AboutContent, AboutValueIcon, Company } from "@/lib/types";

interface AboutViewProps {
  about: AboutContent;
  company: Company;
}

const CARD =
  "rounded-3xl bg-white shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] ring-1 ring-charcoal/[0.05]";

const H2 =
  "font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance";

const VALUE_ICON_PATHS: Record<AboutValueIcon, string> = {
  mountain: "M3 19 9.5 8l3.5 6 2-3.5L21 19H3Zm6.5-11 1.75 3",
  ruler:
    "M4 15.5 15.5 4 20 8.5 8.5 20 4 15.5Zm3-3 1.5 1.5M9.5 10l2 2M12 7.5l1.5 1.5",
  chat: "M5 5h14v10H9l-4 4V5Zm4 5h.01M12 10h.01M15 10h.01",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
};

function ValueIcon({ name }: { name: AboutValueIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={VALUE_ICON_PATHS[name]} />
    </svg>
  );
}

function RegionIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {featured ? (
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      ) : (
        <path d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      )}
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  id,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  id: string;
}) {
  return (
    <RevealOnScroll className="mb-10 max-w-2xl lg:mb-14">
      <p className="eyebrow mb-4 text-gold">{eyebrow}</p>
      <h2 id={id} className={H2}>
        {title}
      </h2>
      {body && (
        <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
          {body}
        </p>
      )}
    </RevealOnScroll>
  );
}

export function AboutView({ about, company }: AboutViewProps) {
  const { hero, story, services, sites, values, serviceAreas, cta } = about;

  const siteCards = sites.roles.flatMap((role) => {
    const address = company.contact.addresses.find((a) => a.label === role.label);
    return address ? [{ ...role, ...address }] : [];
  });

  return (
    <article className="bg-surface">
      <section className="section-padding page-top overflow-x-clip" aria-labelledby="about-title">
        <div className="container-content grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-20">
          <RevealOnScroll priority className="max-w-xl md:max-w-2xl lg:max-w-xl">
            <p className="eyebrow mb-3 text-gold sm:mb-4">{hero.eyebrow}</p>
            <h1
              id="about-title"
              className="font-display text-[clamp(2rem,1.1rem+2.9vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance"
            >
              {hero.title}
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-5 sm:text-lg">
              {hero.body}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <MagneticButton href={cta.primaryHref} className="w-full sm:w-auto">
                {cta.primaryLabel}
              </MagneticButton>
              <MagneticButton href="#sites" variant="secondary" className="w-full sm:w-auto">
                {cta.secondaryLabel}
              </MagneticButton>
            </div>
          </RevealOnScroll>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto lg:max-w-[30rem] xl:max-w-[32rem]">
            <div
              className="absolute -right-3 -top-5 hidden h-24 w-24 opacity-60 sm:block lg:-top-6 lg:h-28 lg:w-28"
              style={{
                backgroundImage:
                  "radial-gradient(var(--color-gold) 1.25px, transparent 1.25px)",
                backgroundSize: "14px 14px",
              }}
              aria-hidden
            />
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-charcoal ring-1 ring-charcoal/5 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_32px_64px_-24px_rgba(14,42,62,0.35)] sm:aspect-[16/11] sm:rounded-[2rem] lg:aspect-[4/5]">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  className="object-cover object-[45%_50%]"
                  sizes="(max-width: 1023px) min(92vw, 576px), 512px"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-navy/75 via-navy/10 to-transparent"
                  aria-hidden
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                  <p className="eyebrow text-gold">Kathmandu · Nepal</p>
                  <p className="mt-1.5 max-w-xs text-[0.8125rem] leading-relaxed text-surface/85 sm:mt-2 sm:text-sm">
                    {hero.imageCaption}
                  </p>
                </figcaption>
              </div>

              <div className="absolute -left-5 top-8 hidden rounded-2xl bg-white/95 px-5 py-4 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_20px_40px_-16px_rgba(27,27,29,0.25)] ring-1 ring-charcoal/5 backdrop-blur sm:block lg:-left-8 lg:top-10 xl:-left-10">
                <p className="font-display text-3xl leading-none tracking-tight text-navy tabular-nums">
                  {company.stats.yearsInBusiness}+
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.12em] text-charcoal/55">
                  Years in Nepal
                </p>
              </div>

              <div className="absolute -right-5 bottom-24 hidden rounded-2xl bg-gold px-5 py-4 text-charcoal shadow-[0_20px_40px_-16px_rgba(140,110,78,0.6)] sm:block lg:-right-4 lg:bottom-32">
                <p className="font-display text-3xl leading-none tracking-tight tabular-nums">
                  {company.contact.addresses.length}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.12em] text-charcoal/70">
                  Valley sites
                </p>
              </div>
            </figure>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
              <div className="flex flex-col gap-1.5 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-charcoal/[0.06]">
                <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-charcoal/55">
                  Years in Nepal
                </dt>
                <dd className="order-first font-display text-2xl leading-none tracking-tight text-navy tabular-nums">
                  {company.stats.yearsInBusiness}+
                </dd>
              </div>
              <div className="flex flex-col gap-1.5 rounded-2xl bg-gold px-4 py-3.5 text-charcoal">
                <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-charcoal/70">
                  Valley sites
                </dt>
                <dd className="order-first font-display text-2xl leading-none tracking-tight tabular-nums">
                  {company.contact.addresses.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-muted/50" aria-labelledby="about-story">
        <div className="container-content grid gap-10 lg:grid-cols-12 lg:gap-16">
          <RevealOnScroll className="lg:col-span-5">
            <p className="eyebrow mb-4 text-gold">{story.eyebrow}</p>
            <h2 id="about-story" className={H2}>
              {story.title}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08} className="space-y-5 lg:col-span-7">
            {story.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-charcoal/65 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <StatsCounter stats={company.stats} />

      <section className="section-padding" aria-labelledby="about-services">
        <div className="container-content">
          <SectionHeading id="about-services" eyebrow={services.eyebrow} title={services.title} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {services.items.map((item, i) => (
              <RevealOnScroll as="li" key={item.title} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={item.href}
                  className={`${CARD} group flex h-full flex-col p-7 transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_20px_40px_-16px_rgba(27,27,29,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
                >
                  <span className="font-display text-sm text-gold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl tracking-tight text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/60">
                    {item.body}
                  </p>
                  <span className="mt-6 text-sm font-medium text-navy transition-colors group-hover:text-gold">
                    Learn more <span aria-hidden>→</span>
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="sites"
        className="section-padding scroll-mt-24 bg-surface-muted/50"
        aria-labelledby="about-sites"
      >
        <div className="container-content">
          <SectionHeading
            id="about-sites"
            eyebrow={sites.eyebrow}
            title={sites.title}
            body={sites.body}
          />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {siteCards.map((site, i) => (
              <RevealOnScroll as="li" key={site.label} delay={i * 0.08} className="h-full">
                <address className={`${CARD} flex h-full flex-col p-7 not-italic`}>
                  <p className="eyebrow text-gold">{site.role}</p>
                  <h3 className="mt-3 font-display text-xl tracking-tight text-charcoal">
                    {site.label}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-charcoal/75">{site.address}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/60">
                    {site.description}
                  </p>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 text-sm font-medium text-navy transition-colors hover:text-gold"
                  >
                    Open in Google Maps <span aria-hidden>↗</span>
                  </a>
                </address>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding" aria-labelledby="about-values">
        <div className="container-content grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RevealOnScroll className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4 text-gold">{values.eyebrow}</p>
              <h2 id="about-values" className={H2}>
                {values.title}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/60 sm:text-lg">
                {values.body}
              </p>

              <aside className="relative mt-10 overflow-hidden rounded-3xl bg-navy p-7 text-surface sm:p-8">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                  aria-hidden
                />
                <p className="relative font-display text-2xl leading-tight tracking-tight">
                  {values.highlight.title}
                </p>
                <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-surface/65">
                  {values.highlight.body}
                </p>
                <Link
                  href={values.highlight.linkHref}
                  className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-surface"
                >
                  {values.highlight.linkLabel} <span aria-hidden>→</span>
                </Link>
              </aside>
            </RevealOnScroll>
          </div>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
            {values.items.map((item, i) => (
              <RevealOnScroll as="li" key={item.title} delay={(i % 2) * 0.08} className="h-full">
                <article
                  className={`${CARD} group flex h-full flex-col p-7 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.22)] sm:p-8`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-navy ring-1 ring-gold/25 transition-colors duration-500 group-hover:bg-navy group-hover:text-gold">
                      <ValueIcon name={item.icon} />
                    </span>
                    <span
                      className="font-display text-sm text-charcoal/25 tabular-nums"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl tracking-tight text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/60">
                    {item.body}
                  </p>
                  <p className="mt-6 flex items-center gap-2 border-t border-charcoal/[0.07] pt-5 text-xs font-medium uppercase tracking-[0.1em] text-charcoal/50">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {item.proof}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding bg-surface-muted/50" aria-labelledby="about-areas">
        <div className="container-content grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <RevealOnScroll className="lg:col-span-5">
            <p className="eyebrow mb-4 text-gold">{serviceAreas.eyebrow}</p>
            <h2 id="about-areas" className={H2}>
              {serviceAreas.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
              {serviceAreas.body}
            </p>
            <Link
              href={serviceAreas.contactHref}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy transition-colors duration-300 hover:text-gold"
            >
              {serviceAreas.contactLabel}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08} className="lg:col-span-7">
            <div className={`${CARD} overflow-hidden`}>
              {serviceAreas.regions.map((region, index) => {
                const featured = index === 0;
                return (
                  <div
                    key={region.id}
                    role="group"
                    aria-labelledby={`region-${region.id}`}
                    className={
                      featured
                        ? "p-6 sm:p-8"
                        : "relative border-t border-gold/15 bg-linear-to-br from-cream/70 via-cream/40 to-white p-6 sm:p-8"
                    }
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
                          featured ? "bg-navy text-gold ring-navy" : "bg-cream text-navy ring-gold/25"
                        }`}
                      >
                        <RegionIcon featured={featured} />
                      </span>
                      <h3
                        id={`region-${region.id}`}
                        className="font-display text-xl tracking-tight text-charcoal"
                      >
                        {region.label}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] ${
                          featured ? "bg-gold/15 text-[#8a6a3f]" : "bg-navy/[0.06] text-navy/70"
                        }`}
                      >
                        {region.badge}
                      </span>
                    </div>

                    {!featured && (
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
                        {region.body}
                      </p>
                    )}

                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {region.areas.map((area) => (
                        <li
                          key={area}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 transition-colors duration-300 ${
                            featured
                              ? "bg-surface text-charcoal/85 ring-charcoal/[0.08] hover:ring-gold/50"
                              : "bg-white text-charcoal/85 shadow-[0_1px_2px_rgba(27,27,29,0.05)] ring-gold/20 hover:ring-gold/50"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`h-1.5 w-1.5 rounded-full ${
                              featured ? "bg-gold" : "bg-white ring-[1.5px] ring-gold"
                            }`}
                          />
                          {area}
                        </li>
                      ))}
                      {region.moreLabel && (
                        <li>
                          <Link
                            href={serviceAreas.contactHref}
                            className="group inline-flex items-center gap-2 rounded-full border border-dashed border-navy/30 px-4 py-2 text-sm text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-surface"
                          >
                            <span
                              aria-hidden
                              className="text-base leading-none text-gold transition-colors duration-300 group-hover:text-gold"
                            >
                              +
                            </span>
                            {region.moreLabel}
                          </Link>
                        </li>
                      )}
                    </ul>

                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {region.features.map((feature) => (
                        <li
                          key={feature}
                          className="inline-flex items-center gap-1.5 text-xs text-charcoal/60"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gold"
                            aria-hidden
                          >
                            <path d="m3.5 8.5 3 3 6-7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection
        title={cta.title}
        body={cta.body}
        primaryHref={cta.primaryHref}
        primaryLabel={cta.primaryLabel}
        secondaryHref={cta.secondaryHref}
        secondaryLabel={cta.secondaryLabel}
      />
    </article>
  );
}
