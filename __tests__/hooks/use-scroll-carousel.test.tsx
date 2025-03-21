import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderHook, act, render as rtlRender } from "@testing-library/react";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";

// Mock window object and scroll events
const mockBoundingClientRect = jest.fn();
const originalScrollTo = window.scrollTo;

// Helper to simulate scroll events
const simulateScroll = (scrollY = 0) => {
  // Update window.scrollY
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY
  });
  
  // Dispatch scroll event
  window.dispatchEvent(new Event('scroll'));
};

describe("useScrollCarousel Hook", () => {
  let carouselRef: React.RefObject<HTMLDivElement>;
  
  // Setup before each test
  beforeEach(() => {
    // Create a mock ref with an HTMLDivElement
    carouselRef = {
      current: document.createElement('div')
    };
    
    // Mock getBoundingClientRect for the carousel element
    carouselRef.current.getBoundingClientRect = mockBoundingClientRect;
    
    // Default mock return value for getBoundingClientRect
    mockBoundingClientRect.mockReturnValue({
      top: 0,
      height: 500,
      width: 1000,
      bottom: 500,
      left: 0,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });
    
    // Mock window scroll behavior
    window.scrollTo = jest.fn();
    
    // Reset window.scrollY
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0
    });
    
    jest.clearAllMocks();
  });
  
  // Cleanup after tests
  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });
  
  // Test group: Initialization
  describe("Initialization", () => {
    it("initializes with default state values", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      expect(result.current.isSticky).toBe(false);
      expect(result.current.hasScrolledThrough).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.activeIndex).toBe(0);
      expect(result.current.totalScrollHeight).toBe(500); // 5 items * 100vh
    });
    
    it("calculates totalScrollHeight based on itemCount", () => {
      const { result: result3 } = renderHook(() => useScrollCarousel(carouselRef, 3));
      expect(result3.current.totalScrollHeight).toBe(300); // 3 items * 100vh
      
      const { result: result7 } = renderHook(() => useScrollCarousel(carouselRef, 7));
      expect(result7.current.totalScrollHeight).toBe(700); // 7 items * 100vh
    });
    
    it("handles initialization with null ref", () => {
      const nullRef = { current: null };
      const { result } = renderHook(() => useScrollCarousel(nullRef, 5));
      
      // Should still initialize with default values
      expect(result.current.isSticky).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.activeIndex).toBe(0);
    });
  });
  
  // Test group: Scroll Behavior
  describe("Scroll Behavior", () => {
    it("becomes sticky when scrolling to the top of carousel", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Mock the carousel being at the top of viewport
      mockBoundingClientRect.mockReturnValue({
        top: 0,
        height: 500,
        width: 1000,
        bottom: 500,
        left: 0,
        right: 1000
      });
      
      // Simulate scroll
      act(() => {
        simulateScroll(100);
      });
      
      expect(result.current.isSticky).toBe(true);
    });
    
    it("updates progress based on scroll position", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Mock the carousel at different scroll positions
      // Halfway through the virtual scroll area (250px / 2500px = 0.1)
      mockBoundingClientRect.mockReturnValue({
        top: -250,
        height: 500,
        width: 1000,
        bottom: 250,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(250);
      });
      
      // Progress should be proportional to scroll position
      expect(result.current.progress).toBeCloseTo(0.1, 1);
      
      // Mock scrolling to 20% of total height
      mockBoundingClientRect.mockReturnValue({
        top: -500,
        height: 500,
        width: 1000,
        bottom: 0,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(500);
      });
      
      expect(result.current.progress).toBeCloseTo(0.2, 1);
    });
    
    it("updates activeIndex based on scroll progress", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Scroll to 20% progress (should be first item)
      mockBoundingClientRect.mockReturnValue({
        top: -500,
        height: 500,
        width: 1000,
        bottom: 0,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(500);
      });
      
      expect(result.current.activeIndex).toBe(1);
      
      // Scroll to 40% progress (should be second item)
      mockBoundingClientRect.mockReturnValue({
        top: -1000,
        height: 500,
        width: 1000,
        bottom: -500,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(1000);
      });
      
      expect(result.current.activeIndex).toBe(2);
      
      // Scroll to 80% progress (should be fourth item)
      mockBoundingClientRect.mockReturnValue({
        top: -2000,
        height: 500,
        width: 1000,
        bottom: -1500,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(2000);
      });
      
      expect(result.current.activeIndex).toBe(4);
    });
    
    it("marks as hasScrolledThrough when reached end of carousel", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Scroll near the end (95%+ progress)
      mockBoundingClientRect.mockReturnValue({
        top: -2400,
        height: 500,
        width: 1000,
        bottom: -1900,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(2400);
      });
      
      expect(result.current.hasScrolledThrough).toBe(true);
      expect(result.current.isSticky).toBe(false);
    });
    
    it("resets state when scrolling back up", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // First scroll down to set initial state
      mockBoundingClientRect.mockReturnValue({
        top: -1000,
        height: 500,
        width: 1000,
        bottom: -500,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(1000);
      });
      
      expect(result.current.isSticky).toBe(true);
      expect(result.current.progress).toBeGreaterThan(0);
      expect(result.current.activeIndex).toBeGreaterThan(0);
      
      // Then scroll back up
      mockBoundingClientRect.mockReturnValue({
        top: 100, // Position above the viewport
        height: 500,
        width: 1000,
        bottom: 600,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(0);
      });
      
      // State should reset
      expect(result.current.isSticky).toBe(false);
      expect(result.current.hasScrolledThrough).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.activeIndex).toBe(0);
    });
  });
  
  // Test group: Boundary Conditions
  describe("Boundary Conditions", () => {
    it("handles scrolling past the carousel", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Mock position well below the carousel
      mockBoundingClientRect.mockReturnValue({
        top: -3000,
        height: 500,
        width: 1000,
        bottom: -2500,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(3000);
      });
      
      // Should have completed scrolling through
      expect(result.current.hasScrolledThrough).toBe(true);
      expect(result.current.isSticky).toBe(false);
      
      // activeIndex should be at the last item (not beyond)
      expect(result.current.activeIndex).toBe(4); // 0-based index, so last of 5 items is 4
    });
    
    it("handles single item carousels", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 1));
      
      mockBoundingClientRect.mockReturnValue({
        top: -50,
        height: 500,
        width: 1000,
        bottom: 450,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(50);
      });
      
      expect(result.current.isSticky).toBe(true);
      expect(result.current.activeIndex).toBe(0); // Only one item
      expect(result.current.totalScrollHeight).toBe(100); // 1 item * 100vh
    });
    
    it("handles very large item counts", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 100));
      
      expect(result.current.totalScrollHeight).toBe(10000); // 100 items * 100vh
      
      // Scroll to halfway point
      mockBoundingClientRect.mockReturnValue({
        top: -2500,
        height: 500,
        width: 1000,
        bottom: -2000,
        left: 0,
        right: 1000
      });
      
      act(() => {
        simulateScroll(2500);
      });
      
      // Progress should be 0.05 (2500 / 50000)
      // With 100 items, activeIndex should be around 5
      expect(result.current.progress).toBeCloseTo(0.05, 2);
      expect(result.current.activeIndex).toBe(5);
    });
  });
  
  // Test group: Window Event Handling
  describe("Window Event Handling", () => {
    it("adds scroll event listener on mount", () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      renderHook(() => useScrollCarousel(carouselRef, 5));
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
    
    it("removes scroll event listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderHook(() => useScrollCarousel(carouselRef, 5));
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
    
    it("doesn't crash with rapid scroll events", () => {
      const { result } = renderHook(() => useScrollCarousel(carouselRef, 5));
      
      // Simulate multiple rapid scroll events
      act(() => {
        for (let i = 0; i < 10; i++) {
          mockBoundingClientRect.mockReturnValue({
            top: -i * 100,
            height: 500,
            width: 1000,
            bottom: 500 - i * 100,
            left: 0,
            right: 1000
          });
          simulateScroll(i * 100);
        }
      });
      
      // Should handle all events without crashing
      expect(result.current.progress).toBeGreaterThan(0);
    });
  });
  
  // Test group: Integration with Components
  describe("Integration with Components", () => {
    it("can be used within a React component", () => {
      // Create a test component that uses the hook
      const TestComponent = () => {
        const ref = React.useRef<HTMLDivElement>(null);
        const { activeIndex, progress } = useScrollCarousel(ref, 5);
        
        return (
          <div ref={ref} data-testid="carousel-container">
            <div data-testid="active-index">{activeIndex}</div>
            <div data-testid="progress">{progress}</div>
          </div>
        );
      };
      
      // Use React Testing Library to render the component
      const { getByTestId } = rtlRender(<TestComponent />);
      
      // Initial state should be rendered
      expect(getByTestId('active-index').textContent).toBe('0');
      expect(getByTestId('progress').textContent).toBe('0');
      
      // This is just a basic integration test - we could add more complex testing
      // of the component's behavior with the hook if needed
    });
  });
}); 