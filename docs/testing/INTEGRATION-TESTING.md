# Integration Testing Documentation

This document outlines our approach to integration testing in the Sandro Portfolio project, focusing on how components work together within pages and features.

## Integration Testing Goals

Integration tests verify that individual components work correctly when combined into larger features or pages. Our integration tests:

1. Test the **entire page structure** including all sections
2. Verify that **all components render correctly** when used together
3. Test **navigation and routing** between different sections
4. Verify **performance optimizations** like lazy loading work in the integrated context
5. Test **initial data fetching** as it applies to the entire page
6. Validate that **responsive layouts** work cohesively across viewport sizes
7. Ensure **accessibility** requirements are maintained at the page level

## Main Page Integration Test

We've implemented a comprehensive integration test for the main photographer portfolio page (`app/page.tsx`). This is our primary landing page that integrates multiple section components.

### Test Structure

Our main page integration test is located at: `__tests__/app/page.test.tsx`

The test is structured into the following sections:

#### 1. Mock Component Setup

We mock each section component to isolate the integration test from individual component implementation details:

```tsx
jest.mock("@/components/layout/Header", () => ({
  Header: () => <div data-testid="mock-header">Header Component</div>
}))

// Additional component mocks...
```

This approach allows us to:
- Focus on the integration aspects rather than component internals
- Maintain stable tests even when component implementations change
- Improve test performance and reliability

#### 2. Page Structure Tests

Tests that verify the main page container has the correct structure:

```tsx
describe("Page Structure", () => {
  it("renders the main page container with correct classes", () => {
    render(<Page />)
    
    const mainContainer = screen.getByText(/Hero Section/i).closest('div')
    expect(mainContainer).toHaveClass("min-h-screen", "bg-black", "text-white")
  })
  
  it("renders all sections in the correct order", () => {
    // Tests that sections are ordered correctly
  })
})
```

#### 3. Section Rendering Tests

Tests that verify all expected section components are correctly rendered:

```tsx
describe("Section Rendering", () => {
  it("renders all section components", () => {
    render(<Page />)
    
    // Check that each section is rendered
    expect(screen.getByTestId("mock-header")).toBeInTheDocument()
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument()
    // Additional section checks...
  })
})
```

#### 4. Performance Optimization Tests

Tests that verify performance optimizations like hydration suppression:

```tsx
describe("Performance Optimizations", () => {
  it("uses suppressHydrationWarning for hydration optimization", () => {
    render(<Page />)
    
    const mainContainer = screen.getByText(/Hero Section/i).closest('div')
    expect(mainContainer).toHaveAttribute("suppressHydrationWarning")
  })
})
```

#### 5. Responsive Layout Tests

Tests that verify the page renders correctly at different viewport sizes:

```tsx
describe("Responsive Layout", () => {
  it("renders correctly on mobile viewport", async () => {
    // Render at mobile viewport width
    renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE - 1 })
    
    // Verify all sections are present at this viewport
  })
  
  // Additional tests for tablet and desktop viewports
})
```

#### 6. Accessibility Tests

Tests that verify the entire page meets accessibility requirements:

```tsx
describe("Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Page />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Integration Testing Tools

We use several specialized utilities for integration testing:

### 1. Viewport Testing Utilities

Located in `__tests__/utils/viewport-test-utils.tsx`, these tools allow testing at different screen sizes:

```tsx
import { 
  renderAtViewport, 
  BREAKPOINTS,
  setupForBreakpointTesting 
} from "@/__tests__/utils/viewport-test-utils"

// Setup
const { cleanupForBreakpointTesting } = setupForBreakpointTesting()

// Rendering at specific viewport
renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE - 1 })

// Cleanup
afterAll(() => {
  cleanupForBreakpointTesting()
})
```

### 2. Accessibility Testing

We use jest-axe to verify accessibility compliance:

```tsx
import { axe, toHaveNoViolations } from "jest-axe"

// Add matcher
expect.extend(toHaveNoViolations)

// Test accessibility
const { container } = render(<Page />)
const results = await axe(container)
expect(results).toHaveNoViolations()
```

## Key Testing Patterns

### 1. Mock Dependencies, Test Integration

We mock individual section components while testing how they're integrated:

```tsx
// Mock individual components
jest.mock("@/components/sections/Hero", () => ({
  Hero: () => <div data-testid="mock-hero">Hero Section</div>
}))

// Test their integration
expect(screen.getByTestId("mock-hero")).toBeInTheDocument()
```

### 2. Verify Section Order

We verify that sections appear in the correct order on the page:

```tsx
const allContent = screen.getByText(/Hero Section/i).closest('div')?.innerHTML
if (allContent) {
  // Check that components appear in the correct order
  const components = [
    "mock-header",
    "mock-hero",
    // More components...
  ]
  
  let lastIndex = -1
  for (const component of components) {
    const currentIndex = allContent.indexOf(component)
    expect(currentIndex).toBeGreaterThan(lastIndex)
    lastIndex = currentIndex
  }
}
```

### 3. Test at Multiple Viewport Sizes

We test at multiple viewport sizes to ensure responsive behavior:

```tsx
// Mobile
renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE - 1 })

// Tablet
renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE + 1 })

// Desktop
renderAtViewport(<Page />, { width: BREAKPOINTS.DESKTOP + 1 })
```

## Future Integration Testing Enhancements

As the application grows, we plan to enhance our integration tests with:

1. **Navigation Testing**: Once section navigation is implemented, we will add tests to verify correct scrolling/navigation behavior
2. **Data Fetching**: When API data fetching is integrated, we will add tests to verify data loading states and error handling
3. **Animation Testing**: Add tests for page transition animations and scroll-based animations
4. **State Management**: Test global state management across components
5. **User Flows**: Test complete user journeys across multiple interactions

## Running Integration Tests

Integration tests are run alongside all other tests:

```bash
# Run all tests
npm test

# Run just the page integration tests
npm test -- -t "Photographer Portfolio Page Integration Tests"
``` 