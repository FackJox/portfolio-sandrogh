import * as React from "react"
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/overlay/popover"
import { Button } from "@/components/ui/form/button"

// Mock ResizeObserver which is not available in Jest DOM environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Add mock implementation for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe("Popover Component", () => {
  it("should not render popover content when closed", () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // The trigger should be in the document
    expect(screen.getByRole("button", { name: /open popover/i })).toBeInTheDocument()
    
    // The content should not be in the document when closed
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
  })

  it("should open when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger button
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // The content should now be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
  })

  it("should close when trigger is clicked again", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Get the trigger button
    const triggerButton = screen.getByRole("button", { name: /open popover/i })
    
    // Click to open the popover
    await user.click(triggerButton)
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // Click again to close the popover
    await user.click(triggerButton)
    
    // The content should no longer be in the document
    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
    })
  })

  it("should close when escape key is pressed", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // Press Escape to close the popover
    await user.keyboard('{Escape}')
    
    // The content should no longer be in the document
    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
    })
  })

  it("should close when clicking outside", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // Find the portal wrapper for more reliable outside clicking
    const portalWrapper = document.querySelector('[data-radix-popper-content-wrapper]')
    
    // Force document click event
    // We need to use a more direct approach as userEvent has issues with this in JSDOM
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    
    // The content should no longer be in the document
    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument()
    })
  })

  it("should render content in the correct position", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="start" sideOffset={10}>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })

    // Find the popover content element
    const popoverContent = document.querySelector('[role="dialog"]')
    expect(popoverContent).toBeInTheDocument()
    
    // Check alignment attribute is set correctly
    expect(popoverContent).toHaveAttribute('data-align', 'start')
  })

  it("should support different alignment options", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="center">
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document and check alignment
    await waitFor(() => {
      const popoverContent = document.querySelector('[role="dialog"]')
      expect(popoverContent).toHaveAttribute('data-align', 'center')
    })
    
    // Close the popover by pressing Escape
    await user.keyboard('{Escape}')
    
    // Re-render with different alignment
    rerender(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="end">
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )
    
    // Click the trigger to open the popover again
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Check new alignment
    await waitFor(() => {
      const popoverContent = document.querySelector('[role="dialog"]')
      expect(popoverContent).toHaveAttribute('data-align', 'end')
    })
  })

  it("should handle interactive elements inside popover content", async () => {
    const onButtonClick = jest.fn()
    const user = userEvent.setup()
    
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
          <Button onClick={onButtonClick}>Click Me</Button>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // Click the button inside the popover
    await user.click(screen.getByRole("button", { name: /click me/i }))
    
    // Check the button click handler was called
    expect(onButtonClick).toHaveBeenCalledTimes(1)
    
    // The popover should still be open
    expect(screen.getByText("Popover Content")).toBeInTheDocument()
  })

  it("should have proper accessibility attributes", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    const trigger = screen.getByRole("button", { name: /open popover/i })
    
    // The trigger should have aria-expanded set to false initially
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    // Click to open
    await user.click(trigger)
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // The trigger should have aria-expanded="true" when popover is open
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // The trigger should have aria-controls attribute
    expect(trigger).toHaveAttribute('aria-controls')
    
    // Check if the content has the correct role
    const popoverContent = document.querySelector('[role="dialog"]')
    expect(popoverContent).toHaveAttribute('role', 'dialog')
  })

  it("should work with animations", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    )

    // Click the trigger to open the popover
    await user.click(screen.getByRole("button", { name: /open popover/i }))
    
    // Wait for the content to be in the document
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument()
    })
    
    // Get content
    const content = document.querySelector('[role="dialog"]')
    
    // Check animation states
    expect(content).toHaveAttribute('data-state', 'open')
    
    // Check for animation classes (as defined in the component)
    expect(content?.className).toContain('data-[state=open]:animate-in')
    expect(content?.className).toContain('data-[state=closed]:animate-out')
    expect(content?.className).toContain('data-[state=closed]:fade-out-0') 
    expect(content?.className).toContain('data-[state=open]:fade-in-0')
  })
}) 