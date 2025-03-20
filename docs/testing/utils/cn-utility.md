# `cn()` Utility Function Tests

This document describes the test implementation for the `cn()` utility function and the related test environment improvements.

## Overview

The `cn()` utility function combines [clsx](https://github.com/lukeed/clsx) and [tailwind-merge](https://github.com/dcastil/tailwind-merge) to provide a powerful way to combine Tailwind CSS classes with conditional logic. The tests ensure that this function works correctly in all scenarios.

## Test Implementation

The tests for the `cn()` utility function are located in `lib/utils.test.ts` and cover all the required functionality:

### Basic Class Name Concatenation

Tests that the function properly combines multiple class name strings:

```typescript
it('should concatenate basic class names', () => {
  expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
})
```

### Conditional Class Application

Tests that the function correctly applies classes based on conditional objects:

```typescript
it('should apply conditional classes', () => {
  expect(cn('base-class', { 'text-red-500': true, 'text-blue-500': false }))
    .toBe('base-class text-red-500')
})
```

### Array Handling

Tests that the function properly processes arrays of class names:

```typescript
it('should handle array of class names', () => {
  expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500')
})
```

### Nested Arrays

Tests that the function handles nested arrays of class names:

```typescript
it('should handle nested arrays', () => {
  expect(cn(['text-red-500', ['bg-blue-500', 'p-4']]))
    .toBe('text-red-500 bg-blue-500 p-4')
})
```

### Undefined and Null Values

Tests that the function gracefully handles undefined and null values:

```typescript
it('should handle undefined and null values', () => {
  expect(cn('base-class', undefined, null)).toBe('base-class')
})
```

### Boolean Conditions

Tests that the function works with boolean expressions:

```typescript
it('should handle boolean conditions', () => {
  expect(cn('base-class', true && 'text-red-500', false && 'text-blue-500'))
    .toBe('base-class text-red-500')
})
```

### Complex Combinations

Tests that the function handles complex combinations of all the above:

```typescript
it('should handle complex combinations', () => {
  expect(cn(
    'base-class',
    ['text-red-500', 'bg-blue-500'],
    { 'p-4': true, 'm-4': false },
    undefined,
    null,
    true && 'rounded-lg',
    false && 'shadow-lg'
  )).toBe('base-class text-red-500 bg-blue-500 p-4 rounded-lg')
})
```

### Tailwind Class Merging

Tests that the function correctly merges conflicting Tailwind classes according to specificity rules:

```typescript
it('should properly merge Tailwind classes', () => {
  expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500')
  expect(cn('p-4 p-6')).toBe('p-6')
})
```

### Empty Strings

Tests that the function handles empty strings properly:

```typescript
it('should handle empty strings', () => {
  expect(cn('base-class', '')).toBe('base-class')
})
```

### Multiple Conditional Objects

Tests that the function processes multiple conditional objects correctly:

```typescript
it('should handle multiple conditional objects', () => {
  expect(cn(
    { 'text-red-500': true },
    { 'bg-blue-500': true },
    { 'p-4': false }
  )).toBe('text-red-500 bg-blue-500')
})
```

## Theme-Related Test Fixes

During the implementation of tests for components that use the `cn()` utility, we encountered an issue with theme scripts being injected into the test environment. This caused unexpected content in DOM elements and led to test failures.

### Problem

When rendering components in tests, the theme initialization script from `next-themes` would inject JavaScript code into the DOM, which interfered with text content assertions in tests.

### Solution

We made the following improvements to fix this issue:

1. **Extended ThemeProvider with a `disableScript` prop:**

```typescript
interface ExtendedThemeProviderProps extends ThemeProviderProps {
  disableScript?: boolean
}

export function ThemeProvider({ 
  children, 
  disableScript = false, 
  ...props 
}: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props}
      enableScript={!disableScript}
    >
      {children}
    </NextThemesProvider>
  )
}
```

2. **Updated the customRender function in test-utils.tsx:**

```typescript
function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  // Extract provider-specific options
  const {
    theme = "light",
    route = "/",
    withTooltipProvider = false,
    ...renderOptions
  } = options || {}
  
  // Mock document.documentElement methods to prevent script injection
  const originalAddClass = document.documentElement.classList.add;
  const originalRemoveClass = document.documentElement.classList.remove;
  
  // Replace with no-op implementations during tests
  document.documentElement.classList.add = jest.fn();
  document.documentElement.classList.remove = jest.fn();

  // Add providers as needed
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    // ... existing code ...
    
    // Set theme directly on document to avoid script injection
    document.documentElement.setAttribute('data-theme', theme);
    
    return (
      <ThemeProvider attribute="class" defaultTheme={theme} disableScript={true}>
        {children}
      </ThemeProvider>
    )
  }

  const result = render(ui, { wrapper: AllProviders, ...renderOptions });
  
  // Restore original classList methods
  document.documentElement.classList.add = originalAddClass;
  document.documentElement.classList.remove = originalRemoveClass;
  
  return result;
}
```

3. **Improved component tests by:**
   - Using `data-testid` attributes for reliable element selection
   - Avoiding direct text content checks when theme scripts might be present
   - Using more reliable class and attribute assertions

### Benefits

These improvements provide several benefits:

1. More reliable tests with fewer false negatives
2. Cleaner test environment without script injection side effects
3. Better test isolation between different components
4. Improved test maintainability by focusing on behavior rather than implementation details

## Best Practices

When testing components that use the `cn()` utility and theme features:

1. Always use the custom render function from test-utils
2. Use data-testid attributes for elements that need to be selected in tests
3. Focus on testing classes and attributes rather than exact text content
4. When testing text content, use either `getByText()` or specific role-based queries
5. Use the `hasClasses()` helper to check for the presence of multiple Tailwind classes 