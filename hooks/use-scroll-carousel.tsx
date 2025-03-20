"use client";

import * as React from "react";

export function useScrollCarousel(carouselRef: React.RefObject<HTMLDivElement>, itemCount: number) {
  const [isSticky, setIsSticky] = React.useState(false);
  const [hasScrolledThrough, setHasScrolledThrough] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Store the total height needed for the virtual scroll
  const totalScrollHeight = React.useMemo(() => {
    return itemCount * 100; // Each item takes 100vh worth of scrolling
  }, [itemCount]);
  
  React.useEffect(() => {
    if (!carouselRef.current) return;
    
    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const rect = carouselRef.current.getBoundingClientRect();
      const offsetTop = rect.top;
      const sectionHeight = rect.height;
      
      // When the section is at the top of the viewport
      if (offsetTop <= 0 && !hasScrolledThrough) {
        if (!isSticky) setIsSticky(true);
        
        // Calculate scroll progress through the virtual scroll area
        const scrollPosition = Math.abs(offsetTop);
        const totalScrollDistance = sectionHeight * itemCount;
        const currentProgress = Math.min(scrollPosition / totalScrollDistance, 1);
        setProgress(currentProgress);
        
        // Calculate which item to show based on progress
        const calculatedIndex = Math.min(
          Math.floor(currentProgress * itemCount),
          itemCount - 1
        );
        
        if (calculatedIndex !== activeIndex) {
          setActiveIndex(calculatedIndex);
        }
        
        // Check if we've scrolled through all items
        if (currentProgress >= 0.95) {
          setHasScrolledThrough(true);
          setIsSticky(false);
        }
      } else if (offsetTop > 0) {
        // Reset when scrolling back up
        setIsSticky(false);
        setHasScrolledThrough(false);
        setProgress(0);
        setActiveIndex(0);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [carouselRef, hasScrolledThrough, isSticky, activeIndex, itemCount]);
  
  return {
    isSticky,
    hasScrolledThrough,
    progress,
    activeIndex,
    totalScrollHeight,
  };
} 