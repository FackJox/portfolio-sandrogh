# Component Test Template

This document provides a standardized template for writing component tests in the Sandro Portfolio project, focusing on best practices with React Testing Library and Jest.

## Template Structure

```tsx
/**
 * @file ComponentName.test.tsx
 * @description Test suite for the ComponentName component
 */

import * as React from "react"
import { render, screen, within, hasClasses, hasDataAttribute } from "@/__tests__/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { ComponentName } from "@/components/path/to/component"

// Mock any dependencies if needed
// jest.mock("dependency", () => ({ ... }))

describe("ComponentName", () => {
  // ==========================================================================
  // SECTION 1: Basic Rendering Tests
  // ==========================================================================
  // Purpose: Verify the component renders correctly with default and custom props
  // Approach: Test the presence of key elements, correct class names, and text content
  // ==========================================================================
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<ComponentName />)
      
      // Verify key elements exist using user-centric queries
      const element = screen.getByRole("element-role")
      expect(element).toBeInTheDocument()
      
      // Test default styling
      expect(hasClasses(element, ["default-class-1", "default-class-2"])).toBe(true)
    })

    it("renders with custom className", () => {
      render(<ComponentName className="custom-class" />)
      
      const element = screen.getByRole("element-role")
      
      // Test that custom class is added while preserving default classes
      expect(hasClasses(element, ["custom-class", "default-class-1"])).toBe(true)
    })

    it("renders with custom children/content", () => {
      render(<ComponentName>Custom Content</ComponentName>)
      
      // Test that custom content is rendered
      expect(screen.getByText("Custom Content")).toBeInTheDocument()
    })
    
    // Additional rendering tests for specific variants, sizes, etc.
    it("renders with specific variant prop", () => {
      render(<ComponentName variant="primary" />)
      
      const element = screen.getByRole("element-role")
      
      // Test variant-specific classes
      expect(hasClasses(element, ["variant-specific-class"])).toBe(true)
    })
  })

  // ==========================================================================
  // SECTION 2: Prop Variations Tests
  // ==========================================================================
  // Purpose: Test component behavior with different prop values
  // Approach: Verify correct class application, attribute settings, and rendering
  // ==========================================================================
  describe("Prop Variations", () => {
    it("applies correct styles for different variants", () => {
      const { rerender } = render(<ComponentName variant="primary" data-testid="test-component" />)
      
      let component = screen.getByTestId("test-component")
      expect(hasClasses(component, ["primary-class"])).toBe(true)
      
      // Test different variant
      rerender(<ComponentName variant="secondary" data-testid="test-component" />)
      component = screen.getByTestId("test-component")
      expect(hasClasses(component, ["secondary-class"])).toBe(true)
    })
    
    it("applies correct styles for different sizes", () => {
      const { rerender } = render(<ComponentName size="sm" data-testid="test-component" />)
      
      let component = screen.getByTestId("test-component")
      expect(hasClasses(component, ["size-sm-class"])).toBe(true)
      
      // Test different size
      rerender(<ComponentName size="lg" data-testid="test-component" />)
      component = screen.getByTestId("test-component")
      expect(hasClasses(component, ["size-lg-class"])).toBe(true)
    })
    
    it("handles boolean props correctly", () => {
      render(<ComponentName disabled data-testid="test-component" />)
      
      const component = screen.getByTestId("test-component")
      
      // Test disabled state
      expect(component).toBeDisabled()
      expect(hasClasses(component, ["disabled-class"])).toBe(true)
    })
    
    // Test other relevant props like asChild, etc.
    it("works with asChild prop", () => {
      render(
        <ComponentName asChild>
          <a href="#test">Link Content</a>
        </ComponentName>
      )
      
      const link = screen.getByRole("link", { name: "Link Content" })
      expect(link).toHaveAttribute("href", "#test")
      expect(hasClasses(link, ["default-class-1"])).toBe(true)
    })
  })

  // ==========================================================================
  // SECTION 3: Event Handling Tests
  // ==========================================================================
  // Purpose: Test component interactions and event handling
  // Approach: Simulate user interactions and verify callbacks are triggered
  // ==========================================================================
  describe("Event Handling", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<ComponentName onClick={handleClick} />)
      
      // Find interactive element and click it
      const element = screen.getByRole("button")
      await user.click(element)
      
      // Verify handler was called
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
    
    it("handles keyboard interactions", async () => {
      const handleAction = jest.fn()
      const user = userEvent.setup()
      
      render(<ComponentName onAction={handleAction} />)
      
      // Find element and trigger keyboard event
      const element = screen.getByRole("interactive-element")
      element.focus()
      await user.keyboard("{enter}")
      
      // Verify handler was called
      expect(handleAction).toHaveBeenCalledTimes(1)
    })
    
    it("updates internal state on interaction", async () => {
      const user = userEvent.setup()
      
      render(<ComponentName />)
      
      // Test component with internal state
      const trigger = screen.getByRole("button")
      
      // Initial state
      expect(hasDataAttribute(trigger, "state", "closed")).toBe(true)
      
      // Trigger state change
      await user.click(trigger)
      
      // Verify state changed
      expect(hasDataAttribute(trigger, "state", "open")).toBe(true)
    })
  })

  // ==========================================================================
  // SECTION 4: Accessibility Tests
  // ==========================================================================
  // Purpose: Ensure component meets accessibility requirements
  // Approach: Check ARIA attributes, keyboard navigation, and run axe tests
  // ==========================================================================
  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ComponentName />)
      
      // Run axe on the component
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it("has the correct ARIA attributes", () => {
      render(<ComponentName aria-label="Test label" />)
      
      const element = screen.getByRole("element-role")
      expect(element).toHaveAttribute("aria-label", "Test label")
    })
    
    it("supports keyboard navigation", async () => {
      const user = userEvent.setup()
      
      render(
        <>
          <button>Before</button>
          <ComponentName />
          <button>After</button>
        </>
      )
      
      // Tab through elements and check focus
      const beforeButton = screen.getByRole("button", { name: "Before" })
      beforeButton.focus()
      
      await user.tab()
      // Verify our component is focused next
      const ourComponent = screen.getByRole("our-component-role")
      expect(document.activeElement).toBe(ourComponent)
      
      await user.tab()
      const afterButton = screen.getByRole("button", { name: "After" })
      expect(document.activeElement).toBe(afterButton)
    })
    
    it("maintains focus within the component when needed", async () => {
      // Only applicable for components with focus trapping like dialogs
      const user = userEvent.setup()
      
      render(<ComponentName />)
      
      // Open the component
      await user.click(screen.getByRole("button", { name: "Open" }))
      
      // Verify focus is trapped within the component
      const firstElement = screen.getByRole("first-focusable")
      expect(document.activeElement).toBe(firstElement)
      
      // Tab through all elements
      await user.tab()
      await user.tab() // Assuming there are 3 focusable elements
      await user.tab()
      
      // Focus should cycle back to first element
      expect(document.activeElement).toBe(firstElement)
    })
  })

  // ==========================================================================
  // SECTION 5: Integration Tests with Parent/Child Components
  // ==========================================================================
  // Purpose: Test component in context with related components
  // Approach: Render component within its intended parent/with its children
  // ==========================================================================
  describe("Component Composition", () => {
    it("works correctly with parent component", () => {
      render(
        <ParentComponent>
          <ComponentName />
        </ParentComponent>
      )
      
      // Verify component renders correctly within parent
      const parent = screen.getByRole("parent-role")
      const component = within(parent).getByRole("component-role")
      
      expect(component).toBeInTheDocument()
      // Test parent/child interactions
    })
    
    it("renders child components correctly", () => {
      render(
        <ComponentName>
          <ChildComponent />
        </ComponentName>
      )
      
      // Verify child component renders correctly
      const component = screen.getByRole("component-role")
      const child = within(component).getByRole("child-role")
      
      expect(child).toBeInTheDocument()
      // Test additional parent/child interactions
    })
    
    it("passes context/props to children", () => {
      render(
        <ComponentName context="test-context">
          <ChildComponent />
        </ComponentName>
      )
      
      // Verify context is passed correctly
      const child = screen.getByRole("child-role")
      expect(child).toHaveAttribute("data-context", "test-context")
    })
  })

  // ==========================================================================
  // SECTION 6: ForwardRef Implementation (if applicable)
  // ==========================================================================
  // Purpose: Test proper ref forwarding to DOM elements
  // Approach: Create and attach refs to verify they reference the correct elements
  // ==========================================================================
  describe("ForwardRef Implementation", () => {
    it("forwards ref to the underlying element", () => {
      const ref = React.createRef<HTMLElement>()
      
      render(<ComponentName ref={ref} />)
      
      // Verify ref points to the correct element
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe("EXPECTED_TAG_NAME")
    })
    
    it("allows focusing via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.focus()
          }
        }, [])
        
        return <ComponentName ref={ref} />
      }
      
      render(<TestComponent />)
      
      // Verify component is focused
      const component = screen.getByRole("component-role")
      expect(document.activeElement).toBe(component)
    })
  })
})
```

