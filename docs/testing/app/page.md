# Main Page Integration Test

This document provides detailed documentation for the integration test of the main photographer portfolio page component located at `app/page.tsx`.

## Test File Location

The main page integration test is implemented in:

```
__tests__/app/page.test.tsx
```

## Purpose

This integration test verifies that the main page correctly integrates all section components and functions as expected. Unlike component unit tests that focus on individual components in isolation, this integration test ensures the entire page works cohesively.

## Test Coverage

The test covers the following aspects of the main page:

1. **Overall Page Structure** - Testing the main container and its properties
2. **Section Rendering** - Verifying all section components render correctly
3. **Section Order** - Ensuring sections appear in the correct sequence
4. **Performance Optimizations** - Testing hydration optimizations
5. **Responsive Layout** - Testing the page at different viewport sizes
6. **Accessibility** - Ensuring the page meets accessibility requirements

## Testing Approach

### Mock Components

We mock each section component to isolate the page integration logic from the implementation details of individual components:

```tsx
jest.mock("@/components/layout/Header", () => ({
  Header: () => <div data-testid="mock-header">Header Component</div>
}))

jest.mock("@/components/sections/Hero", () => ({
  Hero: () => <div data-testid="mock-hero">Hero Section</div>
}))

// Additional component mocks...
```

This approach allows us to focus solely on how the page integrates these components rather than testing the components themselves, which should be covered by their own unit tests.

### Page Structure Tests

We test that the main page container has the expected structure and styling:

```tsx
it("renders the main page container with correct classes", () => {
  render(<Page />)
  
  const mainContainer = screen.getByText(/Hero Section/i).closest('div')
  expect(mainContainer).toHaveClass("min-h-screen", "bg-black", "text-white")
})
```

We also verify that all sections are present and in the correct order:

```tsx
it("renders all sections in the correct order", () => {
  render(<Page />)
  
  const allContent = screen.getByText(/Hero Section/i).closest('div')?.innerHTML
  if (allContent) {
    // Check that components appear in the correct order
    const components = [
      "mock-header",
      "mock-hero",
      "mock-media-categories",
      "mock-featured-work",
      "mock-about",
      "mock-testimonials",
      "mock-contact",
      "mock-instagram",
      "mock-footer"
    ]
    
    // This will fail if the order is incorrect
    let lastIndex = -1
    for (const component of components) {
      const currentIndex = allContent.indexOf(component)
      expect(currentIndex).toBeGreaterThan(lastIndex)
      lastIndex = currentIndex
    }
  }
})
```

### Performance Optimization Tests

We test that the page correctly implements performance optimizations like hydration suppression:

```tsx
it("uses suppressHydrationWarning for hydration optimization", () => {
  render(<Page />)
  
  const mainContainer = screen.getByText(/Hero Section/i).closest('div')
  expect(mainContainer).toHaveAttribute("suppressHydrationWarning")
})
```

### Responsive Layout Tests

We test that the page renders correctly at different viewport sizes using the viewport testing utilities:

```tsx
it("renders correctly on mobile viewport", async () => {
  // Render at mobile viewport width
  renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE - 1 })
  
  // Assert all sections are present
  expect(screen.getByTestId("mock-header")).toBeInTheDocument()
  expect(screen.getByTestId("mock-hero")).toBeInTheDocument()
  // Additional assertions...
})
```

Similar tests are implemented for tablet and desktop viewports.

### Accessibility Tests

We test that the page meets accessibility requirements using the jest-axe library:

```tsx
it("has no accessibility violations", async () => {
  const { container } = render(<Page />)
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Test Setup and Utilities

The test leverages several utilities:

1. **Viewport Testing Utilities** - For testing at different screen sizes
2. **jest-axe** - For accessibility testing
3. **React Testing Library** - For rendering and querying components

The test also includes proper setup and cleanup:

```tsx
// Setup for responsive layout testing
const { cleanupForBreakpointTesting } = setupForBreakpointTesting()

// Cleanup after all tests
afterAll(() => {
  cleanupForBreakpointTesting()
  jest.restoreAllMocks()
})
```

## Current Limitations

The current integration test has some limitations:

1. **No Navigation Testing** - As the page doesn't currently implement section navigation
2. **No Data Fetching Tests** - As the page doesn't currently implement data fetching
3. **Limited Animation Testing** - No tests for animations or transitions yet

## Future Enhancements

As the page evolves, the integration test should be enhanced to cover:

1. Section navigation when implemented
2. Data fetching for dynamic content
3. Animation and transition behaviors
4. User interaction flows across sections
5. State management across components

## Running the Tests

Run the main page integration test with:

```bash
# Run all tests
npm test

# Run just the page tests
npm test -- -t "Photographer Portfolio Page Integration Tests"
```

## Test Results and Coverage

The integration test provides coverage for the main page component, ensuring that:

1. All sections are correctly integrated
2. The page maintains proper structure
3. The page works at different viewport sizes
4. The page meets accessibility requirements

This complements the unit tests for individual section components, providing end-to-end testing of the main portfolio page. 