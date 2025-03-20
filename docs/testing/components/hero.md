# Hero Section Component Testing

This document outlines the testing strategy and implementation for the Hero section component.

## Component Overview

The Hero section is a full-screen landing component that includes:
- A background image with overlay
- Main headline text
- Subheadline/description text
- Call-to-action buttons for "STILLS" and "MOTION" categories
- Responsive layout adaptations

## Test Coverage

The Hero component tests focus on both content and presentation aspects:

| Aspect | Coverage | Status |
|--------|----------|--------|
| Main headline text | ✅ | Complete |
| Subheadline text | ✅ | Complete |
| CTA buttons | ✅ | Complete |
| Image rendering | ✅ | Complete |
| Responsive layout | ✅ | Complete |
| Styling & overlay | ✅ | Complete |
| Accessibility | ✅ | Complete |

## Test Implementation

The Hero component test file (`/components/sections/Hero.test.tsx`) uses Jest and React Testing Library to test all important aspects of the component:

### Content Tests

- **Headline Text**: Verifies the main heading displays correctly with the "HIGH ALTITUDES HOSTILE ENVIRONMENTS" text
- **Subheadline Text**: Ensures the photographer description text is present
- **CTA Buttons**: Tests both "STILLS" and "MOTION" buttons with correct href links

### Image Tests

- **Image Rendering**: Verifies the hero image loads with correct src path
- **Image Attributes**: Tests proper image properties (alt text, fill, priority)

### Layout & Styling Tests

- **Responsive Classes**: Tests responsive text sizing classes (e.g., `text-4xl md:text-6xl lg:text-7xl`)
- **Container Structure**: Verifies the section has proper height and positioning
- **Overlay Styling**: Tests the overlay has correct background opacity styling

### Accessibility Tests

- **Image Alt Text**: Ensures the hero image has appropriate alt text
- **Heading Structure**: Verifies proper heading hierarchy (h1)
- **Link Accessibility**: Tests that links have meaningful text content
- **Semantic HTML**: Ensures proper semantic structure with section element

## Mock Implementation

The tests include mocks for two Next.js components:

1. **next/image**: Mocked to return a standard img element with data attributes for testing
2. **next/link**: Mocked to render an anchor element with the href prop

## Example Test Cases

```tsx
// Main headline text test
it("renders the main headline text", () => {
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HIGH ALTITUDES HOSTILE ENVIRONMENTS")
})

// CTA buttons test
it("renders the call-to-action buttons", () => {
  expect(screen.getByRole("link", { name: /STILLS/i })).toHaveAttribute("href", "/portfolio?filter=stills")
  expect(screen.getByRole("link", { name: /MOTION/i })).toHaveAttribute("href", "/portfolio?filter=motion")
})

// Responsive layout test
it("has a responsive layout structure", () => {
  // Test container and text responsiveness classes
  const section = document.querySelector("section")
  expect(section).toHaveClass("relative h-screen")
  
  const heading = screen.getByRole("heading", { level: 1 })
  expect(heading).toHaveClass("text-4xl md:text-6xl lg:text-7xl")
  
  const description = screen.getByText("Award-winning action and sports photographer based in New York")
  expect(description).toHaveClass("text-lg md:text-xl")
  
  // Test button container responsive flex layout
  const buttonContainer = document.querySelector(".flex.flex-col.sm\\:flex-row")
  expect(buttonContainer).toHaveClass("flex flex-col sm:flex-row")
})

// Accessibility test
it("meets accessibility requirements", () => {
  // Test image has alt text
  expect(screen.getByAltText("Action photography hero image")).toBeInTheDocument()
  
  // Test heading structure
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  
  // Test links have proper text
  const links = screen.getAllByRole("link")
  links.forEach(link => {
    expect(link).toHaveTextContent(/STILLS|MOTION/)
  })
  
  // Test semantic structure - section element for the hero
  const section = document.querySelector("section")
  expect(section).toBeInTheDocument()
})
```

## Testing Notes

- The tests focus on both rendered content and presentation aspects
- Mock implementations are used for Next.js components to isolate testing of the Hero component
- Responsive layout testing verifies proper class application rather than actual rendering at different screen sizes
- Accessibility testing ensures proper semantic structure and meaningful content
- For elements without ARIA roles (like section), direct DOM querying with document.querySelector is used instead of screen.getByRole

## Future Improvements

- Addition of user interaction tests for the CTA buttons
- Visual regression testing for responsive layouts
- Performance testing for image loading (particularly with the priority attribute)