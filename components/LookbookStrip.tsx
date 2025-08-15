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
    const el = wrap.current;
    const track = trackRef.current;
    const title = titleRef.current;
    if (!el || !track || typeof window === "undefined") return;

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

          // Desktop: Pin and horizontal scroll
      mm.add("(min-width: 900px)", () => {
        const total = track.scrollWidth - el.clientWidth;
        gsap.to(track, {
          x: -total,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${total * 1.5}`, // Slower scroll
            scrub: 1.2, // Smoother scrub
            pin: true,
            anticipatePin: 1,
          },
        });
      });

      // Mobile: Pin and horizontal scroll like desktop
      mm.add("(max-width: 899px)", () => {
        const total = track.scrollWidth - el.clientWidth;
        gsap.to(track, {
          x: -total,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${total * 1.8}`, // More scroll distance for mobile
            scrub: 1.5, // Smooth scrub
            pin: true,
            anticipatePin: 1,
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
      {/* Animated title for all screens */}
      <div ref={titleRef} className="text-center mb-8 md:mb-12 px-4 perspective-1000">
        <h3 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
          <span className="word inline-block">Collection</span>{" "}
          <span className="word inline-block">Gallery</span>
        </h3>
        <p className="text-white/60 text-sm md:text-base mt-3">
          <span className="word inline-block">Scroll</span>{" "}
          <span className="word inline-block">through</span>{" "}
          <span className="word inline-block">our</span>{" "}
          <span className="word inline-block">looks</span>
        </p>
      </div>
      <div ref={wrap} className="lb-wrap relative overflow-hidden h-[50svh] md:h-[70svh]">
        <div
          ref={trackRef}
          className="lb-track flex gap-3 md:gap-4 px-4 md:px-6 h-full items-center"
        >
          {LOOKS.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-xl w-[75vw] h-[45vh] md:w-[48vw] md:h-[58vh] transition-transform hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Look ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      {/* Progress indicator */}
      <div className="text-center mt-6">
        <div className="flex justify-center gap-1.5">
          {LOOKS.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 transition-all duration-300" />
          ))}
        </div>
      </div>
    </section>
  );
}


