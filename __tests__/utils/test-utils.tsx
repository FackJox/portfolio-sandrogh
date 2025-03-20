"use client"

import * as React from "react"
import { render, RenderOptions, RenderResult, screen, within, queries, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OTPInputContext } from "input-otp"
import { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ThemeProvider } from "@/components/ui/theming/theme-provider"
import { TooltipProvider } from "@/components/ui/overlay/tooltip"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"

// Setup global mocks that should be restored after tests
let originalMatchMedia: typeof window.matchMedia
let originalPushState: typeof window.history.pushState

// Save original implementations before any tests run
beforeAll(() => {
  originalMatchMedia = window.matchMedia
  originalPushState = window.history.pushState
  
  // Mock window.matchMedia
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
  }
})

// Restore original implementations after all tests
afterAll(() => {
  window.matchMedia = originalMatchMedia
  window.history.pushState = originalPushState
})

/**
 * Custom render function that wraps components with necessary providers
 */
type CustomRenderOptions = RenderOptions & {
  theme?: "light" | "dark" | "system"
  route?: string
  withTooltipProvider?: boolean
}

function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  // Extract provider-specific options
  const {
    theme = "light",
    route = "/",
    withTooltipProvider = false,
    ...renderOptions
  } = options || {}
  
  // Set route if specified
  if (route) {
    window.history.pushState({}, '', route)
  }

  // Mock document.documentElement methods to prevent script injection
  const originalAddClass = document.documentElement.classList.add;
  const originalRemoveClass = document.documentElement.classList.remove;
  
  // Replace with no-op implementations during tests
  document.documentElement.classList.add = jest.fn();
  document.documentElement.classList.remove = jest.fn();

  // Add providers as needed
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    let wrappedChildren = children
    
    // Apply tooltip provider if requested
    if (withTooltipProvider) {
      wrappedChildren = <TooltipProvider>{wrappedChildren}</TooltipProvider>
    }
    
    // Set theme directly on document to avoid script injection
    document.documentElement.setAttribute('data-theme', theme);
    
    // Always wrap with ThemeProvider
    return (
      <ThemeProvider attribute="class" defaultTheme={theme} disableScript={true}>
        {wrappedChildren}
      </ThemeProvider>
    )
  }

  const result = render(ui, { wrapper: AllProviders, ...renderOptions });
  
  // Restore original classList methods
  document.documentElement.classList.add = originalAddClass;
  document.documentElement.classList.remove = originalRemoveClass;
  
  return result;
}

/**
 * Helper function to test if a component has specific Tailwind classes
 */
function hasClasses(element: HTMLElement, ...classNames: ClassValue[]): boolean {
  const mergedClasses = cn(...classNames)
  const classesToCheck = mergedClasses.split(" ")
  
  return classesToCheck.every((className) => 
    element.classList.contains(className)
  )
}

/**
 * Helper function to test if a component has any of the specified Tailwind classes
 */
function hasAnyClass(element: HTMLElement, ...classNames: ClassValue[]): boolean {
  const mergedClasses = cn(...classNames)
  const classesToCheck = mergedClasses.split(" ")
  
  return classesToCheck.some((className) => 
    element.classList.contains(className)
  )
}

/**
 * Helper function to compare rendered classes with expected classes
 */
function compareClasses(receivedClasses: string, expectedClasses: ClassValue[]): boolean {
  const expected = cn(...expectedClasses)
  return twMerge(receivedClasses) === twMerge(expected)
}

/**
 * Helper function to check if an element has a data attribute with a specific value
 */
function hasDataAttribute(element: HTMLElement, attribute: string, value?: string): boolean {
  const dataAttr = `data-${attribute}`
  const hasAttr = element.hasAttribute(dataAttr)
  
  if (!hasAttr) return false
  if (value === undefined) return true
  
  return element.getAttribute(dataAttr) === value
}

/**
 * Mock for OTPInputContext from the input-otp library
 */
interface MockOTPSlot {
  char: string
  hasFakeCaret: boolean
  isActive: boolean
}

interface MockOTPContextValue {
  slots: MockOTPSlot[]
  // Add other context properties as needed
}

function createMockOTPContext(
  slotValues: Array<Partial<MockOTPSlot>> = []
): MockOTPContextValue {
  // Create default slots with empty values
  const defaultSlots: MockOTPSlot[] = Array(slotValues.length || 4).fill({
    char: "",
    hasFakeCaret: false,
    isActive: false,
  })

  // Merge provided values with defaults
  const slots = defaultSlots.map((defaultSlot, index) => ({
    ...defaultSlot,
    ...(slotValues[index] || {}),
  }))

  return {
    slots,
    // Add other context properties as needed
  }
}

function renderWithOTPContext(
  ui: React.ReactElement,
  contextValue: MockOTPContextValue,
  options?: CustomRenderOptions
): RenderResult {
  return customRender(
    <OTPInputContext.Provider value={contextValue as any}>
      {ui}
    </OTPInputContext.Provider>,
    options
  )
}

/**
 * React Hook Form test utilities
 */
interface FormOptions<T extends z.ZodType> {
  defaultValues?: z.infer<T>
  resolver?: any
  schema?: T
}

function renderWithForm<T extends z.ZodType>(
  ui: React.ReactElement,
  options?: FormOptions<T> & CustomRenderOptions
): RenderResult {
  const {
    defaultValues = {},
    schema,
    resolver,
    ...renderOptions
  } = options || {}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const formResolver = schema ? zodResolver(schema) : resolver
    const methods = useForm({
      defaultValues,
      resolver: formResolver,
    })

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  return customRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  })
}

/**
 * Helper for testing Radix UI components with state changes
 */
