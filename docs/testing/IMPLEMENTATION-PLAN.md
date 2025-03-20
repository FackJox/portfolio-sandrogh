# Button Component Enhancement Plan

This document outlines the plan for enhancing the Button component to implement loading state functionality and other features mentioned in the test documentation.

## Current Status

The Button component currently:
- Uses Radix UI's Slot primitive for composition
- Supports multiple variants (default, destructive, outline, secondary, ghost, link)
- Supports different sizes (default, sm, lg, icon)
- Implements proper accessibility features
- Supports forwardRef pattern
- Uses class-variance-authority for styling variants

However, the component doesn't currently implement:
- Loading states with spinner integration
- Icon positioning control

## Implementation Plan

### 1. Enhance ButtonProps Interface

Update the ButtonProps interface to include:

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconPosition?: "left" | "right";
}
```

### 2. Implement Loading State 

Add loading state implementation to the Button component:

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Handle loading state
    const isDisabled = disabled || isLoading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span 
            className="animate-spin size-4 text-current opacity-70" 
            role="status" 
            aria-label="Loading"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        {children}
      </Comp>
    );
  }
);
```

### 3. Implement Icon Positioning

Update the component to support icon positioning:

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;
    
    // Handle icon positioning
    let childrenArray = React.Children.toArray(children);
    
    // If there's an icon (SVG element) and text content
    if (childrenArray.length > 1) {
      const iconIndex = childrenArray.findIndex(
        child => React.isValidElement(child) && child.type === 'svg'
      );
      
      if (iconIndex !== -1) {
        const icon = childrenArray[iconIndex];
        childrenArray = childrenArray.filter((_, i) => i !== iconIndex);
        
        // Reinsert the icon based on iconPosition
        if (iconPosition === "right") {
          childrenArray.push(icon);
        } else {
          childrenArray.unshift(icon);
        }
      }
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span 
            className="animate-spin size-4 text-current opacity-70" 
            role="status" 
            aria-label="Loading"
          >
            {/* Loading spinner SVG */}
          </span>
        )}
        {childrenArray}
      </Comp>
    );
  }
);
```

### 4. Update the Tests

After implementing these features, existing tests should be updated to match the actual implementation, and additional tests should be added to test the new features.

## Benefits of This Enhancement

1. **Improved UX**: Loading states provide important feedback to users during asynchronous operations
2. **Flexible Icon Placement**: Better support for different design variations
3. **Consistency with Documentation**: Aligns implementation with the comprehensive test documentation
4. **Better Accessibility**: Proper ARIA attributes during loading states

## Implementation Timeline

1. Enhance Button component with loading states and icon positioning
2. Update existing tests to cover new functionality
3. Update documentation if needed to match implementation details
4. Ensure 100% test coverage is maintained

## Related Issues

This enhancement addresses the gap between the current Button component implementation and the test documentation that includes tests for loading states, which are not currently implemented. 