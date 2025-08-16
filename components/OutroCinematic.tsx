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
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerCity, setCustomerCity] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [currentImageBlack, setCurrentImageBlack] = useState<number>(0);
  const [currentImageWhite, setCurrentImageWhite] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"black" | "white">("black");

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
  const SIZE_CHART: Record<string, { chest: number; length: number }> = {
    XS: { chest: 46, length: 66 },
    S: { chest: 49, length: 69 },
    M: { chest: 52, length: 72 },
    L: { chest: 55, length: 74 },
    XL: { chest: 58, length: 76 },
    XXL: { chest: 61, length: 78 },
  };
  const UNIT_PRICE = 299; // MAD - Moroccan Dirham
  const WHATSAPP_NUMBER = "212600000000"; // TODO: replace with real Morocco number
  const IMAGES_BLACK: string[] = ["/images/p8.png", "/images/p9.png"];
  const IMAGES_WHITE: string[] = ["/images/p5.png", "/images/p6.png", "/images/p11.png"];

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
    <section id="outro" ref={root} className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-clip pb-16 md:pb-24">
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
                  Subtotal: <span className="font-medium">{subtotal} MAD</span>
                </div>
                {bothSelected && (
                  <div className="text-emerald-300/90">20% bundle discount: -{discount} MAD</div>
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
                  <div className="relative rounded-2xl overflow-hidden bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMAGES_BLACK[currentImageBlack]} alt="Borderline Black preview" className="w-full h-48 md:h-56 object-cover" />
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
                  <div className="relative rounded-2xl overflow-hidden bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMAGES_WHITE[currentImageWhite]} alt="Spin White preview" className="w-full h-48 md:h-56 object-cover" />
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
                onClick={() => {
                  if (!customerName || !customerCity) {
                    alert("Please fill in all fields!");
                    return;
                  }
                  const chosen: string[] = [];
                  if (selectedBlack) chosen.push(`Borderline Black x${qtyBlack} (Size ${sizeBlack})`);
                  if (selectedWhite) chosen.push(`Spin White x${qtyWhite} (Size ${sizeWhite})`);
                  const discountLine = bothSelected ? `\nBundle discount: -${discount} MAD (20% off)` : "";
                  const msg = `🛍️ *New Order from Zolar*\n\n👤 *Customer:* ${customerName}\n📍 *City:* ${customerCity}\n\n📦 *Products:*\n${chosen.join("\n")}\n\n💰 *Pricing:*\nSubtotal: ${subtotal} MAD${discountLine}\n*Total: ${total} MAD*\n\n✨ Thank you for choosing Zolar!`;
                  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
                  window.open(url, "_blank");
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
    </section>
  );
}


