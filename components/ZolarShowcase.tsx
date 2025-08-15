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

// Mobile Product Story Component - Interactive flip card with storytelling
function MobileProductStory({ product, index }: { product: Product; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const storyCardRef = useRef<HTMLDivElement>(null);

  // Story content for front/back
  const storyContent = {
    borderline: {
      front: {
        title: "The Night Vision",
        story: "Born in LA's underground scene, where neon meets shadow.",
        details: ["Glow-in-dark edges", "Heavyweight cotton", "Street-ready cut"],
        mood: "For those who stand out in the dark"
      },
      back: {
        title: "Borderline Philosophy",
        story: "More than a print—it's a statement about living on the edge.",
        details: ["Hand-printed locally", "Limited run", "Each piece unique"],
        mood: "Where boundaries blur, style emerges"
      }
    },
    spin: {
      front: {
        title: "Kinetic Energy",
        story: "Inspired by motion, designed for movement.",
        details: ["Dual-tone gradient", "Breathable fabric", "Athletic fit"],
        mood: "Keep spinning, keep winning"
      },
      back: {
        title: "Purpose in Motion",
        story: "Every rotation has meaning, every move has purpose.",
        details: ["Screen-printed art", "Soft premium cotton", "Versatile style"],
        mood: "Find your purpose, spin your story"
      }
    }
  };

  const story = product.id === "borderline-black" ? storyContent.borderline : storyContent.spin;
  // We show fixed content per side; flip controls which side is visible

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Animate rotationY so it doesn't conflict with other GSAP transforms
  useLayoutEffect(() => {
    const el = storyCardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotationY: isFlipped ? 180 : 0,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 1200,
      force3D: true,
    });
  }, [isFlipped]);

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
    <div ref={cardRef} className="mobile-story-wrapper relative h-[85vh] px-4 py-8">
      {/* 3D Flip Card Container */}
      <div className="story-card-container relative h-full perspective-1000">
        <div ref={storyCardRef} className={`story-card relative w-full h-full transform-style-3d`}>
          
          {/* Front Side */}
          <div className="story-side story-front absolute inset-0 backface-hidden">
            <div className={`relative h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ${product.theme.ringClass} bg-black/60`}>
              {/* Product Image */}
              <div className="absolute inset-0">
                <Image 
                  src={product.image} 
                  alt={`${product.name} front`} 
                  fill 
                  sizes="100vw" 
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
              
              {/* Story Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Top: Flip hint */}
                <div className="text-right">
                  <button 
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm"
                  >
                    <span>Flip to back</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {/* Bottom: Story content */}
                <div className="story-content">
                  <p className={`text-xs uppercase tracking-[0.3em] ${product.theme.accentTextClass} mb-2`}>
                    {product.subtitle}
                  </p>
                  <h3 className="text-4xl font-bold text-white mb-3">{story.front.title}</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-4">{story.front.story}</p>
                  
                  {/* Story details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.front.details.map((detail, i) => (
                      <span key={i} className="story-detail px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs text-white/80">
                        {detail}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-white/60 italic">{story.front.mood}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back Side */}
          <div className="story-side story-back absolute inset-0 backface-hidden rotate-y-180">
            <div className={`relative h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ${product.theme.ringClass} bg-black/80 backdrop-blur`}>
              {/* Back view image */}
              <div className="absolute inset-0">
                {product.backImage ? (
                  <Image 
                    src={product.backImage} 
                    alt={`${product.name} back`} 
                    fill 
                    sizes="100vw" 
                    className="object-cover opacity-40"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              
              {/* Back content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Top: Flip back */}
                <div className="text-right">
                  <button 
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm"
                  >
                    <span>Flip to front</span>
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {/* Middle: Back story */}
                <div className="story-content">
                  <h3 className="text-3xl font-bold text-white mb-3">{story.back.title}</h3>
                  <p className="text-white/90 text-base leading-relaxed mb-4">{story.back.story}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {story.back.details.map((detail, i) => (
                      <span key={i} className="story-detail px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs text-white/80">
                        {detail}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-white/60 italic mb-6">{story.back.mood}</p>
                  
                  {/* Size selection */}
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 font-medium">Select your size:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            selectedSize === size
                              ? `${product.theme.buttonClass} border-transparent scale-105`
                              : "border-white/20 bg-black/40 text-white hover:border-white/40"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Bottom: Price and order */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-white/60">Limited edition</p>
                    <p className="text-4xl font-bold text-white">$45</p>
                  </div>
                  <button
                    onClick={handleWhatsAppOrder}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${product.theme.buttonClass} shadow-lg hover:scale-105`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    image: "/images/p8.png",
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
    image: "/images/p5.png",
    backImage: "/images/p6.png", // Back view
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
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pb-16 md:pb-36 space-y-16 md:space-y-40">
        {products.map((product, idx) => {
          const align = product.align ?? (idx % 2 === 0 ? "left" : "right");
          const isLeft = align === "left";
          const copyLift = idx === 1 ? " md:-translate-y-72 lg:-translate-y-80" : "";
          const mediaLift = idx === 1 ? " md:translate-y-40 lg:translate-y-48" : "";
          return (
            <article key={product.id} id={product.id} className="gta-item mobile-product-story">
              {/* Mobile Layout - Story Card */}
              <div className="md:hidden">
                <MobileProductStory product={product} index={idx} />
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-6 md:gap-10 items-center">
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


