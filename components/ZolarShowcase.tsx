"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

// GSAP and ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Size options
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Horizontal Carousel Component - Scroll-driven horizontal cards
function HorizontalCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    const carousel = carouselRef.current;
    if (!container || !carousel) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Pin the container and animate horizontal movement
      const totalWidth = (products.length - 1) * 100;
      
      gsap.to(carousel, {
        xPercent: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [products.length]);

  return (
    <div ref={containerRef} className="relative">
      <div className="h-screen flex items-center overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex w-full"
        >
          {products.map((product, index) => (
            <div key={product.id} className="w-full flex-shrink-0 px-4">
              <div className="h-[80vh] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/60 backdrop-blur relative">
                {/* Product Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    sizes="100vw" 
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
                
                {/* Product Info */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className="text-center">
                    <p className={`text-xs uppercase tracking-[0.3em] ${product.theme.accentTextClass} mb-2`}>
                      {product.subtitle}
                    </p>
                    <h3 className="text-4xl font-bold text-white mb-3">{product.name}</h3>
                    <p className="text-white/90 text-base mb-4">{product.description}</p>
                    
                    {/* Features */}
                    <div className="flex justify-center gap-2 mb-6">
                      {product.bullets.slice(0, 2).map((bullet, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs text-white/80">
                          {bullet}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${product.theme.buttonClass} shadow-lg hover:scale-105`}
                      >
                        <span>Shop Now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm">Scroll down to explore</p>
      </div>
    </div>
  );
}



// ProductCard component with size selection
function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    
    const message = `Hi! I want to order the ${product.name} in size ${selectedSize}. Please let me know the price and availability.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="gta-copy h-auto md:h-[72vh] p-4 sm:p-6 md:p-8 rounded-3xl ring-1 ring-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-center">
      {/* Mobile: Compact header with price */}
      <div className="md:hidden flex items-start justify-between mb-3">
        <div>
          {product.subtitle && (
            <p className={`text-xs uppercase tracking-[0.2em] ${product.theme.accentTextClass}`}>{product.subtitle}</p>
          )}
          <h3 className="mt-1 text-2xl font-semibold">{product.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">$45</p>
        </div>
      </div>

      {/* Desktop: Original header */}
      <div className="hidden md:block">
        {product.subtitle && (
          <p className={`text-xs uppercase tracking-[0.2em] ${product.theme.accentTextClass}`}>{product.subtitle}</p>
        )}
        <h3 className="mt-2 text-3xl md:text-5xl font-semibold">{product.name}</h3>
      </div>

      {/* Description - more concise on mobile */}
      <p className="mt-2 md:mt-3 text-white/80 leading-relaxed text-sm md:text-base">{product.description}</p>
      
      {/* Mobile: Horizontal scrolling features */}
      <div className="md:hidden mt-3 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {product.bullets.map((b, i) => (
            <div key={i} className="flex-none px-3 py-1.5 bg-white/5 rounded-full text-xs text-white/70 whitespace-nowrap">
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Bullet list */}
      <ul className="hidden md:block mt-3 list-disc list-inside text-white/70 space-y-1">
        {product.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      
      {/* Size Selection - optimized for mobile */}
      <div className="mt-4">
        <p className="text-xs md:text-sm text-white/80 mb-2 font-medium">Select Size:</p>
        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg border transition font-medium ${
                selectedSize === size
                  ? `${product.theme.buttonClass} border-transparent`
                  : "border-white/20 bg-black/40 text-white hover:border-white/40"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Fixed bottom action */}
      <div className="mt-4 md:mt-4">
        <button
          onClick={handleWhatsAppOrder}
          className={`w-full inline-flex items-center justify-center rounded-full px-4 md:px-5 py-3 text-sm font-medium ring-1 ring-white/10 transition ${product.theme.buttonClass}`}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
          </svg>
          Order via WhatsApp
        </button>
      </div>
    </div>
  );
}

type Product = {
  id: string;
  name: string;
  subtitle?: string; // acts like kicker
  description: string;
  bullets: string[];
  image: string;
  backImage?: string; // Path to back view image
  align?: "left" | "right";
  theme: {
    accentTextClass: string;
    ringClass: string;
    glowShadowClass: string;
    buttonClass: string;
  };
};

const products: Product[] = [
  {
    id: "borderline-black",
    name: "Borderline Black",
    subtitle: "Green glow print",
    description:
      "Our signature black tee with a neon-green border glow. Heavyweight cotton with a matte finish.",
    bullets: [
      "100% cotton heavyweight",
      "Soft hand green neon print",
      "Relaxed, slightly boxy fit",
    ],
    image: "/images/p8.png", // Front view
    backImage: "/images/p9.png", // Back view
    align: "left",
    theme: {
      accentTextClass: "text-emerald-400",
      ringClass: "ring-emerald-500/20",
      glowShadowClass: "shadow-[0_0_100px_0_rgba(16,185,129,0.35)]",
      buttonClass:
        "bg-emerald-400 text-black hover:bg-emerald-300 focus-visible:outline-emerald-400",
    },
  },
  {
    id: "spin-for-purpose-white",
    name: "Spin for Purpose White",
    subtitle: "Blue/Orange print",
    description:
      "Clean white base with kinetic blue and orange spin graphic. Light and breathable for every day.",
    bullets: [
      "Midweight premium cotton",
      "Dual-tone screen print",
      "Standard fit, true to size",
    ],
    image: "/images/p5.png", // Front view - using the provided image
    backImage: "/images/p6.png", // Back view - using the provided image
    align: "right",
    theme: {
      accentTextClass: "text-sky-400",
      ringClass: "ring-sky-500/20",
      glowShadowClass: "shadow-[0_0_100px_0_rgba(56,189,248,0.30)]",
      buttonClass:
        "bg-sky-400 text-black hover:bg-sky-300 focus-visible:outline-sky-400",
    },
  },
];

export default function ZolarShowcase() {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = scopeRef.current;
    const header = headerRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    // Animate header text on entry
    if (header) {
      gsap.fromTo(
        header.querySelectorAll(".shop-word"),
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    const setup = () => {
      const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".gta-item"));
      rows.forEach((row) => {
        const media = row.querySelector(".gta-media") as HTMLElement | null;
        const copy = row.querySelector(".gta-copy") as HTMLElement | null;
        if (!media || !copy) return;

        // Desktop parallax
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            media,
            { yPercent: -12, scale: 1.02 },
            {
              yPercent: 12,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: row,
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
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        // Mobile parallax (lighter)
        mm.add("(max-width: 767px)", () => {
          // Mobile story card animations
          const storyWrapper = row.querySelector(".mobile-story-wrapper") as HTMLElement | null;
          const storyCard = row.querySelector(".story-card") as HTMLElement | null;
          const storyDetails = row.querySelectorAll(".story-detail");
          const storyContent = row.querySelector(".story-content") as HTMLElement | null;

          if (storyWrapper && storyCard) {
            // Card entrance with 3D rotation
            gsap.fromTo(
              storyCard,
              { 
                rotateX: -25,
                rotateY: -10,
                scale: 0.85,
                opacity: 0,
                transformPerspective: 1200
              },
              {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: storyWrapper,
                  start: "top 80%",
                  end: "top 40%",
                  scrub: 1,
                },
              }
            );

            // Story content fade in
            if (storyContent) {
              gsap.fromTo(
                storyContent,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  delay: 0.3,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: storyWrapper,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                  },
                }
              );
            }

            // Story details stagger
            if (storyDetails.length > 0) {
              gsap.fromTo(
                storyDetails,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.4,
                  stagger: 0.1,
                  ease: "back.out(1.7)",
                  scrollTrigger: {
                    trigger: storyWrapper,
                    start: "top 65%",
                    toggleActions: "play none none reverse",
                  },
                }
              );
            }

            // Subtle floating animation while in view
            gsap.to(storyCard, {
              y: -10,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              scrollTrigger: {
                trigger: storyWrapper,
                start: "top 60%",
                end: "bottom 40%",
                toggleActions: "play pause resume pause",
              },
            });
          }

          // Desktop elements (hidden on mobile, but still process for safety)
          if (media) {
            gsap.fromTo(
              media,
              { yPercent: -3, scale: 1.0 },
              {
                yPercent: 3,
                scale: 1.01,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          if (copy) {
            gsap.fromTo(
              copy,
              { y: 10 },
              {
                y: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
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
    <section ref={scopeRef} aria-label="Zolar product showcase" className="relative">
      {/* Animated section header */}
      <div ref={headerRef} className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-16 md:pt-24 pb-8 md:pb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          <span className="shop-word inline-block">Shop</span>{" "}
          <span className="shop-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Collection</span>
        </h2>
        <p className="mt-4 text-white/60 text-lg">
          <span className="shop-word inline-block">Limited</span>{" "}
          <span className="shop-word inline-block">Drop</span>{" "}
          <span className="shop-word inline-block">01</span>
        </p>
      </div>

      {/* Mobile Horizontal Carousel */}
      <div className="md:hidden">
        <HorizontalCarousel products={products} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 mx-auto max-w-7xl px-4 md:px-8 pb-16 md:pb-36 space-y-16 md:space-y-40">
        {products.map((product, idx) => {
          const align = product.align ?? (idx % 2 === 0 ? "left" : "right");
          const isLeft = align === "left";
          const copyLift = idx === 1 ? " md:-translate-y-72 lg:-translate-y-80" : "";
          const mediaLift = idx === 1 ? " md:translate-y-40 lg:translate-y-48" : "";
          return (
            <article key={product.id} id={product.id} className="gta-item">
              <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-center">
                {/* Media */}
                <div className={(isLeft ? "md:col-span-7 order-1" : "md:col-start-6 md:col-span-7 order-1") + mediaLift}>
                  <div className={`gta-media relative overflow-hidden rounded-3xl shadow-2xl ring-1 ${product.theme.ringClass} bg-black/60` } aria-label={`${product.name} media`}>
                    <div className="h-[45vh] md:h-[72vh]">
                      <Image src={product.image} alt={`${product.name} — ${product.subtitle ?? product.name}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px" className="object-cover" priority={idx===0} />
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className={(isLeft ? "md:col-start-9 md:col-span-4 order-2" : "md:col-start-1 md:col-span-4 order-2") + copyLift}>
                  <ProductCard product={product} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


