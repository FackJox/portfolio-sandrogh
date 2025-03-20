# Button Component Testing

This document outlines the testing approach for the Button component in the Sandro Portfolio project.

## Component Overview

The Button component is built on Radix UI's Slot primitive and uses class-variance-authority (cva) for styling variants. It supports:

- Multiple variants (default, destructive, outline, secondary, ghost, link)
- Different sizes (default, sm, lg, icon)
- Composition through `asChild` prop
- Accessibility features
- Ref forwarding
- Icon support with automatic styling
- Loading states with spinner integration
- Keyboard interaction and focus management

## Test Approach

The Button component tests focus on eight key areas:

1. **Default Rendering**: Verifying the component renders correctly with default props
2. **Variant Testing**: Ensuring all visual variants apply the correct Tailwind classes
3. **Size Testing**: Confirming size variations affect the component as expected
4. **Event Handling**: Testing click event handlers and disabled state behavior
5. **Accessibility**: Verifying accessibility attributes and states
6. **Ref Forwarding**: Testing the forwardRef implementation works correctly
7. **Styling Utilities**: Validating Tailwind class integration and composition
8. **Loading States**: Testing loading state behavior and spinner integration

## Test Implementation

The test file `button.test.tsx` is located next to the component file for easy maintenance.

### Default Rendering

Tests that the button renders with the correct default variant and size classes.

```tsx
it('renders correctly with default props', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  
  // Verify default variant classes
  expect(hasClasses(button, buttonVariants({ variant: 'default', size: 'default' }))).toBe(true);
});
```

### Variant Testing

Tests each variant to ensure the correct Tailwind classes are applied.

```tsx
it('applies different variants correctly', () => {
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
  
  for (const variant of variants) {
    const { rerender } = render(<Button variant={variant}>Button</Button>);
    const button = screen.getByRole('button', { name: /button/i });
    
    // Different expectations based on the variant
    switch (variant) {
      case 'default':
        expect(button).toHaveClass('bg-primary');
        expect(button).toHaveClass('text-primary-foreground');
        expect(button).toHaveClass('hover:bg-primary/90');
        break;
      case 'destructive':
        expect(button).toHaveClass('bg-destructive');
        expect(button).toHaveClass('text-destructive-foreground');
        expect(button).toHaveClass('hover:bg-destructive/90');
        break;
      case 'outline':
        expect(button).toHaveClass('border-input');
        expect(button).toHaveClass('bg-background');
        expect(button).toHaveClass('hover:bg-accent');
        expect(button).toHaveClass('hover:text-accent-foreground');
        break;
      case 'secondary':
        expect(button).toHaveClass('bg-secondary');
        expect(button).toHaveClass('text-secondary-foreground');
        expect(button).toHaveClass('hover:bg-secondary/80');
        break;
      case 'ghost':
        expect(button).toHaveClass('hover:bg-accent');
        expect(button).toHaveClass('hover:text-accent-foreground');
        break;
      case 'link':
        expect(button).toHaveClass('text-primary');
        expect(button).toHaveClass('underline-offset-4');
        expect(button).toHaveClass('hover:underline');
        break;
    }
    
    rerender(<div />);
  }
});
```

### Size Testing

Tests each size to ensure appropriate dimensions are applied.

```tsx
it('applies different sizes correctly', () => {
  const sizes = ['default', 'sm', 'lg', 'icon'] as const;
  
  for (const size of sizes) {
    const { rerender } = render(<Button size={size}>Button</Button>);
    const button = screen.getByRole('button', { name: /button/i });
    
    // Check size-specific classes
    switch (size) {
      case 'default':
        expect(button).toHaveClass('h-10');
        expect(button).toHaveClass('px-4');
        expect(button).toHaveClass('py-2');
        break;
      case 'sm':
        expect(button).toHaveClass('h-9');
        expect(button).toHaveClass('px-3');
        expect(button).toHaveClass('rounded-md');
        break;
      case 'lg':
        expect(button).toHaveClass('h-11');
        expect(button).toHaveClass('px-8');
        expect(button).toHaveClass('rounded-md');
        break;
      case 'icon':
        expect(button).toHaveClass('h-10');
        expect(button).toHaveClass('w-10');
        break;
    }
    
    rerender(<div />);
  }
});
```

### Event Handling

Tests the click handler functionality and disabled state.

```tsx
it('handles click events properly', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('should not trigger click when disabled', async () => {
  const handleClick = jest.fn();
  render(<Button disabled onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  await userEvent.click(button);
  
  expect(handleClick).not.toHaveBeenCalled();
  expect(button).toBeDisabled();
  expect(button).toHaveClass('disabled:pointer-events-none');
  expect(button).toHaveClass('disabled:opacity-50');
});
```