## Best Practices

### Using React Testing Library

1. **User-Centric Queries**: Always prefer queries that reflect how users find elements:
   - `getByRole` (preferred)
   - `getByLabelText` (for form elements)
   - `getByText` (for content)
   - `getByPlaceholderText`, `getByAltText` (as needed)
   - Avoid `getByTestId` except when no better option exists

2. **Testing Behavior, Not Implementation**: 
   - Focus on what the component does, not how it's built
   - Test from a user's perspective
   - Avoid testing component state directly
   - Test accessible interactions (clicks, keypresses)

3. **Async Testing**:
   - Use `userEvent` instead of `fireEvent` for more realistic user interactions
   - Remember that `userEvent` methods are async - always `await` them
   - Use `waitFor` or `findBy` queries for async operations

### Accessibility Testing

1. **Jest-Axe Integration**:
   - Include at least one `axe` test per component
   - Focus on component-specific accessibility concerns
   - Consider testing different component states

2. **ARIA and Keyboard Testing**:
   - Verify correct ARIA attributes
   - Test keyboard navigation and focus management
   - Test screen reader experiences where applicable

### Component Composition Testing

1. **Isolation vs. Integration**:
   - Start with isolated component tests
   - Add integration tests with immediate parent/child components
   - Test component composition patterns (compound components)

2. **Effective Mocking**:
   - Mock child components when testing parent behavior
   - Mock context providers when testing consumers
   - Use Jest's mocking capabilities for external dependencies

## Template Customization

Adapt this template based on the specific component's requirements:

1. **Simple Components**: Focus on rendering and prop variation tests
2. **Interactive Components**: Emphasize event handling and accessibility
3. **Container Components**: Focus on integration with child components
4. **Form Components**: Add form validation and submission tests
5. **Complex Components**: Include comprehensive tests across all sections

## File Organization

Follow these conventions for test file organization:

1. Place component tests alongside their components or in a parallel `__tests__` directory
2. Use the naming convention `ComponentName.test.tsx`
3. Group related component tests in the same file
4. Import test utilities from `@/__tests__/utils/test-utils` 