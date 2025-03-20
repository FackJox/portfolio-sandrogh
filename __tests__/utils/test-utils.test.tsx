import * as React from "react"
import { render, hasClasses, hasAnyClass, compareClasses, createMockOTPContext, renderWithOTPContext, mockWindowResize, mockNavigation, setupUserEvent, customQueries } from "./test-utils"

describe("Test Utilities", () => {
  describe("Render Function", () => {
    it("renders components correctly", () => {
      const { getByText } = render(<div>Test Component</div>)
      expect(getByText("Test Component")).toBeInTheDocument()
    })

    it("renders with theme provider", () => {
      const { getByText } = render(<div>Themed Component</div>, { theme: "dark" })
      expect(getByText("Themed Component")).toBeInTheDocument()
      // We can't directly test the theme attribute since it's set by next-themes,
      // but we can verify the component renders properly
    })
  })

  describe("Tailwind Class Testing Helpers", () => {
    it("hasClasses checks if element has all specified classes", () => {
      const { getByText } = render(
        <div className="bg-primary text-white px-4 py-2">Test Element</div>
      )
      const element = getByText("Test Element")
      
      expect(hasClasses(element, "bg-primary", "text-white")).toBe(true)
      expect(hasClasses(element, "bg-primary", "non-existent-class")).toBe(false)
    })

    it("hasAnyClass checks if element has any of the specified classes", () => {
      const { getByText } = render(
        <div className="bg-primary text-white">Test Element</div>
      )
      const element = getByText("Test Element")
      
      expect(hasAnyClass(element, "non-existent", "text-white")).toBe(true)
      expect(hasAnyClass(element, "non-existent", "also-non-existent")).toBe(false)
    })

    it("compareClasses compares rendered classes with expected classes", () => {
      const className = "bg-primary text-white px-4 py-2"
      
      expect(compareClasses(className, ["bg-primary", "text-white", "px-4", "py-2"])).toBe(true)
      expect(compareClasses(className, ["bg-primary", "text-white", "px-5"])).toBe(false)
    })
  })

  describe("OTP Input Context Utilities", () => {
    it("createMockOTPContext creates a valid mock context", () => {
      const mockContext = createMockOTPContext([
        { char: "1", isActive: true },
        { char: "2" }
      ])
      
      expect(mockContext.slots).toHaveLength(2)
      expect(mockContext.slots[0].char).toBe("1")
      expect(mockContext.slots[0].isActive).toBe(true)
      expect(mockContext.slots[1].char).toBe("2")
      expect(mockContext.slots[1].isActive).toBe(false)
    })

    it("renderWithOTPContext renders components with the OTP context", () => {
      const mockContext = createMockOTPContext([{ char: "1", isActive: true }])
      
      const TestComponent = () => {
        const context = React.useContext(require("input-otp").OTPInputContext)
        return <div data-testid="test-component">{context.slots[0].char}</div>
      }
      
      const { getByTestId } = renderWithOTPContext(<TestComponent />, mockContext)
      expect(getByTestId("test-component").textContent).toBe("1")
    })
  })

  describe("Window Resize Mock", () => {
    it("mocks window resize correctly", () => {
      const cleanup = mockWindowResize(500, 800)
      
      expect(window.innerWidth).toBe(500)
      expect(window.innerHeight).toBe(800)
      
      // Clean up after test
      if (cleanup) cleanup()
    })
  })

  describe("Navigation Mock", () => {
    it("mocks navigation correctly", () => {
      mockNavigation.push("/test-path")
      expect(mockNavigation.getCurrentPath()).toBe("/test-path")
      
      mockNavigation.replace("/replaced-path")
      expect(mockNavigation.getCurrentPath()).toBe("/replaced-path")
    })
  })

  describe("User Event Setup", () => {
    it("returns a userEvent instance", () => {
      const user = setupUserEvent()
      expect(user).toHaveProperty("click")
      expect(user).toHaveProperty("type")
    })
  })

  describe("Custom Queries", () => {
    it("finds elements by class", () => {
      const { container } = render(
        <div>
          <span className="test-class">Test Element</span>
          <span className="test-class">Another Test Element</span>
        </div>
      )
      
      const element = customQueries.getByClass(container, "test-class")
      expect(element).toBeInTheDocument()
      expect(element.textContent).toBe("Test Element")
      
      const elements = customQueries.getAllByClass(container, "test-class")
      expect(elements).toHaveLength(2)
      expect(elements[1].textContent).toBe("Another Test Element")
      
      const queryResult = customQueries.queryByClass(container, "non-existent")
      expect(queryResult).toBeNull()
    })
  })
}) 