### Accessibility Testing

Tests accessibility attributes and states.

```tsx
it('maintains accessibility attributes', () => {
  const { rerender } = render(
    <Button aria-label="Accessible Button" aria-pressed="true">Click me</Button>
  );
  
  const button = screen.getByRole('button', { name: /accessible button/i });
  expect(button).toHaveAttribute('aria-pressed', 'true');
  
  // Test focus-visible styles
  button.focus();
  expect(button).toHaveClass('focus-visible:outline-none');
  expect(button).toHaveClass('focus-visible:ring-2');
  expect(button).toHaveClass('focus-visible:ring-ring');
  expect(button).toHaveClass('focus-visible:ring-offset-2');
  
  // Test disabled state
  rerender(<Button disabled>Disabled Button</Button>);
  const disabledButton = screen.getByRole('button', { name: /disabled button/i });
  expect(disabledButton).toBeDisabled();
  expect(disabledButton).toHaveClass('disabled:pointer-events-none');
  expect(disabledButton).toHaveClass('disabled:opacity-50');
});
```

### Keyboard Interaction Testing

Tests handling of keyboard navigation and focus styles.

```tsx
it('handles keyboard interactions properly', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Press Enter</Button>);
  
  const button = screen.getByRole('button', { name: 'Press Enter' });
  button.focus();
  
  // Test that Enter key triggers the click handler
  await user.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalledTimes(1);
  
  // Test that Space key triggers the click handler
  await user.keyboard(' ');
  expect(handleClick).toHaveBeenCalledTimes(2);
  
  // Test focus styles
  expect(button).toHaveClass('focus-visible:ring-2');
  expect(button).toHaveClass('focus-visible:ring-ring');
});

it('supports proper tab navigation', async () => {
  const user = userEvent.setup();
  
  render(
    <>
      <button>First Button</button>
      <Button>Target Button</Button>
      <button>Last Button</button>
    </>
  );
  
  // Get all buttons
  const firstButton = screen.getByRole('button', { name: 'First Button' });
  const targetButton = screen.getByRole('button', { name: 'Target Button' });
  const lastButton = screen.getByRole('button', { name: 'Last Button' });
  
  // Start with focus on first button
  firstButton.focus();
  
  // Tab to our component button
  await user.tab();
  expect(document.activeElement).toBe(targetButton);
  
  // Tab to the last button
  await user.tab();
  expect(document.activeElement).toBe(lastButton);
});
```

### Ref Forwarding

Tests the forwardRef implementation works correctly.

```tsx
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
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href="https://example.com">
        Link Button
      </a>
    </Button>
  );
  
  expect(ref.current).not.toBeNull();
  expect(ref.current?.tagName).toBe('A');
  expect(ref.current?.textContent).toBe('Link Button');
  expect(ref.current?.href).toContain('example.com');
});
```

### Tailwind Styling

Tests the integration with Tailwind classes.

```tsx
it('correctly merges custom className with variant classes', () => {
  render(<Button className="my-custom-class">Custom Button</Button>);
  
  const button = screen.getByRole('button', { name: /custom button/i });
  expect(button).toHaveClass('my-custom-class');
  expect(button).toHaveClass('bg-primary'); // Default variant class
  expect(button).toHaveClass('text-primary-foreground');
});

it('applies Tailwind utility classes consistently', () => {
  render(<Button>Standard Button</Button>);
  
  const button = screen.getByRole('button', { name: /standard button/i });
  
  // Check essential Tailwind classes
  expect(button).toHaveClass('inline-flex');
  expect(button).toHaveClass('items-center');
  expect(button).toHaveClass('justify-center');
  expect(button).toHaveClass('gap-2');
  expect(button).toHaveClass('whitespace-nowrap');
  expect(button).toHaveClass('rounded-md');
  expect(button).toHaveClass('text-sm');
  expect(button).toHaveClass('font-medium');
  expect(button).toHaveClass('transition-colors');
});
```

### Loading State Testing

Tests the button's behavior when in a loading state.

