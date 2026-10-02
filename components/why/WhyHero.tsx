import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhyStudioViewer } from "@/components/why/WhyStudioViewer";
import { quoteHref, whatsappHref } from "@/lib/constants";

interface WhyHeroProps {
  whatsapp: string;
}

export function WhyHero({ whatsapp }: WhyHeroProps) {
  return (
    <section className="section-padding page-top">
      <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll priority className="max-w-xl">
          <p className="eyebrow mb-4 text-gold">Why uPVC in Kathmandu</p>
          <h1 className="font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
            Upgrade to uPVC: stronger, quieter, maintenance-free windows for Nepal homes.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
            Built for Nepal’s climate, dust, and noise — uPVC doors and windows
            give you better insulation, zero painting, and decades of
            trouble-free use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MagneticButton href={quoteHref()}>Get a Free Quote</MagneticButton>
            <MagneticButton
              href={whatsappHref(
                whatsapp,
                "Hi Hi-Tech — I’d like to book a site measurement for uPVC windows or doors in Kathmandu."
              )}
              variant="secondary"
            >
              Book a Site Measurement
            </MagneticButton>
          </div>
        </RevealOnScroll>

        <RevealOnScroll priority delay={0.12}>
          <WhyStudioViewer
            openingType="casement"
            posterAlt="White uPVC casement window — Hi-Tech uPVC Kathmandu"
            caption="Live 3D casement · multi-chamber uPVC profile"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}