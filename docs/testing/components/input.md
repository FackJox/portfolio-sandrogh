# Input Component Testing

This document outlines the testing approach for the Input component in the Sandro Portfolio project.

## Overview

The Input component is a foundational UI element that extends the native HTML input with additional styling and functionality. It is built using React's forwardRef pattern to maintain ref forwarding capabilities while adding consistent styling through Tailwind CSS classes.

## Test File Location

The tests for the Input component are located at:
- `__tests__/components/ui/form/input.test.tsx`

## Test Coverage

The Input component has achieved **100% test coverage** across all metrics:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

The tests cover the following aspects of the Input component:

1. **Rendering and Base Functionality**
   - Default rendering
   - Custom type attribute
   - Placeholder text support
   - Custom className application
   - Class merging behavior

2. **Input Variants**
   - Default variant styling
   - File input styling
   - Focus state styling
   - Error state styling

3. **Controlled Input**
   - Value updates in controlled mode
   - Initial value handling
   - Value changes through controlled state

4. **Uncontrolled Input**
   - Default value handling
   - Maintaining uncontrolled behavior with onChange
   - Ref-based value manipulation

5. **Disabled State**
   - Disabled attribute rendering
   - Disabled styling
   - Prevention of input when disabled

6. **Validation and Error States**
   - Support for aria-invalid
   - Display of validation errors
   - Required attribute validation

7. **Focus and Blur Events**
   - Focus event handling
   - Blur event handling
   - Focus-visible styling on keyboard focus
   - Chained keyboard events

8. **Form Integration**
   - Integration with form context
   - Required attribute support
   - React Hook Form integration

9. **Accessibility**
   - Preservation of ARIA attributes
   - Support for aria-invalid for validation
   - Proper label association
   - Axe accessibility violations testing
   - Error message announcement with aria-describedby

10. **ForwardRef Implementation**
    - Proper ref forwarding to the input element
    - Focus via ref
    - Value setting via ref

11. **Event Handlers**
    - Multiple sequential events
    - Special key events
    - Event propagation

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

### Input Variants Tests

These tests verify that the appropriate styling is applied based on input variants:

```tsx
it("applies default variant styling", () => {
  render(<Input data-testid="default-variant" />)
  
  const input = screen.getByTestId("default-variant")
  expect(input).toHaveClass("flex h-10 w-full rounded-md border")
})

it("applies proper styling for file input", () => {
  render(<Input type="file" data-testid="file-input" />)
  
  const input = screen.getByTestId("file-input")
  expect(input).toHaveClass("cursor-pointer")
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

### Uncontrolled Input Tests

These tests ensure the Input component works correctly in uncontrolled mode:

```tsx
it("works as uncontrolled input with defaultValue", () => {
  render(<Input defaultValue="default value" data-testid="uncontrolled-input" />)
  
  const input = screen.getByTestId("uncontrolled-input")
  expect(input).toHaveValue("default value")
  
  fireEvent.change(input, { target: { value: "new value" } })
  expect(input).toHaveValue("new value")
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

### Validation and Error States Tests

These tests verify that the Input component properly handles validation and error states:

```tsx
it("supports aria-invalid for error state", () => {
  render(<Input aria-invalid="true" data-testid="invalid-input" />)
  
  const input = screen.getByTestId("invalid-input")
  expect(input).toHaveAttribute("aria-invalid", "true")
})

it("can display validation errors with aria-invalid", () => {
  render(
    <div>
      <Input aria-invalid="true" aria-describedby="error-message" data-testid="error-input" />
      <div id="error-message">This field is required</div>
    </div>
  )
  
  const input = screen.getByTestId("error-input")
  expect(input).toHaveAttribute("aria-invalid", "true")
  expect(input).toHaveAttribute("aria-describedby", "error-message")
  expect(screen.getByText("This field is required")).toBeInTheDocument()
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

it("handles chained keyboard events", async () => {
  const handleFocus = jest.fn()
  const handleBlur = jest.fn()
  const handleChange = jest.fn()
  
  render(
    <Input 
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      data-testid="keyboard-input"
    />
  )
  
  const input = screen.getByTestId("keyboard-input")
  await userEvent.tab() // Tab to focus the input
  expect(handleFocus).toHaveBeenCalledTimes(1)
  
  await userEvent.keyboard("test")
  expect(handleChange).toHaveBeenCalled()
  
  await userEvent.tab() // Tab away to blur
  expect(handleBlur).toHaveBeenCalledTimes(1)
})
```

### Form Integration Tests

These tests verify that the Input component works correctly within forms:

```tsx
it("works within a form context", () => {
  render(
    <form>
      <Input name="email" defaultValue="test@example.com" data-testid="form-input" />
    </form>
  )
  
  const input = screen.getByTestId("form-input")
  expect(input).toHaveAttribute("name", "email")
  expect(input).toHaveValue("test@example.com")
})

it("integrates with React Hook Form", () => {
  // Form integration test implementation with React Hook Form
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

it("has no accessibility violations", async () => {
  const { container } = render(
    <div>
      <label htmlFor="a11y-test">Email</label>
      <Input id="a11y-test" name="email" />
    </div>
  )
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
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

it("allows value changes via ref", () => {
  const ref = React.createRef<HTMLInputElement>()
  render(<Input ref={ref} data-testid="ref-value-input" />)
  
  act(() => {
    if (ref.current) {
      ref.current.value = "ref changed value"
    }
  })
  
  expect(screen.getByTestId("ref-value-input")).toHaveValue("ref changed value")
})
```

### Event Handlers Tests

```tsx
it("handles multiple events in sequence", async () => {
  const handleFocus = jest.fn()
  const handleBlur = jest.fn()
  const handleChange = jest.fn()
  const handleKeyDown = jest.fn()
  
  render(
    <Input 
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      data-testid="sequence-input"
    />
  )
  
  const input = screen.getByTestId("sequence-input")
  await userEvent.click(input)
  expect(handleFocus).toHaveBeenCalledTimes(1)
  
  await userEvent.type(input, "test")
  expect(handleChange).toHaveBeenCalledTimes(4)
  expect(handleKeyDown).toHaveBeenCalledTimes(4)
  
  await userEvent.tab()
  expect(handleBlur).toHaveBeenCalledTimes(1)
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
7. Verify accessibility using axe-core

## Test Utilities Used

- `render`: Custom render function from test utilities
- `screen`: For querying rendered elements
- `fireEvent`: For triggering DOM events
- `userEvent`: For simulating user interactions more realistically
- `hasClasses`: Utility for testing Tailwind class application
- `act`: For testing React effects and state updates
- `axe`: For validating accessibility standards

## Coverage Achievements

The Input component test suite has achieved 100% coverage for:
- All statements
- All branches
- All functions
- All lines

This comprehensive coverage ensures that the Input component is thoroughly tested and reliable for use throughout the application.

## Future Test Improvements

1. Add more integration tests with form libraries like Formik
2. Test with various types of validation patterns
3. Add visual regression tests for styling across themes
4. Test performance with large forms containing multiple Input components 