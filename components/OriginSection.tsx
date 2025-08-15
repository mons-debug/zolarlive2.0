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
        // Enhanced Borderline logo animation with rotation and glow
        tl.fromTo(
          logoRef.current,
          { scale: 0.9, y: -12, rotation: -3, opacity: 0.8 },
          { scale: 1.1, y: 4, rotation: 1, opacity: 1, ease: "none" },
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
      className="relative h-[100svh] md:h-[100svh] grid place-items-center overflow-clip"
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
          style={{ objectPosition: "center top" }}
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
        <div className="o-line text-xs tracking-[0.3em] text-white/40 uppercase mb-8 md:mb-12 font-medium">
          Established 2025 — Morocco
        </div>
                       <div ref={logoRef} className="mx-auto mb-6 sm:mb-8 w-[180px] sm:w-[260px] will-change-transform">
                 <div className="relative">
                   <Image 
                     src="/images/BORDERLINE LOGOS DESIGN-04.svg" 
                     alt="Borderline logo" 
                     width={274} 
                     height={182} 
                     className="w-full h-auto drop-shadow-2xl filter brightness-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-sky-400/20 mix-blend-overlay rounded-lg"></div>
                 </div>
               </div>
        <div className="o-line text-xs tracking-[0.2em] text-white/60 uppercase">
          Drop 01 — Borderline
        </div>
                <h2 className="o-line mt-3 text-5xl md:text-6xl font-semibold text-white perspective-1000">
          <span className="inline-block animate-fade-up">Made</span>{" "}
          <span className="inline-block animate-fade-up animation-delay-100">for</span>{" "}
          <span className="inline-block animate-fade-up animation-delay-200 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">Motion</span>
        </h2>
        <p className="o-line mt-4 text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
          Premium streetwear crafted in Casablanca. Where North African heritage
          meets contemporary design. First drop, infinite possibilities.
        </p>
      </div>
    </section>
  );
}


