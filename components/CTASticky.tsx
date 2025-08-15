"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CTAStickyProps = {
  buyLink: string;
};

export default function CTASticky({ buyLink }: CTAStickyProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [product, setProduct] = useState<"borderline" | "spin">("borderline");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const show = () => gsap.to(root, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
      const hide = () => gsap.to(root, { y: 24, opacity: 0, duration: 0.3, ease: "power2.inOut" });

      ScrollTrigger.create({
        trigger: "#story-rail",
        start: "center center",
        endTrigger: "#outro",
        end: "top bottom",
        onEnter: show,
        onEnterBack: show,
        onLeave: hide,
        onLeaveBack: hide,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-auto sm:min-w-[680px] opacity-0 translate-y-6"
      role="region"
      aria-label="Purchase bar"
    >
      <div className="rounded-2xl bg-black/70 ring-1 ring-white/10 backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 sm:grid-cols-[auto_1fr_auto] items-center">
          {/* Thumbnail (desktop) */}
          <div className="hidden sm:block">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-1 ring-white/10">
              {product === "borderline" ? (
                <Image src="/images/zolar-borderline-black.jpg" alt="Borderline Black" fill className="object-cover" />
              ) : (
                <Image src="/images/zolar-spin-purpose-white.jpg" alt="Spin for Purpose" fill className="object-cover" />
              )}
            </div>
          </div>

          {/* Selector + Price */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 ring-1 ring-white/10">
              <button
                className={`px-3 py-1.5 text-sm rounded-full transition ${
                  product === "borderline" ? "bg-emerald-400 text-black" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setProduct("borderline")}
              >
                Borderline
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full transition ${
                  product === "spin" ? "bg-sky-400 text-black" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setProduct("spin")}
              >
                Spin
              </button>
            </div>
            <div className="text-sm text-white/70">$45</div>
          </div>

          {/* CTA */}
          <div className="justify-self-end">
            <a
              href={buyLink}
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Buy now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


