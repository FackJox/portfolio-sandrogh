# useToast Hook Testing

This document provides detailed documentation on testing the `useToast` custom hook in the Sandro Portfolio project.

## Overview

The `useToast` hook provides a toast notification system for the application. It manages the state of toast notifications, including creation, dismissal, and updates. The hook is implemented using a React reducer pattern and a listener system for state updates.

## Hook Features

- Creating toast notifications with various properties (title, description, variant, action)
- Dismissing toast notifications individually or all at once
- Updating existing toast notifications
- Managing a queue of toast notifications with a configurable limit
- Providing access to toast state from anywhere in the application

## Test Approach

Testing the `useToast` hook covers:

1. Core functionality in isolation using `renderHook`
2. Reducer logic with direct calls to the reducer function
3. Integration with the Toast component
4. Error handling and edge cases
5. Cleanup and memory management

## Test Structure

```
describe("useToast Hook", () => {
  describe("Toast State Management", () => {
    // Tests for basic state management
  });

  describe("Toast API", () => {
    // Tests for API methods
  });

  describe("Toast Limit", () => {
    // Tests for toast limit functionality
  });

  describe("Reducer Logic", () => {
    // Tests for reducer actions
  });

  describe("Integration with Toast Component", () => {
    // Tests for integration with Toast component
  });

  describe("Error Handling", () => {
    // Tests for error scenarios
  });

  describe("Global Toast Function", () => {
    // Tests for global toast function
  });

  describe("Hook Cleanup", () => {
    // Tests for cleanup
  });
});
```

## Test Cases

### Toast State Management

Tests in this section verify that the hook correctly manages toast state:

1. **Initial state test**: Verifies that the hook initializes with an empty toast array.
   ```tsx
   it("returns empty toast array by default", () => {
     const { result } = renderHook(() => useToast());
     expect(result.current.toasts).toEqual([]);
   });
   ```

2. **Adding toast**: Confirms that the hook can add a toast to the state.
   ```tsx
   it("adds toast to the state", () => {
     const { result } = renderHook(() => useToast());
     
     act(() => {
       result.current.toast({ title: "Test Toast" });
     });
     
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].title).toBe("Test Toast");
   });
   ```

3. **Adding toast with all properties**: Tests the ability to add a fully-configured toast.
   ```tsx
   it("adds toast with all properties", () => {
     const { result } = renderHook(() => useToast());
     
     act(() => {
       result.current.toast({
         title: "Full Toast",
         description: "This is a complete toast",
         variant: "destructive",
         action: <button>Action</button>
       });
     });
     
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].title).toBe("Full Toast");
     expect(result.current.toasts[0].description).toBe("This is a complete toast");
     expect(result.current.toasts[0].variant).toBe("destructive");
     expect(result.current.toasts[0].action).toBeDefined();
   });
   ```

4. **Dismissing toast**: Tests toast dismissal functionality.
   ```tsx
   it("removes toast when dismissed", () => {
     const { result } = renderHook(() => useToast());
     
     let toastId: string;
     
     act(() => {
       const { id } = result.current.toast({ title: "Dismiss Test Toast" });
       toastId = id;
     });
     
     act(() => {
       result.current.dismiss(toastId);
     });
     
     // Toast should first be marked as closed but still in the array
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].open).toBe(false);
   });
   ```

5. **Updating toast**: Tests the ability to update an existing toast.
   ```tsx
   it("updates existing toast", () => {
     const { result } = renderHook(() => useToast());
     
     let updateFn: (props: any) => void;
     
     act(() => {
       const { update } = result.current.toast({ title: "Original Title" });
       updateFn = update;
       
       // Update the toast
       updateFn({ title: "Updated Title", description: "New description" });
     });
     
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].title).toBe("Updated Title");
     expect(result.current.toasts[0].description).toBe("New description");
   });
   ```

### Toast API

Tests in this section verify the API methods returned by the hook:

1. **API methods existence**: Confirms that the hook returns required API methods.
   ```tsx
   it("returns toast function with dispatch methods", () => {
     const { result } = renderHook(() => useToast());
     
     expect(typeof result.current.toast).toBe("function");
     expect(typeof result.current.dismiss).toBe("function");
   });
   ```

2. **Toast ID generation**: Verifies that toast IDs are correctly generated.
   ```tsx
   it("returns created toast ID", () => {
     const { result } = renderHook(() => useToast());
     
     let id: string;
     
     act(() => {
       id = result.current.toast({ title: "Test Toast" }).id;
     });
     
     expect(typeof id).toBe("string");
     expect(id.length).toBeGreaterThan(0);
   });
   ```

3. **Dismiss by ID**: Tests dismissing a specific toast by ID.
   ```tsx
   it("dismisses a specific toast by ID", () => {
     // Test implementation
   });
   ```

4. **Dismiss all**: Tests dismissing all toasts at once.
   ```tsx
   it("dismisses all toasts when no ID provided", () => {
     // Test implementation
   });
   ```

### Toast Limit

Tests in this section verify the toast limit functionality:

```tsx
it("limits the number of toasts according to TOAST_LIMIT", () => {
  const { result } = renderHook(() => useToast());
  
  // Create more toasts than the limit allows
  act(() => {
    resetToastState();
    result.current.toast({ title: "Toast 1" });
    result.current.toast({ title: "Toast 2" });
    result.current.toast({ title: "Toast 3" });
  });
  
  // Only the latest toast should be present due to TOAST_LIMIT
  expect(result.current.toasts).toHaveLength(1);
  expect(result.current.toasts[0].title).toBe("Toast 3");
});
```

### Reducer Logic

Tests in this section verify the reducer's handling of different actions:

