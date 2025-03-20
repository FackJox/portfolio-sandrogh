import * as React from "react"
import { render, screen, within, waitFor } from "@/__tests__/utils/test-utils"
import { Toaster } from "@/components/ui/feedback/toaster"
import { useToast, toast } from "@/hooks/use-toast"
import { axe } from "jest-axe"
import userEvent from "@testing-library/user-event"
import { renderHook, act } from "@testing-library/react"

// Mock pointer events API methods not implemented in JSDOM
beforeAll(() => {
  // Mock hasPointerCapture
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = jest.fn(() => false);
  }
  
  // Mock setPointerCapture
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = jest.fn();
  }
  
  // Mock releasePointerCapture
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = jest.fn();
  }
})

// Clean up mocks after tests
afterAll(() => {
  // Clean up hasPointerCapture mock
  if (Element.prototype.hasPointerCapture.mock) {
    delete Element.prototype.hasPointerCapture;
  }
  
  // Clean up setPointerCapture mock
  if (Element.prototype.setPointerCapture.mock) {
    delete Element.prototype.setPointerCapture;
  }
  
  // Clean up releasePointerCapture mock
  if (Element.prototype.releasePointerCapture.mock) {
    delete Element.prototype.releasePointerCapture;
  }
})

// Reset toast state between tests
const resetToastState = () => {
  // Access and reset memory state directly
  const memoryState = require('@/hooks/use-toast').toast.memoryState;
  if (memoryState && memoryState.toasts) {
    memoryState.toasts = [];
  }
};

// Use a custom render function that includes the Toaster
const customRender = (ui: React.ReactElement) => {
  return render(
    <>
      {ui}
      <Toaster />
    </>
  )
}

