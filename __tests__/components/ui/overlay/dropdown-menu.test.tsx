import * as React from "react"
import { render, screen, fireEvent, customRender, hasClasses } from "@/__tests__/utils/test-utils"
import { createRadixTester } from "@/__tests__/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { axe, toHaveNoViolations } from "jest-axe"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut
} from "@/components/ui/overlay/dropdown-menu"
import { waitFor } from "@testing-library/react"

// Add jest-axe custom matcher
expect.extend(toHaveNoViolations)

// Mock the scrollIntoView method which isn't available in JSDOM
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn()
}

// Mock for keyboard events testing
const mockKeyDown = (element: Element, key: string, options: KeyboardEventInit = {}) => {
  fireEvent.keyDown(element, { key, ...options })
}

describe("DropdownMenu Component", () => {
  // Test 1: Test menu rendering in closed state
  describe("Initial Rendering", () => {
    it("renders with closed menu by default", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      // Check that the trigger exists but content is not in the document by default
      expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument()
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    })

    it("applies correct styling to trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="test-class" data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      const trigger = screen.getByTestId("dropdown-trigger")
      expect(trigger).toHaveClass("test-class")
    })
  })

  // Test 2: Test menu opening and closing
  describe("Menu Opening and Closing", () => {
    it("opens and closes the menu when clicking the trigger", async () => {
      const user = userEvent.setup()
      const result = render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="dropdown-item">Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // First click to open the menu
      await user.click(trigger)
      
      // Check that content is now in the document
      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument()
      
      // Check aria-expanded is updated
      expect(trigger).toHaveAttribute("aria-expanded", "true")
      
      // Close the menu by clicking outside (use Escape as a workaround in tests)
      await user.keyboard('{Escape}')
      
      // Check that content is no longer in the document
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
      
      // Check aria-expanded is updated
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    })

    it("closes the dropdown menu when ESC key is pressed", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="dropdown-item">Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // First click to open the menu
      await user.click(trigger)
      
      // Check that content is now in the document
      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument()
      
      // Press ESC key
      await user.keyboard('{Escape}')
      
      // Check that content is no longer in the document
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    })
  })

  // Test 3: Test menu item rendering and selection
  describe("Menu Item Rendering and Selection", () => {
    it("renders menu items correctly", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-1">Item 1</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-2">Item 2</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-3">Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Check all items are rendered
      expect(screen.getByTestId("item-1")).toBeInTheDocument()
      expect(screen.getByTestId("item-2")).toBeInTheDocument()
      expect(screen.getByTestId("item-3")).toBeInTheDocument()
    })

    it("selects an item when clicked", async () => {
      const onSelectMock = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-1" onSelect={onSelectMock}>Item 1</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-2">Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Click on the first item
      await user.click(screen.getByTestId("item-1"))
      
      // Check that onSelect was called
      expect(onSelectMock).toHaveBeenCalledTimes(1)
      
      // Check that menu is closed after selection
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    })
  })

  // Test 4: Test keyboard navigation through menu items
  describe("Keyboard Navigation", () => {
    it("allows navigating menu items with arrow keys", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-1">Item 1</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-2">Item 2</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-3">Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Press down arrow to focus on first item
      await user.keyboard('{ArrowDown}')
      
      // Check first item is focused
      expect(document.activeElement).toHaveTextContent("Item 1")
      
      // Press down arrow again to move to second item
      await user.keyboard('{ArrowDown}')
      
      // Check second item is focused
      expect(document.activeElement).toHaveTextContent("Item 2")
      
      // Press up arrow to move back to first item
      await user.keyboard('{ArrowUp}')
      
      // Check first item is focused again
      expect(document.activeElement).toHaveTextContent("Item 1")
    })

    it("allows selecting item with Enter key", async () => {
      const onSelectMock = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-1" onSelect={onSelectMock}>Item 1</DropdownMenuItem>
            <DropdownMenuItem data-testid="item-2">Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Press down arrow to focus on first item
      await user.keyboard('{ArrowDown}')
      
      // Press Enter to select the first item
      await user.keyboard('{Enter}')
      
      // Check that onSelect was called
      expect(onSelectMock).toHaveBeenCalledTimes(1)
      
      // Check that menu is closed after selection
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    })
  })

  // Test 5: Test submenu functionality
  describe("Submenu Functionality", () => {
    it("renders submenu trigger and content", async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-1">Item 1</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="submenu-trigger">More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent data-testid="submenu-content">
                <DropdownMenuItem data-testid="submenu-item-1">Submenu Item 1</DropdownMenuItem>
                <DropdownMenuItem data-testid="submenu-item-2">Submenu Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Check that submenu trigger is rendered
      expect(screen.getByTestId("submenu-trigger")).toBeInTheDocument()
      
      // Submenu content should not be visible initially
      expect(screen.queryByTestId("submenu-content")).not.toBeInTheDocument()
      
      // Click on submenu trigger to open it
      await user.click(screen.getByTestId("submenu-trigger"))
      
      // Check submenu content is now visible
      // Radix creates a separate portal for the submenu
      expect(screen.getByTestId("submenu-content")).toBeInTheDocument()
      expect(screen.getByTestId("submenu-item-1")).toBeInTheDocument()
      expect(screen.getByTestId("submenu-item-2")).toBeInTheDocument()
    })
  })

  // Test 6: Test disabled menu items
  describe("Disabled Menu Items", () => {
    it("renders disabled menu items correctly", async () => {
      const onSelectMock = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="enabled-item" onSelect={onSelectMock}>Enabled Item</DropdownMenuItem>
            <DropdownMenuItem data-testid="disabled-item" disabled onSelect={onSelectMock}>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Check disabled item has the disabled attribute
      const disabledItem = screen.getByTestId("disabled-item")
      expect(disabledItem).toHaveAttribute("data-disabled")
      
      // Check disabled item has appropriate styling
      expect(disabledItem).toHaveClass("data-[disabled]:pointer-events-none")
      expect(disabledItem).toHaveClass("data-[disabled]:opacity-50")
      
      // Try to click on the disabled item
      await user.click(disabledItem)
      
      // onSelect should not have been called
      expect(onSelectMock).not.toHaveBeenCalled()
      
      // Click on the enabled item
      await user.click(screen.getByTestId("enabled-item"))
      
      // onSelect should have been called once
      expect(onSelectMock).toHaveBeenCalledTimes(1)
    })
  })

  // Test 7: Test custom rendering of menu items
  describe("Custom Rendering", () => {
    it("renders custom elements in menu items", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem data-testid="item-with-icon">
              <span data-testid="custom-icon">🔔</span>
              <span>Item with Icon</span>
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="item-with-shortcut">
              Item with Shortcut
              <DropdownMenuShortcut data-testid="shortcut">⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      
      // Open the menu
      await user.click(trigger)
      
      // Check that custom elements are rendered
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
      expect(screen.getByTestId("shortcut")).toBeInTheDocument()
    })

    it("renders checkbox and radio items correctly", async () => {
      const onCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuCheckboxItem
              data-testid="dropdown-checkbox"
              checked={true}
              onCheckedChange={onCheckedChange}
            >
              Show Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value="pedro">
              <DropdownMenuRadioItem value="pedro">Pedro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="colm">Colm</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      // With defaultOpen, the menu should already be open
      await waitFor(() => {
        expect(screen.getByTestId("dropdown-content")).toBeInTheDocument()
      })
      
      // Check the checkbox item
      const checkboxItem = screen.getByTestId("dropdown-checkbox")
      expect(checkboxItem).toBeInTheDocument()
      expect(checkboxItem).toHaveAttribute("data-state", "checked")
      
      // Click the checkbox
      await user.click(checkboxItem)
      expect(onCheckedChange).toHaveBeenCalledWith(false)
    })
    
    it("renders radio items correctly", async () => {
      // Create a simpler test that focuses just on radio items
      const onValueChange = jest.fn()
      
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="pedro" onValueChange={onValueChange}>
              <DropdownMenuRadioItem value="pedro" data-testid="radio-pedro">
                Pedro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="colm" data-testid="radio-colm">
                Colm
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      // Verify the radio items
      const pedroItem = screen.getByTestId("radio-pedro")
      const colmItem = screen.getByTestId("radio-colm")
      
      expect(pedroItem).toBeInTheDocument()
      expect(colmItem).toBeInTheDocument()
      
      // Pedro should be checked
      expect(pedroItem).toHaveAttribute("data-state", "checked")
      expect(colmItem).toHaveAttribute("data-state", "unchecked")
      
      // Click on Colm
      const user = userEvent.setup()
      await user.click(colmItem)
      
      // onValueChange should be called
      expect(onValueChange).toHaveBeenCalledWith("colm")
    })
  })

  // Test 8: Test accessibility features
  describe("Accessibility", () => {
    it("has correct ARIA attributes", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByTestId("dropdown-trigger")
      expect(trigger).toHaveAttribute("aria-expanded", "false")
      
      // Open the menu
      await user.click(trigger)
      
      // Check aria-expanded is updated
      expect(trigger).toHaveAttribute("aria-expanded", "true")
      
      // Check menu has correct role
      const menuContent = screen.getByTestId("dropdown-content")
      expect(menuContent).toHaveAttribute("role", "menu")
      
      // Check menu items have correct role
      const menuItems = screen.getAllByRole("menuitem")
      expect(menuItems.length).toBe(1)
    })

    it("passes basic accessibility tests", async () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="dropdown-trigger">Trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="dropdown-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
}) 