1. **ADD_TOAST action**: Tests adding a toast via the reducer.
   ```tsx
   it("handles ADD_TOAST action", () => {
     const initialState = { toasts: [] };
     const action = { 
       type: "ADD_TOAST" as const, 
       toast: { id: "test", title: "Test Toast", open: true } 
     };
     
     const newState = reducer(initialState, action);
     
     expect(newState.toasts).toHaveLength(1);
     expect(newState.toasts[0].title).toBe("Test Toast");
   });
   ```

2. **UPDATE_TOAST action**: Tests updating a toast via the reducer.
   ```tsx
   it("handles UPDATE_TOAST action", () => {
     // Test implementation
   });
   ```

3. **DISMISS_TOAST action**: Tests dismissing toasts via the reducer.
   ```tsx
   it("handles DISMISS_TOAST action for a specific toast", () => {
     // Test implementation for dismissing a specific toast
   });
   
   it("handles DISMISS_TOAST action for all toasts", () => {
     // Test implementation for dismissing all toasts
   });
   ```

4. **REMOVE_TOAST action**: Tests removing toasts via the reducer.
   ```tsx
   it("handles REMOVE_TOAST action for a specific toast", () => {
     // Test implementation for removing a specific toast
   });
   
   it("handles REMOVE_TOAST action for all toasts", () => {
     // Test implementation for removing all toasts
   });
   ```

### Integration with Toast Component

Tests in this section verify the integration with the Toast component:

1. **Rendering toast via component**: Tests that a toast renders correctly when triggered from a component.
   ```tsx
   it("renders toast when triggered from a component", async () => {
     render(
       <>
         <TestComponent />
         <Toaster />
       </>
     );
     
     const button = screen.getByTestId("toast-trigger");
     userEvent.click(button);
     
     await waitFor(() => {
       expect(screen.getByText("Integrated Toast")).toBeInTheDocument();
     });
   });
   ```

2. **Dismissing toast via UI**: Tests that a toast can be dismissed by clicking the close button.
   ```tsx
   it("dismisses toast when close button is clicked", async () => {
     // Test implementation
   });
   ```

### Error Handling

Tests in this section verify error handling in the hook:

1. **Invalid update parameters**: Tests that the hook handles invalid update parameters gracefully.
   ```tsx
   it("handles invalid update parameters gracefully", () => {
     const { result } = renderHook(() => useToast());
     
     let updateFn: (props: any) => void;
     
     act(() => {
       const { update } = result.current.toast({ title: "Original Toast" });
       updateFn = update;
     });
     
     // Should not throw when passed invalid data
     expect(() => {
       act(() => {
         // @ts-ignore - Testing runtime behavior with invalid data
         updateFn(null);
       });
     }).not.toThrow();
     
     // Toast should still exist
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].title).toBe("Original Toast");
   });
   ```

2. **Missing toast ID**: Tests that the hook handles non-existent toast IDs gracefully.
   ```tsx
   it("handles missing toast ID in dismiss operation", () => {
     // Test implementation
   });
   ```

### Global Toast Function

Tests in this section verify the global toast function:

1. **Creating toast globally**: Tests creating a toast using the global toast function.
   ```tsx
   it("creates toast using global toast function", () => {
     let id: string;
     
     act(() => {
       const result = globalToast({ title: "Global Toast" });
       id = result.id;
     });
     
     // Render a hook to check the state
     const { result } = renderHook(() => useToast());
     
     expect(result.current.toasts).toHaveLength(1);
     expect(result.current.toasts[0].title).toBe("Global Toast");
     expect(result.current.toasts[0].id).toBe(id);
   });
   ```

2. **Dismissing toast globally**: Tests dismissing a toast using the global dismiss function.
   ```tsx
   it("dismisses toast using global dismiss function", () => {
     // Test implementation
   });
   ```

### Hook Cleanup

Tests in this section verify that the hook cleans up properly:

```tsx
it("removes listener on unmount", () => {
  // Initial render
  const { unmount } = renderHook(() => useToast());
  
  // Get the listeners array
  const module = require('@/hooks/use-toast');
  const initialListeners = [...module.listeners];
  
  // Unmount the hook
  unmount();
  
  // Listeners array should have one fewer item
  expect(module.listeners.length).toBe(initialListeners.length - 1);
});
```

## Testing Challenges and Solutions

### 1. Accessing Internal State

The useToast hook manages state in a global variable outside the React component tree. To test this effectively, we:

- Created a custom resetToastState function that directly accesses and resets the internal memory state
- Used the module system to access internal variables for verification

```tsx
const resetToastState = () => {
  // Directly modify the internal memory state of the useToast hook
  const module = require('@/hooks/use-toast');
  if (module.memoryState) {
    module.memoryState.toasts = [];
  }
  
  // Also call dismiss from the global toast function
  if (typeof globalToast.dismiss === 'function') {
    globalToast.dismiss();
  }
};
```

### 2. Testing Components with Toast Integration

When testing components that use the useToast hook, we need to:

- Render the component along with the Toaster component
- Reset toast state between tests
- Handle asynchronous updates

```tsx
function customRender(ui: React.ReactElement) {
  return render(
    <>
      {ui}
      <Toaster />
    </>
  )
}
```

### 3. Testing Cleanup

To test that the hook cleans up properly, we:

- Access the internal listeners array
- Count the number of listeners before and after unmounting
- Verify that the listener was removed

## Conclusion

Testing the useToast hook requires a combination of isolated hook testing, reducer testing, and integration testing with components. By thoroughly testing all aspects of the hook, we ensure that the toast notification system works correctly throughout the application.

The patterns established in these tests can be applied to testing other custom hooks in the project. 