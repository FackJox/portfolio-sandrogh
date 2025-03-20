/**
 * @file Input.test.tsx
 * @description Test suite for the Input component, demonstrating form component testing approaches
 */

import * as React from "react"
import { render, screen, hasClasses, renderWithForm } from "@/__tests__/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Input } from "@/components/ui/form/input"
import * as z from "zod"

describe("Input", () => {
  // ==========================================================================
  // SECTION 1: Basic Rendering Tests
  // ==========================================================================
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Input />)
      
      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe("INPUT")
      
      // Test default styling
      expect(hasClasses(input, ["flex", "h-10", "w-full", "rounded-md", "border", "border-input"])).toBe(true)
    })

    it("renders with custom className", () => {
      render(<Input className="custom-class" />)
      
      const input = screen.getByRole("textbox")
      
      // Test that custom class is added while preserving default classes
      expect(hasClasses(input, ["custom-class", "flex", "h-10"])).toBe(true)
    })

    it("renders with custom type attribute", () => {
      render(<Input type="password" />)
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "password")
    })
    
    it("renders with placeholder text", () => {
      const placeholder = "Enter your name"
      render(<Input placeholder={placeholder} />)
      
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // SECTION 2: Prop Variations Tests
  // ==========================================================================
  describe("Prop Variations", () => {
    it("handles disabled state correctly", () => {
      render(<Input disabled />)
      
      const input = screen.getByRole("textbox")
      expect(input).toBeDisabled()
    })
    
    it("handles readOnly state correctly", () => {
      render(<Input readOnly value="Read only value" />)
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("readOnly")
      expect(input).toHaveValue("Read only value")
    })
    
    it("applies correct styles for error state", () => {
      render(<Input aria-invalid={true} />)
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    
    it("supports name attribute for form submission", () => {
      render(<Input name="username" />)
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("name", "username")
    })
  })

  // ==========================================================================
  // SECTION 3: Event Handling Tests
  // ==========================================================================
  describe("Event Handling", () => {
    it("updates value when typing", async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole("textbox")
      await user.type(input, "test input")
      
      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue("test input")
    })
    
    it("calls onFocus and onBlur handlers", async () => {
      const handleFocus = jest.fn()
      const handleBlur = jest.fn()
      const user = userEvent.setup()
      
      render(
        <div>
          <Input onFocus={handleFocus} onBlur={handleBlur} />
          <button>Other element</button>
        </div>
      )
      
      const input = screen.getByRole("textbox")
      const button = screen.getByRole("button")
      
      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      await user.click(button)
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
    
    it("respects controlled component pattern", async () => {
      const user = userEvent.setup()
      
      function ControlledInput() {
        const [value, setValue] = React.useState("initial")
        return (
          <Input 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-testid="controlled-input"
          />
        )
      }
      
      render(<ControlledInput />)
      
      const input = screen.getByTestId("controlled-input")
      expect(input).toHaveValue("initial")
      
      await user.clear(input)
      await user.type(input, "updated")
      
      expect(input).toHaveValue("updated")
    })
  })

  // ==========================================================================
  // SECTION 4: Accessibility Tests
  // ==========================================================================
  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <label htmlFor="test-input">Test Input
          <Input id="test-input" />
        </label>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it("supports aria-describedby for validation messages", () => {
      render(
        <>
          <Input 
            aria-describedby="error-message"
            aria-invalid={true}
          />
          <div id="error-message">This field is required</div>
        </>
      )
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("aria-describedby", "error-message")
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    
    it("maintains labelling relationship", () => {
      render(
        <>
          <label htmlFor="labeled-input">Labeled Input</label>
          <Input id="labeled-input" />
        </>
      )
      
      const label = screen.getByText("Labeled Input")
      const input = screen.getByLabelText("Labeled Input")
      
      expect(label).toBeInTheDocument()
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe("INPUT")
    })
  })

  // ==========================================================================
  // SECTION 5: Form Integration Tests
  // ==========================================================================
  describe("Form Integration", () => {
    it("works with form submission", async () => {
      const handleSubmit = jest.fn(e => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByRole("textbox")
      const submitButton = screen.getByRole("button", { name: "Submit" })
      
      await user.type(input, "user123")
      await user.click(submitButton)
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue("user123")
    })
    
    it("supports form validation", async () => {
      const schema = z.object({
        email: z.string().email("Invalid email format")
      })

      const user = userEvent.setup()
      
      // Render with Zod validation
      const { container } = renderWithForm(
        <form>
          <Input name="email" data-testid="email-input" />
          <button type="submit">Submit</button>
        </form>,
        { schema }
      )
      
      const input = screen.getByTestId("email-input")
      const submitButton = screen.getByText("Submit")
      
      // Type invalid email and submit
      await user.type(input, "invalid-email")
      await user.click(submitButton)
      
      // Validation error should appear
      expect(container.innerHTML).toContain("Invalid email format")
      
      // Fix the email and submit again
      await user.clear(input)
      await user.type(input, "valid@example.com")
      await user.click(submitButton)
      
      // Error should be gone
      expect(container.innerHTML).not.toContain("Invalid email format")
    })
    
    it("can be used with React Hook Form", async () => {
      const handleSubmit = jest.fn()
      const user = userEvent.setup()
      
      const { container } = renderWithForm(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Input name="username" required />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByRole("textbox")
      const submitButton = screen.getByRole("button")
      
      // Submit without filling required field
      await user.click(submitButton)
      expect(handleSubmit).not.toHaveBeenCalled()
      
      // Fill the field and submit
      await user.type(input, "username")
      await user.click(submitButton)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // SECTION 6: ForwardRef Implementation
  // ==========================================================================
  describe("ForwardRef Implementation", () => {
    it("forwards ref to the input element", () => {
      const ref = React.createRef<HTMLInputElement>()
      
      render(<Input ref={ref} />)
      
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe("INPUT")
    })
    
    it("allows focusing via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLInputElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.focus()
          }
        }, [])
        
        return <Input ref={ref} />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole("textbox")
      expect(document.activeElement).toBe(input)
    })
    
    it("allows setting value via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLInputElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.value = "Set via ref"
          }
        }, [])
        
        return <Input ref={ref} />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("Set via ref")
    })
  })
}) 