interface RadixComponentTester {
  open: () => Promise<void>
  close: () => Promise<void>
  isOpen: () => boolean
  getContent: () => HTMLElement
  getTrigger: () => HTMLElement
}

function createRadixTester(
  result: RenderResult,
  triggerSelector: string,
  contentSelector: string,
  openState: string = "open",
  closedState: string = "closed"
): RadixComponentTester {
  const getTrigger = () => {
    return result.container.querySelector(triggerSelector) as HTMLElement
  }
  
  const getContent = () => {
    return result.container.querySelector(contentSelector) as HTMLElement
  }
  
  const isOpen = () => {
    const content = getContent()
    if (!content) return false
    return hasDataAttribute(content, "state", openState)
  }
  
  const open = async () => {
    const trigger = getTrigger()
    if (!trigger) throw new Error(`Trigger element not found: ${triggerSelector}`)
    userEvent.click(trigger)
    await waitFor(() => {
      const content = getContent()
      if (!content) throw new Error(`Content element not found: ${contentSelector}`)
      if (!hasDataAttribute(content, "state", openState)) 
        throw new Error(`Content did not open`)
    })
  }
  
  const close = async () => {
    const trigger = getTrigger()
    if (!trigger) throw new Error(`Trigger element not found: ${triggerSelector}`)
    userEvent.click(trigger)
    await waitFor(() => {
      const content = getContent()
      if (!content) return
      if (hasDataAttribute(content, "state", openState))
        throw new Error(`Content did not close`)
    })
  }
  
  return {
    open,
    close,
    isOpen,
    getContent,
    getTrigger
  }
}

/**
 * Mock functions for common browser operations
 */
const mockWindowResize = (width: number, height: number): void => {
  const originalWidth = window.innerWidth
  const originalHeight = window.innerHeight
  
  window.innerWidth = width
  window.innerHeight = height
  window.dispatchEvent(new Event('resize'))
  
  // Return a cleanup function
  return () => {
    window.innerWidth = originalWidth
    window.innerHeight = originalHeight
    window.dispatchEvent(new Event('resize'))
  }
}

/**
 * Mock navigation functions
 */
const mockNavigation = {
  push: (path: string): void => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  },
  replace: (path: string): void => {
    window.history.replaceState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  },
  back: (): void => {
    window.history.back()
  },
  forward: (): void => {
    window.history.forward()
  },
  // Get current pathname for testing
  getCurrentPath: (): string => {
    return window.location.pathname
  }
}

/**
 * Helper for testing event handlers
 */
interface SetupUserEventOptions {
  advanceTimers?: boolean
  skipHover?: boolean
}

const setupUserEvent = (options?: SetupUserEventOptions) => {
  return userEvent.setup({
    advanceTimers: options?.advanceTimers ?? true,
    skipHover: options?.skipHover ?? false
  })
}

/**
 * Enhanced Testing Library queries for finding elements
 */
const customQueries = {
  ...queries,
  /**
   * Find element with class
   */
  getByClass: (container: HTMLElement, className: string): HTMLElement => {
    const elements = container.getElementsByClassName(className)
    if (elements.length === 0) {
      throw new Error(`No element found with class: ${className}`)
    }
    return elements[0] as HTMLElement
  },
  queryByClass: (container: HTMLElement, className: string): HTMLElement | null => {
    const elements = container.getElementsByClassName(className)
    return elements.length > 0 ? (elements[0] as HTMLElement) : null
  },
  getAllByClass: (container: HTMLElement, className: string): HTMLElement[] => {
    const elements = container.getElementsByClassName(className)
    if (elements.length === 0) {
      throw new Error(`No elements found with class: ${className}`)
    }
    return Array.from(elements) as HTMLElement[]
  },
  queryAllByClass: (container: HTMLElement, className: string): HTMLElement[] => {
    const elements = container.getElementsByClassName(className)
    return Array.from(elements) as HTMLElement[]
  },
  /**
   * Find element with data attribute
   */
  getByDataAttr: (container: HTMLElement, attr: string, value?: string): HTMLElement => {
    const selector = value ? `[data-${attr}="${value}"]` : `[data-${attr}]`
    const element = container.querySelector(selector)
    if (!element) {
      throw new Error(`No element found with data attribute: ${attr}${value ? `="${value}"` : ''}`)
    }
    return element as HTMLElement
  },
  queryByDataAttr: (container: HTMLElement, attr: string, value?: string): HTMLElement | null => {
    const selector = value ? `[data-${attr}="${value}"]` : `[data-${attr}]`
    const element = container.querySelector(selector)
    return element as HTMLElement | null
  },
  getAllByDataAttr: (container: HTMLElement, attr: string, value?: string): HTMLElement[] => {
    const selector = value ? `[data-${attr}="${value}"]` : `[data-${attr}]`
    const elements = container.querySelectorAll(selector)
    if (elements.length === 0) {
      throw new Error(`No elements found with data attribute: ${attr}${value ? `="${value}"` : ''}`)
    }
    return Array.from(elements) as HTMLElement[]
  },
  queryAllByDataAttr: (container: HTMLElement, attr: string, value?: string): HTMLElement[] => {
    const selector = value ? `[data-${attr}="${value}"]` : `[data-${attr}]`
    const elements = container.querySelectorAll(selector)
    return Array.from(elements) as HTMLElement[]
  }
}

// Export everything
export {
  customRender as render,
  hasClasses,
  hasAnyClass,
  compareClasses,
  hasDataAttribute,
  createMockOTPContext,
  renderWithOTPContext,
  renderWithForm,
  createRadixTester,
  mockWindowResize,
  mockNavigation,
  setupUserEvent,
  customQueries,
  screen,
  within,
  waitFor
} 