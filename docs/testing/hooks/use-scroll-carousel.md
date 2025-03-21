# useScrollCarousel Hook Testing

This document provides an overview of the testing approach for the `useScrollCarousel` hook, which powers the scroll-based carousel functionality in the portfolio.

## Overview

The `useScrollCarousel` hook manages scroll-based carousel interaction, allowing content to change as users scroll through a section. It tracks scroll position, calculates progress, determines which item should be displayed, and handles the "sticky" behavior of the carousel.

## Test Coverage

The tests for `useScrollCarousel` focus on the following aspects:

1. **Initialization**: Verifying default state values and parameter handling
2. **Scroll Behavior**: Testing the core functionality related to scroll events
3. **Boundary Conditions**: Testing edge cases at the start and end of the carousel
4. **Window Event Handling**: Ensuring proper event listener management
5. **Component Integration**: Testing the hook in a component context

## Test Setup

The tests mock the DOM environment, particularly:

- The `getBoundingClientRect` method to simulate element positioning
- The window `scrollY` property to simulate scroll position
- Scroll events using a custom `simulateScroll` utility

```tsx
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
```

## Test Categories

### Initialization Tests

These tests verify that the hook initializes correctly with different parameters:

- Default state values (`isSticky`, `hasScrolledThrough`, `progress`, `activeIndex`)
- Calculation of `totalScrollHeight` based on `itemCount`
- Handling of null refs

### Scroll Behavior Tests

These tests focus on the core functionality of the hook:

- Transition to "sticky" state when scrolling to top of carousel
- Progress calculation based on scroll position
- Active index updates based on scroll progress
- State transitions when reaching the end of the carousel
- State reset when scrolling back up

### Boundary Condition Tests

These tests verify the hook's behavior at edge cases:

- Scrolling past the end of the carousel
- Handling single-item carousels
- Handling extremely large item counts

### Window Event Handling Tests

These tests ensure proper management of event listeners:

- Adding scroll event listener on mount
- Removing scroll event listener on unmount
- Handling rapid consecutive scroll events

### Component Integration Tests

These tests verify that the hook works correctly within a React component:

- Rendering a component that uses the hook
- Initial state rendering

## Testing Challenges

1. **DOM Simulation**: Accurately simulating the scroll behavior and element positioning requires careful mocking of the DOM API.
2. **Timing-Dependent Behavior**: Scroll events can fire rapidly, requiring tests to handle potential race conditions.
3. **Complex State Transitions**: The hook manages multiple interrelated state values that change based on scroll position.

## Example Test Case

```tsx
// Example test for updating activeIndex based on scroll progress
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
});
```

## Test Mocks

The tests use the following mocks:

1. **Ref Mock**: A mock ref object with a div element
2. **getBoundingClientRect Mock**: Mocks the DOM API for getting element dimensions and position
3. **Window Object Mocks**: Mocks for window.scrollY and scrollTo
4. **Event Listener Spies**: Spies on addEventListener and removeEventListener

## Future Test Improvements

1. **Performance Testing**: Add tests for measuring the performance impact of scroll event handling
2. **Real DOM Testing**: Consider using a more realistic DOM environment (like jsdom) for more comprehensive integration tests
3. **Visual Regression Testing**: Add visual tests for the carousel component that uses this hook
4. **Accessibility Testing**: Test keyboard navigation and screen reader compatibility for the carousel component

## Conclusion

The `useScrollCarousel` hook tests provide comprehensive coverage of the hook's functionality, ensuring it correctly tracks scroll position, manages carousel state, and integrates properly with React components. The tests handle a variety of edge cases and boundary conditions to verify robust behavior across different usage scenarios. 