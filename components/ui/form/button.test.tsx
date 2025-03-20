import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonVariants } from './button';
import { hasClasses, hasDataAttribute } from '../../../__tests__/utils/test-utils';
import * as React from 'react';

describe('Button', () => {
  // 1. Test rendering with default props
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    
    // Verify default variant classes
    expect(hasClasses(button, buttonVariants({ variant: 'default', size: 'default' }))).toBe(true);
  });

  // 2. Test rendering with different variants
  it('applies different variants correctly', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    for (const variant of variants) {
      const { rerender } = render(<Button variant={variant}>Button</Button>);
      
      const button = screen.getByRole('button', { name: /button/i });
      
      // Check classes based on variant
      switch (variant) {
        case 'default':
          expect(button).toHaveClass('bg-primary');
          break;
        case 'destructive':
          expect(button).toHaveClass('bg-destructive');
          break;
        case 'outline':
          expect(button).toHaveClass('border-input');
          expect(button).toHaveClass('bg-background');
          break;
        case 'secondary':
          expect(button).toHaveClass('bg-secondary');
          break;
        case 'ghost':
          expect(button).toHaveClass('hover:bg-accent');
          break;
        case 'link':
          expect(button).toHaveClass('text-primary');
          expect(button).toHaveClass('hover:underline');
          break;
      }
      
      // Cleanup between tests
      rerender(<div />);
    }
  });

  // 3. Test rendering with different sizes
  it('applies different sizes correctly', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    for (const size of sizes) {
      const { rerender } = render(<Button size={size}>Button</Button>);
      
      const button = screen.getByRole('button', { name: /button/i });
      
      // Check classes based on size
      switch (size) {
        case 'default':
          expect(button).toHaveClass('h-10');
          expect(button).toHaveClass('px-4');
          break;
        case 'sm':
          expect(button).toHaveClass('h-9');
          expect(button).toHaveClass('px-3');
          break;
        case 'lg':
          expect(button).toHaveClass('h-11');
          expect(button).toHaveClass('px-8');
          break;
        case 'icon':
          expect(button).toHaveClass('h-10');
          expect(button).toHaveClass('w-10');
          break;
      }
      
      // Cleanup between tests
      rerender(<div />);
    }
  });

  // 4. Test click handler functionality
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
    expect(button).toHaveClass('disabled:opacity-50');
  });

  // 5. Test accessibility attributes
  it('maintains accessibility attributes', () => {
    const { rerender } = render(
      <Button aria-label="Accessible Button" aria-pressed="true">
        Click me
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /accessible button/i });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    
    // Test focus-visible styles are applied
    button.focus();
    expect(button).toHaveClass('focus-visible:ring-2');
    
    // Test disabled state accessibility
    rerender(<Button disabled>Disabled Button</Button>);
    const disabledButton = screen.getByRole('button', { name: /disabled button/i });
    expect(disabledButton).toBeDisabled();
    expect(disabledButton).toHaveClass('disabled:pointer-events-none');
  });

  // 6. Test proper forwardRef implementation
  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with Ref</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.textContent).toBe('Button with Ref');
  });

  // Test forwardRef with asChild
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

  // 7. Test with Tailwind class utility helpers
  it('correctly merges custom className with variant classes', () => {
    render(<Button className="my-custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('my-custom-class');
    
    // Should also have the default variant classes
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('h-10');
  });

  it('applies Tailwind utility classes consistently', () => {
    render(<Button>Standard Button</Button>);
    
    const button = screen.getByRole('button', { name: /standard button/i });
    
    // Check essential Tailwind classes from the cva definition
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('font-medium');
  });

  // Test component behavior with icons
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

  // Component composition test
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
  });
  
  // Test loading state
  it('renders correctly in loading state', () => {
    render(<Button isLoading>Submit</Button>);
    
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
    
    render(<Button isLoading onClick={handleClick}>Submit</Button>);
    
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
    expect(spinner).toHaveClass('text-current');
    expect(spinner).toHaveClass('opacity-70');
    
    // Verify proper aria labels
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
  
  // Test icon positioning
  it('positions icon correctly based on iconPosition prop', () => {
    // Test left-positioned icon (default)
    const { rerender } = render(
      <Button>
        <svg data-testid="test-icon" />
        <span>Button Text</span>
      </Button>
    );
    
    let button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');
    const textNode = screen.getByText('Button Text');
    
    // In the DOM, the icon should be before the text node for left positioning
    expect(button.innerHTML.indexOf(icon.outerHTML)).toBeLessThan(
      button.innerHTML.indexOf(textNode.outerHTML)
    );
    
    // Test right-positioned icon
    rerender(
      <Button iconPosition="right">
        <svg data-testid="test-icon" />
        <span>Button Text</span>
      </Button>
    );
    
    button = screen.getByRole('button');
    
    // In the DOM, the icon should be after the text node for right positioning
    expect(button.innerHTML.indexOf(icon.outerHTML)).toBeGreaterThan(
      button.innerHTML.indexOf(textNode.outerHTML)
    );
  });
  
  // Test keyboard interaction
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
  });
}); 