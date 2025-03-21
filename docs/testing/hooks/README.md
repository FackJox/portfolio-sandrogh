# Custom Hook Testing

This document outlines the patterns and best practices for testing custom hooks in the Sandro Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Utilities](#testing-utilities)
3. [Testing Patterns](#testing-patterns)
4. [Test Structure](#test-structure)
5. [Common Test Cases](#common-test-cases)
6. [Hook Integration Testing](#hook-integration-testing)
7. [Example: useToast](#example-usetoast)
8. [Example: useIsMobile](#example-usemobile)

## Introduction

Custom hooks encapsulate reusable stateful logic in React applications. Testing custom hooks requires a special approach since hooks can only be called from React function components or other custom hooks. The React Testing Library provides a `renderHook` utility that allows us to test hooks in isolation.

## Testing Utilities

For testing custom hooks, we use:

- `renderHook` and `act` from `@testing-library/react`
- Custom utilities from our test-utils.tsx file
- Jest's built-in mocking and assertion utilities

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '@/hooks/use-custom-hook';

// Basic usage
const { result } = renderHook(() => useCustomHook());
```

## Testing Patterns

### 1. Testing Initial State

Verify that the hook initializes with the expected default state.

```tsx
it('returns expected initial state', () => {
  const { result } = renderHook(() => useCustomHook());
  expect(result.current.value).toBe(initialValue);
});
```

### 2. Testing State Updates

Use the `act` function to perform state updates and verify the hook responds correctly.

```tsx
it('updates state when action is called', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.setValue('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

### 3. Testing with Props

Test how the hook behaves with different props by using the initialProps and rerender function.

```tsx
it('responds to prop changes', () => {
  const { result, rerender } = renderHook(
    ({ initialValue }) => useCustomHook(initialValue),
    { initialProps: { initialValue: 'initial' } }
  );
  
  expect(result.current.value).toBe('initial');
  
  // Rerender with new props
  rerender({ initialValue: 'updated' });
  
  expect(result.current.value).toBe('updated');
});
```

### 4. Testing Custom Context Providers

For hooks that depend on context, provide a custom wrapper component that includes the context provider.

```tsx
const wrapper = ({ children }) => (
  <CustomProvider value={mockContextValue}>
    {children}
  </CustomProvider>
);

const { result } = renderHook(() => useCustomContext(), { wrapper });
```

### 5. Testing Asynchronous Logic

For hooks with asynchronous logic, use async versions of the testing utilities.

```tsx
it('fetches data asynchronously', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetchData());
  
  // Initially loading
  expect(result.current.loading).toBe(true);
  
  // Wait for the state to update
  await waitForNextUpdate();
  
  // Check updated state
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual(mockData);
});
```

### 6. Testing Browser APIs

For hooks that interact with browser APIs (like viewport dimensions, window events, etc.), mock the relevant browser APIs.

```tsx
// Mock window.matchMedia for a responsive hook
const mockMatchMedia = jest.fn();
window.matchMedia = mockMatchMedia;

mockMatchMedia.mockImplementation((query) => ({
  matches: false,
  media: query,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Then test the hook
const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
```

### 7. Testing with Timers

For hooks that use timers or debounce/throttle mechanisms, use Jest's timer mocks.

```tsx
// Setup fake timers
jest.useFakeTimers();

it('debounces the function call', () => {
  const { result } = renderHook(() => useDebounce(callback, 500));
  
  act(() => {
    result.current();
    result.current();
    result.current();
  });
  
  // Callback should not be called immediately
  expect(callback).not.toHaveBeenCalled();
  
  // Advance timers
  act(() => {
    jest.advanceTimersByTime(500);
  });
  
  // Callback should be called once
  expect(callback).toHaveBeenCalledTimes(1);
});
```

## Test Structure

Structure your custom hook tests with descriptive blocks that separate different aspects of the hook:

```tsx
describe('useCustomHook', () => {
  // Initial setup and mocks
  beforeEach(() => {
    // Reset state, setup mocks
  });
  
  describe('Initialization', () => {
    // Test default values and initial state
  });
  
  describe('State Management', () => {
    // Test state updates and transitions
  });
  
  describe('Side Effects', () => {
    // Test side effects like API calls, timers, etc.
  });
  
  describe('Cleanup', () => {
    // Test cleanup functions in useEffect returns
  });
  
  describe('Error Handling', () => {
    // Test error states and recovery
  });
});
```

## Common Test Cases

For comprehensive hook testing, consider these common test cases:

1. **Initial state** - Does the hook initialize with the correct default values?
2. **State updates** - Does the hook update state correctly when actions are called?
3. **Prop changes** - Does the hook respond correctly to changes in props?
4. **Side effects** - Are side effects (like API calls or localStorage) triggered at the right times?
5. **Cleanup** - Does the hook clean up properly when unmounted?
6. **Error handling** - Does the hook handle errors gracefully?
7. **Memory management** - Are there any memory leaks or state persistence issues?

## Hook Integration Testing

While unit tests focus on the hook in isolation, integration tests verify how the hook works with components.

```tsx
// Testing a hook used inside a component
it('works correctly when used in a component', () => {
  const TestComponent = () => {
    const { value, setValue } = useCustomHook('test');
    return (
      <div>
        <span data-testid="value">{value}</span>
        <button onClick={() => setValue('updated')}>Update</button>
      </div>
    );
  };
  
  const { getByTestId, getByRole } = render(<TestComponent />);
  
  expect(getByTestId('value')).toHaveTextContent('test');
  
  userEvent.click(getByRole('button'));
  
  expect(getByTestId('value')).toHaveTextContent('updated');
});
```

## Example: useToast

See the [useToast Testing Documentation](./use-toast.md) for a comprehensive example of how to test a complex custom hook that manages state, handles side effects, and integrates with React components.

The useToast hook tests demonstrate:

1. Testing toast creation with various parameters
2. Testing toast dismissal functionality
3. Testing multiple toast handling
4. Testing toast update functions
5. Testing integration with Toast component
6. Testing context provider
7. Testing error handling
8. Testing cleanup and memory management

## Example: useIsMobile

See the [useIsMobile Testing Documentation](./use-mobile.md) for a comprehensive example of testing a responsive hook that handles viewport detection.

The useIsMobile hook tests demonstrate:

1. Testing viewport width detection logic
2. Testing resize event handling
3. Testing debounce functionality for performance optimization
4. Testing integration with responsive components
5. Testing SSR compatibility
6. Testing orientation change handling

This example shows patterns for testing all viewport and device detection hooks, including:

1. Mocking browser viewport APIs (window.matchMedia, window.innerWidth)
2. Testing timing-sensitive code with Jest fake timers
3. Simulating browser events
4. Testing hooks that should work in SSR contexts 