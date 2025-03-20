# Input Component Testing

This document outlines the testing approach for the Input component in the Sandro Portfolio project.

## Overview

The Input component is a foundational UI element that extends the native HTML input with additional styling and functionality. It is built using React's forwardRef pattern to maintain ref forwarding capabilities while adding consistent styling through Tailwind CSS classes.

## Test File Location

The tests for the Input component are located at:
- `__tests__/components/ui/form/input.test.tsx`

## Test Coverage

The tests cover the following aspects of the Input component:

1. **Rendering and Base Functionality**
   - Default rendering
   - Custom type attribute
   - Placeholder text support
   - Custom className application
   - Class merging behavior

2. **Controlled Input**
   - Value updates in controlled mode
   - Initial value handling

3. **Disabled State**
   - Disabled attribute rendering
   - Disabled styling
   - Prevention of input when disabled

4. **Focus and Blur Events**
   - Focus event handling
   - Blur event handling
   - Focus-visible styling on keyboard focus

5. **Form Integration**
   - Integration with form submission
   - Required attribute support

6. **Accessibility**
   - Preservation of ARIA attributes
   - Support for aria-invalid for validation

7. **ForwardRef Implementation**
   - Proper ref forwarding to the input element
   - Focus via ref
   - Value setting via ref

## Testing Approach

### Rendering Tests

Rendering tests verify that the Input component renders correctly with various props and configurations. These tests ensure that:

- The component renders as an `<input>` element
- Type attributes are properly applied
- Placeholder text is displayed correctly
- Custom classes are properly merged with default classes

```tsx
it("renders with default props", () => {
  render(<Input data-testid="test-input" />)
  
  const input = screen.getByTestId("test-input")
  expect(input).toBeInTheDocument()
  expect(input.tagName).toBe("INPUT")
  expect(input).toHaveAttribute("type", "text") // Default type
})
```

### Controlled Input Tests

These tests ensure the Input component works correctly in controlled mode, where the value is managed by React state:

```tsx
it("updates value with controlled input", () => {
  const handleChange = jest.fn()
  const TestComponent = () => {
    const [value, setValue] = React.useState("")
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      handleChange(e)
    }
    
    return <Input value={value} onChange={onChange} data-testid="controlled-input" />
  }
  
  render(<TestComponent />)
  
  const input = screen.getByTestId("controlled-input")
  fireEvent.change(input, { target: { value: "test value" } })
  
  expect(input).toHaveValue("test value")
  expect(handleChange).toHaveBeenCalledTimes(1)
})
```

### Disabled State Tests

These tests verify the behavior of the Input component when disabled:

```tsx
it("prevents input when disabled", async () => {
  const handleChange = jest.fn()
  render(<Input disabled onChange={handleChange} data-testid="disabled-prevent-input" />)
  
  const input = screen.getByTestId("disabled-prevent-input")
  await userEvent.type(input, "test")
  
  expect(handleChange).not.toHaveBeenCalled()
  expect(input).toHaveValue("")
})
```

### Focus and Blur Tests

These tests ensure that focus and blur events are properly handled:

```tsx
it("handles focus event", () => {
  const handleFocus = jest.fn()
  render(<Input onFocus={handleFocus} data-testid="focus-input" />)
  
  const input = screen.getByTestId("focus-input")
  fireEvent.focus(input)
  
  expect(handleFocus).toHaveBeenCalledTimes(1)
})
```

### Form Integration Tests

These tests verify that the Input component works correctly within forms:

```tsx
it("integrates with React Hook Form", async () => {
  // Form integration test implementation
})
```

### Accessibility Tests

These tests ensure that the Input component maintains accessibility features:

```tsx
it("maintains accessibility attributes", () => {
  render(
    <Input 
      aria-label="Test input"
      aria-describedby="description-id"
      data-testid="a11y-input"
    />
  )
  
  const input = screen.getByTestId("a11y-input")
  expect(input).toHaveAttribute("aria-label", "Test input")
  expect(input).toHaveAttribute("aria-describedby", "description-id")
})
```

### ForwardRef Tests

These tests verify that the Input component correctly forwards refs:

```tsx
it("forwards ref to the input element", () => {
  const ref = React.createRef<HTMLInputElement>()
  render(<Input ref={ref} data-testid="ref-input" />)
  
  const input = screen.getByTestId("ref-input")
  expect(ref.current).toBe(input)
})
```

## Best Practices

When testing the Input component:

1. Always use data-testid for selecting elements in tests
2. Test both controlled and uncontrolled usage patterns
3. Verify that accessibility attributes are preserved
4. Check that event handlers are called with the expected arguments
5. Test ref forwarding explicitly for components using forwardRef
6. Use the `hasClasses` utility to verify that styling classes are properly applied

## Test Utilities Used

- `render`: Custom render function from test utilities
- `screen`: For querying rendered elements
- `fireEvent`: For triggering DOM events
- `userEvent`: For simulating user interactions more realistically
- `hasClasses`: Utility for testing Tailwind class application
- `act`: For testing React effects and state updates

## Coverage Goals

The Input component test suite aims to achieve 100% coverage for:

- All rendering scenarios
- Event handling
- Accessibility features
- Ref forwarding
- Form integration

## Future Test Improvements

1. Add tests for additional input types (number, email, date, etc.)
2. Test with various label components
3. Add visual regression tests for styling across themes
4. Test integration with more complex form validation scenarios 