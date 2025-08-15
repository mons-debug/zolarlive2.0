"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = { video?: string; imageFallback?: string; ctaHref?: string };

export default function OutroCinematic({
  video = "/videos/outro-loop.mp4",
  imageFallback = "/images/zolar-borderline-black.jpg",
  ctaHref = "/checkout",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [selectedBlack, setSelectedBlack] = useState<boolean>(true);
  const [selectedWhite, setSelectedWhite] = useState<boolean>(true);
  const [sizeBlack, setSizeBlack] = useState<string>("M");
  const [sizeWhite, setSizeWhite] = useState<string>("M");
  const [qtyBlack, setQtyBlack] = useState<number>(1);
  const [qtyWhite, setQtyWhite] = useState<number>(1);

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
  const UNIT_PRICE = 45; // USD – adjust if needed
  const WHATSAPP_NUMBER = "1234567890"; // TODO: replace with real number

  const bothSelected = selectedBlack && selectedWhite;
  const subtotal = UNIT_PRICE * (selectedBlack ? qtyBlack : 0) + UNIT_PRICE * (selectedWhite ? qtyWhite : 0);
  const discount = bothSelected ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - discount;

  useEffect(() => {
    const el = root.current;
    if (!el || typeof window === "undefined") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      el.querySelector(".out-text"),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 40%",
          scrub: reduce ? false : 0.6,
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section id="outro" ref={root} className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-clip">
      {/* Title and CTA moved to top */}
      <div className="out-text text-center mb-8">
        <h3 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Borderline — Limited Release
        </h3>
        <p className="text-white/60 text-lg">Secure Yours</p>
      </div>
      
      {/* Product selection panel without outer container */}
      <div className="w-[min(1100px,90vw)] mx-auto">
        <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl p-5 md:p-7 grid gap-4">
            {/* Summary row (top right) */}
            <div className="flex items-start justify-between">
              <div className="text-white/70 text-xs md:text-sm">Buy both and save <span className="text-emerald-300">20%</span></div>
              <div className="text-right text-white text-sm">
                <div>
                  Subtotal: $<span className="font-medium">{subtotal}</span>
                </div>
                {bothSelected && (
                  <div className="text-emerald-300/90">20% bundle discount: -${discount}</div>
                )}
                <div className="text-base md:text-lg font-semibold">Total: ${total}</div>
              </div>
            </div>

            {/* Two product blocks side-by-side with larger images */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Black product block */}
              <div className={`rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-4 md:p-5 transition-all hover:bg-white/10 ${selectedBlack ? "" : "opacity-60"}`}>
                <div className="flex items-center gap-3 md:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/p8.png" alt="Borderline Black" className="h-24 w-24 md:h-32 md:w-32 rounded-2xl object-cover shadow" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-white font-medium">Borderline Black</div>
                      <label className="flex items-center gap-2 text-xs text-white/70">
                        <input type="checkbox" className="h-4 w-4" checked={selectedBlack} onChange={(e) => setSelectedBlack(e.target.checked)} /> Include
                      </label>
                    </div>
                    <div className="mt-3">
                      <div className="text-white/70 text-xs mb-2">Size</div>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                          <button key={`b-${s}`} type="button" onClick={() => setSizeBlack(s)} className={`px-3 py-1.5 rounded-md text-xs border transition ${sizeBlack === s ? "bg-emerald-400 text-black border-transparent" : "bg-black/40 text-white border-white/20 hover:border-white/40"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" aria-label="decrease" className="px-2 py-1 rounded-md bg-white/10 text-white" onClick={() => setQtyBlack((q) => Math.max(1, q - 1))}>-</button>
                      <span className="min-w-6 text-center text-white">{qtyBlack}</span>
                      <button type="button" aria-label="increase" className="px-2 py-1 rounded-md bg-white text-black" onClick={() => setQtyBlack((q) => q + 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* White product block */}
              <div className={`rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-4 md:p-5 transition-all hover:bg-white/10 ${selectedWhite ? "" : "opacity-60"}`}>
                <div className="flex items-center gap-3 md:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/p5.png" alt="Spin for Purpose White" className="h-24 w-24 md:h-32 md:w-32 rounded-2xl object-cover shadow" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-white font-medium">Spin White</div>
                      <label className="flex items-center gap-2 text-xs text-white/70">
                        <input type="checkbox" className="h-4 w-4" checked={selectedWhite} onChange={(e) => setSelectedWhite(e.target.checked)} /> Include
                      </label>
                    </div>
                    <div className="mt-3">
                      <div className="text-white/70 text-xs mb-2">Size</div>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                          <button key={`w-${s}`} type="button" onClick={() => setSizeWhite(s)} className={`px-3 py-1.5 rounded-md text-xs border transition ${sizeWhite === s ? "bg-sky-400 text-black border-transparent" : "bg-black/40 text-white border-white/20 hover:border-white/40"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" aria-label="decrease" className="px-2 py-1 rounded-md bg-white/10 text-white" onClick={() => setQtyWhite((q) => Math.max(1, q - 1))}>-</button>
                      <span className="min-w-6 text-center text-white">{qtyWhite}</span>
                      <button type="button" aria-label="increase" className="px-2 py-1 rounded-md bg-white text-black" onClick={() => setQtyWhite((q) => q + 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* WhatsApp CTA */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!selectedBlack && !selectedWhite) return;
                  const chosen: string[] = [];
                  if (selectedBlack) chosen.push(`Borderline Black x${qtyBlack} (size ${sizeBlack})`);
                  if (selectedWhite) chosen.push(`Spin for Purpose White x${qtyWhite} (size ${sizeWhite})`);
                  const discountLine = bothSelected ? `\nBundle discount applied: 20%` : "";
                  const msg = `Hi! I'd like to order:\n- ${chosen.join("\n- ")}\nSubtotal: $${subtotal}${discountLine}\nTotal: $${total}`;
                  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
                  window.open(url, "_blank");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:opacity-90"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/></svg>
                Order via WhatsApp
              </button>
            </div>
          </div>
      </div>
    </section>
  );
}


