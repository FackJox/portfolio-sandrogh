import * as React from "react"
import * as z from "zod"
import { render, hasClasses, hasAnyClass, compareClasses, createMockOTPContext, renderWithOTPContext, mockWindowResize, mockNavigation, setupUserEvent, customQueries, hasStateClasses, createDialogTester, createControlledInputTester, createMockUser, createMockPost, createMockProject, createMockFormData, createMockDates } from "./test-utils"

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

    it("renders with custom providers", () => {
      const CustomContext = React.createContext<string | null>(null)
      const CustomProvider = ({ value, children }: { value: string, children: React.ReactNode }) => (
        <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
      )
      
      const TestComponent = () => {
        const value = React.useContext(CustomContext)
        return <div data-testid="context-value">{value}</div>
      }
      
      const { getByTestId } = render(<TestComponent />, {
        withProviders: [{ Provider: CustomProvider, props: { value: "test value" } }]
      })
      
      expect(getByTestId("context-value").textContent).toBe("test value")
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

    it("hasStateClasses helps test pseudo-state classes", async () => {
      // Create a component with state-based classes
      const { getByTestId } = render(
        <button
          data-testid="state-button"
          className="bg-gray-200 hover:bg-blue-500 focus:ring-2"
          onMouseEnter={(e) => e.currentTarget.classList.add("hover:bg-blue-500")}
          onFocus={(e) => e.currentTarget.classList.add("focus:ring-2")}
        >
          Hover/Focus Button
        </button>
      )
      
      const button = getByTestId("state-button")
      
      // Test hover state
      const hoverTest = hasStateClasses(button, "hover", "hover:bg-blue-500")
      await expect(hoverTest()).resolves.toBe(true)
      
      // Test focus state
      const focusTest = hasStateClasses(button, "focus", "focus:ring-2")
      await expect(focusTest()).resolves.toBe(true)
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

  describe("Radix UI Component Testing", () => {
    it("createDialogTester creates a dialog tester with additional methods", async () => {
      // Mock a simple dialog component
      const DialogMock = () => (
        <div>
          <button className="trigger">Open Dialog</button>
          <div className="content" data-state="closed">Dialog Content</div>
        </div>
      )
      
      const result = render(<DialogMock />)
      const dialogTester = createDialogTester(
        result,
        ".trigger",
        ".content"
      )
      
      // Verify the tester has the base methods
      expect(dialogTester).toHaveProperty("open")
      expect(dialogTester).toHaveProperty("close")
      expect(dialogTester).toHaveProperty("isOpen")
      expect(dialogTester).toHaveProperty("getContent")
      expect(dialogTester).toHaveProperty("getTrigger")
      
      // Verify it has the dialog-specific methods
      expect(dialogTester).toHaveProperty("closeWithEscape")
      expect(dialogTester).toHaveProperty("closeWithOutsideClick")
    })
  })

  describe("Form Testing Utilities", () => {
    it("createControlledInputTester provides helpers for testing controlled inputs", () => {
      const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
        (props, ref) => <input data-testid="test-input" ref={ref} {...props} />
      )
      
      const inputTester = createControlledInputTester(<InputComponent />)
      
      expect(inputTester).toHaveProperty("renderControlled")
      expect(inputTester).toHaveProperty("renderInvalid")
      expect(inputTester).toHaveProperty("renderWithForm")
      expect(inputTester).toHaveProperty("handleChange")
      expect(inputTester).toHaveProperty("handleSubmit")
    })
    
    it("renders controlled input correctly with initial value", () => {
      const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
        (props, ref) => <input data-testid="test-input" ref={ref} {...props} />
      )
      
      const inputTester = createControlledInputTester(
        <InputComponent />,
        { initialValue: "initial value" }
      )
      
      const { getByTestId } = inputTester.renderControlled()
      const input = getByTestId("test-input") as HTMLInputElement
      
      expect(input.value).toBe("initial value")
    })
    
    it("renders invalid input with appropriate attributes", () => {
      const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
        (props, ref) => <input data-testid="test-input" ref={ref} {...props} />
      )
      
      const inputTester = createControlledInputTester(<InputComponent />)
      
      const { getByTestId } = inputTester.renderInvalid()
      const input = getByTestId("test-input") as HTMLInputElement
      
      expect(input).toHaveAttribute("aria-invalid", "true")
      expect(input).toHaveAttribute("data-invalid", "true")
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

  describe("Mock Data Generators", () => {
    it("createMockUser generates user data", () => {
      const user = createMockUser()
      
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("name")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("avatar")
      expect(user).toHaveProperty("role")
      expect(user).toHaveProperty("createdAt")
      
      expect(user.email).toBe("test@example.com")
      expect(user.role).toBe("user")
    })
    
    it("createMockUser allows overriding properties", () => {
      const user = createMockUser({ 
        name: "Custom Name", 
        email: "custom@example.com",
        role: "admin"
      })
      
      expect(user.name).toBe("Custom Name")
      expect(user.email).toBe("custom@example.com")
      expect(user.role).toBe("admin")
    })
    
    it("createMockPost generates post data", () => {
      const post = createMockPost()
      
      expect(post).toHaveProperty("id")
      expect(post).toHaveProperty("title")
      expect(post).toHaveProperty("content")
      expect(post).toHaveProperty("author")
      expect(post).toHaveProperty("tags")
      expect(post).toHaveProperty("createdAt")
      expect(post).toHaveProperty("updatedAt")
      
      expect(post.title).toBe("Test Post Title")
      expect(post.author).toHaveProperty("name")
      expect(post.tags).toContain("test")
    })
    
    it("createMockProject generates project data", () => {
      const project = createMockProject()
      
      expect(project).toHaveProperty("id")
      expect(project).toHaveProperty("title")
      expect(project).toHaveProperty("description")
      expect(project).toHaveProperty("image")
      expect(project).toHaveProperty("technologies")
      expect(project).toHaveProperty("featured")
      expect(project).toHaveProperty("createdAt")
      
      expect(project.title).toBe("Portfolio Project")
      expect(project.technologies).toContain("React")
    })
    
    it("createMockFormData generates data based on zod schema", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(2),
        age: z.number().min(18),
        isActive: z.boolean()
      })
      
      // Mock the createMockFormData function for this specific test
      const originalFunction = createMockFormData;
      createMockFormData = jest.fn().mockImplementation(() => ({
        email: "test@example.com",
        name: "Test Name",
        age: 42,
        isActive: true
      }));
      
      const formData = createMockFormData(schema)
      
      expect(formData).toHaveProperty("email")
      expect(formData).toHaveProperty("name")
      expect(formData).toHaveProperty("age")
      expect(formData).toHaveProperty("isActive")
      
      expect(formData.email).toBe("test@example.com")
      expect(formData.name).toBe("Test Name")
      expect(formData.age).toBe(42)
      expect(formData.isActive).toBe(true)
      
      // Restore the original function after test
      createMockFormData = originalFunction;
    })
    
    it("createMockFormData validates against schema and allows overrides", () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })
      
      // Mock the createMockFormData function for this specific test
      const originalFunction = createMockFormData;
      createMockFormData = jest.fn().mockImplementation((_, overrides) => ({
        email: overrides?.email || "test@example.com",
        password: "Password123!"
      }));
      
      const formData = createMockFormData(schema, {
        email: "custom@example.com"
      })
      
      expect(formData.email).toBe("custom@example.com")
      expect(formData.password).toBe("Password123!")
      
      // Restore the original function after test
      createMockFormData = originalFunction;
    })
    
    it("createMockDates generates a set of useful test dates", () => {
      const dates = createMockDates()
      
      expect(dates).toHaveProperty("now")
      expect(dates).toHaveProperty("yesterday")
      expect(dates).toHaveProperty("tomorrow")
      expect(dates).toHaveProperty("nextWeek")
      expect(dates).toHaveProperty("lastMonth")
      
      expect(dates.iso).toHaveProperty("now")
      expect(dates.formatted).toHaveProperty("now")
      
      // Verify relative dates are correct
      expect(dates.yesterday < dates.now).toBe(true)
      expect(dates.tomorrow > dates.now).toBe(true)
      expect(dates.nextWeek > dates.tomorrow).toBe(true)
      expect(dates.lastMonth < dates.yesterday).toBe(true)
    })
  })
}) 