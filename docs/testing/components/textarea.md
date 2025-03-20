# Textarea Component Testing

This document outlines the testing approach for the Textarea component in the Sandro Portfolio project.

## Overview

The Textarea component is a foundational UI element that extends the native HTML textarea with additional styling and functionality. It is built using React's forwardRef pattern to maintain ref forwarding capabilities while adding consistent styling through Tailwind CSS classes.

## Test File Location

The tests for the Textarea component are located at:
- `components/ui/form/textarea.test.tsx`

## Test Coverage

The Textarea component has achieved **100% test coverage** across all metrics:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

The tests cover the following aspects of the Textarea component:

1. **Rendering Tests**
   - Default rendering
   - Custom className application
   - Placeholder text support
   - Class merging behavior
   - Rows and cols attributes
   - Min and max length attributes

2. **Controlled vs Uncontrolled Input**
   - Uncontrolled input with defaultValue
   - Controlled input with state
   - Value changes in controlled mode

3. **Resizing Behavior**
   - Resize attribute support
   - Minimum height application
   - Resize configuration options

4. **Accessibility**
   - Aria attributes preservation
   - Support for aria-invalid for validation
   - Proper label association
   - Focus management
   - No accessibility violations (axe tests)

5. **Form Integration**
   - Integration with form submissions
   - Required attribute support
   - Validation behavior

6. **Character Count and Limitations**
   - MaxLength attribute behavior
   - Character count display

7. **Placeholder Behavior**
   - Placeholder display when empty
   - Placeholder hiding with content
   - Placeholder styling

8. **ForwardRef Implementation**
   - Proper ref forwarding to the textarea element
   - Focus via ref

## Testing Approach

### Rendering Tests

Rendering tests verify that the Textarea component renders correctly with various props and configurations. These tests ensure that:

- The component renders as a `<textarea>` element
- Attributes like rows, cols, and placeholder are properly applied
- Custom classes are properly merged with default classes

```tsx
it("renders with default props", () => {
  render(<Textarea data-testid="test-textarea" />)
  const textarea = screen.getByTestId("test-textarea")
  expect(textarea).toBeInTheDocument()
  expect(textarea.tagName).toBe("TEXTAREA")
})

it("renders with rows and cols attributes", () => {
  render(<Textarea rows={10} cols={50} data-testid="dimensions-textarea" />)
  const textarea = screen.getByTestId("dimensions-textarea")
  expect(textarea).toHaveAttribute("rows", "10")
  expect(textarea).toHaveAttribute("cols", "50")
})
```

### Controlled vs Uncontrolled Input Tests

These tests ensure the Textarea component works correctly in both controlled and uncontrolled modes:

```tsx
it("functions as uncontrolled input with defaultValue", async () => {
  const user = userEvent.setup()
  render(<Textarea defaultValue="Initial text" data-testid="uncontrolled-textarea" />)
  
  const textarea = screen.getByTestId("uncontrolled-textarea")
  expect(textarea).toHaveValue("Initial text")
  
  await user.clear(textarea)
  await user.type(textarea, "New text")
  
  expect(textarea).toHaveValue("New text")
})

it("handles controlled input", async () => {
  const handleChange = jest.fn()
  const TestComponent = () => {
    const [value, setValue] = React.useState("Initial value")
    
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      handleChange(e)
    }
    
    return <Textarea value={value} onChange={onChange} data-testid="controlled-textarea" />
  }
  
  const user = userEvent.setup()
  render(<TestComponent />)
  
  const textarea = screen.getByTestId("controlled-textarea")
  expect(textarea).toHaveValue("Initial value")
  
  await user.clear(textarea)
  await user.type(textarea, "Updated value")
  
  expect(textarea).toHaveValue("Updated value")
  expect(handleChange).toHaveBeenCalled()
})
```

### Resizing Behavior Tests

These tests verify the resizing behavior of the Textarea component:

```tsx
it("allows resizing with resize attribute", () => {
  render(<Textarea style={{ resize: "both" }} data-testid="resizable-textarea" />)
  const textarea = screen.getByTestId("resizable-textarea")
  expect(textarea).toHaveStyle("resize: both")
})

it("disables resizing with resize attribute", () => {
  render(<Textarea style={{ resize: "none" }} data-testid="non-resizable-textarea" />)
  const textarea = screen.getByTestId("non-resizable-textarea")
  expect(textarea).toHaveStyle("resize: none")
})

it("respects min-height from className", () => {
  render(<Textarea data-testid="min-height-textarea" />)
  const textarea = screen.getByTestId("min-height-textarea")
  expect(textarea).toHaveClass("min-h-[80px]")
})
```

### Accessibility Tests

These tests ensure that the Textarea component maintains proper accessibility features:

```tsx
it("maintains accessibility attributes", () => {
  render(
    <Textarea
      aria-label="Message"
      aria-describedby="message-help"
      aria-invalid={true}
      data-testid="a11y-textarea"
    />
  )
  
  const textarea = screen.getByTestId("a11y-textarea")
  expect(textarea).toHaveAttribute("aria-label", "Message")
  expect(textarea).toHaveAttribute("aria-describedby", "message-help")
  expect(textarea).toHaveAttribute("aria-invalid", "true")
})

it("has proper label association", () => {
  render(
    <>
      <label htmlFor="test-textarea">Test Label</label>
      <Textarea id="test-textarea" data-testid="labeled-textarea" />
    </>
  )
  
  const textarea = screen.getByLabelText("Test Label")
  expect(textarea).toBe(screen.getByTestId("labeled-textarea"))
})

it("has no accessibility violations", async () => {
  const { container } = render(
    <div>
      <label htmlFor="a11y-test-textarea">Accessible Textarea</label>
      <Textarea id="a11y-test-textarea" />
    </div>
  )
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Form Integration Tests

These tests verify that the Textarea component works correctly within forms:

```tsx
it("integrates with form submission", async () => {
  const handleSubmit = jest.fn(e => e.preventDefault())
  const user = userEvent.setup()
  
  render(
    <form onSubmit={handleSubmit}>
      <Textarea name="message" data-testid="form-textarea" />
      <button type="submit">Submit</button>
    </form>
  )
  
  // Type in textarea and submit form
  const textarea = screen.getByTestId("form-textarea")
  await user.type(textarea, "Test message")
  await user.click(screen.getByRole("button", { name: /submit/i }))
  
  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(textarea).toHaveValue("Test message")
})

it("accepts required attribute", () => {
  render(<Textarea required data-testid="required-textarea" />)
  const textarea = screen.getByTestId("required-textarea")
  expect(textarea).toBeRequired()
})
```

### Character Count and Limitations Tests

These tests verify that the Textarea component properly handles character limitations:

```tsx
it("respects maxLength attribute", async () => {
  const user = userEvent.setup()
  render(<Textarea maxLength={10} data-testid="maxlength-textarea" />)
  
  const textarea = screen.getByTestId("maxlength-textarea")
  
  // Try to type more than maxLength
  await user.type(textarea, "12345678901234")
  
  // Should truncate to maxLength
  expect(textarea).toHaveValue("1234567890")
})

it("can display remaining character count with external counter", async () => {
  const user = userEvent.setup()
  const TestComponent = () => {
    const [value, setValue] = React.useState("")
    const maxLength = 20
    
    return (
      <div>
        <Textarea 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          data-testid="character-count-textarea"
        />
        <div data-testid="counter">{maxLength - value.length} characters remaining</div>
      </div>
    )
  }
  
  render(<TestComponent />)
  
  const textarea = screen.getByTestId("character-count-textarea")
  const counter = screen.getByTestId("counter")
  
  expect(counter).toHaveTextContent("20 characters remaining")
  
  await user.type(textarea, "12345")
  
  expect(counter).toHaveTextContent("15 characters remaining")
})
```

### Placeholder Behavior Tests

These tests verify that the Textarea component correctly handles placeholder text:

```tsx
it("shows placeholder when empty", () => {
  const placeholder = "Enter text here..."
  render(<Textarea placeholder={placeholder} data-testid="placeholder-visible-textarea" />)
  
  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
})

it("hides placeholder when input has value", async () => {
  const user = userEvent.setup()
  const placeholder = "Enter text here..."
  
  render(<Textarea placeholder={placeholder} data-testid="placeholder-hidden-textarea" />)
  
  const textarea = screen.getByTestId("placeholder-hidden-textarea")
  await user.type(textarea, "Some input value")
  
  // Placeholder shouldn't be visible, but the attribute should remain
  expect(textarea).toHaveAttribute("placeholder", placeholder)
  expect(textarea).toHaveValue("Some input value")
})

it("applies correct styling to the placeholder", () => {
  render(<Textarea placeholder="Test placeholder" data-testid="placeholder-styled-textarea" />)
  
  const textarea = screen.getByTestId("placeholder-styled-textarea")
  expect(textarea).toHaveClass("placeholder:text-muted-foreground")
})
```

### ForwardRef Tests

These tests verify that the Textarea component correctly forwards refs:

```tsx
it("forwards ref to the textarea element", () => {
  const ref = React.createRef<HTMLTextAreaElement>()
  render(<Textarea ref={ref} data-testid="ref-textarea" />)
  
  expect(ref.current).not.toBeNull()
  expect(ref.current?.tagName).toBe("TEXTAREA")
})

it("allows focus via ref", () => {
  const TestComponent = () => {
    const ref = React.useRef<HTMLTextAreaElement>(null)
    
    React.useEffect(() => {
      if (ref.current) {
        ref.current.focus()
      }
    }, [])
    
    return <Textarea ref={ref} data-testid="focus-ref-textarea" />
  }
  
  render(<TestComponent />)
  
  const textarea = screen.getByTestId("focus-ref-textarea")
  expect(document.activeElement).toBe(textarea)
})
```

## Test Coverage Review

The Textarea component has been thoroughly tested with a focus on:

1. **Comprehensive rendering tests** covering all possible props and configurations
2. **Controlled and uncontrolled input handling** ensuring proper state management
3. **Resizing behavior tests** verifying the component respects CSS resize properties
4. **Accessibility validation** with axe and ARIA attribute testing
5. **Form integration tests** covering submission, validation, and error states
6. **Character count functionality** with both browser-based and custom implementations
7. **Placeholder behavior** in various states
8. **Proper ref forwarding** as per the React forwardRef pattern

This thorough testing approach ensures the Textarea component is robust, accessible, and maintains its expected behavior through future code changes. 