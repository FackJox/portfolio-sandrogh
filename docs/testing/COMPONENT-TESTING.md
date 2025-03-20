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

## Testing Radix UI Components

Components built with Radix UI primitives require special consideration:

1. Test with the custom render function that includes providers
2. Test component composition (Root, Trigger, Content, etc.)
3. Verify state changes based on Radix's data attributes
4. Test proper context integration

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

describe('Accordion Component', () => {
  it('renders collapsed by default', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText('Content 1')).not.toBeVisible();
  });
  
  it('expands when trigger is clicked', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const trigger = screen.getByRole('button');
    userEvent.click(trigger);
    
    // Wait for animation
    await waitFor(() => {
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });
});
```

## Testing Form Components

For form components, consider these additional tests:

1. Test validation behaviors
2. Test form submission
3. Test error states and messages
4. Test integration with form libraries if applicable
5. Test keyboard interactions specific to forms

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