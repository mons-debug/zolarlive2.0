"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MACRO = [
  {
    img: "/images/macro-stitch.png",
    title: "Seams",
    body: "Durable ribbing and reinforced seams built to last.",
  },
  {
    img: "/images/p9.png",
    title: "Print",
    body: "Soft-hand inks with crisp edges and deep blacks.",
  },
  {
    img: "/images/macro-fabric.png",
    title: "Fabric",
    body: "Heavyweight cotton with a matte, structured drape.",
  },
];

export default function MaterialFocus() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof window === "undefined") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".m-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 24, opacity: 0.9 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 45%",
            scrub: reduce ? false : 0.6,
          },
        }
      );
      gsap.fromTo(
        card,
        { xPercent: (i - 1) * 6 },
        {
          xPercent: 0,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 40%",
            scrub: reduce ? false : 0.6,
          },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={root}
      id="materials"
      className="relative z-10 w-[min(1100px,86vw)] mx-auto py-16"
    >
      <h3 className="text-white text-3xl md:text-4xl font-semibold mb-6">
        Materials & Details
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {MACRO.map((m, i) => (
          <div
            key={i}
            className="m-card rounded-3xl border border-white/10 bg-black/40 backdrop-blur overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.title} className="w-full h-64 object-cover" />
            <div className="p-5">
              <div className="text-white text-xl font-semibold">{m.title}</div>
              <p className="text-white/70 mt-2">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


