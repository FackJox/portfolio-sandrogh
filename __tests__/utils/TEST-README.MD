# Test Utilities Documentation

This directory contains test utility functions that help with testing components, particularly those using Radix UI, React Hook Form, and the project's styling conventions.

## Available Utilities

### Custom Render Function

The `render` function is a custom wrapper around React Testing Library's render function. It provides a way to wrap components in necessary providers.

```tsx
import { render } from '@/__tests__/utils/test-utils';

test('renders component with providers', () => {
  const { getByText } = render(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

The render function accepts additional options:

```tsx
render(<MyComponent />, {
  theme: 'dark', // 'light', 'dark', or 'system'
  route: '/dashboard', // Set the current route
  withTooltipProvider: true, // Wrap with TooltipProvider for testing tooltips
});
```

#### Theme Script Handling

The custom render function includes special handling to prevent theme script injection in tests, which can interfere with assertions:

```tsx
// Theme script is automatically disabled in tests
render(<MyComponent />);

// For advanced theme testing, you can use the ThemeProvider directly
render(
  <ThemeProvider attribute="class" defaultTheme="dark" disableScript={true}>
    <MyComponent />
  </ThemeProvider>
);
```

When testing components that might be affected by theme scripts:
- Use `data-testid` attributes for selection instead of relying on DOM structure
- Avoid direct assertions on `textContent` which might contain theme script code
- Prefer testing styles, attributes, and class names over text content

### Tailwind Class Testing Helpers

These utilities help testing components that use Tailwind CSS classes through the `cn()` utility.

#### `hasClasses`

Checks if an element has all the specified Tailwind classes.

```tsx
import { render, hasClasses } from '@/__tests__/utils/test-utils';

test('component has correct classes', () => {
  const { getByRole } = render(<Button variant="primary" size="lg" />);
  const button = getByRole('button');
  
  expect(hasClasses(button, 'bg-primary', 'text-white', 'px-4', 'py-2')).toBe(true);
});
```

#### `hasAnyClass`

Checks if an element has any of the specified Tailwind classes.

```tsx
import { render, hasAnyClass } from '@/__tests__/utils/test-utils';

test('component has at least one of the variant classes', () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  expect(hasAnyClass(button, 'bg-primary', 'bg-secondary', 'bg-accent')).toBe(true);
});
```

#### `compareClasses`

Compares if the rendered classes match exactly with expected classes.

```tsx
import { render, compareClasses } from '@/__tests__/utils/test-utils';

test('classes are exactly as expected', () => {
  const { getByRole } = render(<Button className="custom-class" variant="primary" />);
  const button = getByRole('button');
  
  expect(compareClasses(
    button.className,
    ['px-4', 'py-2', 'bg-primary', 'text-white', 'custom-class']
  )).toBe(true);
});
```

### Data Attribute Testing Helpers

Utilities for testing components that use data attributes for state management.

#### `hasDataAttribute`

Checks if an element has a specific data attribute with an optional value.

```tsx
import { render, hasDataAttribute } from '@/__tests__/utils/test-utils';

test('component has correct data attribute', () => {
  const { getByRole } = render(<Button data-state="open" />);
  const button = getByRole('button');
  
  expect(hasDataAttribute(button, 'state', 'open')).toBe(true);
  expect(hasDataAttribute(button, 'state')).toBe(true);
  expect(hasDataAttribute(button, 'state', 'closed')).toBe(false);
});
```

### OTPInputContext Mock Helpers

Utilities for testing components that use the OTPInputContext from the input-otp library.

#### `createMockOTPContext`

Creates a mock OTP context with customizable slot values.

```tsx
import { createMockOTPContext } from '@/__tests__/utils/test-utils';

const mockContext = createMockOTPContext([
  { char: '1', isActive: true },
  { char: '2' },
  { char: '3' },
  { char: '4' }
]);
```

#### `renderWithOTPContext`

Renders a component within a mocked OTP context.

```tsx
import { renderWithOTPContext, createMockOTPContext } from '@/__tests__/utils/test-utils';

test('OTP input displays correctly', () => {
  const mockContext = createMockOTPContext([
    { char: '1', isActive: true },
    { char: '2' }
  ]);
  
  const { getByText } = renderWithOTPContext(<InputOTPSlot index={0} />, mockContext);
  expect(getByText('1')).toBeInTheDocument();
});
```

### React Hook Form Testing Utilities

Utilities for testing components that use React Hook Form.

#### `renderWithForm`

Renders a component within a React Hook Form context with optional schema validation.

```tsx
import { renderWithForm } from '@/__tests__/utils/test-utils';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

