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
  const [selectedWhite, setSelectedWhite] = useState<boolean>(false);
  const [sizeBlack, setSizeBlack] = useState<string>("M");
  const [sizeWhite, setSizeWhite] = useState<string>("M");
  const [qtyBlack, setQtyBlack] = useState<number>(1);
  const [qtyWhite, setQtyWhite] = useState<number>(1);
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerCity, setCustomerCity] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [currentImageBlack, setCurrentImageBlack] = useState<number>(0);
  const [currentImageWhite, setCurrentImageWhite] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"black" | "white">("black");
  const [fullscreenData, setFullscreenData] = useState<{isOpen: boolean, product: "black" | "white", imageIndex: number} | null>(null);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (fullscreenData?.isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [fullscreenData?.isOpen]);

  const SIZES = ["S", "M", "L", "XL"] as const;
  const SIZE_CHART: Record<string, { chest: number; length: number }> = {
    XS: { chest: 46, length: 66 },
    S: { chest: 49, length: 69 },
    M: { chest: 52, length: 72 },
    L: { chest: 55, length: 74 },
    XL: { chest: 58, length: 76 },
    XXL: { chest: 61, length: 78 },
  };
  const UNIT_PRICE = 299; // MAD - Moroccan Dirham
  const WHATSAPP_NUMBER = "212663406326"; // Morocco WhatsApp number
  const IMAGES_BLACK: string[] = ["/frontartblack.png", "/black-front.png", "/black-back.png", "/3 (1).png"];
  const IMAGES_WHITE: string[] = ["/whiteartback.png", "/white-front.png", "/white-back.png"];

  const bothSelected = selectedBlack && selectedWhite;
  const subtotal = UNIT_PRICE * (selectedBlack ? qtyBlack : 0) + UNIT_PRICE * (selectedWhite ? qtyWhite : 0);
  const discount = bothSelected ? Math.round(subtotal * 0.15) : 0;
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
    <section id="outro" ref={root} className="relative min-h-[90vh] md:min-h-screen lg:min-h-[110vh] xl:min-h-[120vh] flex flex-col justify-center items-center px-4 lg:px-8 xl:px-12 overflow-clip pb-8 md:pb-24 lg:pb-32 xl:pb-40">
      {/* Title and CTA moved to top */}
      <div className="out-text text-center mb-8 lg:mb-12 xl:mb-16 relative z-10">
        <div className="font-mono text-xs md:text-sm lg:text-base tracking-[0.3em] text-emerald-400/80 mb-4 lg:mb-6">
          Final Collection Drop
        </div>
        <h3 className="font-display text-4xl md:text-5xl text-white text-glow mb-6 lg:mb-8">
          Borderline — Limited Release
        </h3>
        <p className="font-body text-white/90 text-lg md:text-xl">Secure Yours</p>
      </div>
      
      {/* Product selection panel without outer container */}
      <div className="w-[min(1100px,90vw)] lg:w-[min(1300px,85vw)] xl:w-[min(1500px,80vw)] mx-auto">
        <div className="rounded-2xl lg:rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl p-5 md:p-7 lg:p-9 xl:p-12 grid gap-4 lg:gap-6 xl:gap-8">
            {/* Summary row (top right) */}
            <div className="flex items-start justify-between">
              <div className="text-white/70 text-xs md:text-sm">Buy both and save <span className="text-emerald-300">15%</span></div>
              <div className="text-right text-white text-sm">
                <div>
                  Subtotal: <span className="font-medium">{subtotal} MAD</span>
                </div>
                {bothSelected && (
                  <div className="text-emerald-300/90">15% bundle discount: -{discount} MAD</div>
                )}
                <div className="text-base md:text-lg font-semibold">Total: {total} MAD</div>
              </div>
            </div>

            {/* Mobile: segmented toggle between products */}
            <div className="md:hidden">
              <div className="flex items-center justify-center mb-3">
                <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/20">
                  <button
                    type="button"
                    onClick={() => setActiveTab("black")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeTab === "black" ? "bg-white text-black" : "text-white/80 hover:text-white"}`}
                  >
                    Borderline Black
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("white")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeTab === "white" ? "bg-white text-black" : "text-white/80 hover:text-white"}`}
                  >
                    Spin White
                  </button>
                </div>
              </div>
            </div>

            {/* Product blocks */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Black product block */}
              <div className={`rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-4 md:p-5 transition-all hover:bg-white/10 ${selectedBlack ? "" : "opacity-60"} ${activeTab === "black" ? "" : "hidden md:block"}`}>
                <div className="flex flex-col gap-3">
                  {/* Inline product gallery */}
                  <div className="relative rounded-2xl overflow-hidden bg-black/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMAGES_BLACK[currentImageBlack]} alt="Borderline Black preview" className="w-full h-48 md:h-56 object-cover" />
                    
                    {/* Fullscreen Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFullscreenData({isOpen: true, product: "black", imageIndex: currentImageBlack});
                      }}
                      className="absolute top-2 right-2 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
                      aria-label="View fullscreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>

                    {/* Price Tag */}
                    <div className="absolute bottom-2 left-2 bg-emerald-500 text-black px-2 py-1 rounded-lg text-sm font-bold">
                      {UNIT_PRICE} MAD
                    </div>

                    {IMAGES_BLACK.length > 1 && (
                      <>
                        <button aria-label="Previous image" onClick={() => setCurrentImageBlack((i) => (i - 1 + IMAGES_BLACK.length) % IMAGES_BLACK.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button aria-label="Next image" onClick={() => setCurrentImageBlack((i) => (i + 1) % IMAGES_BLACK.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {IMAGES_BLACK.map((src, i) => (
                      <button key={`thumb-b-${i}`} onClick={() => setCurrentImageBlack(i)} className={`rounded-xl overflow-hidden ring-1 transition ${i === currentImageBlack ? "ring-white/60" : "ring-white/10 hover:ring-white/30"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="thumbnail" className="w-12 h-12 object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-white font-medium">Borderline Black</div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={selectedBlack}
                        onClick={() => setSelectedBlack((v) => !v)}
                        className={`group flex items-center gap-2 text-xs px-2 py-1 rounded-full border transition ${selectedBlack ? "bg-emerald-400/90 text-black border-transparent" : "bg-black/40 text-white/80 border-white/20"}`}
                      >
                        <span className={`relative inline-block w-6 h-3 rounded-full ${selectedBlack ? "bg-black/70" : "bg-white/20"}`}>
                          <span className={`absolute top-0 left-0 h-3 w-3 rounded-full bg-white transition-transform ${selectedBlack ? "translate-x-3" : "translate-x-0"}`}></span>
                        </span>
                        Include
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white/70 text-xs">Size</div>
                        <button
                          type="button"
                          onClick={() => setIsSizeChartOpen(true)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/15 text-[11px] text-white/80 hover:bg-white/10"
                          aria-label="Open size chart"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>
                          Size chart
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                          <button key={`b-${s}`} type="button" onClick={() => setSizeBlack(s)} className={`px-3 py-1.5 rounded-md text-xs border transition ${sizeBlack === s ? "bg-emerald-400 text-black border-transparent" : "bg-black/40 text-white border-white/20 hover:border-white/40"}`}>{s}</button>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px] text-white/70">
                        Chest: {SIZE_CHART[sizeBlack].chest} cm • Length: {SIZE_CHART[sizeBlack].length} cm
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
              <div className={`rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-4 md:p-5 transition-all hover:bg-white/10 ${selectedWhite ? "" : "opacity-60"} ${activeTab === "white" ? "" : "hidden md:block"}`}>
                <div className="flex flex-col gap-3">
                  {/* Inline product gallery */}
                  <div className="relative rounded-2xl overflow-hidden bg-black/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMAGES_WHITE[currentImageWhite]} alt="Spin White preview" className="w-full h-48 md:h-56 object-cover" />
                    
                    {/* Fullscreen Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFullscreenData({isOpen: true, product: "white", imageIndex: currentImageWhite});
                      }}
                      className="absolute top-2 right-2 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
                      aria-label="View fullscreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>

                    {/* Price Tag */}
                    <div className="absolute bottom-2 left-2 bg-sky-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                      {UNIT_PRICE} MAD
                    </div>

                    {IMAGES_WHITE.length > 1 && (
                      <>
                        <button aria-label="Previous image" onClick={() => setCurrentImageWhite((i) => (i - 1 + IMAGES_WHITE.length) % IMAGES_WHITE.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button aria-label="Next image" onClick={() => setCurrentImageWhite((i) => (i + 1) % IMAGES_WHITE.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {IMAGES_WHITE.map((src, i) => (
                      <button key={`thumb-w-${i}`} onClick={() => setCurrentImageWhite(i)} className={`rounded-xl overflow-hidden ring-1 transition ${i === currentImageWhite ? "ring-white/60" : "ring-white/10 hover:ring-white/30"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="thumbnail" className="w-12 h-12 object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-white font-medium">Spin White</div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={selectedWhite}
                        onClick={() => setSelectedWhite((v) => !v)}
                        className={`group flex items-center gap-2 text-xs px-2 py-1 rounded-full border transition ${selectedWhite ? "bg-sky-400/90 text-black border-transparent" : "bg-black/40 text-white/80 border-white/20"}`}
                      >
                        <span className={`relative inline-block w-6 h-3 rounded-full ${selectedWhite ? "bg-black/70" : "bg-white/20"}`}>
                          <span className={`absolute top-0 left-0 h-3 w-3 rounded-full bg-white transition-transform ${selectedWhite ? "translate-x-3" : "translate-x-0"}`}></span>
                        </span>
                        Include
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white/70 text-xs">Size</div>
                        <button
                          type="button"
                          onClick={() => setIsSizeChartOpen(true)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/15 text-[11px] text-white/80 hover:bg-white/10"
                          aria-label="Open size chart"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>
                          Size chart
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                          <button key={`w-${s}`} type="button" onClick={() => setSizeWhite(s)} className={`px-3 py-1.5 rounded-md text-xs border transition ${sizeWhite === s ? "bg-sky-400 text-black border-transparent" : "bg-black/40 text-white border-white/20 hover:border-white/40"}`}>{s}</button>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px] text-white/70">
                        Chest: {SIZE_CHART[sizeWhite].chest} cm • Length: {SIZE_CHART[sizeWhite].length} cm
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
                  if (!selectedBlack && !selectedWhite) {
                    alert("Please select at least one product!");
                    return;
                  }
                  setShowOrderForm(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/></svg>
                Order via WhatsApp
              </button>
            </div>
          </div>
      </div>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-black ring-1 ring-white/10 text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h4 className="text-lg font-semibold">Size Chart</h4>
              <button aria-label="Close size chart" onClick={() => setIsSizeChartOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="text-sm text-white/70 mb-3">Measurements are taken flat across the garment. For best fit, compare with a tee you own.</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-white/70">
                    <tr>
                      <th className="text-left py-2 pr-4 font-medium">Size</th>
                      <th className="text-left py-2 pr-4 font-medium">Chest (cm)</th>
                      <th className="text-left py-2 font-medium">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {SIZES.map((s) => (
                      <tr key={`row-${s}`}>
                        <td className="py-2 pr-4">{s}</td>
                        <td className="py-2 pr-4">{SIZE_CHART[s].chest}</td>
                        <td className="py-2">{SIZE_CHART[s].length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setIsSizeChartOpen(false)} className="w-full mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphic Order Form Popup */}
      {showOrderForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Complete Your Order</h3>
            
            {/* Order Summary */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <h4 className="text-sm text-white/60 uppercase tracking-wider mb-3">Order Details</h4>
              {selectedBlack && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Borderline Black (Size {sizeBlack})</span>
                  <span className="text-white">x{qtyBlack} = {qtyBlack * UNIT_PRICE} MAD</span>
                </div>
              )}
              {selectedWhite && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Spin White (Size {sizeWhite})</span>
                  <span className="text-white">x{qtyWhite} = {qtyWhite * UNIT_PRICE} MAD</span>
                </div>
              )}
              {bothSelected && (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                  <span className="text-emerald-300">Bundle Discount (20%)</span>
                  <span className="text-emerald-300">-{discount} MAD</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-white font-bold text-lg">{total} MAD</span>
              </div>
            </div>

            {/* Customer Info Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">City</label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Enter your city"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOrderForm(false);
                  setCustomerName("");
                  setCustomerCity("");
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!customerName || !customerCity) {
                    alert("Please fill in all fields!");
                    return;
                  }

                  // Prepare order data for Brevo
                  const orderData = {
                    customerName,
                    customerCity,
                    selectedProducts: {
                      borderlineBlack: selectedBlack ? {
                        selected: true,
                        size: sizeBlack,
                        quantity: qtyBlack
                      } : undefined,
                      spinWhite: selectedWhite ? {
                        selected: true,
                        size: sizeWhite,
                        quantity: qtyWhite
                      } : undefined
                    },
                    orderTotal: total,
                    subtotal: subtotal,
                    discount: discount
                  };

                  try {
                    // Send data to Brevo first
                    const response = await fetch('/api/submit-order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(orderData)
                    });

                    if (!response.ok) {
                      console.warn('Failed to send data to Brevo, but continuing with WhatsApp...');
                    }
                  } catch (error) {
                    console.warn('Error sending to Brevo:', error);
                    // Continue with WhatsApp even if Brevo fails
                  }

                  // Prepare WhatsApp message
                  const chosen: string[] = [];
                  if (selectedBlack) chosen.push(`Borderline Black x${qtyBlack} (Size ${sizeBlack})`);
                  if (selectedWhite) chosen.push(`Spin White x${qtyWhite} (Size ${sizeWhite})`);
                  const discountLine = bothSelected ? `\nBundle discount: -${discount} MAD (20% off)` : "";
                  const msg = `Hi! I want to order from Zolar:\n\n📦 Products:\n${chosen.join("\n")}\n\n💰 Total: ${total} MAD${discountLine ? `\n(Bundle discount applied: -${discount} MAD)` : ""}\n\n👤 Name: ${customerName}\n📍 City: ${customerCity}\n\nPlease confirm availability and delivery details. Thank you!`;
                  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
                  
                  // Open WhatsApp
                  window.open(url, "_blank");
                  
                  // Clear form
                  setShowOrderForm(false);
                  setCustomerName("");
                  setCustomerCity("");
                }}
                className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  customerName && customerCity
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Gallery Modal */}
      {fullscreenData?.isOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setFullscreenData(null);
            }
          }}
          onTouchMove={(e) => e.preventDefault()}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFullscreenData(null);
            }}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
            aria-label="Close fullscreen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Fullscreen Image Container */}
          <div 
            className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={fullscreenData.product === "black" 
                  ? IMAGES_BLACK[fullscreenData.imageIndex] 
                  : IMAGES_WHITE[fullscreenData.imageIndex]
                } 
                alt={`${fullscreenData.product === "black" ? "Borderline Black" : "Spin White"} - Fullscreen`} 
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>

            {/* Navigation Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              {/* Product Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
                <button 
                  onClick={() => setFullscreenData({isOpen: true, product: "black", imageIndex: currentImageBlack})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    fullscreenData.product === "black" 
                      ? 'bg-emerald-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Borderline Black
                </button>
                <button
                  onClick={() => setFullscreenData({isOpen: true, product: "white", imageIndex: currentImageWhite})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    fullscreenData.product === "white" 
                      ? 'bg-sky-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Spin White
                </button>
              </div>

              {/* Image Navigation */}
              {((fullscreenData.product === "black" && IMAGES_BLACK.length > 1) || 
                (fullscreenData.product === "white" && IMAGES_WHITE.length > 1)) && (
                <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
                  <button
                    onClick={() => {
                      if (fullscreenData.product === "black") {
                        const newIndex = (fullscreenData.imageIndex - 1 + IMAGES_BLACK.length) % IMAGES_BLACK.length;
                        setCurrentImageBlack(newIndex);
                        setFullscreenData({...fullscreenData, imageIndex: newIndex});
                      } else {
                        const newIndex = (fullscreenData.imageIndex - 1 + IMAGES_WHITE.length) % IMAGES_WHITE.length;
                        setCurrentImageWhite(newIndex);
                        setFullscreenData({...fullscreenData, imageIndex: newIndex});
                      }
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      if (fullscreenData.product === "black") {
                        const newIndex = (fullscreenData.imageIndex + 1) % IMAGES_BLACK.length;
                        setCurrentImageBlack(newIndex);
                        setFullscreenData({...fullscreenData, imageIndex: newIndex});
                      } else {
                        const newIndex = (fullscreenData.imageIndex + 1) % IMAGES_WHITE.length;
                        setCurrentImageWhite(newIndex);
                        setFullscreenData({...fullscreenData, imageIndex: newIndex});
                      }
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Image Counter */}
              <div className="bg-black/70 backdrop-blur-md rounded-full border border-white/20 px-4 py-2">
                <span className="text-sm text-white/80">
                  {fullscreenData.imageIndex + 1} / {fullscreenData.product === "black" ? IMAGES_BLACK.length : IMAGES_WHITE.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


