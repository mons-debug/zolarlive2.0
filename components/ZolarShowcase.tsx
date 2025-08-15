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
      
      // Prevent body scroll during horizontal swipe
      document.body.style.overflow = 'hidden';
    }
  };

  const handleTouchEnd = () => {
    // Re-enable body scroll
    document.body.style.overflow = '';
    
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
        style={{ touchAction: 'pan-x' }}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="w-full flex-shrink-0">
              <MobileProductStory product={product} index={index} />
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

      {/* Swipe Hint */}
      <div className="text-center mt-4">
        <p className="text-white/60 text-sm">Swipe to explore • Tap to flip</p>
      </div>
    </div>
  );
}

// Mobile Product Story Component - Interactive flip card with storytelling
function MobileProductStory({ product, index }: { product: Product; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Minimal story content - Morocco 2025 edition
  const storyContent = {
    borderline: {
      front: {
        subtitle: product.subtitle,
        title: "The Night Vision",
        mood: "For those who stand out"
      },
      back: {
        subtitle: "Back View",
        title: "Borderline",
        mood: "Limited Edition"
      }
    },
    spin: {
      front: {
        subtitle: product.subtitle,
        title: "Kinetic Energy",
        mood: "Keep spinning"
      },
      back: {
        subtitle: "Back View",
        title: "Purpose",
        mood: "Limited Edition"
      }
    }
  };

  const story = product.id === "borderline-black" ? storyContent.borderline : storyContent.spin;
  const currentStory = isFlipped ? story.back : story.front;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div ref={cardRef} className="mobile-story-wrapper relative h-[85vh] px-4 py-8">
      {/* 3D Flip Card Container */}
      <div className="story-card-container relative h-full" style={{ perspective: '1000px' }}>
        <div 
          className="story-card"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transition: 'transform 0.7s',
            WebkitTransition: '-webkit-transform 0.7s',
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          
          {/* Front Side */}
          <div 
            className="story-side story-front"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
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
              
                              {/* Minimal Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* Top: Flip hint */}
                  <div className="flex justify-end">
                    <button 
                      onClick={handleFlip}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm hover:bg-white/20 transition-colors"
                    >
                      <span>View back</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Bottom: Minimal text */}
                  <div className="story-content">
                    <p className={`text-xs uppercase tracking-[0.3em] ${product.theme.accentTextClass} mb-2`}>
                      {currentStory.subtitle}
                    </p>
                    <h3 className="text-3xl font-bold text-white mb-2">{currentStory.title}</h3>
                    <p className="text-sm text-white/60 italic">{currentStory.mood}</p>
                  </div>
                </div>
            </div>
          </div>
          
          {/* Back Side */}
          <div 
            className="story-side story-back"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className={`relative h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ${product.theme.ringClass} bg-black/80 backdrop-blur`}>
              {/* Back view image */}
              <div className="absolute inset-0">
                {product.backImage ? (
                  <Image 
                    src={product.backImage} 
                    alt={`${product.name} back`} 
                    fill 
                    sizes="100vw" 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
              
              {/* Minimal Back content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Top: Flip back */}
                <div className="flex justify-end">
                  <button 
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm hover:bg-white/20 transition-colors"
                  >
                    <span>View front</span>
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {/* Bottom: Minimal back text */}
                <div className="story-content">
                  <p className={`text-xs uppercase tracking-[0.3em] ${product.theme.accentTextClass} mb-2`}>
                    {story.back.subtitle}
                  </p>
                  <h3 className="text-3xl font-bold text-white mb-2">{story.back.title}</h3>
                  <p className="text-sm text-white/60 italic">{story.back.mood}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Carousel Deck Component
function DesktopCarouselDeck({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentViewMode, setCurrentViewMode] = useState<'front' | 'back'>('front');

  const currentProduct = products[currentIndex];

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    
    const message = `Hi! I want to order the ${currentProduct.name} in size ${selectedSize}. Please let me know the price and availability.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setSelectedSize(""); // Reset size selection
    setCurrentViewMode('front'); // Reset to front view
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setSelectedSize(""); // Reset size selection
    setCurrentViewMode('front'); // Reset to front view
  };

  const toggleView = () => {
    setCurrentViewMode(prev => prev === 'front' ? 'back' : 'front');
  };

  const getCurrentImage = () => {
    return currentViewMode === 'front' ? currentProduct.image : (currentProduct.backImage || currentProduct.image);
  };

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* Image Carousel Deck */}
      <div className="col-span-7">
        <div className="relative">
          {/* Main Product Card */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 bg-black/60 backdrop-blur">
            <div className="aspect-[4/5] relative">
              <Image 
                src={getCurrentImage()} 
                alt={`${currentProduct.name} ${currentViewMode}`}
                fill 
                sizes="60vw" 
                className="object-cover transition-opacity duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* View Toggle Button */}
              {currentProduct.backImage && (
                <button
                  onClick={toggleView}
                  className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur text-white text-sm hover:bg-black/70 transition-colors"
                >
                  {currentViewMode === 'front' ? 'View Back' : 'View Front'}
                </button>
              )}
              
              {/* Navigation Arrows */}
              <button
                onClick={prevProduct}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextProduct}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Thumbnails */}
          <div className="flex justify-center mt-6 gap-4">
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedSize("");
                  setCurrentViewMode('front');
                }}
                className={`relative w-20 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? `ring-2 ${currentProduct.theme.ringClass} scale-110` 
                    : 'ring-1 ring-white/20 hover:ring-white/40'
                }`}
              >
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill 
                  sizes="80px" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </button>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedSize("");
                  setCurrentViewMode('front');
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `${currentProduct.theme.buttonClass} scale-110`
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="col-span-5 space-y-8">
        {/* Header */}
        <div>
          {currentProduct.subtitle && (
            <p className={`text-sm uppercase tracking-[0.3em] ${currentProduct.theme.accentTextClass} mb-2`}>
              {currentProduct.subtitle}
            </p>
          )}
          <h1 className="text-5xl font-bold text-white mb-4">{currentProduct.name}</h1>
          <p className="text-2xl font-bold text-white">$45.00</p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-white/80 leading-relaxed text-base">{currentProduct.description}</p>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
          <ul className="space-y-2">
            {currentProduct.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center text-white/70">
                <div className={`w-2 h-2 rounded-full ${currentProduct.theme.buttonClass} mr-3 flex-shrink-0`} />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                  selectedSize === size
                    ? `${currentProduct.theme.buttonClass} border-transparent shadow-lg scale-105`
                    : "border-white/20 bg-black/40 text-white hover:border-white/40 hover:bg-white/5"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Care Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Care Instructions</h3>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Machine wash cold with like colors</li>
            <li>• Tumble dry low or hang dry</li>
            <li>• Do not bleach or iron directly on print</li>
            <li>• Wash inside out to preserve design</li>
          </ul>
        </div>

        {/* Order Button */}
        <div className="pt-6">
          <button
            onClick={handleWhatsAppOrder}
            className={`w-full inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-semibold ring-1 ring-white/10 transition-all duration-200 ${currentProduct.theme.buttonClass} hover:scale-105 hover:shadow-lg`}
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
            </svg>
            Order via WhatsApp
          </button>
          
          {/* Additional Product Info */}
          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm">Free shipping on orders over $50</p>
            <p className="text-white/60 text-sm">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Legacy ProductCard component for mobile (keeping for backwards compatibility)
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
          <span className="shop-word inline-block">Collection</span>
        </h2>
        <p className="mt-4 text-white/60 text-lg">
          <span className="shop-word inline-block">Limited</span>{" "}
          <span className="shop-word inline-block">Drop</span>{" "}
          <span className="shop-word inline-block">01</span>
        </p>
      </div>
      
      {/* Mobile Carousel */}
      <div className="md:hidden px-4 pb-16">
        <MobileCarousel products={products} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 mx-auto max-w-7xl px-4 md:px-8 pb-16 md:pb-36">
        <DesktopCarouselDeck products={products} />
      </div>
    </section>
  );
}


