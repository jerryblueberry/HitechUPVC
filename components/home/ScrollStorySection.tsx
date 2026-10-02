"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { IMAGES } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  {
    eyebrow: "Windows",
    title: "Engineered to open with quiet precision",
    body: "Multi-chamber profiles, soft-close hardware, and seals that keep the elements out while letting light flood in.",
    image: IMAGES.scrollStory.window,
  },
  {
    eyebrow: "Doors",
    title: "Seamless connection to the outdoors",
    body: "Sliding, folding, and French systems that disappear into the architecture — expanding living space without compromise.",
    image: IMAGES.scrollStory.door,
  },
  {
    eyebrow: "Living",
    title: "Where comfort meets craftsmanship",
    body: "Every installation is measured, manufactured, and fitted to last — transforming how you experience your home.",
    image: IMAGES.scrollStory.interior,
  },
] as const;

export function ScrollStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || !containerRef.current || !pinRef.current) return;

      const images = gsap.utils.toArray<HTMLElement>(".story-image");
      const texts = gsap.utils.toArray<HTMLElement>(".story-copy");
      const panels = gsap.utils.toArray<HTMLElement>(".story-panel");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=280%",
          pin: pinRef.current,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;

        tl.to(
          images[i - 1],
          { opacity: 0, scale: 1.05, duration: 1, ease: "power2.inOut" },
          i
        );
        tl.fromTo(
          images[i],
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          i
        );

        tl.to(
          texts[i - 1],
          { opacity: 0, y: -16, duration: 0.6, ease: "power2.in" },
          i - 0.2
        );
        tl.fromTo(
          texts[i],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          i + 0.1
        );

        // Window panel slides open on first transition
        if (i === 1) {
          tl.to(
            ".window-sash",
            { xPercent: -102, duration: 1.4, ease: "power3.inOut" },
            0.3
          );
        }
        // Door panel rotates on second transition
        if (i === 2) {
          tl.to(
            ".door-sash",
            { rotateY: -78, duration: 1.4, ease: "power3.inOut", transformOrigin: "left center" },
            1.3
          );
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <>
      {/* Reduced-motion / mobile fallback */}
      <section className="lg:hidden section-padding bg-charcoal text-surface">
        <div className="container-content space-y-16">
          {STORIES.map((story) => (
            <article key={story.title}>
              <p className="eyebrow text-gold mb-3">{story.eyebrow}</p>
              <h2 className="font-display text-h2 mb-4">{story.title}</h2>
              <p className="text-surface/70 mb-6">{story.body}</p>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={story.image} alt={story.title} fill className="object-cover" sizes="100vw" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GSAP pinned scrollytelling — desktop */}
      <section ref={containerRef} className="hidden lg:block relative h-[280vh]">
        <div ref={pinRef} className="relative h-screen overflow-hidden bg-charcoal">
          {/* Images stack */}
          <div className="absolute inset-0">
            {STORIES.map((story, i) => (
              <div
                key={story.title}
                className="story-image absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0, zIndex: i }}
              >
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
              </div>
            ))}

            {/* Animated window sash overlay — first scene */}
            <div
              className="window-sash story-panel absolute top-[15%] right-[12%] w-[38%] h-[55%] z-20 border-2 border-surface/30 bg-surface/10 backdrop-blur-sm"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
              aria-hidden
            >
              <div className="absolute inset-2 border border-surface/20" />
            </div>

            {/* Door sash — second scene */}
            <div
              className="door-sash story-panel absolute top-[12%] right-[8%] w-[42%] h-[62%] z-20 border-2 border-surface/30 bg-surface/5"
              style={{ transformOrigin: "left center", perspective: "800px" }}
              aria-hidden
            >
              <div className="absolute inset-0 bg-gradient-to-br from-surface/10 to-transparent" />
            </div>
          </div>

          {/* Copy layers */}
          <div className="relative z-30 h-full flex items-center">
            <div className="container-content max-w-xl">
              {STORIES.map((story, i) => (
                <div
                  key={story.title}
                  className="story-copy absolute max-w-lg"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="eyebrow text-gold mb-4">{story.eyebrow}</p>
                  <h2 className="font-display text-h2 text-surface mb-5">{story.title}</h2>
                  <p className="text-surface/75 leading-relaxed">{story.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
