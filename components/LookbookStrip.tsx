"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LOOKS = ["/images/p9.png", "/images/p5.png", "/images/p6.png", "/images/p7.png", "/images/p8.png", "/images/p11.png"];

export default function LookbookStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [startTime, setStartTime] = useState(0);

  // Infinite looping carousel
  const getItemWidth = () => {
    if (typeof window === "undefined") return 300;
    return window.innerWidth < 768 ? Math.min(280, window.innerWidth - 80) : 320; // Better mobile sizing
  };
  
  const [itemWidth, setItemWidth] = useState(getItemWidth());
  
  // Create infinite loop by duplicating images
  const extendedLooks = [...LOOKS, ...LOOKS, ...LOOKS]; // Triple the images for smooth infinite scroll
  const totalImages = extendedLooks.length;
  const actualStartIndex = LOOKS.length; // Start in the middle set

  const goToSlide = useCallback((index: number, immediate = false) => {
    setCurrentIndex(index);
    
    const slideWidth = itemWidth + 24; // Include gap
    const translateX = -(index * slideWidth);
    
    if (trackRef.current) {
      if (immediate) {
        gsap.set(trackRef.current, { x: `${translateX}px` });
      } else {
        gsap.to(trackRef.current, {
          x: `${translateX}px`,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [itemWidth]);

  const nextSlide = useCallback(() => {
    const newIndex = currentIndex + 1;
    
    // If we're at the end of the second set, jump to the beginning of the first set
    if (newIndex >= LOOKS.length * 2) {
      goToSlide(newIndex);
      setTimeout(() => {
        goToSlide(LOOKS.length, true); // Jump to start of second set instantly
      }, 500);
    } else {
      goToSlide(newIndex);
    }
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = currentIndex - 1;
    
    // If we're at the beginning of the second set, jump to the end of the third set
    if (newIndex < LOOKS.length) {
      goToSlide(newIndex);
      setTimeout(() => {
        goToSlide(LOOKS.length * 2 - 1, true); // Jump to end of second set instantly
      }, 500);
    } else {
      goToSlide(newIndex);
    }
  }, [currentIndex, goToSlide]);

  // Enhanced touch handlers for mobile
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setStartTime(Date.now());
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
    
    // Prevent page scroll on mobile during swipe
    if (trackRef.current) {
      const distance = clientX - startX;
      const slideWidth = itemWidth + 24; // Include gap in calculation
      const currentTranslateX = -(currentIndex * slideWidth);
      const newTranslateX = currentTranslateX + distance * 0.3; // Add some resistance
      
      gsap.set(trackRef.current, { x: `${newTranslateX}px` });
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const distance = startX - currentX;
    const time = Date.now() - startTime;
    const velocity = Math.abs(distance) / time; // pixels per ms
    
    // Lower threshold for faster swipes, higher for slower swipes
    const threshold = velocity > 0.5 ? 30 : 80;
    
    if (distance > threshold) {
      nextSlide();
    } else if (distance < -threshold) {
      prevSlide();
    } else {
      // Snap back to current position
      goToSlide(currentIndex);
    }
  };

  // Handle resize and initialize
  useEffect(() => {
    const handleResize = () => {
      const newItemWidth = getItemWidth();
      setItemWidth(newItemWidth);
      // Reset to starting position
      setCurrentIndex(actualStartIndex);
      if (trackRef.current) {
        const slideWidth = newItemWidth + 24; // Include gap
        gsap.set(trackRef.current, { x: `${-(actualStartIndex * slideWidth)}px` });
      }
    };

    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [actualStartIndex]);

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
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all"
          aria-label="Previous images"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all"
          aria-label="Next images"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div 
          className="overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
          style={{ 
            touchAction: 'pan-y pinch-zoom',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleStart(e.clientX);
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              e.preventDefault();
              handleMove(e.clientX);
            }
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleEnd();
          }}
          onMouseLeave={() => {
            if (isDragging) handleEnd();
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6"
            style={{ width: `${totalImages * (itemWidth + 24)}px` }} // Adjusted gap
          >
            {extendedLooks.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-white/30 hover:shadow-emerald-500/20"
                style={{ width: `${itemWidth}px` }}
              >
                <div className="aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={src} 
                    alt={`Look ${(i % LOOKS.length) + 1}`} 
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
          {LOOKS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(LOOKS.length + i)}
              className={`w-2 h-2 rounded-full transition-all ${
                (currentIndex % LOOKS.length) === i 
                  ? 'bg-emerald-400 w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to image ${i + 1}`}
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


