import * as React from "react";
import { render } from "@testing-library/react";

// Constants
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1536
};

// Mock window.innerWidth
export function setWindowInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true
  });
}

// Mock window.innerHeight
export function setWindowInnerHeight(height: number) {
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
    writable: true
  });
}

// Mock window.matchMedia
export function setupMatchMediaMock() {
  // Create reusable functions for the event listeners
  const mockAddEventListener = jest.fn();
  const mockRemoveEventListener = jest.fn();
  
  // Create a mock implementation of matchMedia
  const createMatchMediaMock = (matches: boolean) => ({
    matches,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    media: "",
    addListener: mockAddEventListener, // For older API compatibility
    removeListener: mockRemoveEventListener, // For older API compatibility
  });
  
  // Mock matchMedia implementation
  const mockMatchMedia = jest.fn();
  window.matchMedia = mockMatchMedia;
  
  mockMatchMedia.mockImplementation((query) => {
    // Parse the max-width value from the query
    const maxWidthMatch = query.match(/\(max-width: (\d+)px\)/);
    if (maxWidthMatch) {
      const maxWidth = parseInt(maxWidthMatch[1], 10);
      return createMatchMediaMock(window.innerWidth <= maxWidth);
    }
    
    // Parse the min-width value from the query
    const minWidthMatch = query.match(/\(min-width: (\d+)px\)/);
    if (minWidthMatch) {
      const minWidth = parseInt(minWidthMatch[1], 10);
      return createMatchMediaMock(window.innerWidth >= minWidth);
    }
    
    // Handle orientation queries
    if (query.includes('orientation: portrait')) {
      return createMatchMediaMock(window.innerHeight > window.innerWidth);
    }
    
    if (query.includes('orientation: landscape')) {
      return createMatchMediaMock(window.innerWidth > window.innerHeight);
    }
    
    // Handle dark mode queries
    if (query.includes('prefers-color-scheme: dark')) {
      return createMatchMediaMock(false); // Default to light theme
    }
    
    // Handle reduced motion queries
    if (query.includes('prefers-reduced-motion: reduce')) {
      return createMatchMediaMock(false); // Default to no preference
    }
    
    // Default match
    return createMatchMediaMock(false);
  });
  
  return {
    mockMatchMedia,
    mockAddEventListener,
    mockRemoveEventListener
  };
}

// Mock media features more comprehensively
export function mockMediaFeatures(features: {
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape';
  prefersColorScheme?: 'light' | 'dark';
  prefersReducedMotion?: boolean;
}) {
  // Set width and height
  if (features.width !== undefined) {
    setWindowInnerWidth(features.width);
  }
  
  if (features.height !== undefined) {
    setWindowInnerHeight(features.height);
  }
  
  // If orientation is set but height/width aren't matched, set the appropriate dimension
  if (features.orientation === 'portrait' && (features.width ?? 0) >= (features.height ?? 0)) {
    setWindowInnerHeight((features.width ?? 0) + 100); // Ensure height > width
  } else if (features.orientation === 'landscape' && (features.height ?? 0) >= (features.width ?? 0)) {
    setWindowInnerWidth((features.height ?? 0) + 100); // Ensure width > height
  }
  
  // Re-setup matchMedia after dimension changes
  setupMatchMediaMock();
}

// Utility to trigger resize events
export function triggerResize(width: number, height?: number) {
  setWindowInnerWidth(width);
  if (height !== undefined) {
    setWindowInnerHeight(height);
  }
  
  window.dispatchEvent(new Event('resize'));
}

// Utility to trigger orientation change
export function triggerOrientationChange(orientation: 'portrait' | 'landscape') {
  if (orientation === 'portrait') {
    // Ensure height > width for portrait
    const height = window.innerWidth + 100;
    setWindowInnerHeight(height);
  } else {
    // Ensure width > height for landscape
    const width = window.innerHeight + 100;
    setWindowInnerWidth(width);
  }
  
  window.dispatchEvent(new Event('orientationchange'));
}

// Helper HOC to wrap components for viewport testing
export function createViewportWrapper(width: number, height?: number) {
  // Setup the viewport before rendering
  setWindowInnerWidth(width);
  if (height !== undefined) {
    setWindowInnerHeight(height);
  }
  setupMatchMediaMock();
  
  // Return a wrapper component
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

// Helper to render components at a specific viewport
export function renderAtViewport(ui: React.ReactElement, options: { width: number; height?: number }) {
  const ViewportWrapper = createViewportWrapper(options.width, options.height);
  return render(ui, { wrapper: ViewportWrapper, ...options });
}

// Testing utility for checking device type
export function getDeviceTypeForWidth(width: number): 'mobile' | 'tablet' | 'desktop' | 'large-desktop' {
  if (width < BREAKPOINTS.MOBILE) return 'mobile';
  if (width < BREAKPOINTS.TABLET) return 'tablet';
  if (width < BREAKPOINTS.DESKTOP) return 'desktop';
  return 'large-desktop';
}

// Setup for testing responsive breakpoints
export function setupForBreakpointTesting() {
  // Setup fake timers for debounce/throttle testing
  jest.useFakeTimers();
  
  // Setup match media mocks
  setupMatchMediaMock();
  
  // Setup default viewport
  setWindowInnerWidth(1024);
  setWindowInnerHeight(768);
  
  return {
    cleanupForBreakpointTesting: () => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    }
  };
} 