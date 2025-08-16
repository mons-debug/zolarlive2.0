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
const SIZE_CHART: Record<string, { chest: number; length: number }> = {
  XS: { chest: 46, length: 66 },
  S: { chest: 49, length: 69 },
  M: { chest: 52, length: 72 },
  L: { chest: 55, length: 74 },
  XL: { chest: 58, length: 76 },
  XXL: { chest: 61, length: 78 },
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
                  <th className="text-left py-2 font-medium">Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {SIZES.map((s) => (
                  <tr key={s}>
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
          <button onClick={onClose} className="w-full mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15">Close</button>
        </div>
      </div>
    </div>
  );
}

// Mobile Carousel Component with scroll-triggered auto-swipe
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

  // Set initial gradient to Borderline (green) theme on component mount
  useEffect(() => {
    updateGlobalGradient('borderline', 'male');
  }, []);

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

  const resetGlobalGradient = () => {
    const docEl = document.documentElement;
    const gradientBg = document.querySelector('.zolar-gradient-vars');
    
    // Reset to enhanced default green theme
    docEl.style.setProperty('--h1', '155');
    docEl.style.setProperty('--h2', '135'); 
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
            alt={`${currentProduct.name} ${viewMode} ${model}`} 
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
              <div className="inline-flex p-1 rounded-full bg-black/50 backdrop-blur border border-white/20">
                    <button 
                  onClick={() => handleVariantChange('borderline')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    variant === 'borderline' 
                      ? 'bg-emerald-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Borderline
                </button>
                <button
                  onClick={() => handleVariantChange('spin')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    variant === 'spin' 
                      ? 'bg-sky-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Spin
                    </button>
            </div>
          </div>
          
            {/* View & Model Controls */}
            <div className="flex justify-between items-center">
              {/* Front/Back Toggle */}
              <div className="flex bg-black/50 backdrop-blur rounded-full border border-white/20">
                <button
                  onClick={() => handleToggleChange('view', 'front')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    viewMode === 'front' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => handleToggleChange('view', 'back')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    viewMode === 'back' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Back
                </button>
              </div>
              
              {/* Male/Female Toggle */}
              <div className="flex bg-black/50 backdrop-blur rounded-full border border-white/20">
                  <button 
                  onClick={() => handleToggleChange('model', 'male')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    model === 'male' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => handleToggleChange('model', 'female')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    model === 'female' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Female
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

            {/* Navigation Controls Overlay */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 max-w-full">
              {/* Front/Back Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
                <button
                  onClick={() => handleToggleChange('view', 'front')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    viewMode === 'front' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => handleToggleChange('view', 'back')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    viewMode === 'back' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Male/Female Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
              <button
                  onClick={() => handleToggleChange('model', 'male')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    model === 'male' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Male
              </button>
              <button
                  onClick={() => handleToggleChange('model', 'female')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    model === 'female' 
                      ? 'bg-white text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Female
              </button>
          </div>

              {/* Variant Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
                            <button
                  onClick={() => handleVariantChange('borderline')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    variant === 'borderline' 
                      ? 'bg-emerald-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Borderline
              </button>
              <button
                  onClick={() => handleVariantChange('spin')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    variant === 'spin' 
                      ? 'bg-sky-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Spin
              </button>
          </div>
        </div>
      </div>
        </div>
      )}
        </div>
  );
}

// Desktop Product Showcase - Like Mobile, Just Showcasing Products
function DesktopProductShowcase({ products }: { products: Product[] }) {
  const [currentView, setCurrentView] = useState<'borderline' | 'spin'>('borderline');
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const borderlineProduct = products.find(p => p.id.includes('borderline'));
  const spinProduct = products.find(p => p.id.includes('spin'));

  return (
    <div className="space-y-8">
      {/* Product Showcase Grid - Like Mobile Cards but for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Borderline Black Showcase */}
        <div 
          className={`group relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${
            currentView === 'borderline' 
              ? 'ring-2 ring-emerald-500/20 scale-105 shadow-2xl' 
              : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-102'
          }`}
          onClick={() => setCurrentView('borderline')}
        >
            <div className="aspect-[4/5] relative">
              <Image 
              src={currentView === 'borderline' && currentSide === 'back' && borderlineProduct?.backImage ? borderlineProduct.backImage : borderlineProduct?.image || '/images/p8.png'} 
              alt="Borderline Black"
                fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                priority
              quality={85}
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
            {/* Fullscreen Button - Borderline */}
            {currentView === 'borderline' && (
                <button
                onClick={() => setIsFullscreenOpen(true)}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="View fullscreen"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                </button>
              )}
              
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                Green glow print
          </div>
              <h3 className="text-2xl font-bold text-white mb-2">Borderline Black</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Our signature black tee with a neon-green border glow.
              </p>
            </div>
            </div>
          </div>

        {/* Spin White Showcase */}
        <div 
          className={`group relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${
            currentView === 'spin' 
              ? 'ring-2 ring-sky-500/20 scale-105 shadow-2xl' 
              : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-102'
          }`}
          onClick={() => setCurrentView('spin')}
        >
          <div className="aspect-[4/5] relative">
                <Image 
              src={currentView === 'spin' && currentSide === 'back' && spinProduct?.backImage ? spinProduct.backImage : spinProduct?.image || '/images/p5.png'} 
              alt="Spin White"
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            {/* Fullscreen Button - Spin */}
            {currentView === 'spin' && (
              <button
                onClick={() => setIsFullscreenOpen(true)}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="View fullscreen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-xs uppercase tracking-wider text-sky-400 mb-2">
                Blue/Orange print
          </div>
              <h3 className="text-2xl font-bold text-white mb-2">Spin for Purpose White</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Clean white base with kinetic blue and orange spin graphic.
              </p>
          </div>
        </div>
            </div>
          </div>

      {/* View Toggle for Selected Product */}
      {((currentView === 'borderline' && borderlineProduct?.backImage) || (currentView === 'spin' && spinProduct?.backImage)) && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-black/50 backdrop-blur border border-white/20">
              <button
              onClick={() => setCurrentSide('front')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentSide === 'front' 
                  ? 'bg-white text-black' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Front View
              </button>
              <button
              onClick={() => setCurrentSide('back')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentSide === 'back' 
                  ? 'bg-white text-black' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Back View
              </button>
          </div>
        </div>
      )}

      {/* Product Story Section */}
      <div className="text-center space-y-4">
        <div className={`font-mono text-sm tracking-wider ${currentView === 'borderline' ? 'text-emerald-400' : 'text-sky-400'}`}>
          {currentView === 'borderline' ? 'Drop 01 — Borderline Collection' : 'Drop 01 — Spin Collection'}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white">
          {currentView === 'borderline' ? 'The Night Vision' : 'Kinetic Energy'}
        </h3>
        <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
          {currentView === 'borderline' 
            ? 'For those who stand out in the darkness. Premium streetwear with a neon edge.'
            : 'Keep spinning, keep moving. Energy in motion, captured in fabric.'
          }
        </p>
        </div>

      {/* Desktop Fullscreen Modal */}
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
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={currentView === 'borderline' && currentSide === 'back' && borderlineProduct?.backImage 
                  ? borderlineProduct.backImage 
                  : currentView === 'spin' && currentSide === 'back' && spinProduct?.backImage
                  ? spinProduct.backImage
                  : currentView === 'borderline' 
                  ? borderlineProduct?.image || '/images/p8.png'
                  : spinProduct?.image || '/images/p5.png'
                } 
                alt={`${currentView === 'borderline' ? 'Borderline Black' : 'Spin White'} ${currentSide} - Fullscreen`} 
                fill 
                sizes="100vw" 
                className="object-contain"
                priority
              />
        </div>

            {/* Navigation Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              {/* Product Toggle */}
              <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
            <button
                  onClick={() => setCurrentView('borderline')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentView === 'borderline' 
                      ? 'bg-emerald-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Borderline
            </button>
              <button
                  onClick={() => setCurrentView('spin')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentView === 'spin' 
                      ? 'bg-sky-400 text-black' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Spin
              </button>
        </div>

              {/* Front/Back Toggle */}
              {((currentView === 'borderline' && borderlineProduct?.backImage) || (currentView === 'spin' && spinProduct?.backImage)) && (
                <div className="flex bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1">
          <button
                    onClick={() => setCurrentSide('front')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      currentSide === 'front' 
                        ? 'bg-white text-black' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Front
          </button>
                  <button
                    onClick={() => setCurrentSide('back')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      currentSide === 'back' 
                        ? 'bg-white text-black' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Back
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

// Legacy ProductCard component for mobile (keeping for backwards compatibility)
function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

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
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs md:text-sm text-white/80 font-medium">Select Size:</p>
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
        <div className="mt-2 text-[12px] md:text-sm text-white/70 min-h-[1rem]">
          {selectedSize
            ? `Chest: ${SIZE_CHART[selectedSize].chest} cm • Length: ${SIZE_CHART[selectedSize].length} cm`
            : 'Tap a size to see measurements'}
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
      {isSizeChartOpen && <SizeChartModal onClose={() => setIsSizeChartOpen(false)} />}
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
      <div ref={headerRef} className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 pt-8 md:pt-16 pb-4 md:pb-12 text-center">
        <div className="font-mono text-xs md:text-sm tracking-[0.3em] text-emerald-400/80 mb-4">
          <span className="shop-word inline-block">Exclusive</span>{" "}
          <span className="shop-word inline-block">Release</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-white text-glow">
          <span className="shop-word inline-block">Borderline</span>{" "}
          <span className="shop-word inline-block">Collection</span>
        </h2>
        <p className="mt-6 font-body text-white/70 text-lg md:text-xl">
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
      <div className="hidden md:block relative z-10 mx-auto max-w-6xl px-4 md:px-8 pb-16 md:pb-24">
        <DesktopProductShowcase products={products} />
      </div>
    </section>
  );
}



