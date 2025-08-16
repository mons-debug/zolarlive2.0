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
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.querySelector("#lookbook") as HTMLElement;
    const el = wrap.current;
    const track = trackRef.current;
    const title = titleRef.current;
    if (!el || !track || !section || typeof window === "undefined") return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const mm = gsap.matchMedia();

    // Animate title on entry
    if (title && !reduce) {
      gsap.fromTo(
        title.querySelectorAll(".word"),
        { 
          y: 30, 
          opacity: 0,
          rotateX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

          // Desktop: Pin entire section and horizontal scroll
      mm.add("(min-width: 900px)", () => {
        const total = track.scrollWidth - el.clientWidth;
        
        // Create timeline for better control
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${total * 0.8 + window.innerHeight * 0.2}`, // Start horizontal much earlier
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
          },
        });
        
        // Hold title visible for first 5% of scroll
        tl.to(track, { x: 0, duration: 0.05, ease: "none" });
        // Then slide horizontally for remaining 95%
        tl.to(track, { x: -total, duration: 0.95, ease: "none" });
      });

      // Mobile: Pin entire section and horizontal scroll
      mm.add("(max-width: 899px)", () => {
        const total = track.scrollWidth - el.clientWidth;
        
        // Create timeline for better control on mobile
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${total * 0.7 + window.innerHeight * 0.15}`, // Start horizontal much earlier on mobile
            scrub: 1.2, // Smooth scrub
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        
        // Hold title visible for first 5% of scroll on mobile
        tl.to(track, { x: 0, duration: 0.05, ease: "none" });
        // Then slide horizontally for remaining 95%
        tl.to(track, { x: -total, duration: 0.95, ease: "none" });
      });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

    return (
    <section id="lookbook" className="relative min-h-[80vh] md:min-h-screen flex flex-col">
      {/* Fixed title that stays at top */}
      <div ref={titleRef} className="text-center pt-8 xs:pt-12 pb-4 xs:pb-6 md:pt-24 md:pb-16 px-4 perspective-1000">
        <h3 className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight">
          <span className="word inline-block">Collection</span>{" "}
          <span className="word inline-block">Gallery</span>
        </h3>
        <p className="text-white/60 text-sm xs:text-base md:text-lg mt-2 xs:mt-4">
          <span className="word inline-block">Scroll</span>{" "}
          <span className="word inline-block">through</span>{" "}
          <span className="word inline-block">our</span>{" "}
          <span className="word inline-block">looks</span>
        </p>
      </div>
      {/* Gallery that pins below the title */}
      <div ref={wrap} className="lb-wrap relative overflow-hidden flex-1 min-h-[50vh] md:min-h-[60vh]">
        <div
          ref={trackRef}
          className="lb-track flex gap-4 md:gap-6 px-6 md:px-8 h-full items-center"
        >
          {LOOKS.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl w-[85vw] xs:w-[80vw] h-[40vh] xs:h-[50vh] md:w-[45vw] md:h-[55vh] transition-transform hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Look ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}


