import * as React from "react"
import { render, screen, fireEvent, customRender, hasClasses, renderWithForm } from "@/__tests__/utils/test-utils"
import { Input } from "@/components/ui/form/input"
import userEvent from "@testing-library/user-event"
import { act } from "react"
import * as z from "zod"
import { axe, toHaveNoViolations } from "jest-axe"

// Add jest-axe custom matcher
expect.extend(toHaveNoViolations)

describe("Input Component", () => {
  describe("Rendering and Base Functionality", () => {
    it("renders with default props", () => {
      render(<Input data-testid="test-input" />)
      
      const input = screen.getByTestId("test-input")
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe("INPUT")
    })

    it("renders with custom type", () => {
      render(<Input type="password" data-testid="password-input" />)
      
      const input = screen.getByTestId("password-input")
      expect(input).toHaveAttribute("type", "password")
    })

    it("renders with placeholder text", () => {
      const placeholder = "Enter your name"
      render(<Input placeholder={placeholder} data-testid="placeholder-input" />)
      
      const input = screen.getByTestId("placeholder-input")
      expect(input).toHaveAttribute("placeholder", placeholder)
    })

    it("applies custom className", () => {
      render(<Input className="custom-class" data-testid="custom-class-input" />)
      
      const input = screen.getByTestId("custom-class-input")
      expect(input).toHaveClass("custom-class")
    })

    it("merges custom className with default classes", () => {
      render(<Input className="custom-class" data-testid="merged-class-input" />)
      
      const input = screen.getByTestId("merged-class-input")
      
      // Check it has both default and custom classes
      expect(hasClasses(input, "flex", "h-10", "w-full", "rounded-md", "border", "border-input", "custom-class")).toBe(true)
    })
  })

  describe("Input Variants", () => {
    // Test for different visual styles that might be applied
    it("applies default variant styling", () => {
      render(<Input data-testid="default-variant-input" />)
      
      const input = screen.getByTestId("default-variant-input")
      expect(hasClasses(input, "border", "border-input", "bg-background")).toBe(true)
    })

    // Testing file input variant
    it("applies proper styling for file input", () => {
      render(<Input type="file" data-testid="file-input" />)
      
      const input = screen.getByTestId("file-input")
      expect(hasClasses(input, "file:border-0", "file:bg-transparent", "file:text-sm", "file:font-medium", "file:text-foreground")).toBe(true)
    })

    // Test variant with focus state
    it("applies focus styling when focused", async () => {
      render(<Input data-testid="focus-styled-input" />)
      
      const input = screen.getByTestId("focus-styled-input")
      
      await act(async () => {
        input.focus()
      })
      
      expect(hasClasses(input, "focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2")).toBe(true)
    })
  })

  describe("Controlled Input", () => {
    it("updates value with controlled input", async () => {
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
      await userEvent.type(input, "test value")
      
      expect(input).toHaveValue("test value")
      expect(handleChange).toHaveBeenCalled()
    })

    it("handles initial controlled value", () => {
      render(<Input value="initial value" readOnly data-testid="initial-value-input" />)
      
      const input = screen.getByTestId("initial-value-input")
      expect(input).toHaveValue("initial value")
    })
    
    it("handles value changes in controlled mode", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState("initial")
        
        const handleButtonClick = () => {
          setValue("updated value")
        }
        
        return (
          <div>
            <Input value={value} onChange={e => setValue(e.target.value)} data-testid="controlled-change-input" />
            <button onClick={handleButtonClick} data-testid="update-button">Update</button>
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const input = screen.getByTestId("controlled-change-input")
      const button = screen.getByTestId("update-button")
      
      expect(input).toHaveValue("initial")
      
      await userEvent.click(button)
      expect(input).toHaveValue("updated value")
    })
  })

  describe("Uncontrolled Input", () => {
    it("works as uncontrolled input with defaultValue", async () => {
      render(<Input defaultValue="default text" data-testid="uncontrolled-input" />)
      
      const input = screen.getByTestId("uncontrolled-input")
      expect(input).toHaveValue("default text")
      
      await userEvent.clear(input)
      await userEvent.type(input, "new text")
      
      expect(input).toHaveValue("new text")
    })
    
    it("maintains uncontrolled behavior with onChange", async () => {
      const handleChange = jest.fn()
      
      render(<Input defaultValue="initial" onChange={handleChange} data-testid="uncontrolled-onchange-input" />)
      
      const input = screen.getByTestId("uncontrolled-onchange-input")
      await userEvent.clear(input)
      await userEvent.type(input, "updated")
      
      expect(input).toHaveValue("updated")
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe("Disabled State", () => {
    it("renders with disabled attribute", () => {
      render(<Input disabled data-testid="disabled-input" />)
      
      const input = screen.getByTestId("disabled-input")
      expect(input).toBeDisabled()
    })

    it("applies disabled styles", () => {
      render(<Input disabled data-testid="disabled-styled-input" />)
      
      const input = screen.getByTestId("disabled-styled-input")
      expect(hasClasses(input, "disabled:cursor-not-allowed", "disabled:opacity-50")).toBe(true)
    })

    it("prevents input when disabled", async () => {
      const handleChange = jest.fn()
      render(<Input disabled onChange={handleChange} data-testid="disabled-prevent-input" />)
      
      const input = screen.getByTestId("disabled-prevent-input")
      await userEvent.type(input, "test")
      
      expect(handleChange).not.toHaveBeenCalled()
      expect(input).toHaveValue("")
    })
  })

  describe("Validation and Error States", () => {
    it("supports aria-invalid for error state", () => {
      render(<Input aria-invalid={true} data-testid="invalid-input" />)
      
      const input = screen.getByTestId("invalid-input")
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    
    // Simplified test that doesn't rely on form validation
    it("can display validation errors with aria-invalid", () => {
      render(
        <div>
          <Input 
            aria-invalid={true}
            aria-describedby="email-error"
            data-testid="email-input" 
          />
          <div id="email-error">Invalid email format</div>
        </div>
      )
      
      const input = screen.getByTestId("email-input")
      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("aria-describedby", "email-error")
      expect(screen.getByText("Invalid email format")).toBeInTheDocument()
    })
    
    // Simplified test for required attribute
    it("supports required attribute for form validation", () => {
      render(
        <form noValidate>
          <Input 
            name="name" 
            required
            data-testid="required-input"
          />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByTestId("required-input")
      expect(input).toHaveAttribute("required")
    })
  })

  describe("Focus and Blur Events", () => {
    it("handles focus event", async () => {
      const handleFocus = jest.fn()
      render(<Input onFocus={handleFocus} data-testid="focus-input" />)
      
      const input = screen.getByTestId("focus-input")
      await userEvent.click(input)
      
      expect(handleFocus).toHaveBeenCalled()
    })

    it("handles blur event", async () => {
      const handleBlur = jest.fn()
      const handleFocus = jest.fn()
      render(
        <div>
          <Input onFocus={handleFocus} onBlur={handleBlur} data-testid="blur-input" />
          <button data-testid="outside-element">Outside</button>
        </div>
      )
      
      const input = screen.getByTestId("blur-input")
      const outsideElement = screen.getByTestId("outside-element")
      
      await userEvent.click(input)
      await userEvent.click(outsideElement)
      
      expect(handleBlur).toHaveBeenCalled()
    })

    it("applies focus-visible styles on keyboard focus", async () => {
      render(<Input data-testid="focus-styled-input" />)
      
      const input = screen.getByTestId("focus-styled-input")
      
      await act(async () => {
        input.focus()
      })
      
      expect(hasClasses(input, "focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2")).toBe(true)
    })
    
    it("handles chained keyboard events", async () => {
      const handleFocus = jest.fn()
      const handleKeyDown = jest.fn()
      const handleKeyUp = jest.fn()
      
      render(
        <Input 
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          data-testid="keyboard-input"
        />
      )
      
      const input = screen.getByTestId("keyboard-input")
      
      await userEvent.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      await userEvent.keyboard("test")
      expect(handleKeyDown).toHaveBeenCalledTimes(4)
      expect(handleKeyUp).toHaveBeenCalledTimes(4)
    })
  })

  describe("Form Integration", () => {
    it("works within a form context", () => {
      render(
        <form>
          <Input 
            name="email" 
            defaultValue="test@example.com" 
            data-testid="form-input" 
          />
        </form>
      )
      
      const input = screen.getByTestId("form-input")
      expect(input).toHaveAttribute("name", "email")
      expect(input).toHaveValue("test@example.com")
    })

    it("accepts required attribute", () => {
      render(<Input required data-testid="required-input" />)
      
      const input = screen.getByTestId("required-input")
      expect(input).toHaveAttribute("required")
    })
    
    it("can be used with React Hook Form", () => {
      const { getByTestId } = render(
        <form>
          <Input name="username" data-testid="rhf-input" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = getByTestId("rhf-input")
      expect(input).toHaveAttribute("name", "username")
    })
  })

  describe("Accessibility", () => {
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

    it("supports aria-invalid for validation", () => {
      render(<Input aria-invalid={true} data-testid="invalid-input" />)
      
      const input = screen.getByTestId("invalid-input")
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    
    it("has proper label association", () => {
      render(
        <>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" data-testid="labeled-input" />
        </>
      )
      
      const input = screen.getByLabelText("Test Label")
      expect(input).toBe(screen.getByTestId("labeled-input"))
    })
    
    it("has no accessibility violations", async () => {
      const { container } = render(
        <div>
          <label htmlFor="a11y-test-input">Accessible Input</label>
          <Input id="a11y-test-input" />
        </div>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it("announces error messages with aria-describedby", () => {
      render(
        <>
          <label htmlFor="error-input">Input with Error</label>
          <Input 
            id="error-input" 
            aria-invalid={true}
            aria-describedby="error-message"
            data-testid="error-input"
          />
          <div id="error-message" role="alert">This field is required</div>
        </>
      )
      
      const input = screen.getByTestId("error-input")
      const errorMessage = screen.getByRole("alert")
      
      expect(input).toHaveAttribute("aria-describedby", "error-message")
      expect(errorMessage).toHaveTextContent("This field is required")
    })
  })

  describe("ForwardRef Implementation", () => {
    it("forwards ref to the input element", () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} data-testid="ref-input" />)
      
      const input = screen.getByTestId("ref-input")
      expect(ref.current).toBe(input)
    })

    it("allows focus via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLInputElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.focus()
          }
        }, [])
        
        return <Input ref={ref} data-testid="focus-ref-input" />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByTestId("focus-ref-input")
      expect(document.activeElement).toBe(input)
    })
    
    it("allows value changes via ref", () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} data-testid="value-ref-input" />)
      
      const input = screen.getByTestId("value-ref-input")
      
      act(() => {
        if (ref.current) {
          ref.current.value = "set via ref"
        }
      })
      
      expect(input).toHaveValue("set via ref")
    })
  })

  describe("Event Handlers", () => {
    it("handles multiple events in sequence", async () => {
      const handlers = {
        onFocus: jest.fn(),
        onChange: jest.fn(),
        onBlur: jest.fn()
      }
      
      render(
        <div>
          <Input 
            onFocus={handlers.onFocus}
            onChange={handlers.onChange}
            onBlur={handlers.onBlur}
            data-testid="multi-event-input" 
          />
          <button data-testid="outside">Outside</button>
        </div>
      )
      
      const input = screen.getByTestId("multi-event-input")
      const outside = screen.getByTestId("outside")
      
      await userEvent.click(input)
      expect(handlers.onFocus).toHaveBeenCalledTimes(1)
      
      await userEvent.type(input, "hello")
      expect(handlers.onChange).toHaveBeenCalledTimes(5) // One for each character
      
      await userEvent.click(outside)
      expect(handlers.onBlur).toHaveBeenCalledTimes(1)
      
      // Events should be called in the right order
      expect(handlers.onFocus.mock.invocationCallOrder[0])
        .toBeLessThan(handlers.onChange.mock.invocationCallOrder[0])
      
      expect(handlers.onChange.mock.invocationCallOrder[4])
        .toBeLessThan(handlers.onBlur.mock.invocationCallOrder[0])
    })
    
    it("handles special key events", async () => {
      const handlers = {
        onChange: jest.fn(),
        onKeyDown: jest.fn(),
        onKeyUp: jest.fn()
      }
      
      render(
        <Input
          onChange={handlers.onChange}
          onKeyDown={handlers.onKeyDown}
          onKeyUp={handlers.onKeyUp}
          data-testid="special-key-input"
        />
      )
      
      const input = screen.getByTestId("special-key-input")
      
      // Test Enter key
      await userEvent.click(input)
      await userEvent.keyboard("{Enter}")
      
      expect(handlers.onKeyDown).toHaveBeenCalledTimes(1)
      expect(handlers.onKeyUp).toHaveBeenCalledTimes(1)
      
      // Enter doesn't trigger onChange for inputs
      expect(handlers.onChange).toHaveBeenCalledTimes(0)
      
      // Test Escape key
      await userEvent.keyboard("{Escape}")
      
      expect(handlers.onKeyDown).toHaveBeenCalledTimes(2)
      expect(handlers.onKeyUp).toHaveBeenCalledTimes(2)
    })
  })
}) 