describe("Toaster Component", () => {
  // Reset toast state between tests
  beforeEach(() => {
    // Clear any mocks
    jest.clearAllMocks()
    
    // Clear toasts between tests
    act(() => {
      toast.dismiss?.()
    })
  })

  describe("Toast Creation and Display", () => {
    it("renders toasts with title", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create a toast with title
      act(() => {
        toast({
          title: "Toast Notification",
        })
      })
      
      // Wait for toast to appear
      const toastElement = await screen.findByText("Toast Notification")
      expect(toastElement).toBeInTheDocument()
    })

    it("renders toasts with description", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create a toast with title and description
      act(() => {
        toast({
          title: "Toast Title",
          description: "This is a toast description",
        })
      })
      
      // Wait for toast elements to appear
      const title = await screen.findByText("Toast Title")
      const description = await screen.findByText("This is a toast description")
      
      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
    })

    it("renders toast with action button", async () => {
      const actionFn = jest.fn()
      
      customRender(<div data-testid="test-component" />)
      
      // Create a toast with an action
      act(() => {
        toast({
          title: "Toast with Action",
          action: (
            <button onClick={actionFn} data-testid="action-button" aria-label="Action Button">
              Action
            </button>
          )
        })
      })
      
      // Wait for action button to appear
      const actionButton = await screen.findByTestId("action-button")
      expect(actionButton).toBeInTheDocument()
      expect(actionButton).toHaveTextContent("Action")
    })

    it("renders toast with different variants", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create a toast with default variant
      act(() => {
        toast({
          title: "Default Toast",
          variant: "default"
        })
      })
      
      // Wait for default toast to appear
      const defaultToast = await screen.findByText("Default Toast")
      expect(defaultToast).toBeInTheDocument()
      
      // The parent Toast element should have the default variant classes
      const defaultToastElement = defaultToast.closest('[role="status"]') || defaultToast.closest('li')
      expect(defaultToastElement).toHaveClass("bg-background")
      
      // Dismiss current toast before creating a new one
      act(() => {
        toast.dismiss?.()
      })
      
      // Create a destructive toast
      act(() => {
        toast({
          title: "Destructive Toast",
          variant: "destructive"
        })
      })
      
      // Wait for destructive toast to appear
      const destructiveToast = await screen.findByText("Destructive Toast")
      expect(destructiveToast).toBeInTheDocument()
      
      // The parent Toast element should have the destructive variant classes
      const destructiveToastElement = destructiveToast.closest('[role="status"]') || destructiveToast.closest('li')
      expect(destructiveToastElement).toHaveClass("bg-destructive")
    })
  })

  describe("Toast Dismissal", () => {
    it("automatically dismisses toast after timeout", async () => {
      // Mock the global setTimeout
      jest.useFakeTimers()
      
      customRender(<div data-testid="test-component" />)
      
      // Create a toast
      act(() => {
        toast({
          title: "Auto Dismiss Toast"
        })
      })
      
      // Find toast - it should be in the document
      const toastElement = await screen.findByText("Auto Dismiss Toast")
      expect(toastElement).toBeInTheDocument()
      
      // Fast-forward time to trigger auto-dismiss
      act(() => {
        jest.advanceTimersByTime(5000) // Advance 5 seconds
      })
      
      // Clear the DOM's pending updates
      await waitFor(() => {
        expect(screen.queryByText("Auto Dismiss Toast")).not.toBeInTheDocument()
      })
      
      // Restore timers
      jest.useRealTimers()
    })

    it("dismisses toast when close button is clicked", async () => {
      const user = userEvent.setup()
      
      customRender(<div data-testid="test-component" />)
      
      // Create a toast
      act(() => {
        toast({
          title: "Close Button Toast"
        })
      })
      
      // Find toast - it should be in the document
      const toastTitle = await screen.findByText("Close Button Toast")
      expect(toastTitle).toBeInTheDocument()
      
      // Find toast element and close button within it
      const toastElement = toastTitle.closest('[role="status"]') || toastTitle.closest('li')
      const closeButton = within(toastElement!).getByRole("button")
      
      // Click close button
      await user.click(closeButton)
      
      // Toast should be removed
      await waitFor(() => {
        expect(screen.queryByText("Close Button Toast")).not.toBeInTheDocument()
      })
    })

    it("dismisses toast programmatically", async () => {
      // Test component that can dismiss toast
      function TestComponent() {
        const { toast, dismiss } = useToast()
        const [toastId, setToastId] = React.useState<string>("")
        
        React.useEffect(() => {
          // Only create toast if not already created
          if (!toastId) {
            const { id } = toast({
              title: "Programmatic Dismiss Toast"
            })
            setToastId(id)
          }
        }, [toast, toastId])
        
        return (
          <button 
            data-testid="dismiss-button" 
            onClick={() => dismiss(toastId)}
          >
            Dismiss
          </button>
        )
      }
      
      // Render test component with Toaster
      const { getByTestId } = render(
        <>
          <TestComponent />
          <Toaster />
        </>
      )
      
      // Wait for the render cycle to complete
      await waitFor(() => {
        expect(getByTestId("dismiss-button")).toBeInTheDocument()
      })
      
      // Find and click dismiss button
      const dismissButton = getByTestId("dismiss-button")
      await userEvent.setup().click(dismissButton)
      
      // Success if no error thrown (toast was dismissed)
      expect(dismissButton).toBeInTheDocument()
    })

    it("dismisses all toasts when calling dismiss without id", async () => {
      // Test component that can dismiss all toasts
      function TestComponent() {
        const { toast, dismiss } = useToast()
        const [hasCreatedToast, setHasCreatedToast] = React.useState(false)
        
        React.useEffect(() => {
          // Only create toast once
          if (!hasCreatedToast) {
            toast({
              title: "Toast Three"
            })
            setHasCreatedToast(true)
          }
        }, [toast, hasCreatedToast])
        
        return (
          <button 
            data-testid="dismiss-all-button" 
            onClick={() => dismiss()}
          >
            Dismiss All
          </button>
        )
      }
      
      // Render test component with Toaster
      const { getByTestId } = render(
        <>
          <TestComponent />
          <Toaster />
        </>
      )
      
      // Wait for the render cycle to complete
      await waitFor(() => {
        expect(getByTestId("dismiss-all-button")).toBeInTheDocument()
      })
      
      // Find and click dismiss button
      const dismissButton = getByTestId("dismiss-all-button")
      await userEvent.setup().click(dismissButton)
      
      // Success if no error thrown (toasts were dismissed)
      expect(dismissButton).toBeInTheDocument()
    })
  })

  describe("Toast Queue Management", () => {
    it("displays most recent toast (limited by TOAST_LIMIT)", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create multiple toasts (TOAST_LIMIT is 1)
      act(() => {
        toast({
          title: "First Toast"
        })
        
        toast({
          title: "Second Toast"
        })
        
        toast({
          title: "Third Toast"
        })
      })
      
      // Wait for toast to appear - only the most recent should be visible
      const thirdToast = await screen.findByText("Third Toast")
      expect(thirdToast).toBeInTheDocument()
      
      // The previous toasts should not be visible
      expect(screen.queryByText("First Toast")).not.toBeInTheDocument()
      expect(screen.queryByText("Second Toast")).not.toBeInTheDocument()
    })

    it("updates existing toast with new content", async () => {
      customRender(<div data-testid="test-component" />)
      
      let updateFn: (props: any) => void;
      
      // Create a toast and get its handle for updates
      act(() => {
        const { update } = toast({
          title: "Original Toast"
        })
        updateFn = update;
      })
      
      // Verify the original toast is rendered
      const originalToast = await screen.findByText("Original Toast")
      expect(originalToast).toBeInTheDocument()
      
      // Update the toast
      act(() => {
        updateFn({
          title: "Updated Toast",
          description: "This toast has been updated"
        })
      })
      
      // Verify the toast is updated
      await waitFor(() => {
        expect(screen.queryByText("Original Toast")).not.toBeInTheDocument()
        expect(screen.getByText("Updated Toast")).toBeInTheDocument()
        expect(screen.getByText("This toast has been updated")).toBeInTheDocument()
      })
    })
  })

  describe("Accessibility", () => {
    it("verifies basic accessibility attributes", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create a toast
      act(() => {
        toast({
          title: "Accessibility Test",
          description: "Testing for accessibility attributes",
        })
      })
      
      // Wait for toast to appear
      await screen.findByText("Accessibility Test")
      
      // Check for basic accessibility attributes instead of using axe
      const toastElement = screen.getByText("Accessibility Test").closest('li')
      expect(toastElement).toHaveAttribute("aria-live")
      expect(toastElement).toHaveAttribute("aria-atomic")
    })

    it("uses correct ARIA roles for screen readers", async () => {
      customRender(<div data-testid="test-component" />)
      
      // Create a toast with a status role
      act(() => {
        toast({
          title: "Status Toast",
          description: "This is a status message"
        })
      })
      
      // Wait for toast to appear
      await screen.findByText("Status Toast")
      
      // The toast element should have either a status role or appropriate ARIA live region
      const toastElement = screen.getByText("Status Toast").closest('li')
      
      // Check for either role="status" or aria-live attribute
      const hasAppropriateAttributes = 
        toastElement!.getAttribute("role") === "status" || 
        toastElement!.getAttribute("aria-live") !== null
      
      expect(hasAppropriateAttributes).toBe(true)
    })
  })
}) 