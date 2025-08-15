"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Align = "left" | "right";

type Item = {
  kicker: string;
  title: string;
  body: string;
  media: string; // image path or .mp4
  align: Align;
};

const ITEMS: Item[] = [
  {
    kicker: "Borderline Black",
    title: "Neon-lined presence",
    body:
      "Back print with a soft green aura on a deep black base. Heavyweight and structured.",
    media: "/images/zolar-borderline-black.png",
    align: "left",
  },
  {
    kicker: "Spin for Purpose",
    title: "Kinetic mark",
    body:
      "Clean white base featuring dual-tone blue/orange spin artwork. Light and breathable.",
    media: "/images/zolar-spin-purpose-white.png",
    align: "right",
  },
  {
    kicker: "Look",
    title: "In motion",
    body: "Designed for daily rotation and night shoots alike.",
    media: "/images/look01.png",
    align: "left",
  },
];

export default function GTAParallax() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    const setup = () => {
      const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".gta-item"));
      items.forEach((el) => {
        const media = el.querySelector(".gta-media") as HTMLElement | null;
        const copy = el.querySelector(".gta-copy") as HTMLElement | null;
        if (!media || !copy) return;

        // Desktop parallax (stronger)
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            media,
            { yPercent: -12, scale: 1.02 },
            {
              yPercent: 12,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            copy,
            { y: 40 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        // Mobile parallax (lighter)
        mm.add("(max-width: 767px)", () => {
          gsap.fromTo(
            media,
            { yPercent: -6, scale: 1.0 },
            {
              yPercent: 6,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            copy,
            { y: 18 },
            {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });
    };

    const ctx = gsap.context(setup, root);
    return () => {
      ctx.revert();
      mm.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Zolar GTA-style parallax features"
      className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 space-y-20"
    >
      {ITEMS.map((item, idx) => {
        const isLeft = item.align === "left";
        const isSecond = idx === 1;
        const copyLift = isSecond ? "md:-translate-y-16 lg:-translate-y-24" : "md:-translate-y-6 lg:-translate-y-8";
        return (
          <article key={idx} className="gta-item grid md:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Media */}
            <div
              className={
                isLeft
                  ? "md:col-span-7 order-1"
                  : "md:col-start-6 md:col-span-7 order-1"
              }
            >
              <div
                className="gta-media relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 bg-black/60"
                aria-label={`${item.title} media`}
                role="img"
                style={
                  item.media.endsWith(".mp4")
                    ? undefined
                    : { backgroundImage: `url(${item.media})`, backgroundSize: "cover", backgroundPosition: "center" }
                }
              >
                {/* Height wrapper */}
                <div className="h-[58vh] md:h-[72vh]">
                  {item.media.endsWith(".mp4") && (
                    <video
                      src={item.media}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      title={item.title}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Copy */}
            <div
              className={
                isLeft
                  ? `md:col-start-9 md:col-span-4 order-2 ${copyLift}`
                  : `md:col-start-1 md:col-span-4 order-2 ${copyLift}`
              }
            >
              <div className="gta-copy h-full p-6 sm:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">{item.kicker}</p>
                <h3 className="mt-2 text-3xl md:text-5xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-white/80 leading-relaxed">{item.body}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}


