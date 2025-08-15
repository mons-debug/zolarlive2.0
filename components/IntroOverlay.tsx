"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    const docEl = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduce) {
      setVisible(false);
      document.body.style.overflow = prevOverflow;
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setVisible(false);
        document.body.style.overflow = prevOverflow;
      },
    });

    // Start black, small logo pulse in
    tl.fromTo(
      logo,
      { scale: 0.6 },
      { scale: 1.0, duration: 0.6 }
    );

    // Colorize background vars while logo eases upward a touch
    tl.to(
      docEl as unknown as gsap.TweenTarget,
      { "--ga1": 0.35, "--ga2": 0.25, "--ga3": 0.06, duration: 0.9, ease: "none" },
      "<"
    );
    tl.to(
      logo,
      { y: -24, scale: 1.08, duration: 0.9, ease: "power1.out" },
      "<"
    );

    // Ensure gradient alphas are at their target before removing overlay
    tl.set(docEl as unknown as gsap.TweenTarget, { "--ga1": 0.35, "--ga2": 0.25, "--ga3": 0.06 });
    tl.to(overlay, { opacity: 0, duration: 0.5, ease: "power1.out" }, ">-0.1");

    return () => {
      tl.kill();
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-black text-white grid place-items-center"
      aria-label="Intro"
    >
      <div className="text-center px-6">
        <div ref={logoRef} className="mx-auto w-[120px] sm:w-[180px] will-change-transform">
          <Image src="/images/zolar-wordmark.svg" alt="Zolar" width={180} height={70} className="w-full h-auto" />
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">Made for Motion</h1>
        <p className="mt-3 text-white/70 max-w-xl mx-auto">
          Heavyweight builds, soft-touch inks, clean silhouettes. Born at night shoots, tuned for daily rotation.
        </p>
      </div>
    </div>
  );
}


