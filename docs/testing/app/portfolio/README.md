# Portfolio Page Component Tests

This document outlines the testing approach for the Portfolio page component, which displays a filterable collection of photography and videography work.

## Test Coverage

The test suite covers the following aspects of the Portfolio page:

1. **Page Rendering**
   - Verification of page structure and container styling
   - Rendering of title and description text
   - Presence of category filter buttons
   - Display of portfolio items grid

2. **Filtering/Categorization**
   - Default behavior showing all portfolio items
   - Filtering functionality for "Stills" category
   - Filtering functionality for "Motion" category
   - Empty state handling for categories with no items

3. **Portfolio Item Display**
   - Verification of still image rendering with correct elements
   - Verification of motion video rendering with play button and duration
   - Item title and description overlay on hover

4. **Interactions with Portfolio Items**
   - Hover effects showing overlay with details
   - Button behavior for stills vs. motion items
   - "Load More" button functionality

5. **Loading States**
   - Presence of a separate loading component for the page

6. **Responsive Layout**
   - Mobile viewport rendering with hamburger menu
   - Desktop viewport rendering with visible navigation
   - Image optimization attributes for responsive display

## Key Testing Approach

### 1. Test Isolation

We use mock data instead of real API calls to ensure tests are isolated and reliable. The portfolio items are included in the component itself, making this approach straightforward.

### 2. Testing UI Components

We use React Testing Library's `render`, `screen`, and `within` functions to test the UI components, focusing on:
- Presence of elements
- Correct text content 
- Class names for styling
- Accessibility attributes
- Element relationships

### 3. Testing Interactivity

We use `userEvent` to simulate user interactions such as:
- Clicking filter buttons
- Hovering over portfolio items
- Clicking "View Photo/Video" buttons
- Clicking "Load More" button

Example of testing hover interaction:
```tsx
// Get portfolio item
const item = screen.getAllByTestId("portfolio-item")[0]

// Hover over the item
await user.hover(item)

// The overlay should now be visible
const overlay = within(item).getByTestId("item-overlay")
expect(overlay).toHaveClass("opacity-100")
```

### 4. Testing Responsive Behavior

We use the `renderAtViewport` utility to test responsive behavior at different viewport sizes:
- Mobile viewport (below 768px)
- Desktop viewport (above 1280px)

This allows us to verify that:
- The navigation toggles between hamburger menu and full navigation
- The grid layout adjusts to different screen sizes
- Elements are appropriately sized and positioned

### 5. Testing Filtering Logic

We test the category filtering to ensure:
- The correct filter button is visually active
- The displayed items match the selected category
- Category-specific elements (play button, duration) appear only for the right categories

## Implementation Details

### Test Data

We use the sample portfolio data defined in the component for testing. This consists of:
- Still photo items (with id, title, category, image, description)
- Motion video items (same fields plus duration)

### Component Mocks

For testing, we:
- Mock Next.js Image component to render as a regular img with test attributes
- Add test IDs to key elements in the component for reliable selection
- Mock functions like `console.log` to verify callback execution

### Important Selectors Used

- `[data-testid="portfolio-item"]` - Portfolio item containers
- `[data-testid="item-overlay"]` - Hover overlay for portfolio items
- `[data-testid="play-icon"]` - Play icon for motion items
- `[role="region"][aria-label="Portfolio gallery"]` - Portfolio grid container

## Challenges and Solutions

### 1. Testing Hover States

Challenge: Testing hover interactions can be tricky in JSDOM.

Solution: We use:
- `userEvent.hover()` for simulating hover
- CSS classes that change on hover (opacity-0 → opacity-100)
- Explicit test IDs to target overlay elements

### 2. Testing Responsive Layout

Challenge: Testing responsive layouts requires manipulating viewport size.

Solution: We created and used:
- `renderAtViewport` utility that sets window dimensions
- `BREAKPOINTS` constants for consistent viewport sizes
- Class assertions to verify responsive grid classes

### 3. Testing Category Filtering

Challenge: Testing that filtering shows the correct items based on category.

Solution:
- Count total items after filtering
- Check for category-specific elements (e.g., play button)
- Test "no items" state for empty categories

## Future Test Improvements

1. **Integration with API**: When portfolio data comes from an API, add tests for:
   - Data fetching states
   - Error handling
   - Dynamic rendering based on fetched data

2. **Modal/Detail View**: If implementing a modal or detail view:
   - Test modal opening/closing
   - Test keyboard navigation and accessibility
   - Test image gallery navigation if applicable

3. **Pagination or Infinite Scroll**: For large portfolios:
   - Test pagination controls
   - Test loading more items
   - Test intersection observer for infinite scroll

4. **Search Functionality**: If search is added:
   - Test search input
   - Test filtering by search terms
   - Test highlighting of search matches 