test('form renders with validation', () => {
  const { getByRole } = renderWithForm(
    <form>
      <input name="email" />
      <input name="password" type="password" />
    </form>,
    {
      schema,
      defaultValues: {
        email: 'test@example.com',
        password: 'password123'
      }
    }
  );
  
  expect(getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  expect(getByRole('textbox', { name: /password/i })).toBeInTheDocument();
});
```

### Radix UI Component Testing Utilities

Utilities for testing Radix UI components with state changes.

#### `createRadixTester`

Creates a helper for testing Radix UI components that have open/close states.

```tsx
import { render, createRadixTester } from '@/__tests__/utils/test-utils';

test('dropdown opens and closes', async () => {
  const result = render(
    <Dropdown>
      <DropdownTrigger>Open</DropdownTrigger>
      <DropdownContent>Content</DropdownContent>
    </Dropdown>
  );
  
  const dropdown = createRadixTester(
    result,
    '[role="button"]', // trigger selector
    '[role="menu"]', // content selector
    'open', // open state
    'closed' // closed state
  );
  
  expect(dropdown.isOpen()).toBe(false);
  
  await dropdown.open();
  expect(dropdown.isOpen()).toBe(true);
  
  await dropdown.close();
  expect(dropdown.isOpen()).toBe(false);
});
```

### Browser Mocks

Utilities for mocking browser behavior in tests.

#### `mockWindowResize`

Simulates window resize events.

```tsx
import { mockWindowResize } from '@/__tests__/utils/test-utils';

test('component responds to window resize', () => {
  // Simulate mobile viewport
  const cleanup = mockWindowResize(375, 667);
  
  // Test mobile-specific behavior
  expect(screen.getByTestId('mobile-menu')).toBeVisible();
  
  // Clean up after test
  cleanup();
});
```

#### `mockNavigation`

Mocks the browser navigation functions.

```tsx
import { mockNavigation } from '@/__tests__/utils/test-utils';

test('navigation works correctly', () => {
  mockNavigation.push('/dashboard');
  expect(mockNavigation.getCurrentPath()).toBe('/dashboard');
  
  mockNavigation.replace('/settings');
  expect(mockNavigation.getCurrentPath()).toBe('/settings');
  
  // For testing back/forward buttons
  mockNavigation.back();
  mockNavigation.forward();
});
```

### User Event Setup

A wrapper around Testing Library's userEvent for simulating user interactions.

```tsx
import { setupUserEvent } from '@/__tests__/utils/test-utils';

test('user interaction works', async () => {
  const user = setupUserEvent();
  
  await user.click(screen.getByRole('button'));
  await user.type(screen.getByRole('textbox'), 'Hello world');
  
  // With options
  const customUser = setupUserEvent({ 
    advanceTimers: true, 
    skipHover: true 
  });
});
```

### Custom Queries

Additional query functions to supplement Testing Library's built-in queries.

#### Class-based Queries

```tsx
import { customQueries } from '@/__tests__/utils/test-utils';

test('finds elements by class', () => {
  const { container } = render(<div className="test-class">Content</div>);
  
  const element = customQueries.getByClass(container, 'test-class');
  expect(element).toBeInTheDocument();
  
  const elements = customQueries.getAllByClass(container, 'test-class');
  expect(elements).toHaveLength(1);
  
  // Query variants (don't throw if not found)
  const maybeElement = customQueries.queryByClass(container, 'maybe-class');
  const maybeElements = customQueries.queryAllByClass(container, 'maybe-class');
});
```

#### Data Attribute Queries

```tsx
import { customQueries } from '@/__tests__/utils/test-utils';

test('finds elements by data attribute', () => {
  const { container } = render(
    <div>
      <div data-state="open">Open Content</div>
      <div data-state="closed">Closed Content</div>
    </div>
  );
  
  const openElement = customQueries.getByDataAttr(container, 'state', 'open');
  expect(openElement.textContent).toBe('Open Content');
  
  const stateElements = customQueries.getAllByDataAttr(container, 'state');
  expect(stateElements).toHaveLength(2);
  
  // Query variants (don't throw if not found)
  const maybeElement = customQueries.queryByDataAttr(container, 'state', 'maybe');
  const maybeElements = customQueries.queryAllByDataAttr(container, 'maybe');
});
```

## Best Practices

1. Use the custom `render` function instead of the default one from React Testing Library
2. Use the Tailwind class helpers when testing styling rather than testing raw class strings
3. When testing OTP components, use the OTP context mock utilities to simulate different states
4. Use `mockWindowResize` to test responsive behavior
5. Use `setupUserEvent` instead of directly importing userEvent for consistent behavior
6. Use the customQueries for specialized DOM selection needs
7. Use `renderWithForm` when testing form components with React Hook Form
8. Use `createRadixTester` for testing Radix UI components with state changes
9. Use data attribute queries when testing components that use data attributes for state
10. Always clean up mocks and event listeners after tests 

### Integration Testing

When testing how components work together as a cohesive unit:

1. Use mocked versions of individual components to isolate the integration testing
2. Test the overall page structure and component ordering
3. Verify responsive behavior at different viewport sizes
4. Test performance optimizations like hydration suppression
5. Test accessibility at the page level using jest-axe

For a complete example of integration testing, see:

- [Main Page Integration Test](__tests__/app/page.test.tsx) - Integration test for the entire portfolio page
- [Integration Testing Documentation](../docs/testing/INTEGRATION-TESTING.md) - Comprehensive documentation of our integration testing approach
- [Main Page Test Documentation](../docs/testing/app/page.md) - Specific documentation for the main page integration test

Key integration testing patterns:

```tsx
// Mock component dependencies
jest.mock("@/components/sections/Hero", () => ({
  Hero: () => <div data-testid="mock-hero">Hero Section</div>
}))

// Test page structure
const mainContainer = screen.getByText(/Hero Section/i).closest('div')
expect(mainContainer).toHaveClass("min-h-screen", "bg-black", "text-white")

// Test component ordering
const components = ["mock-header", "mock-hero", /* ... */]
let lastIndex = -1
for (const component of components) {
  const currentIndex = allContent.indexOf(component)
  expect(currentIndex).toBeGreaterThan(lastIndex)
  lastIndex = currentIndex
}

// Test at different viewport sizes
renderAtViewport(<Page />, { width: BREAKPOINTS.MOBILE - 1 })

// Test accessibility
const results = await axe(container)
expect(results).toHaveNoViolations()
``` 