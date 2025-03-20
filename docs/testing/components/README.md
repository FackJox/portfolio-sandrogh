# UI Component Testing

This document provides guidelines and examples for testing UI components in the Sandro Portfolio project.

## Component Testing Approach

We use React Testing Library to test our UI components, focusing on testing the components from a user's perspective rather than implementation details.

## Tested Components

The following components have comprehensive test coverage:

1. [Button Component](button.md) - Testing various variants, sizes, events, and accessibility
2. [Input Component](input.md) - Testing rendering, controlled input, disabled state, events, accessibility, and ref forwarding
3. [Header Component](header.md) - Testing navigation functionality, responsive behavior, and accessibility

### Recent Additions

The Header component tests were recently added, testing both structure and behavior:
- Tests navigation links and routing
- Tests responsive mobile navigation with Sheet component
- Verifies accessibility features and proper ARIA attributes
- Tests styling and layout using Tailwind classes

The Input component tests were previously added, achieving 100% code coverage across all metrics:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

These tests cover a range of functionalities from basic rendering to complex behaviors like controlled inputs, form submission, and accessibility.

## Testing Radix UI Components

When testing components that use Radix UI primitives:

1. Test the component's accessibility features
2. Verify proper prop forwarding
3. Test state transitions and event handling
4. Verify that variants and sizes work as expected

## Example Test

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies different variants', () => {
    const { rerender } = render(<Button variant="default">Button</Button>);
    
    let button = screen.getByRole('button', { name: /button/i });
    expect(button).toHaveClass('bg-primary');
    
    rerender(<Button variant="destructive">Button</Button>);
    button = screen.getByRole('button', { name: /button/i });
    expect(button).toHaveClass('bg-destructive');
  });
});
```

## Testing Component Composition

For components with multiple parts (e.g., Dialog with Dialog.Trigger, Dialog.Content), test each part individually and then test the integration.

## Mocking Context Providers

When testing components that rely on context providers:

```tsx
// Example: Wrapping a component with ThemeProvider for testing
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';

const customRender = (ui, options) =>
  render(ui, { wrapper: ThemeProvider, ...options });

// use customRender instead of render from RTL
```

## Progress Tracking

The following form components now have complete test coverage:
- Button: 100%
- Checkbox: 100%
- Input: 100%
- InputOTP: ~96%

Our next focus areas include:
- Form component
- Select component
- Textarea component 