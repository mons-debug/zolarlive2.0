"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CinematicHeroProps = {
  media: "video" | "image";
  src: string;
  alt?: string;
};

export default function CinematicHero({ media, src, alt = "Zolar hero" }: CinematicHeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    // Ensure hero visually matches global gradient vars
    const docEl = document.documentElement;
    const cs = getComputedStyle(docEl);
    root.style.setProperty("--h1", cs.getPropertyValue("--h1"));
    root.style.setProperty("--h2", cs.getPropertyValue("--h2"));
    root.style.setProperty("--gx", cs.getPropertyValue("--gx"));
    root.style.setProperty("--gy", cs.getPropertyValue("--gy"));

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Intro reveal
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out" });
      }
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.05 }
        );
      }
      if (mediaRef.current) {
        gsap.fromTo(
          mediaRef.current,
          { scale: 1.08, opacity: 0.85 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
        );
      }

      // Scroll compression and gentle gradient drift (no media scale to avoid lateral shift)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=140%",
          scrub: true,
          pin: true,
        },
      });

      // Drift global vars slightly; keep colorization controlled by the global stage
      tl.to(docEl, { "--gx": "52%", "--gy": "34%", ease: "none" }, 0)
        .to(root, { opacity: 0.98, ease: "none" }, 0)
        .to(textRef.current, { y: -2, ease: "none" }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative isolate h-[100svh] overflow-clip" aria-label="Hero">
      {/* Logo top-left */}
      <div ref={logoRef} className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20 opacity-90">
        <Image src="/zolar-logo-solid.svg" alt="Zolar" width={28} height={28} />
      </div>

      {/* Center content */}
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="absolute inset-0 -z-10 overflow-hidden" ref={mediaRef}>
          {media === "video" ? (
            <video
              src={src}
              className="h-full w-full object-cover [object-position:center_35%]"
              autoPlay
              loop
              muted
              playsInline
              poster="/images/zolar-borderline-black.jpg"
            />
          ) : (
            <Image src={src} alt={alt} fill sizes="100vw" className="object-cover [object-position:center_32%]" priority />
          )}
          {/* Edge protection: add outer vignettes to hide gradient boundaries on ultrawide */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
          {/* Bottom feather: slightly taller and curved mask to reduce straight-edge perception */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-b from-transparent via-black/70 to-black" />
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(120vmax_80vmax_at_50%_50%,black,transparent_70%)] bg-black/0" />
        </div>

        <div ref={textRef} className="relative z-10 px-6 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">Glow in Motion</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg">
            Borderline Black and Spin for Purpose. Designed to move with you.
          </p>
          <p className="mt-8 text-white/60 text-xs uppercase tracking-[0.3em]">
            Scroll to unveil ↓
          </p>
        </div>
      </div>
    </section>
  );
}


