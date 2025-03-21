# useMobile Hook Testing

This document outlines the testing approach for the `useIsMobile` hook and establishes patterns for testing viewport and device detection hooks in the Sandro Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Hook Implementation](#hook-implementation)
3. [Testing Strategy](#testing-strategy)
4. [Mock Implementation](#mock-implementation)
5. [Test Cases](#test-cases)
6. [Integration with Components](#integration-with-components)
7. [SSR Compatibility](#ssr-compatibility)
8. [Patterns for Viewport/Device Detection Hooks](#patterns-for-viewportdevice-detection-hooks)

## Introduction

The `useIsMobile` hook provides a responsive utility for detecting mobile devices based on viewport width. This allows components to adapt their behavior and appearance based on the device type. Proper testing ensures that the hook correctly identifies device types across different viewport sizes and handles resize events efficiently.

## Hook Implementation

The `useIsMobile` hook:
- Defines a breakpoint (768px) that separates mobile from desktop
- Uses `window.matchMedia` to detect viewport width
- Uses a debounced event listener to handle resize events efficiently
- Returns a boolean indicating whether the current viewport is considered mobile
- Supports SSR by providing a default value when window is undefined

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 250 // milliseconds

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Debounced handler for resize events
    const onChange = debounce(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, DEBOUNCE_DELAY)
    
    mql.addEventListener("change", onChange)
    
    // Initial check without debounce
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile ?? false
}
```

## Testing Strategy

The testing strategy focuses on six key areas:

1. **Detection Logic**: Test that different viewport sizes are correctly identified as mobile or desktop
2. **Resize Event Handling**: Test that the hook updates when the viewport size changes
3. **Debounce Functionality**: Verify that the debounce mechanism works correctly
4. **Integration with Components**: Test how the hook behaves when used in components
5. **SSR Compatibility**: Verify that the hook works in server-side rendering contexts
6. **Orientation Change Handling**: Test how the hook handles device orientation changes

## Mock Implementation

To test a hook that interacts with browser APIs, we need to mock:

1. **window.matchMedia**: Mock the MediaQueryList API
2. **window.innerWidth**: Mock the viewport width
3. **Timer Functions**: Use Jest's fake timers to test debounce functionality

```tsx
// Mock window.matchMedia
const mockMatchMedia = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock window.innerWidth
function setWindowInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true
  });
}

// Setup in beforeEach
beforeEach(() => {
  // Create a mock implementation of matchMedia
  const createMatchMediaMock = (matches: boolean) => ({
    matches,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  });

  // Set default window.innerWidth
  setWindowInnerWidth(1024);
  
  // Mock matchMedia implementation
  window.matchMedia = mockMatchMedia;
  mockMatchMedia.mockImplementation((query) => {
    // Parse the max-width value from the query
    const maxWidthMatch = query.match(/\(max-width: (\d+)px\)/);
    if (maxWidthMatch) {
      const maxWidth = parseInt(maxWidthMatch[1], 10);
      return createMatchMediaMock(window.innerWidth <= maxWidth);
    }
    return createMatchMediaMock(false);
  });

  // Setup fake timers for debounce testing
  jest.useFakeTimers();
});
```

## Test Cases

### 1. Detection Logic

Test that the hook correctly identifies mobile and desktop viewports based on the defined breakpoint.

```tsx
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
```

### 2. Resize Event Handling

Test that the hook updates when the viewport size changes through the matchMedia event listener.

```tsx
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
});
```

### 3. Debounce Functionality

Test that the debounce mechanism prevents excessive updates during rapid window resizing.

```tsx
describe("Debounce functionality", () => {
  it("should not update immediately on resize", () => {
    setWindowInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    
    // Get the change callback
    const changeCallback = mockAddEventListener.mock.calls[0][1];
    
    // Trigger resize but don't advance timer
    act(() => {
      setWindowInnerWidth(600);
      changeCallback();
    });
    
    // Should still be desktop since debounce hasn't completed
    expect(result.current).toBe(false);
    
    // Advance timer to complete debounce
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
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
```

### 4. Integration with Components

Test how the hook behaves when used in components that need to adapt to mobile/desktop layouts.

```tsx
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

    // Render at mobile width
    setWindowInnerWidth(600);
    const { getByTestId } = render(<TestComponent />);
    
    // Should render mobile view
    expect(getByTestId('test-component')).toHaveTextContent('Mobile View');
  });
});
```

### 5. SSR Compatibility

Test that the hook handles server-side rendering contexts where window is undefined.

```tsx
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
```

### 6. Orientation Change Handling

Test how the hook handles device orientation changes that affect viewport dimensions.

```tsx
describe("Orientation change handling", () => {
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
```

## Integration with Components

The useIsMobile hook can be integrated with components for responsive behavior:

```tsx
function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div className="container">
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

When testing components that use the hook, you should:

1. Mock the hook to return predefined values
2. Test the component with both mobile and desktop states
3. Verify that the component renders correctly in both states

```tsx
// Mock the hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn()
}));

// In your test
import { useIsMobile } from '@/hooks/use-mobile';

describe('ResponsiveComponent', () => {
  it('renders MobileLayout when on mobile', () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    const { container } = render(<ResponsiveComponent />);
    expect(container).toContainElement(screen.getByTestId('mobile-layout'));
  });
  
  it('renders DesktopLayout when on desktop', () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    const { container } = render(<ResponsiveComponent />);
    expect(container).toContainElement(screen.getByTestId('desktop-layout'));
  });
});
```

## SSR Compatibility

For SSR compatibility, the hook needs to handle cases where `window` is undefined:

1. Use type checking for `window` before accessing browser APIs
2. Provide a default value when `window` is undefined
3. Use `React.useEffect` for browser-only code

When testing SSR compatibility:

1. Mock `window` as undefined
2. Verify that the hook returns the default value
3. Verify that no errors are thrown

## Patterns for Viewport/Device Detection Hooks

When creating and testing viewport/device detection hooks, follow these patterns:

### 1. Consistent API Across Hooks

```tsx
// All viewport hooks should follow a consistent naming pattern
const useIsDesktop = () => { ... }
const useIsMobile = () => { ... }
const useIsTablet = () => { ... }

// All hooks should return a boolean
// Optional: return additional properties like breakpoint values
```

### 2. Shared Mock Utilities

Create shared utilities for testing viewport hooks:

```tsx
// __tests__/utils/viewport-test-utils.tsx
export function mockViewport(width: number, height?: number) {
  // Implementation that mocks window.innerWidth and window.matchMedia
}

export function triggerResize(width: number, height?: number) {
  // Implementation that triggers resize events
}

export function createViewportWrapper(width: number) {
  // HOC that wraps components for testing with specific viewport
}
```

### 3. Testing Media Features Beyond Width

For hooks that detect features beyond width:

```tsx
// Mock additional media features
function mockMediaFeatures(features: {
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape';
  prefersColorScheme?: 'light' | 'dark';
  prefersReducedMotion?: boolean;
}) {
  // Implementation
}
```

### 4. Dynamic Breakpoint Testing

For hooks with configurable breakpoints:

```tsx
it('uses custom breakpoints when provided', () => {
  const { result } = renderHook(() => useIsMobile({ breakpoint: 600 }));
  
  // Test with various widths around custom breakpoint
  setWindowInnerWidth(599);
  expect(result.current).toBe(true);
  
  setWindowInnerWidth(600);
  expect(result.current).toBe(false);
});
```

### 5. Common Test Structure for All Viewport Hooks

All viewport/device detection hooks should test:

1. Basic detection based on viewport size
2. Event listener registration and cleanup
3. Response to viewport changes
4. Debounce functionality
5. SSR compatibility
6. Integration with components

By following these patterns, we ensure consistent, reliable viewport detection across the application, with thorough test coverage for all responsive behaviors. 