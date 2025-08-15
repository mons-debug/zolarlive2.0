"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    if (!overlay || !logo || !text) return;

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(logo, { scale: 0.6, autoAlpha: 0 });
    gsap.set(text, { autoAlpha: 0, y: 16 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        document.body.style.overflow = "";
      },
    });

    document.body.style.overflow = "hidden";

    tl.to(logo, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.3 })
      .to(text, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "<0.2")
      .to(overlay, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut", delay: 0.8 });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] grid place-items-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div ref={logoRef}>
          <Image src="/images/zolar-wordmark.svg" alt="Zolar" width={180} height={64} />
        </div>
        <div ref={textRef} className="text-white/80 text-sm tracking-wide">
          Loading collection...
        </div>
      </div>
    </div>
  );
}


