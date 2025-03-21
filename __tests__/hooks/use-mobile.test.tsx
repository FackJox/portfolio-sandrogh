import * as React from "react";
import { render, renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BREAKPOINTS,
  setupMatchMediaMock,
  setWindowInnerWidth,
  setupForBreakpointTesting
} from "@/__tests__/utils/viewport-test-utils";

// Mock values
const MOBILE_BREAKPOINT = BREAKPOINTS.MOBILE;
const DEBOUNCE_DELAY = 250; // Must match the value in the hook

describe("useIsMobile Hook", () => {
  // Mock event listener functions
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  // Setup before each test
  beforeEach(() => {
    // Setup mock and save references to the event listeners
    const mocks = setupMatchMediaMock();
    mockAddEventListener = mocks.mockAddEventListener;
    mockRemoveEventListener = mocks.mockRemoveEventListener;

    // Set default window width
    setWindowInnerWidth(1024);

    // Setup fake timers for debounce testing
    jest.useFakeTimers();
  });

  // Cleanup after tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  // Test group: Initial detection
  describe("Initial viewport detection", () => {
    it("should detect desktop viewport initially", () => {
      setWindowInnerWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });

    it("should detect mobile viewport initially", () => {
      setWindowInnerWidth(767);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
    });

    it("should detect exactly at the breakpoint as desktop", () => {
      setWindowInnerWidth(MOBILE_BREAKPOINT);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });
  });

  // Test group: Resize event handling
  describe("Resize event handling", () => {
    it("should register media query change listener on mount", () => {
      renderHook(() => useIsMobile());
      expect(mockAddEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("should remove media query change listener on unmount", () => {
      const { unmount } = renderHook(() => useIsMobile());
      unmount();
      expect(mockRemoveEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("should update when viewport changes from desktop to mobile", () => {
      setWindowInnerWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);

      // Trigger the change event callback directly
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      
      // Simulate changing to mobile width
      act(() => {
        setWindowInnerWidth(600);
        changeCallback();
        // Fast-forward debounce timer
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });

      expect(result.current).toBe(true);
    });

    it("should update when viewport changes from mobile to desktop", () => {
      setWindowInnerWidth(600);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);

      // Trigger the change event callback directly
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      
      // Simulate changing to desktop width
      act(() => {
        setWindowInnerWidth(1024);
        changeCallback();
        // Fast-forward debounce timer
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });

      expect(result.current).toBe(false);
    });
  });

  // Test group: Debounce functionality
  describe("Debounce functionality", () => {
    it("should not update immediately on resize", () => {
      setWindowInnerWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);

      // Get the change callback
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      
      // Trigger resize but don't advance timer
      act(() => {
        setWindowInnerWidth(600);
        changeCallback();
      });
      
      // Should still be desktop since debounce hasn't completed
      expect(result.current).toBe(false);
      
      // Advance timer just before debounce completes
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY - 10);
      });
      
      // Should still be desktop
      expect(result.current).toBe(false);
      
      // Complete the debounce period
      act(() => {
        jest.advanceTimersByTime(10);
      });
      
      // Now it should detect mobile
      expect(result.current).toBe(true);
    });
    
    it("should only execute the last resize event in a rapid sequence", () => {
      setWindowInnerWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      
      // Get the change callback
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      
      // Simulate a series of rapid resize events
      act(() => {
        // First to mobile
        setWindowInnerWidth(600);
        changeCallback();
        
        // Advance timer partially
        jest.advanceTimersByTime(100);
        
        // Then to desktop
        setWindowInnerWidth(900);
        changeCallback();
        
        // Advance timer partially
        jest.advanceTimersByTime(100);
        
        // Then to mobile again
        setWindowInnerWidth(700);
        changeCallback();
      });
      
      // Should still be desktop since debounce hasn't completed
      expect(result.current).toBe(false);
      
      // Complete the debounce period for the last change
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });
      
      // Should reflect the last change (700px = mobile)
      expect(result.current).toBe(true);
    });
  });

  // Test group: Integration with components
  describe("Integration with components", () => {
    it("should correctly provide mobile state to components", () => {
      // Component that uses the hook
      const TestComponent = () => {
        const isMobile = useIsMobile();
        return (
          <div data-testid="test-component">
            {isMobile ? "Mobile View" : "Desktop View"}
          </div>
        );
      };

      // Setup
      setWindowInnerWidth(600);
      
      // Render the component
      const { getByTestId } = render(<TestComponent />);
      
      // Verify correct detection
      expect(getByTestId('test-component')).toHaveTextContent('Mobile View');
    });
  });

  // Test group: SSR Compatibility
  describe("SSR Compatibility", () => {
    it("should return default value when window is undefined", () => {
      // Save original window
      const originalWindow = global.window;
      
      // Mock window as undefined for SSR testing
      // @ts-ignore - deliberately setting window to undefined to test SSR
      global.window = undefined;
      
      // Render hook - should not throw
      const { result } = renderHook(() => useIsMobile());
      
      // Should return the default value (false)
      expect(result.current).toBe(false);
      
      // Restore window
      global.window = originalWindow;
    });
  });

  // Test group: Edge cases
  describe("Edge cases", () => {
    it("should handle window resize events", () => {
      setWindowInnerWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      
      // Trigger window resize event
      act(() => {
        setWindowInnerWidth(600);
        window.dispatchEvent(new Event('resize'));
        
        // Since our hook listens to media query changes, not resize directly,
        // we need to trigger the media query listener manually in tests
        const changeCallback = mockAddEventListener.mock.calls[0][1];
        changeCallback();
        
        // Fast-forward debounce timer
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });
      
      expect(result.current).toBe(true);
    });

    it("should handle orientation change events on mobile devices", () => {
      // Start with mobile portrait
      setWindowInnerWidth(375);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
      
      // Simulate orientation change to landscape (still mobile)
      act(() => {
        setWindowInnerWidth(667); // iPhone in landscape, still below breakpoint
        
        // Trigger the media query change
        const changeCallback = mockAddEventListener.mock.calls[0][1];
        changeCallback();
        
        // Fast-forward debounce timer
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });
      
      // Should still be mobile
      expect(result.current).toBe(true);
      
      // Simulate orientation change on tablet from portrait to landscape
      act(() => {
        setWindowInnerWidth(1024); // iPad Pro in landscape, above breakpoint
        
        // Trigger the media query change
        const changeCallback = mockAddEventListener.mock.calls[0][1];
        changeCallback();
        
        // Fast-forward debounce timer
        jest.advanceTimersByTime(DEBOUNCE_DELAY);
      });
      
      // Should now be desktop
      expect(result.current).toBe(false);
    });
  });
}); 