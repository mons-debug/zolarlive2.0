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

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof window === "undefined") return;
    const track = el.querySelector(".lb-track") as HTMLElement | null;
    if (!track) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (window.innerWidth >= 900 && !reduce) {
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
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section id="lookbook" className="relative">
      <div ref={wrap} className="lb-wrap relative overflow-hidden h-[70svh]">
        <div className="lb-track flex gap-4 px-6 h-full items-center">
          {LOOKS.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-3xl border border-white/10 bg-black/40 overflow-hidden"
              style={{ width: "48vw", height: "58vh" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


