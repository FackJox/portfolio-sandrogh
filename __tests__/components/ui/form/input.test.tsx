import * as React from "react"
import { render, screen, fireEvent, customRender, hasClasses, renderWithForm } from "@/__tests__/utils/test-utils"
import { Input } from "@/components/ui/form/input"
import userEvent from "@testing-library/user-event"
import { act } from "react"
import * as z from "zod"

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
  })

  describe("Form Integration", () => {
    it("integrates with form submission", async () => {
      const onSubmit = jest.fn((e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        return formData.get("email") as string
      })
      
      const TestForm = () => {
        const [submitResult, setSubmitResult] = React.useState<string | null>(null)
        
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const email = formData.get("email") as string
          setSubmitResult(email)
          onSubmit(e)
        }
        
        return (
          <div>
            <form
              onSubmit={handleSubmit}
              data-testid="test-form"
            >
              <Input name="email" data-testid="form-input" />
              <button type="submit" data-testid="submit-button">Submit</button>
            </form>
            {submitResult && <div data-testid="submit-result">{submitResult}</div>}
          </div>
        )
      }
      
      render(<TestForm />)
      
      const input = screen.getByTestId("form-input")
      const submitButton = screen.getByTestId("submit-button")
      
      await userEvent.type(input, "test@example.com")
      await userEvent.click(submitButton)
      
      expect(onSubmit).toHaveBeenCalled()
    })

    it("accepts required attribute", () => {
      render(<Input required data-testid="required-input" />)
      
      const input = screen.getByTestId("required-input")
      expect(input).toHaveAttribute("required")
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

    it("allows setting value via ref", () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLInputElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.value = "value set via ref"
          }
        }, [])
        
        return <Input ref={ref} data-testid="value-ref-input" />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByTestId("value-ref-input")
      expect(input).toHaveValue("value set via ref")
    })
  })
}) 