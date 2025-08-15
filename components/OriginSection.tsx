"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OriginSection() {
  const root = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof window === "undefined") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=140%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
      },
    });

    if (!reduce) {
      tl.fromTo(
        el.querySelectorAll(".o-line"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, ease: "none" },
        0
      );

      const varTweens: gsap.TweenVars = {
        "--gx": "52%",
        "--gy": "40%",
        "--h1": 210,
        "--h2": 540,
        ease: "none",
      };
      tl.to(document.documentElement, varTweens, 0);

      if (logoRef.current) {
        // Gentle entrance without overlay; small scale drift across the pin
        tl.fromTo(
          logoRef.current,
          { scale: 0.96, y: -8 },
          { scale: 1.06, y: -2, ease: "none" },
          0
        );
      }

      if (heroImgRef.current) {
        // Fade and drift the hero image so the green gradient takes over
        tl.fromTo(
          heroImgRef.current,
          { opacity: 0.9, y: 0, scale: 1.02 },
          { opacity: 0, y: -24, scale: 1.06, ease: "none" },
          0
        );
      }

      // Animate SVG icons with stagger
      const svgIcons = el.querySelectorAll(".svg-icon-wrapper");
      if (svgIcons.length > 0) {
        tl.fromTo(
          svgIcons,
          { y: 20, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, ease: "back.out(1.7)" },
          0.6
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={root}
      id="origin"
      className="relative h-[100svh] md:h-[100svh] grid place-items-center overflow-clip"
    >
      {/* Image overlay: mobile full-bleed, desktop blended */}
      <div ref={heroImgRef} className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Mobile: ensure full coverage and no bottom band */}
        <Image
          src="/images/banner.png"
          alt="Zolar hero"
          fill
          sizes="100vw"
          priority
          className="object-cover md:hidden"
          style={{ objectPosition: "center top" }}
        />
        {/* Desktop: keep screen blend */}
        <div className="hidden md:block mix-blend-screen">
          <Image src="/images/banner.png" alt="Zolar hero" fill priority className="object-cover" />
        </div>
      </div>
      {/* Welcome Text Overlay */}
      <div className="absolute top-20 left-0 right-0 z-50 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white animate-fade-in">Welcome to Zolar</h1>
      </div>
      {/* Top clean — global background stays black until this section scrolls in */}
      {/* No per-section background; global gradient renders behind */}
      <div className="relative z-10 w-[min(1000px,86vw)] text-center">
        <div className="o-line text-xs tracking-[0.3em] text-white/40 uppercase mb-8 md:mb-12 font-medium">
          Established 2025 — Morocco
        </div>
        <div ref={logoRef} className="mx-auto mb-6 sm:mb-8 w-[160px] sm:w-[220px] will-change-transform">
          <Image src="/images/zolar-wordmark.svg" alt="Zolar wordmark" width={220} height={80} className="w-full h-auto" />
        </div>
        <div className="o-line text-xs tracking-[0.2em] text-white/60 uppercase">
          Drop 01 — Borderline
        </div>
        <h2 className="o-line mt-3 text-5xl md:text-6xl font-semibold text-white">
          Made for Motion
        </h2>
        <p className="o-line mt-4 text-white/70 max-w-2xl mx-auto text-lg">
          Premium streetwear crafted in Casablanca. Where North African heritage 
          meets contemporary design. First drop, infinite possibilities.
        </p>
        
        {/* Bottom SVG Icons */}
        <div className="o-line mt-8 md:mt-12 flex justify-center items-center gap-12 md:gap-16">
          {/* SVG Icon 1 */}
          <div className="svg-icon-wrapper opacity-0 transform translate-y-4">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white/80 hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274.72 182.92">
                <path fill="currentColor" d="M71.8,154.02h132.2s-58.4-4.8-132.2,0Z"/>
                <path fill="currentColor" d="M225.24,48.79c0-7.36-5.67-13.33-12.66-13.33s-12.66,5.97-12.66,13.33,5.24,12.86,11.86,13.29c-9.33,13.06-41.56,53.37-60.11,16.08l-11.72-33.85c6.14-.92,10.87-6.46,10.87-13.18,0-7.36-5.67-13.33-12.66-13.33s-12.66,5.97-12.66,13.33c0,6.71,4.71,12.25,10.83,13.18-5.82,18.83-26.71,75.82-55.77,35.4l-15.58-17.93c5.62-1.36,9.82-6.65,9.82-12.98,0-7.36-5.67-13.33-12.66-13.33s-12.66,5.97-12.66,13.33,5.67,13.33,12.66,13.33c.81,0,1.6-.09,2.37-.24l5.38,62.74-.47-9.5,1.66-4.25,10.6,11.1-5.35,6.85-4.75-5.8-1.68,1.61,1.85,21.55,133.6-1.32,1.87-17.84-2.46,2.46-6.79-8.97,5.96-8.34,4.33,4.88,5.75-55.01c6.32-.74,11.24-6.39,11.24-13.24ZM102.38,130.13l-6.96-10.68,6.96-8.58,8.28,11.07-8.28,8.2ZM138.48,131.87l-13.5-16.4,13.5-16.15,12.34,16.27-12.34,16.27ZM171.52,129.47l-6.79-8.97,5.96-8.34,8.53,9.61-7.7,7.7Z"/>
              </svg>
            </div>
            
          {/* SVG Icon 2 */}
          <div className="svg-icon-wrapper opacity-0 transform translate-y-4">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white/80 hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274.72 182.92">
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M75.27,37.73v90.02s31.08-18.07,63.67,0V36.72s-18.79-19.72-63.67,1.01Z"/>
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M84.85,129.15s40.11-.59,47.12,1.52c0,0,3.04-1.18-2.2-2.53s-40.53-2.2-41.63-1.44-1.94-.25-3.29,2.45Z"/>
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M70.07,42.42v92.39h68.87v8.28H63.49V46.64s1.39-3.72,6.59-4.22Z"/>
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M202.61,37.73v90.02s-31.08-18.07-63.67,0v-46.49s0-44.55,0-44.55c0,0,18.79-19.72,63.67,1.01Z"/>
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M193.03,129.15s-40.11-.59-47.12,1.52c0,0-3.04-1.18,2.2-2.53s40.53-2.2,41.63-1.44,1.94-.25,3.29,2.45Z"/>
                <path fill="currentColor" stroke="currentColor" strokeMiterlimit="10" d="M207.81,42.42v92.39h-68.87s0,8.28,0,8.28h75.45s0-96.44,0-96.44c0,0-1.39-3.72-6.59-4.22Z"/>
              </svg>
            </div>
            
          {/* SVG Icon 3 */}
          <div className="svg-icon-wrapper opacity-0 transform translate-y-4">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white/80 hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274.72 182.92">
                <rect fill="currentColor" x="162.91" y="102.43" width="44.85" height="11.21" rx="5.61" ry="5.61" transform="translate(202.85 321.85) rotate(-124.92)"/>
                <path fill="currentColor" d="M181.71,118.05s-2.24,11.3,2.74,18.36h11.96s-14.7-18.36-14.7-18.36Z"/>
                <rect fill="currentColor" x="99.02" y="47.11" width="44.85" height="11.21" rx="5.61" ry="5.61" transform="translate(8.7 122.12) rotate(-55.08)"/>
                <rect fill="currentColor" x="66.96" y="102.43" width="44.85" height="11.21" rx="5.61" ry="5.61" transform="translate(-50.36 119.48) rotate(-55.08)"/>
                <path fill="currentColor" d="M115.85,47.03l23.09-31.48v-7.72s-3.49-2.82-7.48,2.66c-3.99,5.48-20.76,25.75-18.52,32.97.01.33.09,1.32.83,2.24.77.96,1.76,1.25,2.08,1.33Z"/>
                <path fill="currentColor" d="M112.32,54.05l-26.41,44.44s-4.98-3.82,1.66-17.61c6.64-13.79,10.8-23.84,24.75-26.83Z"/>
                <path fill="currentColor" d="M87.44,151.52s-35.38,2.87-28.41-6.98c6.98-9.84,21.68-36.51,21.68-36.51-5.01,1.57-8.62,3.68-10.87,5.2-15.34,10.36-18.35,27.74-18.78,30.52-.43,2.74-.52,5.01-.54,6.44.29,1.51.99,3.92,2.96,5.88.96.96,2.86,3.41,9.91,3.29,14.58-.25,16.07,1.74,24.05-7.85Z"/>
                <rect fill="currentColor" x="130.85" y="47.11" width="44.85" height="11.21" rx="5.61" ry="5.61" transform="translate(197.79 208.58) rotate(-124.92)"/>
                <path fill="currentColor" d="M158.87,47.03l-23.09-31.48v-7.72s3.49-2.82,7.48,2.66c3.99,5.48,20.76,25.75,18.52,32.97-.01.33-.09,1.32-.83,2.24-.77.96-1.76,1.25-2.08,1.33Z"/>
                <path fill="currentColor" d="M162.4,54.05l26.41,44.44s4.98-3.82-1.66-17.61-10.8-23.84-24.75-26.83Z"/>
                <path fill="currentColor" d="M187.28,151.52s35.38,2.87,28.41-6.98c-6.98-9.84-21.68-36.51-21.68-36.51,5.01,1.57,8.62,3.68,10.87,5.2,15.34,10.36,18.35,27.74,18.78,30.52.43,2.74.52,5.01.54,6.44-.29,1.51-.99,3.92-2.96,5.88-.96.96-2.86,3.41-9.91,3.29-14.58-.25-16.07,1.74-24.05-7.85Z"/>
                <polygon fill="currentColor" points="143.47 78.39 122.79 108.03 134.5 107.42 129.51 129.22 150.32 99.19 138.04 99.44 143.47 78.39"/>
                <path fill="currentColor" d="M121.66,65.43l-22.55,41.49s5.36,2.99,14.08-7.48c8.72-10.47,11.09-20.31,8.47-34.01Z"/>
                <path fill="currentColor" d="M93.13,118.05s2.24,11.3-2.74,18.36h-11.96l14.7-18.36Z"/>
                <path fill="currentColor" d="M77.35,138.65l42.28,1.25s12.21,6.31,1.33,11.38l-44.02-1.74s-5.48-4.15.42-10.88Z"/>
                <path fill="currentColor" d="M153.18,65.43l22.55,41.49s-5.36,2.99-14.08-7.48-11.09-20.31-8.47-34.01Z"/>
                <path fill="currentColor" d="M197.5,138.65l-42.28,1.25s-12.21,6.31-1.33,11.38l44.02-1.74s5.48-4.15-.42-10.88Z"/>
                <path fill="currentColor" d="M119.01,136.94s7.27,8.72,17.55,6.98c10.28-1.74,10.86-.66,20.41-5.98,0,0-4.21-2.49-7.59-2.66s-27.46,0-27.46,0l-2.91,1.66Z"/>
                <path fill="currentColor" d="M110.87,152.31l51.5-.66s.83,11.71-14.62,10.38c-15.45-1.33-28.74.11-28.74.11,0,0-8.22-5.09-8.14-9.41"/>
                <path fill="currentColor" d="M136.68,42.26s-7.02,10.96-6.71,11.09,5.86,4.67,8.35,3.55,6.73-4.98,6.73-4.98l-8.37-9.66Z"/>
              </svg>
            </div>
        </div>
      </div>
    </section>
  );
}


