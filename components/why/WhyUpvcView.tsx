import Image from "next/image";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";
import { CTASection } from "@/components/home/CTASection";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { ProductCategoryShowcase } from "@/components/home/ProductCategoryShowcase";
import { FaqList } from "@/components/ui/FaqList";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhyHero } from "@/components/why/WhyHero";
import { WhyStudioViewer } from "@/components/why/WhyStudioViewer";
import { whatsappHref } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import type { Company, FAQ, ProductCategory, Project } from "@/lib/types";

interface WhyUpvcViewProps {
  company: Company;
  faqs: FAQ[];
  projects: Project[];
  counts: Record<ProductCategory, number>;
}

const COMPARISONS = [
  {
    title: "uPVC vs traditional wood",
    intro:
      "Wood in Kathmandu often means termites, monsoon swelling, and a fresh coat of paint every few years.",
    points: [
      "Immune to termites and rot — no moisture damage",
      "Never needs painting, sanding, or varnishing",
      "Multi-chamber profiles insulate better than most wooden frames",
      "Factory-made dimensions — no warping or grain variation",
      "Lower lifetime cost once maintenance is counted",
    ],
  },
  {
    title: "uPVC vs aluminium",
    intro:
      "Aluminium is strong, but it conducts heat and cold — and Kathmandu winter mornings show it.",
    points: [
      "uPVC insulates; aluminium conducts heat and cold",
      "Less condensation on cold valley mornings",
      "Double glazing cuts traffic and construction noise more effectively",
      "No oxidation or white powder over time",
    ],
  },
  {
    title: "uPVC vs local frames",
    intro:
      "Basic wooden or metal frames rarely seal against Kathmandu dust, rain, or security needs.",
    points: [
      "Gaskets and tight seals keep dust and pollution outside",
      "Handles monsoon rain, strong sun, and temperature swings without cracking",
      "Multi-point locking is stronger than many local wooden or basic metal solutions",
    ],
  },
] as const;

const LOCAL_BENEFITS = [
  {
    title: "Dust & pollution",
    body: "Tight seals and quality gaskets keep fine particles outside, so interiors stay cleaner.",
  },
  {
    title: "Noise control",
    body: "Double-glazed uPVC windows significantly reduce street noise in bedrooms and living rooms.",
  },
  {
    title: "Energy comfort",
    body: "Better insulation means less need for heaters in winter and fans in summer — saving electricity and fuel.",
  },
  {
    title: "Monsoon ready",
    body: "Properly installed frames do not absorb water, swell, or rot during the rainy season.",
  },
] as const;

const TABLE_ROWS = [
  ["Termites & rot", "Immune", "Common risk", "Not typical", "Varies"],
  ["Painting / upkeep", "None", "Regular", "Occasional", "Frequent"],
  ["Thermal insulation", "Excellent", "Fair", "Poor", "Poor–fair"],
  ["Noise reduction", "Strong with DG", "Limited", "Limited", "Weak"],
  ["Dust tightness", "Gasket-sealed", "Gaps over time", "Fair", "Poor"],
  ["Monsoon swelling", "None", "Common", "None", "Common"],
] as const;

