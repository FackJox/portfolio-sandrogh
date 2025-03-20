import * as React from "react"
import { render, screen, createMockOTPContext, renderWithOTPContext, hasClasses } from "@/__tests__/utils/test-utils"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp"

describe("InputOTP Components", () => {
  describe("InputOTP", () => {
    it("renders with default props", () => {
      const { container } = render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      )
      
      expect(container.querySelector("input")).toBeInTheDocument()
    })
    
    it("applies custom class names", () => {
      const { container } = render(
        <InputOTP 
          maxLength={4} 
          className="custom-input-class"
          containerClassName="custom-container-class"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
        </InputOTP>
      )
      
      const input = container.querySelector("input")
      const containerDiv = container.querySelector("div")
      
      expect(input).toHaveClass("custom-input-class")
      expect(containerDiv).toHaveClass("custom-container-class")
    })
  })
  
  describe("InputOTPGroup", () => {
    it("renders with default props", () => {
      const { container } = render(
        <InputOTPGroup data-testid="otp-group">
          <div data-testid="slot">Slot</div>
        </InputOTPGroup>
      )
      
      const group = screen.getByTestId('otp-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveClass('flex')
      expect(group).toHaveClass('items-center')
    })
    
    it("applies custom class names", () => {
      const { container } = render(
        <InputOTPGroup className="custom-group-class" data-testid="otp-group">
          <div>Slot</div>
        </InputOTPGroup>
      )
      
      const group = screen.getByTestId('otp-group')
      expect(group).toHaveClass("custom-group-class")
    })
  })
  
  describe("InputOTPSlot", () => {
    it("renders character from context", () => {
      const mockContext = createMockOTPContext([
        { char: "1", isActive: false, hasFakeCaret: false }
      ])
      
      const { getByText } = renderWithOTPContext(
        <InputOTPSlot index={0} />,
        mockContext
      )
      
      expect(getByText("1")).toBeInTheDocument()
    })
    
    it("renders with active state", () => {
      const mockContext = createMockOTPContext([
        { char: "1", isActive: true, hasFakeCaret: false }
      ])
      
      const { container } = renderWithOTPContext(
        <InputOTPSlot index={0} data-testid="active-slot" />,
        mockContext
      )
      
      const slot = screen.getByTestId('active-slot')
      expect(slot).toHaveClass("z-10")
      expect(slot).toHaveClass("ring-2")
      expect(slot).toHaveClass("ring-ring")
    })
    
    it("renders with fake caret", () => {
      const mockContext = createMockOTPContext([
        { char: "", isActive: true, hasFakeCaret: true }
      ])
      
      const { container } = renderWithOTPContext(
        <InputOTPSlot index={0} />,
        mockContext
      )
      
      const caretElement = container.querySelector(".animate-caret-blink")
      expect(caretElement).toBeInTheDocument()
    })
    
    it("applies custom class names", () => {
      const mockContext = createMockOTPContext([
        { char: "1", isActive: false, hasFakeCaret: false }
      ])
      
      const { container } = renderWithOTPContext(
        <InputOTPSlot index={0} className="custom-slot-class" data-testid="custom-slot" />,
        mockContext
      )
      
      const slot = screen.getByTestId('custom-slot')
      expect(slot).toHaveClass("custom-slot-class")
    })
  })
  
  describe("InputOTPSeparator", () => {
    it("renders a separator with Dot icon", () => {
      const { container } = render(<InputOTPSeparator data-testid="separator" />)
      
      expect(container.querySelector('svg')).toBeInTheDocument()
      const separator = screen.getByTestId('separator')
      expect(separator).toHaveAttribute("role", "separator")
    })
    
    it("applies additional props", () => {
      const { container } = render(
        <InputOTPSeparator className="custom-separator" data-testid="separator" />
      )
      
      const separator = screen.getByTestId('separator')
      expect(separator).toHaveAttribute("data-testid", "separator")
      expect(separator).toHaveClass("custom-separator")
    })
  })
}) 