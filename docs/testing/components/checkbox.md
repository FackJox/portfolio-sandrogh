# Checkbox Component Testing

This document details the test coverage for the Checkbox component in the Sandro Portfolio project.

## Overview

The Checkbox component is a form input component built on top of Radix UI's Checkbox primitive, providing an accessible and customizable checkbox input with proper keyboard interactions and ARIA attributes.

## Test Coverage

The component has achieved 100% test coverage across all metrics:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## What's Being Tested

### Rendering and Appearance

- **Default Rendering**: Verifies that the checkbox renders with the correct default styles and in an unchecked state
- **Custom Class Names**: Tests that custom class names are properly applied
- **Default Checked State**: Verifies that the checkbox can be initialized in a checked state
- **State Transitions**: Tests the component's ability to render and transition between checked and unchecked states

### Behavior

- **Toggle Behavior**: Tests that clicking the checkbox toggles its state
- **Event Handling**: Verifies that the `onCheckedChange` callback is called with the correct state
- **Disabled State**: Tests that the checkbox respects the disabled prop and prevents interaction
- **Controlled Component**: Verifies that the checkbox works in controlled mode with the `checked` prop

### Keyboard Interactions

- **Keyboard Focus**: Tests that the checkbox can receive keyboard focus
- **Space Key Toggle**: Verifies that pressing the Space key toggles the checkbox state
- **Other Keys**: Tests that other keys (like Enter) do not toggle the checkbox

### Accessibility

- **ARIA Attributes**: Tests that the checkbox has the correct ARIA attributes (`aria-label`, `aria-checked`)
- **Focus Indicators**: Verifies that the checkbox has proper focus indicators for keyboard users
- **State Representation**: Tests that the checkbox communicates its state through appropriate ARIA attributes

### Label Association

- **Label Integration**: Tests that the checkbox can be associated with a label using `htmlFor` and ID
- **Label Click Behavior**: Verifies that clicking an associated label toggles the checkbox
- **ARIA Labelledby**: Tests association with labels using `aria-labelledby`

### Form Integration

- **Form Data Submission**: Tests that the checkbox value is correctly included in form submissions when checked
- **Form Name and Value**: Verifies that the checkbox name and value are properly set for form submissions

## Test Implementation

The tests use React Testing Library and Jest, with the project's custom test utilities:

```tsx
import * as React from "react"
import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./checkbox"
import { render, hasClasses } from "@/__tests__/utils/test-utils"

// Example test
it("changes checked state when clicked", () => {
  const { getByRole } = render(<Checkbox />)
  const checkbox = getByRole("checkbox")
  
  expect(checkbox).not.toBeChecked()
  
  fireEvent.click(checkbox)
  expect(checkbox).toBeChecked()
  
  fireEvent.click(checkbox)
  expect(checkbox).not.toBeChecked()
})
```

## Special Testing Considerations

### Stateful Nature

The Checkbox tests particularly focus on its stateful behavior, verifying both controlled and uncontrolled modes:

1. **Uncontrolled Mode**: The component manages its own state
2. **Controlled Mode**: The parent component manages the state via the `checked` prop

### Keyboard Accessibility

Testing keyboard interactions is vital for the Checkbox component since it's commonly used with keyboard navigation:

```tsx
it("toggles when Space key is pressed", async () => {
  const user = userEvent.setup()
  const { getByRole } = render(<Checkbox />)
  const checkbox = getByRole("checkbox")
  
  // Focus the checkbox
  checkbox.focus()
  
  // Press Space key
  await user.keyboard(" ")
  expect(checkbox).toBeChecked()
  
  // Press Space key again
  await user.keyboard(" ")
  expect(checkbox).not.toBeChecked()
})
```

### Form Integration

The tests verify that the Checkbox integrates properly with HTML forms:

```tsx
it("provides proper value to form submission", () => {
  const handleSubmit = jest.fn()
  
  const { getByRole } = render(
    <form onSubmit={e => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      handleSubmit(formData.get("terms"))
    }}>
      <Checkbox id="terms" name="terms" value="accepted" />
      <button type="submit">Submit</button>
    </form>
  )
  
  // Check the box and submit
  fireEvent.click(getByRole("checkbox"))
  fireEvent.click(getByRole("button", { name: "Submit" }))
  
  // Value should be included in form data
  expect(handleSubmit).toHaveBeenCalledWith("accepted")
})
```

## Lessons Learned

1. **Testing Indeterminate State**: The Radix UI Checkbox implementation doesn't directly handle the indeterminate state through a prop. If needed, this functionality would need to be added to the component.

2. **Form Testing Limitations**: JSDOM has limitations with form validation, so care must be taken to test form integration in a way that works with the test environment.

3. **Controlled vs. Uncontrolled**: Testing both controlled and uncontrolled behavior requires different approaches - uncontrolled behavior can be tested directly with clicks, while controlled behavior requires verifying callback calls without expecting the state to change automatically.

## Future Enhancements

Potential improvements for the Checkbox component tests:

1. Add tests for custom indicator elements
2. Test integration with React Hook Form for more complex validation scenarios
3. Test with various color and size variations if those are added to the component 