```tsx
it('renders correctly in loading state', () => {
  render(
    <Button isLoading>
      Submit
    </Button>
  );
  
  const button = screen.getByRole('button');
  const spinner = within(button).getByRole('status');
  
  // Verify spinner is shown
  expect(spinner).toBeInTheDocument();
  
  // Verify button is disabled when loading
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-disabled', 'true');
  
  // Verify button maintains text (for a11y)
  expect(button).toHaveTextContent('Submit');
});

it('prevents clicks when in loading state', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(
    <Button isLoading onClick={handleClick}>
      Submit
    </Button>
  );
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  // Click handler should not be called when button is in loading state
  expect(handleClick).not.toHaveBeenCalled();
});

it('applies correct styling to loading spinner', () => {
  render(<Button isLoading>Submit</Button>);
  
  const button = screen.getByRole('button');
  const spinner = within(button).getByRole('status');
  
  // Test spinner styling
  expect(spinner).toHaveClass('animate-spin');
  expect(spinner).toHaveClass('size-4');
  expect(hasClasses(spinner, ['text-current', 'opacity-70'])).toBe(true);
  
  // Verify proper aria labels
  expect(spinner).toHaveAttribute('aria-label', 'Loading');
});
```

## Additional Tests

### Component Composition

Tests that the button works correctly when used with asChild to render as another element.

```tsx
it('renders as a child component when asChild is true', () => {
  render(
    <Button asChild>
      <a href="https://example.com">Link Button</a>
    </Button>
  );
  
  const link = screen.getByRole('link', { name: /link button/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', 'https://example.com');
  expect(link).toHaveClass('bg-primary'); // Should inherit button styles
  expect(link).toHaveClass('text-primary-foreground');
  expect(link).toHaveClass('hover:bg-primary/90');
});

it('renders as different HTML elements while maintaining button styling', () => {
  // Test rendering as div with role="button"
  const { rerender } = render(
    <Button asChild>
      <div role="button" tabIndex={0}>Div Button</div>
    </Button>
  );
  
  let element = screen.getByRole('button', { name: 'Div Button' });
  expect(element.tagName).toBe('DIV');
  expect(element).toHaveAttribute('tabIndex', '0');
  expect(hasClasses(element, buttonVariants())).toBe(true);
  
  // Test rendering as custom component
  rerender(
    <Button asChild>
      <summary>Summary Button</summary>
    </Button>
  );
  
  element = screen.getByText('Summary Button');
  expect(element.tagName).toBe('SUMMARY');
  expect(hasClasses(element, buttonVariants())).toBe(true);
});
```

### Icon Handling

Tests that the button correctly handles icon children.

```tsx
it('renders correctly with icon children', () => {
  render(
    <Button>
      <svg data-testid="test-icon" />
      Button with Icon
    </Button>
  );
  
  const button = screen.getByRole('button', { name: /button with icon/i });
  const icon = screen.getByTestId('test-icon');
  
  expect(button).toContainElement(icon);
  expect(button).toHaveClass('gap-2');
  // The icon styles are applied through the button's arbitrary variants
  expect(button).toHaveClass('[&_svg]:pointer-events-none');
  expect(button).toHaveClass('[&_svg]:size-4');
  expect(button).toHaveClass('[&_svg]:shrink-0');
});

it('positions icon correctly based on iconPosition prop', () => {
  // Test left-positioned icon (default)
  const { rerender } = render(
    <Button>
      <svg data-testid="test-icon" />
      <span>Button Text</span>
    </Button>
  );
  
  const button = screen.getByRole('button');
  let icon = screen.getByTestId('test-icon');
  
  // Check the DOM order reflects visual order
  expect(button.children[0]).toBe(icon);
  expect(button.children[1].textContent).toBe('Button Text');
  
  // Test right-positioned icon
  rerender(
    <Button iconPosition="right">
      <span>Button Text</span>
      <svg data-testid="test-icon" />
    </Button>
  );
  
  icon = screen.getByTestId('test-icon');
  expect(button.children[0].textContent).toBe('Button Text');
  expect(button.children[1]).toBe(icon);
});
```

## Best Practices

When testing the Button component:

1. Focus on behaviors instead of implementation details
2. Use proper Testing Library queries (getByRole is preferred)
3. Test all variants and sizes to ensure correct styling
4. Verify accessibility features work correctly
5. Test composition patterns with asChild
6. Verify that custom class names are properly merged
7. Test both the presence and absence of classes based on props
8. Verify that all interactive states (hover, focus, disabled, loading) are properly styled
9. Test that icon children receive the correct styling through arbitrary variants
10. Test keyboard interactions to ensure accessibility
11. Verify loading state behavior and associated accessibility attributes

## Related Documentation

- [Component Testing Guidelines](../COMPONENT-TESTING.md)
- [Tailwind Testing Utilities](../utils/cn-utility.md)
- [General Testing Strategy](../TESTING-STRATEGY.md) 