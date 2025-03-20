# Component Testing Guidelines

This document provides comprehensive guidelines for testing UI components in the Sandro Portfolio project, with a focus on ensuring component quality, functionality, and accessibility.

## Core Testing Principles

1. **Test behavior, not implementation details**
2. **Focus on user interaction patterns**
3. **Ensure accessibility compliance**
4. **Verify proper styling and appearance**
5. **Test all component variants and states**

## Testing Presentation

### Visual Rendering

When testing how components render visually:

1. Verify the component renders without errors
2. Check that the component displays the expected content
3. Test that all expected elements are in the DOM
4. Verify class names for styling are applied correctly

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { hasClasses } from '@/__tests__/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text content', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
  });

  it('applies correct default styling', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(hasClasses(button, [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'text-sm',
      'font-medium',
    ])).toBe(true);
  });
});
```

### Testing Component Variants

For components with multiple variants:

1. Test each variant separately
2. Verify correct styling for each variant
3. Test combination of variants where applicable
4. Check for proper class application based on props

Example:

```tsx
it('applies correct classes for primary variant', () => {
  render(<Button variant="primary">Primary Button</Button>);
  const button = screen.getByRole('button');
  expect(hasClasses(button, [
    'bg-primary',
    'text-primary-foreground',
    'hover:bg-primary/90',
  ])).toBe(true);
});

