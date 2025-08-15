"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OriginSection() {
  const root = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof window === "undefined") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=140%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
      },
    });

    if (!reduce) {
      tl.fromTo(
        el.querySelectorAll(".o-line"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, ease: "none" },
        0
      );

      const varTweens: gsap.TweenVars = {
        "--gx": "52%",
        "--gy": "40%",
        "--h1": 210,
        "--h2": 540,
        ease: "none",
      };
      tl.to(document.documentElement, varTweens, 0);

      if (logoRef.current) {
        // Gentle entrance without overlay; small scale drift across the pin
        tl.fromTo(
          logoRef.current,
          { scale: 0.96, y: -8 },
          { scale: 1.06, y: -2, ease: "none" },
          0
        );
      }

      if (heroImgRef.current) {
        // Fade and drift the hero image so the green gradient takes over
        tl.fromTo(
          heroImgRef.current,
          { opacity: 0.9, y: 0, scale: 1.02 },
          { opacity: 0, y: -24, scale: 1.06, ease: "none" },
          0
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={root}
      id="origin"
      className="relative h-[85svh] md:h-[100svh] grid place-items-center overflow-clip"
    >
      {/* Image overlay: mobile full-bleed, desktop blended */}
      <div ref={heroImgRef} className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Mobile: ensure full coverage and no bottom band */}
        <Image
          src="/images/banner.png"
          alt="Zolar hero"
          fill
          sizes="100vw"
          priority
          className="object-cover md:hidden"
          style={{ objectPosition: "center center" }}
        />
        {/* Desktop: keep screen blend */}
        <div className="hidden md:block mix-blend-screen">
          <Image src="/images/banner.png" alt="Zolar hero" fill priority className="object-cover" />
        </div>
      </div>
      {/* Welcome Text Overlay */}
      <div className="absolute top-20 left-0 right-0 z-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white">Welcome to Zolar</h1>
      </div>
      {/* Top clean — global background stays black until this section scrolls in */}
      {/* No per-section background; global gradient renders behind */}
      <div className="relative z-10 w-[min(1000px,86vw)] text-center">
        <div className="o-line text-xs tracking-[0.3em] text-white/40 uppercase mb-8 md:mb-12">
          Established 2024 — Los Angeles
        </div>
        <div ref={logoRef} className="mx-auto mb-6 sm:mb-8 w-[160px] sm:w-[220px] will-change-transform">
          <Image src="/images/zolar-wordmark.svg" alt="Zolar wordmark" width={220} height={80} className="w-full h-auto" />
        </div>
        <div className="o-line text-xs tracking-[0.2em] text-white/60 uppercase">
          Drop 01 — Borderline
        </div>
        <h2 className="o-line mt-3 text-5xl md:text-6xl font-semibold text-white">
          Made for Motion
        </h2>
        <p className="o-line mt-4 text-white/70 max-w-2xl mx-auto">
          Heavyweight builds, soft-touch inks, clean silhouettes. Born at night
          shoots, tuned for daily rotation.
        </p>
      </div>
    </section>
  );
}


