# Toast Component Testing

This document outlines the testing approach for the Toast notification system in the Sandro Portfolio project.

## Overview

The Toast notification system is a complex UI component that provides feedback to users through non-intrusive popup messages. It consists of several parts:

1. **Toast UI Components**: The basic building blocks (Toast, ToastTitle, ToastDescription, etc.)
2. **Toaster Component**: Manages the display of multiple toasts
3. **useToast Hook**: Provides the API for creating and managing toasts

This system is built on Radix UI's Toast primitive and follows accessibility best practices.

## Test Files Location

The tests for the Toast system are located at:
- `__tests__/components/ui/feedback/toast.test.tsx` - Tests for individual Toast components
- `__tests__/components/ui/feedback/toaster.test.tsx` - Tests for the Toaster component
- `__tests__/hooks/use-toast.test.tsx` - Tests for the useToast hook

## Test Coverage

The tests cover the following aspects of the Toast notification system:

### 1. Toast Component Tests

- **Basic Rendering**
  - Default rendering
  - Custom className application
  - Rendering with title and description
  - Rendering with action and close buttons
  - Viewport positioning and layout

- **Prop Variations and Variants**
  - Default variant styling
  - Destructive variant styling

- **Event Handling and Animation**
  - Close button functionality
  - Action button click handlers
  - Animation classes for open/close states
  - Swipe animation classes

- **Accessibility**
  - ARIA attribute verification
  - Screen reader support
  - No accessibility violations (using axe)

- **ForwardRef Implementation**
  - Proper ref forwarding
  - Component interaction via ref

### 2. Toaster Component Tests

- **Toast Creation and Display**
  - Creating toasts with different content
  - Displaying different variants
  - Rendering with action buttons

- **Toast Dismissal**
  - Automatic dismissal after timeout
  - Manual dismissal via close button
  - Programmatic dismissal

- **Toast Queue Management**
  - Multiple toast display
  - Toast update functionality
  - Dismissing all toasts

- **Accessibility**
  - ARIA roles for screen readers
  - Accessibility compliance testing

### 3. useToast Hook Tests

- **Toast State Management**
  - Initial empty state
  - Adding toasts to state
  - Updating existing toasts
  - Removing toasts when dismissed

- **Toast API**
  - API method availability
  - Toast creation with ID
  - Dismissal functionality
  - Toast limit enforcement

- **Event Handling**
  - onOpenChange handler behavior

## Testing Approaches

### Testing UI Components

For the Toast UI components, we use React Testing Library to test:
- Component rendering with different props
- Class name application
- Variant styles
- Accessibility features

Example:

```tsx
it("applies different variants correctly", () => {
  render(
    <ToastProvider>
      <Toast variant="default" data-testid="default-toast">Default toast</Toast>
      <Toast variant="destructive" data-testid="destructive-toast">Destructive toast</Toast>
      <ToastViewport />
    </ToastProvider>
  )
  
  const defaultToast = screen.getByTestId("default-toast")
  const destructiveToast = screen.getByTestId("destructive-toast")
  
  // Default variant should have default background classes
  expect(hasClasses(defaultToast, "border", "bg-background", "text-foreground")).toBe(true)
  
  // Destructive variant should have destructive classes
  expect(hasClasses(destructiveToast, "destructive", "group", "border-destructive", "bg-destructive", "text-destructive-foreground")).toBe(true)
})
```

### Testing Toast Creation and Appearance

For testing the Toaster component and toast appearance, we use a custom render function that includes the Toaster component:

```tsx
const customRender = (ui: React.ReactElement) => {
  return render(
    <>
      {ui}
      <Toaster />
    </>
  )
}

it("renders toasts with title", async () => {
  customRender(<div data-testid="test-component" />)
  
  // Create a toast with title
  toast({
    title: "Toast Notification",
  })
  
  // Wait for toast to appear
  const toastElement = await screen.findByText("Toast Notification")
  expect(toastElement).toBeInTheDocument()
})
```

### Testing Toast Hooks

For the useToast hook, we use renderHook from React Testing Library:

```tsx
it("adds toast to the state", () => {
  const { result } = renderHook(() => useToast())
  
  act(() => {
    toast({ title: "Test Toast" })
  })
  
  expect(result.current.toasts).toHaveLength(1)
  expect(result.current.toasts[0].title).toBe("Test Toast")
})
```

### Testing Time-based Behavior

For testing dismissal timeouts and other time-based behavior, we use Jest's fake timers:

```tsx
it("automatically dismisses toast after timeout", async () => {
  jest.useFakeTimers()
  
  customRender(<div data-testid="test-component" />)
  
  toast({ title: "Auto Dismiss Toast" })
  
  const toastElement = await screen.findByText("Auto Dismiss Toast")
  expect(toastElement).toBeInTheDocument()
  
  jest.advanceTimersByTime(5000) // Advance 5 seconds
  
  await waitFor(() => {
    expect(screen.queryByText("Auto Dismiss Toast")).not.toBeInTheDocument()
  })
  
  jest.useRealTimers()
})
```

## Best Practices for Testing Notification Systems

Based on our implementation, here are the best practices for testing notification systems:

1. **Test Component Parts Separately**: Test UI components, state management, and integration separately.

2. **Test All Notification Variants**: Ensure all types (success, error, etc.) render correctly.

3. **Test Content Rendering**: Verify titles, descriptions, and custom content display correctly.

4. **Test Dismissal Methods**: Test auto-dismissal, manual dismissal, and programmatic dismissal.

5. **Test Animation States**: Verify animation classes for entry, exit, and transitional states.

6. **Test Multiple Notifications**: Verify proper handling of multiple notifications and queue management.

7. **Test Accessibility**: Ensure notifications are accessible to screen readers and keyboard users.

8. **Mock Timers**: Use fake timers to test time-dependent behavior (auto-dismiss).

9. **Test Screen Reader Announcements**: Verify proper ARIA attributes for screen reader announcements.

10. **Test API Methods**: Verify all API methods (create, update, dismiss) work as expected.

## Conclusion

The Toast notification system tests provide comprehensive coverage of all functionality, ensuring a reliable and accessible notification experience. The testing patterns established here can be applied to other notification systems in the project. 