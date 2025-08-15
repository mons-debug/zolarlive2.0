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
      gsap.set(bg, { filter: "hue-rotate(0deg)" });
      gsap.to(bg, {
        filter: "hue-rotate(360deg)",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      // IMPORTANT: Do not translate/scale the background layer to avoid
      // exposing black borders at the viewport edges. All drift comes from
      // small changes to CSS vars in section timelines instead.
      const docEl = document.documentElement;
      // Keep gradient visible on load; drift hues subtly across scroll
      gsap.to(docEl, {
        "--h1": 190, // shift towards yellow/green
        "--h2": 540, // shift towards magenta/sky
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, bg);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="zolar-gradient-vars fixed inset-0 -z-10" aria-hidden />
  );
}


