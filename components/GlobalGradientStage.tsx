"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalGradientStage() {
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bg = bgRef.current;
    if (!bg) return;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Start with white emphasis at the top; fade to green as user scrolls
      gsap.set(bg, { filter: "none" });
      gsap.fromTo(document.documentElement, { "--w1": 0.55 }, {
        "--w1": 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
      // IMPORTANT: Do not translate/scale the background layer to avoid
      // exposing black borders at the viewport edges. All drift comes from
      // small changes to CSS vars in section timelines instead.
      const docEl = document.documentElement;
      // Keep gradient visible on load; maintain blue theme during main scroll
      gsap.to(docEl, {
        "--h1": 200, // sky blue
        "--h2": 230, // deeper azure blue
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "10% top",
          end: "60% top",
          scrub: true,
        },
      });

      // Transition to white/neutral theme when reaching outro section
      gsap.to(docEl, {
        "--h1": 0, // white/neutral
        "--h2": 240, // subtle blue tint
        "--ga1": 0.15, // reduced intensity for white theme
        "--ga2": 0.08,
        "--ga3": 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#outro",
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });
    }, bg);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={bgRef} 
      className="zolar-gradient-vars fixed inset-0 -z-10" 
      style={{ 
        WebkitTransform: 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)'
      }}
      aria-hidden 
    />
  );
}