export function WhyUpvcView({
  company,
  faqs,
  projects,
  counts,
}: WhyUpvcViewProps) {
  const whatsapp = company.contact.whatsapp;

  return (
    <article className="bg-surface">
      <WhyHero whatsapp={whatsapp} />

      <section className="section-padding bg-surface-muted/50" id="what-is-upvc">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <p className="eyebrow mb-4 text-gold">What is uPVC?</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              A rigid profile built for decades of daily use.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/60 sm:text-lg">
              uPVC (unplasticized Polyvinyl Chloride) is a strong, rigid plastic
              profile used worldwide for high-performance doors and windows.
              Unlike regular PVC, uPVC does not bend or soften easily, making it
              ideal for frames that must handle wind, rain, dust, and daily use
              for decades.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
              In simple terms: uPVC windows and doors look good, keep heat and
              noise out, and never need painting or polishing.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <figure>
              <WhyStudioViewer
                openingType="casement"
                posterAlt="White uPVC casement window — multi-chamber profile fabricated in Kathmandu"
                caption="Multi-chamber casement profile — the same system we fabricate in Kathmandu."
              />
            </figure>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-padding" id="compare">
        <div className="container-content">
          <RevealOnScroll className="mb-12 max-w-2xl lg:mb-16">
            <p className="eyebrow mb-4 text-gold">The comparison</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Why uPVC over wood, aluminium, and local options.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
              Traditional wooden doors and windows may look classic, but they
              come with ongoing problems. Aluminium is strong but conducts heat
              and noise. uPVC is the modern solution built for Nepal’s climate.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {COMPARISONS.map((block, i) => (
              <RevealOnScroll key={block.title} delay={i * 0.08} className="h-full">
                <article className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] ring-1 ring-charcoal/[0.05]">
                  <h3 className="font-display text-xl tracking-tight text-charcoal">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
                    {block.intro}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-charcoal/75">
                    {block.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="mt-12 overflow-x-auto rounded-3xl bg-white ring-1 ring-charcoal/[0.05]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">
                uPVC compared with wood, aluminium, and local frames in Kathmandu
              </caption>
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal">
                  <th scope="col" className="px-5 py-4 font-medium">
                    Feature
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    uPVC
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Wood
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Aluminium
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Local frames
                  </th>
                </tr>
              </thead>
              <tbody className="text-charcoal/70">
                {TABLE_ROWS.map((row) => (
                  <tr key={row[0]} className="border-b border-charcoal/5 last:border-0">
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th
                          key={`${row[0]}-label`}
                          scope="row"
                          className="px-5 py-3.5 font-medium text-charcoal"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td
                          key={`${row[0]}-col-${index}`}
                          className={
                            index === 1
                              ? "px-5 py-3.5 font-medium text-navy"
                              : "px-5 py-3.5"
                          }
                        >
                          {cell}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-padding bg-surface-muted/50" id="kathmandu">
        <div className="container-content">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <RevealOnScroll>
              <p className="eyebrow mb-4 text-gold">Designed for Kathmandu</p>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
                Built for dust, noise, monsoon, and valley weather.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
                Living in Kathmandu means heavy dust and pollution, loud traffic
                and construction, cold winters, hot summers, and monsoon humidity.
                uPVC doors and windows are designed to handle exactly these
                conditions.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] shadow-[0_24px_48px_-20px_rgba(27,27,29,0.2)]">
                <Image
                  src={IMAGES.scrollStory.interior}
                  alt="Bright living room with large uPVC windows overlooking a Kathmandu-style neighbourhood"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOCAL_BENEFITS.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.08} className="h-full">
                <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] ring-1 ring-charcoal/[0.05]">
                  <h3 className="text-lg font-semibold tracking-tight text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                    {item.body}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="bg-surface pt-[var(--spacing-section)] md:pt-[var(--spacing-section-lg)]"
      >
        <ProductCategoryShowcase counts={counts} />
        <div className="container-content pb-16 md:pb-24">
          <RevealOnScroll>
            <p className="max-w-2xl text-sm leading-relaxed text-charcoal/55 sm:text-base">
              Custom work is welcome: curved or special-shape windows, large
              glass walls, office partitions, shopfronts, and designs that match
              your architect’s drawings. All systems are fabricated and
              installed by {company.companyName}, with proper sealing, alignment,
              and after-sales support.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <BeforeAfterSlider />

      <GalleryTeaser projects={projects} />

      <section className="section-padding" id="faq">
        <div className="container-content grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <RevealOnScroll>
            <p className="eyebrow mb-4 text-gold">Questions</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              uPVC in Kathmandu, answered.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/60">
              Still deciding between wood and uPVC? Write to us on{" "}
              <a
                href={whatsappHref(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>{" "}
              or visit a Hi-Tech site.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <FaqList faqs={faqs} />
          </RevealOnScroll>
        </div>
      </section>

      <CTASection
        title="Ready to upgrade your home or project with uPVC?"
        body="Get a free consultation and site measurement from our Kathmandu team — Tarakeshwar, Lambagar, or Tokha."
        primaryHref="/contact"
        primaryLabel="Request a Free Quote"
        secondaryHref={whatsappHref(
          whatsapp,
          "Hi Hi-Tech — I’d like a free consultation for uPVC doors or windows."
        )}
        secondaryLabel="Call / WhatsApp Us"
      />
    </article>
  );
}
