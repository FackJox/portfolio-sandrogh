import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Hero } from "./Hero"

// Mock next/image because it's not available in the test environment
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className, fill, priority }: any) => {
    return <img src={src} alt={alt} className={className} data-fill={fill} data-priority={priority} />
  },
}))

// Mock next/link to properly render children
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => {
    return <a href={href}>{children}</a>
  },
}))

// Mock useRouter for interaction testing
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe("Hero", () => {
  beforeEach(() => {
    render(<Hero />)
    // Reset mocks
    mockPush.mockReset()
  })

  it("renders the main headline text", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HIGH ALTITUDES HOSTILE ENVIRONMENTS")
  })

  it("renders the subheadline description text", () => {
    expect(screen.getByText("Award-winning action and sports photographer based in New York")).toBeInTheDocument()
  })

  it("renders the call-to-action buttons", () => {
    expect(screen.getByRole("link", { name: /STILLS/i })).toHaveAttribute("href", "/portfolio?filter=stills")
    expect(screen.getByRole("link", { name: /MOTION/i })).toHaveAttribute("href", "/portfolio?filter=motion")
  })

  it("renders the hero image with correct attributes", () => {
    const heroImage = screen.getByAltText("Action photography hero image")
    expect(heroImage).toBeInTheDocument()
    expect(heroImage).toHaveAttribute("src", "/placeholder.svg?height=1080&width=1920")
    expect(heroImage).toHaveAttribute("data-fill", "true")
    expect(heroImage).toHaveAttribute("data-priority", "true")
    expect(heroImage).toHaveClass("object-cover")
  })

  it("has a responsive layout structure", () => {
    // Test container and text responsiveness classes
    const section = document.querySelector("section")
    expect(section).toHaveClass("relative h-screen")
    
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveClass("text-4xl md:text-6xl lg:text-7xl")
    
    const description = screen.getByText("Award-winning action and sports photographer based in New York")
    expect(description).toHaveClass("text-lg md:text-xl")
    
    // Test button container responsive flex layout
    const buttonContainer = document.querySelector(".flex.flex-col.sm\\:flex-row")
    expect(buttonContainer).toHaveClass("flex flex-col sm:flex-row")
  })

  it("applies proper styling for the overlay", () => {
    // Test overlay styling
    const overlay = screen.getByRole("heading", { level: 1 }).parentElement?.parentElement
    expect(overlay).toHaveClass("absolute inset-0 bg-black/40 flex items-center justify-center")
  })

  it("meets accessibility requirements", () => {
    // Test image has alt text
    expect(screen.getByAltText("Action photography hero image")).toBeInTheDocument()
    
    // Test heading structure
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    
    // Test links have proper text
    const links = screen.getAllByRole("link")
    links.forEach(link => {
      expect(link).toHaveTextContent(/STILLS|MOTION/)
    })
    
    // Test semantic structure - section element for the hero
    const section = document.querySelector("section")
    expect(section).toBeInTheDocument()
  })
  
  // New tests for user interaction
  it("allows users to interact with the STILLS button", async () => {
    const user = userEvent.setup()
    const stillsButton = screen.getByRole("link", { name: /STILLS/i })
    
    await user.click(stillsButton)
    // Since we're using Next.js Link, we can verify the href attribute is correct
    expect(stillsButton).toHaveAttribute("href", "/portfolio?filter=stills")
  })
  
  it("allows users to interact with the MOTION button", async () => {
    const user = userEvent.setup()
    const motionButton = screen.getByRole("link", { name: /MOTION/i })
    
    await user.click(motionButton)
    // Since we're using Next.js Link, we can verify the href attribute is correct
    expect(motionButton).toHaveAttribute("href", "/portfolio?filter=motion")
  })
  
  it("maintains proper focus management for keyboard navigation", async () => {
    const user = userEvent.setup()
    const stillsButton = screen.getByRole("link", { name: /STILLS/i })
    const motionButton = screen.getByRole("link", { name: /MOTION/i })
    
    // First set focus on the first button
    stillsButton.focus()
    expect(document.activeElement).toBe(stillsButton)
    
    // Then tab to the next button
    await user.tab()
    expect(document.activeElement).toBe(motionButton)
  })
}) 