# Popover Component Testing

This document outlines the testing strategy and implementation for the Popover component, which is built on Radix UI's Popover primitive.

## Overview

The Popover component is a UI element that displays floating content when triggered by a button or other interactive element. This document covers the testing strategy for ensuring the Popover component functions correctly, with a focus on proper rendering, interaction behavior, positioning, and accessibility.

## Test Approach

Our Popover component tests use React Testing Library's direct testing approach with the following patterns:
- `userEvent` for simulating user interactions
- `waitFor` to handle asynchronous state changes
- Direct DOM queries with `screen` methods
- Mock implementations for browser APIs not available in JSDOM

## Test Cases

### 1. Rendering in Closed State

Tests that the Popover component properly renders in its closed state, with only the trigger visible and content not present in the DOM.

```tsx
it("should not render popover content when closed", () => {
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // The trigger should be in the document
  expect(screen.getByRole("button", { name: /open popover/i })).toBeInTheDocument()
  
  // The content should not be in the document when closed
  expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
})
```

### 2. Trigger Functionality

Tests that clicking the trigger opens the popover, displaying its content.

```tsx
it("should open when trigger is clicked", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger button
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // The content should now be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
})
```

Also tests that clicking the trigger again closes the popover.

```tsx
it("should close when trigger is clicked again", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Get the trigger button
  const triggerButton = screen.getByRole("button", { name: /open popover/i })
  
  // Click to open the popover
  await user.click(triggerButton)
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // Click again to close the popover
  await user.click(triggerButton)
  
  // The content should no longer be in the document
  await waitFor(() => {
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
  })
})
```

### 3. Positioning and Alignment

Tests that the popover renders with the correct positioning and alignment relative to its trigger.

```tsx
it("should render content in the correct position", async () => {
  const user = userEvent.setup()
  const { container } = render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent align="start" sideOffset={10}>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })

  // Find the popover content element
  const popoverContent = document.querySelector('[role="dialog"]')
  expect(popoverContent).toBeInTheDocument()
  
  // Check alignment attribute is set correctly
  expect(popoverContent).toHaveAttribute('data-align', 'start')
})
```

Also tests different alignment options (start, center, end).

```tsx
it("should support different alignment options", async () => {
  const user = userEvent.setup()
  const { rerender } = render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent align="center">
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document and check alignment
  await waitFor(() => {
    const popoverContent = document.querySelector('[role="dialog"]')
    expect(popoverContent).toHaveAttribute('data-align', 'center')
  })
  
  // Close the popover by pressing Escape
  await user.keyboard('{Escape}')
  
  // Re-render with different alignment
  rerender(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent align="end">
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )
  
  // Click the trigger to open the popover again
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Check new alignment
  await waitFor(() => {
    const popoverContent = document.querySelector('[role="dialog"]')
    expect(popoverContent).toHaveAttribute('data-align', 'end')
  })
})
```

### 4. Closing Mechanisms

Tests the various ways to close a popover:

- Click outside the popover
- Press the Escape key
- Click the trigger button again

```tsx
it("should close when escape key is pressed", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // Press Escape to close the popover
  await user.keyboard('{Escape}')
  
  // The content should no longer be in the document
  await waitFor(() => {
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
  })
})
```

The "click outside" test requires special handling:

```tsx
it("should close when clicking outside", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // Force document click event
  // We need to use a more direct approach as userEvent has issues with this in JSDOM
  document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
  document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  
  // The content should no longer be in the document
  await waitFor(() => {
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
  })
})
```

### 5. Accessibility Features

Tests that the popover component implements appropriate ARIA attributes for accessibility.

```tsx
it("should have proper accessibility attributes", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  const trigger = screen.getByRole("button", { name: /open popover/i })
  
  // The trigger should have aria-expanded set to false initially
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  
  // Click to open
  await user.click(trigger)
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // The trigger should have aria-expanded="true" when popover is open
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  
  // The trigger should have aria-controls attribute
  expect(trigger).toHaveAttribute('aria-controls')
  
  // Check if the content has the correct role
  const popoverContent = document.querySelector('[role="dialog"]')
  expect(popoverContent).toHaveAttribute('role', 'dialog')
})
```

### 6. Nested Interactive Elements

Tests that interactive elements within the popover content function correctly.

```tsx
it("should handle interactive elements inside popover content", async () => {
  const onButtonClick = jest.fn()
  const user = userEvent.setup()
  
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
        <Button onClick={onButtonClick}>Click Me</Button>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // Click the button inside the popover
  await user.click(screen.getByRole("button", { name: /click me/i }))
  
  // Check the button click handler was called
  expect(onButtonClick).toHaveBeenCalledTimes(1)
  
  // The popover should still be open
  expect(screen.getByText("Popover Content")).toBeInTheDocument()
})
```

### 7. Animation Testing

Tests that the popover renders with appropriate animation classes and state attributes.

```tsx
it("should work with animations", async () => {
  const user = userEvent.setup()
  render(
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        <p>Popover Content</p>
      </PopoverContent>
    </Popover>
  )

  // Click the trigger to open the popover
  await user.click(screen.getByRole("button", { name: /open popover/i }))
  
  // Wait for the content to be in the document
  await waitFor(() => {
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })
  
  // Get content
  const content = document.querySelector('[role="dialog"]')
  
  // Check animation states
  expect(content).toHaveAttribute('data-state', 'open')
  
  // Check for animation classes (as defined in the component)
  expect(content?.className).toContain('data-[state=open]:animate-in')
  expect(content?.className).toContain('data-[state=closed]:animate-out')
  expect(content?.className).toContain('data-[state=closed]:fade-out-0') 
  expect(content?.className).toContain('data-[state=open]:fade-in-0')
})
```

## Testing Approach

The Popover component testing follows these key principles:

1. **Direct Testing**: We use direct RTL queries and userEvent interactions rather than the specialized `createPopoverTester` utility.
2. **Isolation**: Each test focuses on a specific aspect of the component's behavior.
3. **Async Testing**: Uses `waitFor` to handle asynchronous state changes properly.
4. **Accessibility Testing**: Ensures the component maintains proper ARIA attributes and roles.
5. **Visual Testing**: Where possible, confirms proper CSS classes and data attributes for styling and animations.

## Key Challenges and Solutions

1. **Testing Positioning**: DOM positioning is difficult to test in JSDOM. Instead, we verify data attributes that control positioning.

2. **Animation Testing**: Direct animation testing is not possible in JSDOM, so we test for the presence of animation classes.

3. **Clicking Outside**: JSDOM has limitations with certain event propagation behaviors. We solved this by directly dispatching multiple mouse events to the document:
   ```js
   document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
   document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
   document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
   ```

4. **Act Warnings**: React may produce "not wrapped in act(...)" warnings during testing, particularly with animations and state changes from Radix UI components. These warnings don't affect the test results and can be ignored.

## Maintenance Considerations

When updating the Popover component:

1. Ensure you maintain accessibility attributes
2. Preserve the same API structure to avoid breaking tests
3. If changing animations, update the animation tests
4. When modifying positioning logic, check the positioning tests 