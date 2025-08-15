"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MACRO = [
  {
    img: "/images/IMG_9627.jpg",
    title: "Seams",
    body: "Durable ribbing and reinforced seams built to last.",
  },
  {
    img: "/images/IMG_9620.jpg",
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

    const mm = gsap.matchMedia();

    // Desktop animations with proper scroll-based animation
    mm.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".m-card");
      
      // Create a timeline that's scrubbed with scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          scrub: 0.5,
        }
      });
      
      // Add animations to timeline
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { 
            y: 80, 
            opacity: 0,
            scale: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
          },
          i * 0.1 // Slight stagger
        );
      });
    });

    // Mobile animations - enhanced with parallax and stagger
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".mobile-material-card");
      
      cards.forEach((card) => {
        const bg = card.querySelector(".mobile-material-bg img") as HTMLElement;
        const content = card.querySelector(".mobile-material-content") as HTMLElement;
        const title = card.querySelector(".mobile-material-title") as HTMLElement;
        const text = card.querySelector(".mobile-material-text") as HTMLElement;
        const indicator = card.querySelector(".mobile-material-indicator") as HTMLElement;
        
        // Card entrance with rotation
        gsap.fromTo(
          card,
          { 
            y: 80, 
            opacity: 0,
            rotateX: -15,
            transformPerspective: 1000
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 60%",
              scrub: 0.8,
            },
          }
        );
        
        // Background parallax
        if (bg) {
          gsap.fromTo(
            bg,
            { scale: 1.1, x: "10%" },
            {
              scale: 1.2,
              x: "-10%",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }
        
        // Content slide in from left
        if (content) {
          gsap.fromTo(
            content,
            { x: -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
        
        // Title and text stagger
        if (title && text) {
          gsap.fromTo(
            [title, text],
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
        
        // Indicator grow animation
        if (indicator) {
          gsap.fromTo(
            indicator,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 65%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={root}
      id="materials"
      className="relative z-10 w-[min(1100px,86vw)] mx-auto py-16 md:py-24"
    >
      <div className="text-center mb-12 md:mb-16">
        <h3 className="text-white text-3xl md:text-5xl font-bold mb-3">
          <span className="inline-block animate-fade-up">Materials</span>{" "}
          <span className="inline-block animate-fade-up animation-delay-100">&</span>{" "}
          <span className="inline-block animate-fade-up animation-delay-200">Details</span>
        </h3>
        <p className="text-white/60 text-base md:text-lg animate-fade-up animation-delay-300">
          Crafted with precision, built to last
        </p>
      </div>
      
      {/* Mobile: Scroll-triggered animated cards */}
      <div className="md:hidden">
        <div className="mobile-materials-wrapper space-y-4 px-4">
          {MACRO.map((m, i) => (
            <div
              key={i}
              className="m-card mobile-material-card relative rounded-3xl overflow-hidden"
              style={{ transform: 'translateZ(0)' }} // Hardware acceleration
            >
              {/* Background with parallax */}
              <div className="mobile-material-bg absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.title} className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-48 flex items-center">
                <div className="mobile-material-content p-6 max-w-[70%]">
                  <h4 className="mobile-material-title text-2xl font-bold text-white mb-2">{m.title}</h4>
                  <p className="mobile-material-text text-white/80 text-sm leading-relaxed">{m.body}</p>
                  <div className="mobile-material-indicator mt-3 w-12 h-1 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {MACRO.map((m, i) => (
          <div
            key={i}
            className="m-card rounded-3xl border border-white/10 bg-black/40 backdrop-blur overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.title} className="w-full h-48 md:h-64 object-cover" />
            <div className="p-4 md:p-5">
              <div className="text-white text-xl font-semibold">{m.title}</div>
              <p className="text-white/70 mt-2">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


