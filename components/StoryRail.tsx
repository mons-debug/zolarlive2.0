"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StoryRail() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".story-row");
      rows.forEach((row, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

        // Enter stagger (both breakpoints)
        const children = row.querySelectorAll(".story-card");
        gsap.from(children, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: "top 80%" },
        });

        if (!prefersReduced) {
          // Row-level subtle x drift on desktop only
          ScrollTrigger.create({
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              if (isMobile()) return;
              const progress = self.progress; // 0..1
              const x = dir * (10 - 20 * progress); // ~ +10 to -10
              gsap.to(row, { xPercent: x, duration: 0.2, ease: "none" });
            },
          });

          // Card-level parallax: add light y drift using data-speed per card
          const prlxItems = row.querySelectorAll<HTMLElement>(".prlx");
          prlxItems.forEach((item) => {
            const speed = parseFloat(item.dataset.speed || "0");
            gsap.to(item, {
              y: () => speed * 80, // ~ -80..80px across the section
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story-rail" ref={rootRef} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 space-y-16">
      {/* Section A */}
      <div className="story-row grid md:grid-cols-12 gap-6 md:gap-8 items-stretch">
        <div className="story-card prlx md:col-span-7 order-2 md:order-1" data-speed="0.6">
          <div className="relative h-full overflow-hidden rounded-3xl ring-1 ring-emerald-500/20 bg-black/60 backdrop-blur-md">
            <div className="aspect-[4/3] sm:aspect-[16/10]">
              <Image src="/images/zolar-borderline-black.png" alt="Borderline Black" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="story-card prlx md:col-span-5 order-1 md:order-2" data-speed="-0.35">
          <div className="h-full p-6 sm:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Borderline Black</p>
            <h3 className="mt-2 text-2xl font-semibold">Neon-lined presence</h3>
            <p className="mt-2 text-white/80">Back print with a soft green aura on a deep black base. Heavyweight and structured.</p>
            <ul className="mt-3 list-disc list-inside text-white/70 space-y-1">
              <li>Green glow back print</li>
              <li>Heavyweight cotton</li>
              <li>Relaxed fit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section B */}
      <div className="story-row grid md:grid-cols-12 gap-6 md:gap-8 items-stretch">
        <div className="story-card prlx md:col-start-8 md:col-span-5 order-1" data-speed="-0.35">
          <div className="h-full p-6 sm:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Spin for Purpose</p>
            <h3 className="mt-2 text-2xl font-semibold">Kinetic mark</h3>
            <p className="mt-2 text-white/80">Clean white base featuring dual-tone blue/orange spin artwork. Light and breathable.</p>
            <ul className="mt-3 list-disc list-inside text-white/70 space-y-1">
              <li>Blue/orange front print</li>
              <li>Midweight cotton</li>
              <li>True-to-size fit</li>
            </ul>
          </div>
        </div>
        <div className="story-card prlx md:col-start-1 md:col-span-7 order-2" data-speed="0.6">
          <div className="relative h-full overflow-hidden rounded-3xl ring-1 ring-sky-500/20 bg-black/60 backdrop-blur-md">
            <div className="aspect-[4/3] sm:aspect-[16/10]">
              <Image src="/images/zolar-spin-purpose-white.png" alt="Spin for Purpose" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Section C */}
      <div className="story-row grid md:grid-cols-12 gap-6 md:gap-8 items-stretch">
        <div className="story-card prlx md:col-span-4" data-speed="-0.25">
          <div className="h-full p-6 sm:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
            <h4 className="text-lg font-semibold">Craft</h4>
            <p className="mt-2 text-white/75">Clean seams, durable ribbing, and soft-touch prints designed to last.</p>
          </div>
        </div>
        <div className="story-card prlx md:col-span-4" data-speed="0.15">
          <div className="h-full p-6 sm:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
            <h4 className="text-lg font-semibold">Fit</h4>
            <p className="mt-2 text-white/75">Relaxed drape for Borderline; standard fit for Spin. Choose your vibe.</p>
          </div>
        </div>
        <div className="story-card prlx md:col-span-4" data-speed="0.4">
          <div className="h-full p-0 overflow-hidden rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
            <div className="aspect-[16/9] relative">
              <Image src="/images/borderline-black.svg" alt="Detail" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


