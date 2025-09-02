"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LOOKS = ["/images/p9.png", "/images/p5.png", "/images/p6.png", "/images/p7.png", "/images/p8.png", "/images/p11.png"];

export default function LookbookStrip() {
  const wrap = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3; // Desktop: 3 images
    if (window.innerWidth >= 768) return 2;  // Tablet: 2 images
    return 1; // Mobile: 1 image
  };
  
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const maxIndex = LOOKS.length - itemsPerView;

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    
    // Calculate the exact position for each slide group
    const slideGroupWidth = 100 / itemsPerView;
    const translateX = -clampedIndex * slideGroupWidth;
    
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: `${translateX}%`,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [maxIndex, itemsPerView]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Touch/Mouse handlers - Simple swipe detection
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setEndX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setEndX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50; // pixels
    const distance = startX - endX;
    
    // Swipe left (next group of images)
    if (distance > threshold && currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    }
    // Swipe right (previous group of images)  
    else if (distance < -threshold && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
    // If no significant swipe, stay on current slide
  };

  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);
      setCurrentIndex(0); // Reset to start when layout changes
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || typeof window === "undefined") return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Animate title on entry
      gsap.fromTo(
        title.querySelectorAll(".word"),
        { 
          y: 30, 
          opacity: 0,
          rotateX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

    return (
    <section id="lookbook" className="relative py-8 md:py-16">
      {/* Fixed title that stays at top */}
      <div ref={titleRef} className="text-center pt-8 xs:pt-12 pb-4 xs:pb-6 md:pt-16 md:pb-12 px-4 perspective-1000">
        <div className="font-mono text-xs md:text-sm tracking-[0.3em] text-emerald-400/80 mb-4">
          <span className="word inline-block">Visual</span>{" "}
          <span className="word inline-block">Showcase</span>
        </div>
        <h3 className="font-display text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-tight text-glow">
          <span className="word inline-block">Collection</span>{" "}
          <span className="word inline-block">Gallery</span>
        </h3>
        <p className="font-body text-white/70 text-sm xs:text-base md:text-xl mt-4 xs:mt-6 leading-relaxed">
          <span className="word inline-block">Explore</span>{" "}
          <span className="word inline-block">our</span>{" "}
          <span className="word inline-block">signature</span>{" "}
          <span className="word inline-block">pieces</span>
        </p>
      </div>

      {/* Manual Carousel Gallery */}
      <div className="relative px-4 md:px-8">
        {/* Navigation Buttons - Desktop */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous images"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next images"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div 
          ref={wrap} 
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div
            ref={trackRef}
            className="flex gap-3 md:gap-8 lg:gap-10 transition-transform duration-500 ease-out"
            style={{ width: `${Math.ceil(LOOKS.length / itemsPerView) * 100}%` }}
        >
          {LOOKS.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-white/30 hover:shadow-emerald-500/20"
              style={{ width: `${100 / LOOKS.length}%` }}
            >
                <div className="aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={src} 
                    alt={`Look ${i + 1}`} 
                    className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105" 
                    draggable={false}
                  />
                </div>
            </div>
          ))}
        </div>
      </div>

        {/* Indicator Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(LOOKS.length / itemsPerView) }, (_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex 
                  ? 'bg-emerald-400 w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide group ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-center mt-4">
          <p className="text-white/50 text-sm">Swipe to explore more</p>
        </div>
      </div>
    </section>
  );
}


