import * as React from "react"
import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./checkbox"
import { render, hasClasses, renderWithForm } from "@/__tests__/utils/test-utils"
import { z } from "zod"

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

    it("renders different states based on checked prop", () => {
      const { getByRole, rerender } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      // Initially unchecked
      expect(checkbox).not.toBeChecked()
      expect(checkbox).toHaveAttribute("data-state", "unchecked")
      
      // Change to checked
      rerender(<Checkbox checked />)
      expect(checkbox).toBeChecked()
      expect(checkbox).toHaveAttribute("data-state", "checked")
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

    it("functions as a controlled component with checked prop", () => {
      const handleCheckedChange = jest.fn()
      const { getByRole } = render(
        <Checkbox checked={true} onCheckedChange={handleCheckedChange} />
      )
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toBeChecked()
      
      fireEvent.click(checkbox)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
      
      // The component is controlled, so it won't change state without parent re-rendering
      expect(checkbox).toBeChecked()
    })
  })
  
  describe("Keyboard Interactions", () => {
    it("can be focused via keyboard", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
    })
    
    it("toggles when Space key is pressed", async () => {
      const user = userEvent.setup()
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).not.toBeChecked()
      
      // Focus the checkbox first
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
      
      // Press Space key
      await user.keyboard(" ")
      expect(checkbox).toBeChecked()
      
      // Press Space key again
      await user.keyboard(" ")
      expect(checkbox).not.toBeChecked()
    })

    it("does not toggle when other keys are pressed", async () => {
      const user = userEvent.setup()
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      // Focus the checkbox
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
      
      // Press Enter key - should not toggle
      await user.keyboard("{Enter}")
      expect(checkbox).not.toBeChecked()
    })
  })
  
  describe("Accessibility", () => {
    it("has the correct ARIA attributes", () => {
      const { getByRole } = render(<Checkbox aria-label="Accept terms" />)
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toHaveAttribute("aria-label", "Accept terms")
    })

    it("has appropriate aria-checked values based on state", () => {
      const { getByRole, rerender } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      // Unchecked state
      expect(checkbox).toHaveAttribute("aria-checked", "false")
      
      // Checked state
      rerender(<Checkbox checked />)
      expect(checkbox).toHaveAttribute("aria-checked", "true")
    })

    it("has focus indicators for keyboard users", () => {
      const { getByRole } = render(<Checkbox />)
      const checkbox = getByRole("checkbox")
      
      expect(hasClasses(checkbox, "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2")).toBe(true)
      
      // Focus the checkbox
      checkbox.focus()
      // This is more of a visual check, so we're just ensuring the classes exist
      expect(hasClasses(checkbox, "focus-visible:ring-2")).toBe(true)
    })
  })

  describe("Label Association", () => {
    it("can be toggled by clicking on an associated label", () => {
      const { getByRole, getByText } = render(
        <div>
          <Checkbox id="terms" />
          <label htmlFor="terms">Accept Terms and Conditions</label>
        </div>
      )
      
      const checkbox = getByRole("checkbox")
      const label = getByText("Accept Terms and Conditions")
      
      expect(checkbox).not.toBeChecked()
      
      // Click on the label
      fireEvent.click(label)
      
      // Checkbox should be checked
      expect(checkbox).toBeChecked()
    })

    it("maintains association with label using aria-labelledby", () => {
      const { getByRole, getByText } = render(
        <div>
          <label id="terms-label">Accept Terms and Conditions</label>
          <Checkbox aria-labelledby="terms-label" />
        </div>
      )
      
      const checkbox = getByRole("checkbox")
      
      expect(checkbox).toHaveAttribute("aria-labelledby", "terms-label")
      expect(getByText("Accept Terms and Conditions")).toBeInTheDocument()
    })
  })

  describe("Form Integration", () => {
    it("can be used within a form with name and value", () => {
      const handleSubmit = jest.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData;
      });
      
      const { getByRole } = render(
        <form onSubmit={handleSubmit}>
          <Checkbox id="terms" name="terms" value="accepted" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const checkbox = getByRole("checkbox");
      const submitButton = getByRole("button", { name: "Submit" });
      
      // Check the box
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      // Submit the form
      fireEvent.click(submitButton);
      
      // Verify handleSubmit was called
      expect(handleSubmit).toHaveBeenCalled();
    });

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
      
      const checkbox = getByRole("checkbox")
      const submitButton = getByRole("button", { name: "Submit" })
      
      // Check the box
      fireEvent.click(checkbox)
      
      // Submit the form
      fireEvent.click(submitButton)
      
      // The checkbox value should be included in form data when checked
      expect(handleSubmit).toHaveBeenCalledWith("accepted")
      
      // Uncheck the box
      fireEvent.click(checkbox)
      
      // Submit again
      fireEvent.click(submitButton)
      
      // When unchecked, the checkbox value should not be included in form data
      expect(handleSubmit).toHaveBeenCalledWith(null)
    })
  })
}) 