it('applies correct classes for outline variant', () => {
  render(<Button variant="outline">Outline Button</Button>);
  const button = screen.getByRole('button');
  expect(hasClasses(button, [
    'border',
    'border-input',
    'bg-background',
    'hover:bg-accent',
    'hover:text-accent-foreground',
  ])).toBe(true);
});
```

## Testing Behavior

### User Interactions

Test how components respond to user interactions:

1. Test click handlers and other event callbacks
2. Verify state changes after interactions
3. Test keyboard interactions
4. Verify proper focus management

Example:

```tsx
it('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  const button = screen.getByRole('button');
  
  userEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('handles keyboard interaction', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Press Enter</Button>);
  const button = screen.getByRole('button');
  
  button.focus();
  userEvent.keyboard('{enter}');
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### State Changes

For components with internal state:

1. Test initial state rendering
2. Test state transitions
3. Verify correct rendering for different states
4. Test controlled vs. uncontrolled behavior

## Testing Accessibility

### ARIA Attributes

Test proper implementation of accessibility features:

1. Verify correct ARIA roles
2. Test ARIA attributes based on component state
3. Verify ARIA labels and descriptions
4. Test focus management and keyboard navigation

Example:

```tsx
it('has correct ARIA attributes', () => {
  render(<Button aria-label="Submit Form">Submit</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveAttribute('aria-label', 'Submit Form');
});

it('applies aria-disabled when disabled', () => {
  render(<Button disabled>Disabled Button</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveAttribute('disabled');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});
```

### Keyboard Navigation

For components that manage focus:

1. Test tab order
2. Verify focus trapping where appropriate
3. Test escape key functionality
4. Verify proper focus indicators

## Testing with Different Props and States

### Props Testing

Test components with different prop combinations:

1. Test required props
2. Test optional props with different values
3. Test prop types and validation
4. Test prop defaults

Example:

```tsx
it('renders with default props', () => {
  render(<Button>Default</Button>);
  const button = screen.getByRole('button');
  
  // Default variant is "default" and size is "md"
  expect(hasClasses(button, ['bg-primary', 'px-4', 'py-2'])).toBe(true);
});

it('renders with custom className', () => {
  render(<Button className="custom-class">Custom</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveClass('custom-class');
});

it('passes additional props to button element', () => {
  render(<Button data-testid="test-button">Test</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveAttribute('data-testid', 'test-button');
});
```

### Testing Edge Cases

Test component behavior in edge cases:

1. Test with missing or undefined props
2. Test with empty content
3. Test overflow handling
4. Test error states

## Testing Specific Component Types

### Testing Radix UI Components with Proper Context

Radix UI components often require specific context providers and handle complex state management. When testing these components:

1. Use the custom render function with appropriate providers
2. Test state transitions using data attributes
3. Use the `createRadixTester` utility to simplify testing
4. Focus on testing the component API, not the internal implementation

Example:

```tsx
import { render, screen, createRadixTester } from '@/__tests__/utils/test-utils';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('renders closed by default', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );
    
    expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });
  
  it('opens when trigger is clicked', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );
    
    // Use the createRadixTester utility
    const dialogTester = createRadixTester(
      { container } as any,
      '[role="button"]',
      '[role="dialog"]'
    );
    
    // Open dialog
    await dialogTester.open();
    expect(dialogTester.isOpen()).toBe(true);
    expect(screen.getByText('Dialog Content')).toBeVisible();
    
    // Close dialog
    await dialogTester.close();
    expect(dialogTester.isOpen()).toBe(false);
  });
  
  it('handles keyboard interactions', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );
    
    // Open dialog
    const trigger = screen.getByRole('button', { name: /open dialog/i });
    await userEvent.click(trigger);
    
    // Press Escape to close
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });
});
```

### Testing Components with forwardRef

Components using `forwardRef` need testing to ensure the ref is properly forwarded:

1. Create a ref using `React.createRef()`
2. Pass the ref to the component
3. Verify the ref is attached to the correct element
4. Test with and without `asChild` prop if applicable

Example:

```tsx
import * as React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button forwardRef', () => {
  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with Ref</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.textContent).toBe('Button with Ref');
  });
  
  it('forwards ref when using asChild', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Button asChild>
        <a ref={ref} href="https://example.com">Link Button</a>
      </Button>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('A');
    expect(ref.current?.href).toContain('example.com');
    expect(ref.current?.textContent).toBe('Link Button');
  });
  
  it('preserves component functionality with forwarded ref', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const handleClick = jest.fn();
    
    render(<Button ref={ref} onClick={handleClick}>Clickable Button</Button>);
    
    // Can reference the DOM element via ref
    expect(ref.current).toBeInTheDocument();
    
    // Element still functions normally
    await userEvent.click(ref.current!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Components with Multiple Variants (cva)

For components that use class-variance-authority (cva) for styling variants:

1. Test each variant combination systematically
2. Use the `hasClasses` or `compareClasses` utilities to verify class application
3. Test default variants and explicit variants
4. Reference the original `buttonVariants` (or similar) function for expected classes

Example:

```tsx
import { render, screen, hasClasses } from '@/__tests__/utils/test-utils';
import { Button, buttonVariants } from '@/components/ui/button';

describe('Button Variants', () => {
  it('applies default variant classes correctly', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    
    // Use the buttonVariants function to get expected classes
    const expectedClasses = buttonVariants({ variant: 'default', size: 'default' });
    expect(hasClasses(button, expectedClasses)).toBe(true);
  });
  
  it('applies specific variant classes correctly', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    // Test each variant
    for (const variant of variants) {
      const { rerender } = render(<Button variant={variant}>Button</Button>);
      const button = screen.getByRole('button');
      
      // Get expected classes for this variant
      const expectedClasses = buttonVariants({ variant, size: 'default' });
      expect(hasClasses(button, expectedClasses)).toBe(true);
      
      // Cleanup between tests
      rerender(<div />);
    }
  });
  
  it('applies size variant classes correctly', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    // Test each size
    for (const size of sizes) {
      const { rerender } = render(<Button size={size}>Button</Button>);
      const button = screen.getByRole('button');
      
      // Get expected classes for this size
      const expectedClasses = buttonVariants({ variant: 'default', size });
      expect(hasClasses(button, expectedClasses)).toBe(true);
      
      // Cleanup between tests
      rerender(<div />);
    }
  });
  
  it('combines variant and size classes correctly', () => {
    render(<Button variant="outline" size="sm">Small Outline Button</Button>);
    const button = screen.getByRole('button');
    
    const expectedClasses = buttonVariants({ variant: 'outline', size: 'sm' });
    expect(hasClasses(button, expectedClasses)).toBe(true);
  });
  
  it('combines custom className with variant classes', () => {
    render(<Button className="my-custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    
    // Should have both variant classes and custom class
    expect(button).toHaveClass('my-custom-class');
    expect(hasClasses(button, buttonVariants())).toBe(true);
  });
});
```

### Testing Responsive Behaviors

For components with responsive behavior:

1. Use `mockWindowResize` to simulate different viewport sizes
2. Test components at mobile, tablet, and desktop breakpoints
3. Verify that the correct classes or styles are applied at each breakpoint
4. Test interactive behavior that changes based on screen size (e.g., mobile menu)

Example:

```tsx
import { render, screen, mockWindowResize } from '@/__tests__/utils/test-utils';
import { Header } from '@/components/layout/Header';

