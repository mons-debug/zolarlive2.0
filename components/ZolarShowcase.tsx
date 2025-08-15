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

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

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
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-36 space-y-16 md:space-y-40">
        {products.map((product, idx) => {
          const align = product.align ?? (idx % 2 === 0 ? "left" : "right");
          const isLeft = align === "left";
          const copyLift = idx === 1 ? " md:-translate-y-72 lg:-translate-y-80" : "";
          const mediaLift = idx === 1 ? " md:translate-y-40 lg:translate-y-48" : "";
          return (
            <article key={product.id} id={product.id} className="gta-item">
              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Mobile: Full-width image with overlay info */}
                <div className="relative">
                  <div className={`relative overflow-hidden rounded-2xl shadow-xl ring-1 ${product.theme.ringClass} bg-black/60`}>
                    <div className="h-[50vh]">
                      <Image src={product.image} alt={`${product.name} — ${product.subtitle ?? product.name}`} fill sizes="100vw" className="object-cover" priority={idx===0} />
                    </div>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Quick info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className={`text-xs uppercase tracking-[0.2em] ${product.theme.accentTextClass}`}>{product.subtitle}</p>
                      <h3 className="text-2xl font-semibold text-white mt-1">{product.name}</h3>
                      <p className="text-white/80 text-sm mt-2 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                </div>
                {/* Mobile: Compact card below */}
                <div className="mt-4">
                  <ProductCard product={product} />
                </div>
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


