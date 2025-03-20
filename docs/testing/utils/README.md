# Test Utilities

This document explains the test utilities available in the `__tests__/utils/test-utils.tsx` file to help with testing components that use Radix UI and the project's styling conventions.

## Custom Render Function

The `render` function is a custom wrapper around React Testing Library's render function that provides a consistent way to render components with necessary providers:

```tsx
import { render } from '@/__tests__/utils/test-utils';

test('renders component with providers', () => {
  const { getByText } = render(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

This ensures that all component tests are wrapped with the same providers, maintaining consistency across tests.

## Tailwind Class Testing Helpers

The test utilities include several helper functions for testing Tailwind CSS classes applied to components through the `cn()` utility.

### `hasClasses`

Tests if an element has all the specified Tailwind classes:

```tsx
import { render, hasClasses } from '@/__tests__/utils/test-utils';

test('button has correct primary variant classes', () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  expect(hasClasses(button, 'bg-primary', 'text-primary-foreground')).toBe(true);
});
```

### `hasAnyClass`

Tests if an element has any of the specified Tailwind classes:

```tsx
import { render, hasAnyClass } from '@/__tests__/utils/test-utils';

test('button has at least one of the expected size classes', () => {
  const { getByRole } = render(<Button size="lg" />);
  const button = getByRole('button');
  
  expect(hasAnyClass(button, 'h-9', 'h-10', 'h-11')).toBe(true);
});
```

### `compareClasses`

Compares if the rendered classes match exactly with expected classes:

```tsx
import { render, compareClasses } from '@/__tests__/utils/test-utils';

test('button classes match expected classes', () => {
  const { getByRole } = render(<Button variant="primary" size="lg" />);
  const button = getByRole('button');
  
  expect(compareClasses(
    button.className,
    ['bg-primary', 'text-primary-foreground', 'h-11', 'px-8']
  )).toBe(true);
});
```

## OTP Input Context Utilities

The test utilities provide helper functions for testing components that use the OTPInputContext from the input-otp library.

### `createMockOTPContext`

Creates a mock OTP context with customizable slot values:

```tsx
import { createMockOTPContext } from '@/__tests__/utils/test-utils';

const mockContext = createMockOTPContext([
  { char: '1', isActive: true },
  { char: '2' },
  { char: '3' },
  { char: '4' }
]);
```

### `renderWithOTPContext`

Renders a component within a mocked OTP context:

```tsx
import { renderWithOTPContext, createMockOTPContext } from '@/__tests__/utils/test-utils';
import { InputOTPSlot } from '@/components/ui/form/input-otp';

test('input OTP slot displays correctly with active state', () => {
  const mockContext = createMockOTPContext([
    { char: '1', isActive: true }
  ]);
  
  const { getByText, getByRole } = renderWithOTPContext(
    <InputOTPSlot index={0} />, 
    mockContext
  );
  
  expect(getByText('1')).toBeInTheDocument();
  expect(getByRole('div')).toHaveClass('ring-2', 'ring-ring');
});
```

## Best Practices

When using these test utilities, follow these best practices:

1. Always use the custom `render` function instead of the default React Testing Library render
2. Use the Tailwind class helpers to test styling rather than testing raw className strings
3. When testing component variants, focus on testing the applied classes rather than the specific visual appearance
4. For components that use contexts (like the OTP input), use the context mock utilities to test different states

For more comprehensive examples, refer to existing component tests in the codebase. 