describe('Header Responsive Behavior', () => {
  // Mock the necessary contexts and Next.js components
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('displays desktop navigation on large screens', () => {
    // Simulate desktop viewport
    const cleanup = mockWindowResize(1280, 800);
    
    render(<Header />);
    
    // Desktop navigation should be visible
    const desktopNav = screen.getByRole('navigation', { name: /main/i });
    expect(desktopNav).toHaveClass('hidden md:flex');
    expect(desktopNav).toBeVisible();
    
    // Mobile menu button should not be visible
    expect(screen.queryByRole('button', { name: /menu/i })).toHaveClass('md:hidden');
    
    cleanup();
  });
  
  it('displays mobile navigation on small screens', () => {
    // Simulate mobile viewport
    const cleanup = mockWindowResize(375, 667);
    
    render(<Header />);
    
    // Mobile menu button should be visible
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileMenuButton).toBeVisible();
    
    // Desktop navigation should be hidden
    const desktopNav = screen.getByRole('navigation', { name: /main/i });
    expect(desktopNav).toHaveClass('hidden md:flex');
    expect(window.getComputedStyle(desktopNav).display).toBe('none');
    
    // Open mobile menu
    userEvent.click(mobileMenuButton);
    
    // Mobile navigation should now be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    cleanup();
  });
  
  it('transitions from mobile to desktop view correctly', () => {
    // Start with mobile viewport
    let cleanup = mockWindowResize(375, 667);
    
    const { rerender } = render(<Header />);
    
    // Mobile menu should be visible
    expect(screen.getByRole('button', { name: /menu/i })).toBeVisible();
    
    // Change to desktop viewport
    cleanup();
    cleanup = mockWindowResize(1280, 800);
    
    // Force a re-render
    rerender(<Header />);
    
    // Desktop navigation should now be visible
    const desktopNav = screen.getByRole('navigation', { name: /main/i });
    expect(desktopNav).toHaveClass('hidden md:flex');
    expect(window.getComputedStyle(desktopNav).display).not.toBe('none');
    
    cleanup();
  });
});
```

### Testing Accessibility Features

For ensuring components meet accessibility requirements:

1. Test ARIA attributes and roles
2. Test keyboard navigation and focus management
3. Test screen reader text and announcements
4. Verify color contrast (using specialized tools if needed)

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

describe('Dialog Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent aria-label="Important information">
          Dialog Content
        </DialogContent>
      </Dialog>
    );
    
    // Trigger should have aria-expanded="false" initially
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open dialog
    userEvent.click(trigger);
    
    // Dialog should have proper role and attributes
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Important information');
    
    // Trigger should have aria-expanded="true" when open
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
  
  it('manages focus correctly', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <button>Focus Me</button>
          <button>Another Button</button>
        </DialogContent>
      </Dialog>
    );
    
    // Open dialog
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    
    // First focusable element should be focused automatically
    const firstButton = screen.getByRole('button', { name: /focus me/i });
    expect(document.activeElement).toBe(firstButton);
    
    // Tab should move to next focusable element within dialog
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /another button/i }));
    
    // Tab again should keep focus within dialog (focus trap)
    await userEvent.tab();
    expect(document.activeElement).not.toBe(screen.getByRole('button', { name: /open dialog/i }));
    expect(document.activeElement?.closest('[role="dialog"]')).toBeInTheDocument();
  });
  
  it('closes with Escape key', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );
    
    // Open dialog
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Press Escape
    await userEvent.keyboard('{Escape}');
    
    // Dialog should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

## Best Practices

1. **Isolate tests**: Each test should be independent and not rely on other tests
2. **Mock dependencies**: Use mocks for complex dependencies
3. **Use descriptive test names**: Clearly describe what's being tested
4. **Avoid implementation details**: Focus on behavior, not how it's implemented
5. **Be thorough but pragmatic**: Test important behaviors without testing every possible scenario

## Common Pitfalls to Avoid

1. Over-relying on `data-testid` attributes instead of user-centric queries
2. Testing third-party library implementation details
3. Brittle tests that break with minor UI changes
4. Insufficient coverage of component variants
5. Not testing accessibility features

## Resources

For more information on component testing:

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event Library](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom) 