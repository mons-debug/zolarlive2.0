"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LOOKS = ["/images/p9.png", "/images/p5.png", "/images/p6.png", "/images/p7.png", "/images/p8.png", "/images/p11.png"];

export default function LookbookStrip() {
  const wrap = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const track = trackRef.current;
    if (!el || !track || typeof window === "undefined") return;
    
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const mm = gsap.matchMedia();

    // Desktop: Pin and horizontal scroll
    mm.add("(min-width: 900px)", () => {
      const total = track.scrollWidth - el.clientWidth;
      gsap.to(track, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${total}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    // Mobile: Horizontal scroll on vertical scroll
    mm.add("(max-width: 899px)", () => {
      const total = track.scrollWidth - el.clientWidth;
      gsap.to(track, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="lookbook" className="relative py-12 md:py-0">
      <div className="text-center mb-6 md:hidden px-4">
        <h3 className="text-white text-2xl font-semibold">Collection Gallery</h3>
        <p className="text-white/60 text-sm mt-2">Swipe through our looks</p>
      </div>
      <div ref={wrap} className="lb-wrap relative overflow-hidden h-[50svh] md:h-[70svh]">
        <div 
          ref={trackRef}
          className="lb-track flex gap-3 md:gap-4 px-4 md:px-6 h-full items-center"
        >
          {LOOKS.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-xl w-[75vw] h-[45vh] md:w-[48vw] md:h-[58vh]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Look ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-4 md:hidden">
        <div className="flex justify-center gap-1">
          {LOOKS.map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
          ))}
        </div>
      </div>
    </section>
  );
}


