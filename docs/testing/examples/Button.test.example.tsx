/**
 * @file Button.test.tsx
 * @description Test suite for the Button component
 */

import * as React from "react"
import { render, screen, within, hasClasses, hasDataAttribute } from "@/__tests__/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  // ==========================================================================
  // SECTION 1: Basic Rendering Tests
  // ==========================================================================
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole("button", { name: "Click me" })
      expect(button).toBeInTheDocument()
      
      // Test default styling
      expect(hasClasses(button, ["inline-flex", "items-center", "justify-center", "whitespace-nowrap", "rounded-md", "text-sm"])).toBe(true)
    })

    it("renders with custom className", () => {
      render(<Button className="custom-class">Click me</Button>)
      
      const button = screen.getByRole("button", { name: "Click me" })
      
      // Test that custom class is added while preserving default classes
      expect(hasClasses(button, ["custom-class", "inline-flex", "rounded-md"])).toBe(true)
    })

    it("renders with custom children", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Label</span>
        </Button>
      )
      
      const button = screen.getByRole("button")
      expect(within(button).getByText("Icon")).toBeInTheDocument()
      expect(within(button).getByText("Label")).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // SECTION 2: Prop Variations Tests
  // ==========================================================================
  describe("Prop Variations", () => {
    it("applies correct styles for different variants", () => {
      const { rerender } = render(<Button variant="default" data-testid="test-button">Button</Button>)
      
      let button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["bg-primary", "text-primary-foreground"])).toBe(true)
      
      // Test different variant
      rerender(<Button variant="destructive" data-testid="test-button">Button</Button>)
      button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["bg-destructive", "text-destructive-foreground"])).toBe(true)
      
      // Test outline variant
      rerender(<Button variant="outline" data-testid="test-button">Button</Button>)
      button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["border", "border-input", "bg-background"])).toBe(true)
    })
    
    it("applies correct styles for different sizes", () => {
      const { rerender } = render(<Button size="default" data-testid="test-button">Button</Button>)
      
      let button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["h-10", "px-4", "py-2"])).toBe(true)
      
      // Test small size
      rerender(<Button size="sm" data-testid="test-button">Button</Button>)
      button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["h-9", "px-3"])).toBe(true)
      
      // Test large size
      rerender(<Button size="lg" data-testid="test-button">Button</Button>)
      button = screen.getByTestId("test-button")
      expect(hasClasses(button, ["h-11", "px-8"])).toBe(true)
    })
    
    it("handles disabled state correctly", () => {
      render(<Button disabled data-testid="test-button">Disabled Button</Button>)
      
      const button = screen.getByTestId("test-button")
      
      // Test disabled state
      expect(button).toBeDisabled()
      expect(hasClasses(button, ["opacity-50", "pointer-events-none"])).toBe(true)
    })
    
    it("works with asChild prop", () => {
      render(
        <Button asChild>
          <a href="#test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole("link", { name: "Link Button" })
      expect(link).toHaveAttribute("href", "#test")
      expect(hasClasses(link, ["inline-flex", "items-center", "justify-center"])).toBe(true)
    })
  })

  // ==========================================================================
  // SECTION 3: Event Handling Tests
  // ==========================================================================
  describe("Event Handling", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole("button", { name: "Click me" })
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
    
    it("handles keyboard interactions", async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Press enter</Button>)
      
      const button = screen.getByRole("button", { name: "Press enter" })
      button.focus()
      await user.keyboard("{enter}")
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
    
    it("does not trigger onClick when disabled", async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      const button = screen.getByRole("button", { name: "Disabled" })
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // SECTION 4: Accessibility Tests
  // ==========================================================================
  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Button>Accessible Button</Button>)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it("maintains ARIA attributes", () => {
      render(
        <Button aria-pressed="true" aria-label="Toggle feature">
          Toggle
        </Button>
      )
      
      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-pressed", "true")
      expect(button).toHaveAttribute("aria-label", "Toggle feature")
    })
    
    it("supports keyboard focus", async () => {
      const user = userEvent.setup()
      
      render(
        <>
          <button>Before</button>
          <Button>Target</Button>
          <button>After</button>
        </>
      )
      
      // Tab through elements and check focus
      const beforeButton = screen.getByRole("button", { name: "Before" })
      beforeButton.focus()
      
      await user.tab()
      const targetButton = screen.getByRole("button", { name: "Target" })
      expect(document.activeElement).toBe(targetButton)
      
      await user.tab()
      const afterButton = screen.getByRole("button", { name: "After" })
      expect(document.activeElement).toBe(afterButton)
    })
  })

  // ==========================================================================
  // SECTION 5: Integration Tests with Parent/Child Components
  // ==========================================================================
  describe("Component Composition", () => {
    it("works correctly within ButtonGroup", () => {
      render(
        <div role="group" aria-label="Button Group">
          <Button variant="outline">Left</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Right</Button>
        </div>
      )
      
      const group = screen.getByRole("group")
      const buttons = within(group).getAllByRole("button")
      
      expect(buttons).toHaveLength(3)
      expect(buttons[0]).toHaveTextContent("Left")
      expect(buttons[1]).toHaveTextContent("Middle")
      expect(buttons[2]).toHaveTextContent("Right")
    })
    
    it("renders LoadingSpinner child correctly", () => {
      render(
        <Button>
          <div data-testid="loading-spinner" aria-label="Loading" role="status"></div>
          Loading...
        </Button>
      )
      
      const button = screen.getByRole("button")
      const spinner = within(button).getByTestId("loading-spinner")
      
      expect(spinner).toBeInTheDocument()
      expect(button).toHaveTextContent("Loading...")
    })
  })

  // ==========================================================================
  // SECTION 6: ForwardRef Implementation
  // ==========================================================================
  describe("ForwardRef Implementation", () => {
    it("forwards ref to the underlying button element", () => {
      const ref = React.createRef<HTMLButtonElement>()
      
      render(<Button ref={ref}>Button with Ref</Button>)
      
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe("BUTTON")
      expect(ref.current?.textContent).toBe("Button with Ref")
    })
    
    it("forwards ref to custom element when using asChild", () => {
      const ref = React.createRef<HTMLAnchorElement>()
      
      render(
        <Button asChild>
          <a href="#test" ref={ref}>Link with Ref</a>
        </Button>
      )
      
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe("A")
      expect(ref.current?.textContent).toBe("Link with Ref")
    })
    
    it("allows focusing via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLButtonElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.focus()
          }
        }, [])
        
        return <Button ref={ref}>Focus Me</Button>
      }
      
      render(<TestComponent />)
      
      const button = screen.getByRole("button", { name: "Focus Me" })
      expect(document.activeElement).toBe(button)
    })
  })
}) 