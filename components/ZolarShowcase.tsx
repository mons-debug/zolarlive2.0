"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, useEffect } from "react";

// GSAP and ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Size options
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Size measurements (approx.)
const SIZE_CHART: Record<string, { chest: number; length: number; shoulder: number }> = {
  XS: { chest: 46, length: 66, shoulder: 42 },
  S: { chest: 49, length: 69, shoulder: 44 },
  M: { chest: 52, length: 72, shoulder: 46 },
  L: { chest: 55, length: 74, shoulder: 48 },
  XL: { chest: 58, length: 76, shoulder: 50 },
  XXL: { chest: 61, length: 78, shoulder: 52 },
};

function SizeChartModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-black ring-1 ring-white/10 text-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h4 className="text-lg font-semibold">Size Chart</h4>
          <button aria-label="Close size chart" onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
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
                  <th className="text-left py-2 pr-4 font-medium">Length (cm)</th>
                  <th className="text-left py-2 font-medium">Shoulder (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {SIZES.map((s) => (
                  <tr key={s}>
                    <td className="py-2 pr-4">{s}</td>
                    <td className="py-2 pr-4">{SIZE_CHART[s].chest}</td>
                    <td className="py-2 pr-4">{SIZE_CHART[s].length}</td>
                    <td className="py-2">{SIZE_CHART[s].shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-1 text-white/80 text-sm">
            <p>Model is 180cm wearing size L.</p>
            <p className="text-white/70">Oversize unisex fit – size down if in doubt.</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15">Close</button>
        </div>
      </div>
    </div>
  );
}

// Mobile Carousel Component with scroll-triggered auto-swipe
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MobileCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    const xDiff = Math.abs(e.targetTouches[0].clientX - touchStart);
    const yDiff = Math.abs(e.targetTouches[0].clientY - touchStartY);
    
    // If horizontal movement is greater than vertical, prevent vertical scroll
    if (xDiff > yDiff && xDiff > 10) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    
    setIsDragging(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Cleanup effect to ensure scroll is re-enabled
  useLayoutEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className={`overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'auto' }}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="w-full flex-shrink-0">
              <div className="h-[85vh] bg-black/60 rounded-3xl flex items-center justify-center">
                <p className="text-white">Legacy carousel - now using single card</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Slide count to hint multiple cards */}
      <div className="text-center mt-2 text-white/70 text-sm">
        {currentIndex + 1} of {products.length}
      </div>

      {/* Swipe Hint */}
      <div className="text-center mt-4">
        <p className="text-white/80 text-sm">Swipe to explore • Tap to flip</p>
      </div>
    </div>
  );
}

// Enhanced Mobile Shop Card Component - Single card with inline controls
function MobileShopCard() {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [model, setModel] = useState<'male' | 'female'>('male');
  const [variant, setVariant] = useState<'borderline' | 'spin'>('borderline');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollLockYRef = useRef<number>(0);

  // Set initial gradient to Spin (blue) theme on component mount
  useEffect(() => {
    updateGlobalGradient('spin', 'male');
  }, []);

  // Prevent body scroll when fullscreen is open and preserve scroll position
  useEffect(() => {
    if (isFullscreenOpen) {
      scrollLockYRef.current = window.scrollY || window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollLockYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const restoreY = scrollLockYRef.current || 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      const { style } = document.documentElement;
      const previousBehavior = style.scrollBehavior as string;
      style.scrollBehavior = 'auto';
      requestAnimationFrame(() => {
        window.scrollTo(0, restoreY);
        style.scrollBehavior = previousBehavior || '';
      });
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen]);

  // 📸 MEDIA CONFIGURATION - Easy to update images
  // 
  // 🎯 QUICK START:
  // 1. Open: create-placeholders.html in your browser
  // 2. Download all 8 placeholder images
  // 3. Replace with your photos using the EXACT same filenames
  // 4. Images will automatically appear in the showcase!
  //
  // 📁 File structure: /public/images/placeholders/
  //    ├── borderline-black-male-front.png
  //    ├── borderline-black-male-back.png  
  //    ├── borderline-black-female-front.png
  //    ├── borderline-black-female-back.png
  //    ├── spin-white-male-front.png
  //    ├── spin-white-male-back.png
  //    ├── spin-white-female-front.png
  //    └── spin-white-female-back.png
  
  const productData = {
    borderline: {
      name: "Borderline Black",
      subtitle: "Green glow print",
      description: "Our signature black tee with a neon-green border glow. Heavyweight cotton with a matte finish.",
      theme: {
        accentTextClass: "text-emerald-400",
        ringClass: "ring-emerald-500/20",
        buttonClass: "bg-emerald-400 text-black"
      },
      images: {
        male: { 
          front: "/images/placeholders/borderline-black-male-front.png", 
          back: "/images/placeholders/borderline-black-male-back.png" 
        },
        female: { 
          front: "/images/placeholders/borderline-black-female-front.png",
          back: "/images/placeholders/borderline-black-female-back.png"
        }
      }
    },
    spin: {
      name: "Spin for Purpose White",
      subtitle: "Blue/Orange print",
      description: "Clean white base with kinetic blue and orange spin graphic. Light and breathable for every day.",
      theme: {
        accentTextClass: "text-sky-400",
        ringClass: "ring-sky-500/20",
        buttonClass: "bg-sky-400 text-black"
      },
      images: {
        male: { 
          front: "/images/placeholders/spin-white-male-front.png", 
          back: "/images/placeholders/spin-white-male-back.png" 
        },
        female: { 
          front: "/images/placeholders/spin-white-female-front.png",
          back: "/images/placeholders/spin-white-female-back.png"
        }
      }
    }
  };

  const currentProduct = productData[variant];
  const currentImage = currentProduct.images[model][viewMode];

  // 🌍 Global gradient control effects
  const handleInteractionStart = () => {
    setIsInteracting(true);
    // Subtle gradient pulse on hover/touch
    const docEl = document.documentElement;
    docEl.style.setProperty('--ga1', '0.48');
    docEl.style.setProperty('--ga2', '0.38');
  };

  const handleInteractionEnd = () => {
    setTimeout(() => {
      setIsInteracting(false);
      // Return to enhanced default intensity
      const docEl = document.documentElement;
      docEl.style.setProperty('--ga1', '0.42');
      docEl.style.setProperty('--ga2', '0.32');
    }, 300);
  };

  const updateGlobalGradient = (newVariant: 'borderline' | 'spin', model: 'male' | 'female' = 'male') => {
    const docEl = document.documentElement;
    const gradientBg = document.querySelector('.zolar-gradient-vars');
    
    // Bold colors for male, less colors for female
    const intensity = model === 'male' ? 1.0 : 0.7;
    
    if (newVariant === 'borderline') {
      // Borderline Black Shirt - Green theme
      docEl.style.setProperty('--h1', '150'); // deep emerald green
      docEl.style.setProperty('--h2', '120'); // forest green
      docEl.style.setProperty('--ga1', `${0.55 * intensity}`); // adjusted for model
      docEl.style.setProperty('--ga2', `${0.42 * intensity}`); // adjusted for model
      docEl.style.setProperty('--ga3', `${0.15 * intensity}`); // adjusted for model
    } else {
      // Spin White Shirt - Blue theme  
      docEl.style.setProperty('--h1', '200'); // sky blue
      docEl.style.setProperty('--h2', '230'); // deeper azure blue
      docEl.style.setProperty('--ga1', `${0.55 * intensity}`); // adjusted for model
      docEl.style.setProperty('--ga2', `${0.42 * intensity}`); // adjusted for model
      docEl.style.setProperty('--ga3', `${0.15 * intensity}`); // adjusted for model
    }
    
    // Add wave animation classes
    if (gradientBg) {
      gradientBg.classList.remove('wave-active', 'wave-intense');
      gradientBg.classList.add(model === 'male' ? 'wave-intense' : 'wave-active');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetGlobalGradient = () => {
    const docEl = document.documentElement;
    const gradientBg = document.querySelector('.zolar-gradient-vars');
    
    // Reset to enhanced default blue theme (maintaining consistency)
    docEl.style.setProperty('--h1', '200');
    docEl.style.setProperty('--h2', '230'); 
    docEl.style.setProperty('--ga1', '0.42');
    docEl.style.setProperty('--ga2', '0.32');
    docEl.style.setProperty('--ga3', '0.12');
    
    // Remove wave animations
    if (gradientBg) {
      gradientBg.classList.remove('wave-active', 'wave-intense');
    }
  };

  const handleVariantChange = (newVariant: 'borderline' | 'spin') => {
    setVariant(newVariant);
    updateGlobalGradient(newVariant, model);
    handleInteractionStart();
    // Don't reset - stay in the selected color until next interaction
    setTimeout(() => {
      handleInteractionEnd();
    }, 300);
  };

  const handleToggleChange = (type: 'view' | 'model', value: 'front' | 'back' | 'male' | 'female') => {
    let newModel = model;
    
    if (type === 'view' && (value === 'front' || value === 'back')) {
      setViewMode(value);
    } else if (type === 'model' && (value === 'male' || value === 'female')) {
      setModel(value);
      newModel = value;
    }
    
    // Update gradient with current variant and new model state
    updateGlobalGradient(variant, newModel);
    handleInteractionStart();
    // Don't reset - stay in the selected color/intensity
    setTimeout(() => {
      handleInteractionEnd();
    }, 300);
  };

  const storyContent = {
    borderline: {
      front: { title: "The Night Vision", mood: "For those who stand out" },
      back: { title: "Borderline", mood: "Limited Edition" }
    },
    spin: {
      front: { title: "Kinetic Energy", mood: "Keep spinning" },
      back: { title: "Purpose", mood: "Limited Edition" }
    }
  };

  const currentStory = storyContent[variant][viewMode];

  return (
    <div ref={cardRef} className="mobile-story-wrapper relative h-[85vh] px-4 py-8">
      <div 
        className={`relative h-full rounded-3xl overflow-hidden shadow-2xl ring-1 bg-black/60 transition-all duration-500 ease-out ${
          currentProduct.theme.ringClass
        } ${
          isInteracting 
            ? `ring-2 ${variant === 'borderline' ? 'ring-emerald-400/60' : 'ring-sky-400/60'} shadow-2xl` 
            : ''
        }`}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
      >
              {/* Product Image */}
              <div className="absolute inset-0">
                <Image 
            src={currentImage} 
            alt={`${currentProduct.name} ${viewMode} ${model} tee`} 
                  fill 
                  sizes="100vw" 
            className="object-cover transition-opacity duration-300"
            priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
                  aria-label="View fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
              
        {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
          {/* Top: Inline Controls */}
          <div className="space-y-3">
            {/* Variant Toggle */}
            <div className="flex justify-center">
              <div className="flex gap-4">
                    <button 
                  onClick={() => handleVariantChange('borderline')}
                  className={`flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-semibold transition-all duration-200 ${
                    variant === 'borderline' 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50' 
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="Borderline collection"
                >
                  <Image src="/images/borderline-icon.png" alt="Borderline" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                </button>
                <button
                  onClick={() => handleVariantChange('spin')}
                  className={`flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-semibold transition-all duration-200 ${
                    variant === 'spin' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-1 ring-sky-400/50' 
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="Spin collection"
                >
                  <Image src="/images/spin-icon.png" alt="Spin" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                    </button>
            </div>
          </div>
          
            {/* View & Model Controls - Enhanced Side Layout */}
            <div className="flex justify-between items-center w-full px-2">
              {/* Left Side: Male/Female Toggle */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleToggleChange('model', 'male')}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-full text-xs font-medium transition-all duration-200 ${
                    model === 'male' 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                      : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="Male model fit"
                >
                  <Image src="/images/male.svg" alt="Male" width={24} height={24} className="w-6 h-6 filter brightness-0 invert" />
                </button>
                <button
                  onClick={() => handleToggleChange('model', 'female')}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-full text-xs font-medium transition-all duration-200 ${
                    model === 'female' 
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' 
                      : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="Female model fit"
                >
                  <Image src="/images/female.svg" alt="Female" width={24} height={24} className="w-6 h-6 filter brightness-0 invert" />
                </button>
              </div>
              
              {/* Right Side: Front/Back Toggle */}
              <div className="flex flex-col gap-3">
                  <button 
                  onClick={() => handleToggleChange('view', 'front')}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-full text-xs font-medium transition-all duration-200 ${
                    viewMode === 'front' 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="View front of t-shirt"
                >
                  <Image src="/images/front.svg" alt="Front" width={24} height={24} className="w-6 h-6 filter brightness-0 invert" />
                </button>
                <button
                  onClick={() => handleToggleChange('view', 'back')}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-full text-xs font-medium transition-all duration-200 ${
                    viewMode === 'back' 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white border border-white/20'
                  }`}
                  title="View back of t-shirt"
                >
                  <Image src="/images/back.svg" alt="Back" width={24} height={24} className="w-6 h-6 filter brightness-0 invert" />
                  </button>
              </div>
            </div>
                </div>
                
                    {/* Bottom: Product Info */}
                <div className="story-content">
            <p className={`font-mono text-xs tracking-[0.25em] ${currentProduct.theme.accentTextClass} mb-3`}>
              {currentProduct.subtitle}
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-white mb-3 text-glow">{currentStory.title}</h3>
            <p className="font-body text-sm text-white/70 italic leading-relaxed">{currentStory.mood}</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
            aria-label="Close fullscreen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Fullscreen Image Container */}
          <div className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={currentImage} 
                alt={`${currentProduct.name} ${viewMode} ${model} - Fullscreen`} 
                fill 
                sizes="100vw" 
                className="object-contain"
                priority
              />
    </div>

                        {/* Navigation Controls Overlay - Enhanced Side Layout */}
            <div className="absolute bottom-6 sm:bottom-8 inset-x-6 flex justify-between items-end">
              {/* Left Side: Male/Female Toggle */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleToggleChange('model', 'male')}
                  className={`group relative flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-bold transition-all duration-300 ${
                    model === 'male' 
                      ? 'bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white shadow-2xl shadow-sky-500/50 scale-110 ring-3 ring-sky-300/70' 
                      : 'bg-black/40 text-white/80 hover:bg-black/50 hover:text-white hover:scale-105 backdrop-blur-lg border-2 border-white/40'
                  }`}
                  title="Male model fit"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 mb-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 7V7l-6-1.5V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1.5L4 7v2l6-1.5V22h2v-6h2v6h2V7.5L22 9z"/>
                  </svg>
                  <span className="leading-none text-xs font-bold relative z-10">MALE</span>
                </button>
                <button
                  onClick={() => handleToggleChange('model', 'female')}
                  className={`group relative flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-bold transition-all duration-300 ${
                    model === 'female' 
                      ? 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white shadow-2xl shadow-pink-500/50 scale-110 ring-3 ring-pink-300/70' 
                      : 'bg-black/40 text-white/80 hover:bg-black/50 hover:text-white hover:scale-105 backdrop-blur-lg border-2 border-white/40'
                  }`}
                  title="Female model fit"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 mb-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm1 20h-2v-6H9.5c-.83 0-1.5-.67-1.5-1.5S8.67 15 9.5 15h5c.83 0 1.5.67 1.5 1.5S15.33 17 14.5 17H13v5zm-1-7c-1.1 0-2-.9-2-2V9.5C10 8.12 8.88 7 7.5 7S5 8.12 5 9.5 6.12 12 7.5 12H8v1c0 1.1.9 2 2 2s2-.9 2-2v-1h.5c1.38 0 2.5-1.12 2.5-2.5S12.88 7 11.5 7 9 8.12 9 9.5V13c0 1.1.9 2 2 2z"/>
                  </svg>
                  <span className="leading-none text-xs font-bold relative z-10">FEMALE</span>
                </button>
              </div>

              {/* Right Side: Front/Back Toggle */}
              <div className="flex flex-col gap-4">
              <button
                  onClick={() => handleToggleChange('view', 'front')}
                  className={`group relative flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-bold transition-all duration-300 ${
                    viewMode === 'front' 
                      ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/50 scale-110 ring-3 ring-emerald-300/70' 
                      : 'bg-black/40 text-white/80 hover:bg-black/50 hover:text-white hover:scale-105 backdrop-blur-lg border-2 border-white/40'
                  }`}
                  title="View front of t-shirt"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 mb-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2L7 4v2h1v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6h1V4l-2-2H9zm1 2h4l1 1v1H9V5l1-1zm4 14h-4V6h4v12z"/>
                    <circle cx="10.5" cy="8" r="0.5"/>
                    <circle cx="13.5" cy="8" r="0.5"/>
                  </svg>
                  <span className="leading-none text-xs font-bold relative z-10">FRONT</span>
              </button>
              <button
                  onClick={() => handleToggleChange('view', 'back')}
                  className={`group relative flex flex-col items-center justify-center w-18 h-18 rounded-full text-xs font-bold transition-all duration-300 ${
                    viewMode === 'back' 
                      ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/50 scale-110 ring-3 ring-emerald-300/70' 
                      : 'bg-black/40 text-white/80 hover:bg-black/50 hover:text-white hover:scale-105 backdrop-blur-lg border-2 border-white/40'
                  }`}
                  title="View back of t-shirt"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 mb-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2L7 4v2h1v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6h1V4l-2-2H9zm1 2h4l1 1v1H9V5l1-1zm4 14h-4V6h4v12z"/>
                    <rect x="10" y="7" width="4" height="1" rx="0.5"/>
                    <rect x="10" y="9" width="4" height="1" rx="0.5"/>
                    <rect x="10" y="11" width="4" height="1" rx="0.5"/>
                  </svg>
                  <span className="leading-none text-xs font-bold relative z-10">BACK</span>
              </button>
          </div>

              {/* Variant Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
                            <button
                  onClick={() => handleVariantChange('borderline')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1 ${
                    variant === 'borderline' 
                      ? 'bg-emerald-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                  title="Borderline collection"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Borderline</span>
              </button>
              <button
                  onClick={() => handleVariantChange('spin')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1 ${
                    variant === 'spin' 
                      ? 'bg-sky-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                  title="Spin collection"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Spin</span>
              </button>
          </div>
        </div>
      </div>
        </div>
      )}
        </div>
  );
}

// Desktop Product Showcase - Premium Desktop Experience
function DesktopProductShowcase({ products }: { products: Product[] }) {
  const [highlightedCard, setHighlightedCard] = useState<'borderline' | 'spin'>('borderline');
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const scrollLockYRefDesktop = useRef<number>(0);

  const borderlineProduct = products.find(p => p.id.includes('borderline'));
  const spinProduct = products.find(p => p.id.includes('spin'));

  // Prevent body scroll when fullscreen is open and preserve scroll position
  useEffect(() => {
    if (isFullscreenOpen) {
      scrollLockYRefDesktop.current = window.scrollY || window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollLockYRefDesktop.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const restoreY = scrollLockYRefDesktop.current || 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      const { style } = document.documentElement;
      const previousBehavior = style.scrollBehavior as string;
      style.scrollBehavior = 'auto';
      requestAnimationFrame(() => {
        window.scrollTo(0, restoreY);
        style.scrollBehavior = previousBehavior || '';
      });
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen]);

  return (
    <div className="space-y-16">


      {/* Product Navigation & Controls - Side by Side Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl mx-auto">
        {/* Left Side - Product Showcase Cards */}
        <div className="flex-1 w-full lg:w-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {/* Borderline Card */}
            <div 
              onClick={() => setHighlightedCard('borderline')}
              className={`relative rounded-2xl overflow-hidden backdrop-blur-sm border p-6 transition-all duration-300 w-full max-w-sm cursor-pointer ${
              highlightedCard === 'borderline' 
                  ? 'bg-emerald-500/20 border-emerald-400/40 scale-105 shadow-xl shadow-emerald-500/10' 
                  : 'bg-black/40 border-white/20 opacity-60 hover:opacity-80 hover:scale-102'
              }`}>
              <div className="aspect-[4/5] relative mb-4">
                              <Image 
                  src={highlightedCard === 'borderline' && currentSide === 'back' && borderlineProduct?.backImage 
                    ? borderlineProduct.backImage 
                    : borderlineProduct?.image || "/images/placeholders/borderline-black-male-front.png"}
                  alt={`Borderline Black ${highlightedCard === 'borderline' ? currentSide : 'front'}`}
                  fill 
                  className="object-cover rounded-xl transition-opacity duration-300"
                />
          </div>
              <h3 className="text-xl font-bold text-white mb-2">Borderline Black</h3>
              <p className="text-sm text-white/80 font-medium">Green glow print, premium streetwear</p>
          </div>

            {/* Spin Card */}
            <div 
              onClick={() => setHighlightedCard('spin')}
              className={`relative rounded-2xl overflow-hidden backdrop-blur-sm border p-6 transition-all duration-300 w-full max-w-sm cursor-pointer ${
              highlightedCard === 'spin' 
                  ? 'bg-sky-500/20 border-sky-400/40 scale-105 shadow-xl shadow-sky-500/10' 
                  : 'bg-black/40 border-white/20 opacity-60 hover:opacity-80 hover:scale-102'
              }`}>
              <div className="aspect-[4/5] relative mb-4">
                <Image 
                  src={highlightedCard === 'spin' && currentSide === 'back' && spinProduct?.backImage 
                    ? spinProduct.backImage 
                    : spinProduct?.image || "/images/placeholders/spin-white-male-front.png"}
                  alt={`Spin White ${highlightedCard === 'spin' ? currentSide : 'front'}`}
                  fill 
                  className="object-cover rounded-xl transition-opacity duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Spin White</h3>
              <p className="text-sm text-white/80 font-medium">Blue/orange kinetic print</p>
            </div>
          </div>
        </div>

                {/* Right Side - Controls */}
        <div className="w-full lg:w-auto flex flex-col items-center space-y-6">
          {/* View Toggle - Only Front/Back buttons */}
          {((highlightedCard === 'borderline' && borderlineProduct?.backImage) || (highlightedCard === 'spin' && spinProduct?.backImage)) && (
            <div className="flex flex-col gap-4 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/30 p-3 shadow-2xl">
              <button
                onClick={() => setCurrentSide('front')}
                className={`px-8 py-3 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${
                  currentSide === 'front' 
                    ? 'bg-white text-black shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Front View
              </button>
              <button
                onClick={() => setCurrentSide('back')}
                className={`px-8 py-3 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${
                  currentSide === 'back' 
                    ? 'bg-white text-black shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Back View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Story Section */}
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className={`font-mono text-sm tracking-[0.2em] ${highlightedCard === 'borderline' ? 'text-emerald-400' : 'text-sky-400'} font-medium`}>
          {highlightedCard === 'borderline' ? 'BORDERLINE' : 'SPIN'} — {highlightedCard === 'borderline' ? 'The Night Vision' : 'Kinetic Energy'}
        </div>
        <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
          {highlightedCard === 'borderline' 
            ? 'For those who stand out in the darkness. Premium streetwear with a neon edge that defines the night.'
            : 'Keep spinning, keep moving. Energy in motion, captured in fabric that never stops.'
          }
        </p>
        
        {/* Product Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Premium Quality</h4>
            <p className="text-white/70 text-sm">220 GSM heavyweight cotton with tight stitching</p>
          </div>
          
          <div className="text-center p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Made in Morocco</h4>
            <p className="text-white/70 text-sm">Authentic craftsmanship from local artisans</p>
          </div>
          
          <div className="text-center p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Limited Edition</h4>
            <p className="text-white/70 text-sm">Only 50 units made - exclusive and rare</p>
          </div>
        </div>
        </div>

      {/* Desktop Fullscreen Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-lg flex items-center justify-center p-8">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-8 right-8 z-10 w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/90 transition-all duration-300 shadow-2xl"
            aria-label="Close fullscreen"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Fullscreen Image Container */}
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={highlightedCard === 'borderline' && currentSide === 'back' && borderlineProduct?.backImage 
                  ? borderlineProduct.backImage 
                  : highlightedCard === 'spin' && currentSide === 'back' && spinProduct?.backImage
                  ? spinProduct.backImage
                  : highlightedCard === 'borderline' 
                  ? borderlineProduct?.image || '/images/placeholders/borderline-black-male-front.png'
                  : spinProduct?.image || '/images/placeholders/spin-white-male-front.png'
                } 
                alt={`${highlightedCard === 'borderline' ? 'Borderline Black' : 'Spin White'} ${currentSide} - Fullscreen`} 
                fill 
                sizes="100vw" 
                className="object-contain"
                priority
              />
        </div>

            {/* Navigation Controls Overlay */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
              {/* Product Toggle */}
              <div className="flex bg-black/80 backdrop-blur-xl rounded-2xl border border-white/30 p-2 shadow-2xl">
            <button
                  onClick={() => setHighlightedCard('borderline')}
                  className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${
                    highlightedCard === 'borderline' 
                      ? 'bg-emerald-500 text-black shadow-lg scale-105' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  title="Borderline collection"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Borderline
            </button>
              <button
                  onClick={() => setHighlightedCard('spin')}
                  className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${
                    highlightedCard === 'spin' 
                      ? 'bg-sky-500 text-black shadow-lg scale-105' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  title="Spin collection"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Spin
              </button>
        </div>

              {/* Front/Back Toggle */}
              {((highlightedCard === 'borderline' && borderlineProduct?.backImage) || (highlightedCard === 'spin' && spinProduct?.backImage)) && (
                <div className="flex gap-4">
          <button
                    onClick={() => setCurrentSide('front')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold ring-2 transition-all duration-300 ${
                      currentSide === 'front' 
                        ? 'bg-emerald-500 text-white ring-emerald-400 shadow-lg shadow-emerald-500/25 scale-105' 
                        : 'bg-white/10 text-white ring-white/30 hover:bg-white/20 hover:ring-white/50 backdrop-blur-sm'
                    }`}
                    title="View front of t-shirt"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 2L7 4v2h1v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6h1V4l-2-2H9zm1 2h4l1 1v1H9V5l1-1zm4 14h-4V6h4v12z"/>
                      <circle cx="10.5" cy="8" r="0.5"/>
                      <circle cx="13.5" cy="8" r="0.5"/>
                    </svg>
                    FRONT
          </button>
                  <button
                    onClick={() => setCurrentSide('back')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold ring-2 transition-all duration-300 ${
                      currentSide === 'back' 
                        ? 'bg-emerald-500 text-white ring-emerald-400 shadow-lg shadow-emerald-500/25 scale-105' 
                        : 'bg-white/10 text-white ring-white/30 hover:bg-white/20 hover:ring-white/50 backdrop-blur-sm'
                    }`}
                    title="View back of t-shirt"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 2L7 4v2h1v12c0 1.1.9 2 2 2h4c1.5 0 2-1 2-2.5V4s0-2 4-2zm2 16h-4v4h4v-4zm2-6v6h-2v-6h2zM8 12v6H6v-6h2zm8-1c.5 0 1-.5 1-1V6c0-1-1-2-2-2H9c-1 0-2 1-2 2v4c0 .5.5 1 1 1h8z"/>
                      <rect x="10" y="7" width="4" height="1" rx="0.5"/>
                      <rect x="10" y="9" width="4" height="1" rx="0.5"/>
                      <rect x="10" y="11" width="4" height="1" rx="0.5"/>
                    </svg>
                    BACK
                  </button>
          </div>
              )}
        </div>
      </div>
        </div>
      )}
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
      "220 GSM heavyweight cotton. Glow-in-the-dark green border print. Tight stitching. Made in Morocco.",
    bullets: [
      "220 GSM heavyweight cotton",
      "Glow-in-the-dark green border print",
      "Oversize unisex fit",
      "Made in Morocco",
      "Care: Cold wash, do not iron print",
      "Limited Drop — Only 50 units made",
    ],
    image: "/images/placeholders/borderline-black-male-front.png", // Front view
    backImage: "/images/placeholders/borderline-black-female-back.png", // Back view
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
      "Premium cotton. Kinetic blue/orange spin graphic. Tight stitching. Made in Morocco.",
    bullets: [
      "Premium cotton",
      "Glow-in-the-dark spin details",
      "Oversize unisex fit",
      "Made in Morocco",
      "Care: Cold wash, do not iron print",
      "Limited Drop — Only 50 units made",
    ],
    image: "/images/placeholders/spin-white-male-front.png", // Front view
    backImage: "/images/placeholders/spin-white-male-back.png", // Back view
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

    // Set header text visible immediately, then enhance on scroll
    if (header) {
      // Set initial visible state
      gsap.set(header.querySelectorAll(".shop-word"), {
          y: 0,
          opacity: 1,
          scale: 1,
      });
      
      // Optional enhancement animation when in view
      gsap.to(
        header.querySelectorAll(".shop-word"),
        {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
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
      {/* Animated section header - Initially visible */}
      <div ref={headerRef} className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-0 md:pt-0 pb-6 md:pb-8 text-center opacity-100">
        <div className="font-mono text-xs md:text-sm tracking-[0.3em] text-emerald-400/80 mb-4 md:mb-6">
          <span className="shop-word inline-block">EXCLUSIVE</span>{" "}
          <span className="shop-word inline-block">RELEASE</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-glow leading-tight whitespace-nowrap">
          <span className="shop-word inline-block">Borderline Collection</span>
        </h2>
        <p className="mt-4 md:mt-6 font-body text-white/70 text-base md:text-lg">
          <span className="shop-word inline-block">Limited</span>{" "}
          <span className="shop-word inline-block">Drop</span>{" "}
          <span className="shop-word inline-block text-emerald-400">01</span>
        </p>
      </div>
      
      {/* Mobile Shop Card */}
      <div className="md:hidden px-4 pb-8">
        <MobileShopCard />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 mx-auto max-w-5xl px-4 md:px-8 pb-16 md:pb-20">
        <DesktopProductShowcase products={products} />
      </div>
    </section>
  );
}



