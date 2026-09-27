import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="section-padding page-top">
      <div className="container-content max-w-xl">
        <p className="eyebrow mb-4 text-gold">404</p>
        <h1 className="font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
          This page isn’t in the workshop.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-charcoal/60 sm:text-lg">
          The link may be old, or the system hasn’t been listed yet. The
          catalogue is still here.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MagneticButton href="/products">Browse products</MagneticButton>
          <MagneticButton href="/" variant="secondary">
            Back home
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}