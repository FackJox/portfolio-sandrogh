import * as React from "react"
import { fireEvent } from "@testing-library/react"
import { Checkbox } from "./checkbox"
import { render, hasClasses } from "@/__tests__/utils/test-utils"

describe("Checkbox Component", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
      expect(hasClasses(checkbox, "peer", "h-4", "w-4", "rounded-sm")).toBe(true)
    })
    
    it("renders with custom className", () => {
      const { getByRole } = render(<Checkbox className="custom-class" />)
      const checkbox = getByRole("checkbox")
      
      expect(hasClasses(checkbox, "custom-class")).toBe(true)
    })
    
    it("renders in checked state when defaultChecked is true", () => {
      const { getByRole } = render(<Checkbox defaultChecked />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toBeChecked()
    })
  })
  
  describe("Behavior", () => {
    it("changes checked state when clicked", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).not.toBeChecked()
      
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      
      fireEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
    
    it("calls onCheckedChange when state changes", () => {
      const handleCheckedChange = jest.fn()
      const { getByRole } = render(
        <Checkbox onCheckedChange={handleCheckedChange} />
      )
      const checkbox = getByRole("checkbox")
      
      fireEvent.click(checkbox)
      expect(handleCheckedChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
      
      fireEvent.click(checkbox)
      expect(handleCheckedChange).toHaveBeenCalledTimes(2)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })
    
    it("respects disabled prop", () => {
      const handleCheckedChange = jest.fn()
      const { getByRole } = render(
        <Checkbox disabled onCheckedChange={handleCheckedChange} />
      )
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toBeDisabled()
      
      fireEvent.click(checkbox)
      expect(handleCheckedChange).not.toHaveBeenCalled()
      expect(checkbox).not.toBeChecked()
    })
  })
  
  describe("Accessibility", () => {
    it("has the correct ARIA attributes", () => {
      const { getByRole } = render(<Checkbox aria-label="Accept terms" />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toHaveAttribute("aria-label", "Accept terms")
    })
    
    it("can be focused via keyboard", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
    })
    
    it("can be focused by keyboard", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
    })
  })
}) 