import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppLink";

interface CTASectionProps {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Show the WhatsApp glyph beside the secondary label */
  secondaryIcon?: "whatsapp";
}

export function CTASection({
  title = "Ready to transform your space?",
  body = "Get a free, no-obligation quote. Our team will guide you from product selection to installation.",
  primaryHref = "/get-quote",
  primaryLabel = "Get a Free Quote",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
  secondaryIcon,
}: CTASectionProps) {
  return (
    <section className="section-padding bg-navy text-surface">
      <div className="container-content">
        <RevealOnScroll className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 xl:gap-20">
          <div className="max-w-xl lg:max-w-2xl">
            <h2 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.08] tracking-tight text-balance">
              {title}
            </h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-surface/60 sm:mt-4 sm:text-base lg:text-lg">
              {body}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:max-w-md sm:flex-row sm:items-center lg:max-w-none lg:w-auto lg:justify-end">
            <MagneticButton
              href={primaryHref}
              className="w-full justify-center !bg-gold !px-7 !py-3.5 !text-charcoal hover:!bg-gold/90 sm:w-auto sm:min-w-[10.5rem]"
            >
              {primaryLabel}
            </MagneticButton>
            <MagneticButton
              href={secondaryHref}
              variant="secondary"
              className={
                secondaryIcon === "whatsapp"
                  ? "w-full justify-center !border-surface/25 !px-7 !py-3.5 !text-surface hover:!border-[#25D366] hover:!text-[#25D366] sm:w-auto sm:min-w-[10.5rem]"
                  : "w-full justify-center !border-surface/25 !px-7 !py-3.5 !text-surface hover:!border-gold hover:!text-gold sm:w-auto sm:min-w-[10.5rem]"
              }
            >
              {secondaryIcon === "whatsapp" && (
                <WhatsAppIcon size={16} className="shrink-0" />
              )}
              {secondaryLabel}
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
