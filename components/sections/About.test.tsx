import { render, screen } from "@testing-library/react"
import { About } from "./About"

// Mock next/image because it's not available in the test environment
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className, fill }: any) => {
    return <img src={src} alt={alt} className={className} data-fill={fill} />
  },
}))

describe("About", () => {
  beforeEach(() => {
    render(<About />)
  })

  it("renders the section title", () => {
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("ABOUT ME")
  })

  it("renders the biography text paragraphs", () => {
    expect(screen.getByText(/Over the past decade I've documented some of the biggest stories/)).toBeInTheDocument()
    expect(screen.getByText(/I filmed army expeds to Dhaulagiri in 2016 and Everest in 2017/)).toBeInTheDocument()
  })

  it("renders the image with proper alt text and attributes", () => {
    const image = screen.getByAltText("Photographer portrait")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/placeholder.svg?height=800&width=800")
    expect(image).toHaveAttribute("data-fill", "true")
    expect(image).toHaveClass("object-cover")
  })

  it("renders the client section with title and logo grid", () => {
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("CLIENTS")
    
    // Check that we have 6 client logo placeholders
    const clientLogos = screen.getAllByText("Client Logo")
    expect(clientLogos).toHaveLength(6)
    
    // Verify the client logos are in a grid layout
    const gridContainer = clientLogos[0].closest(".grid")
    expect(gridContainer).toHaveClass("grid-cols-3")
  })

  it("has a responsive layout structure", () => {
    // Test section and container classes
    const section = document.querySelector("section")
    expect(section).toHaveClass("py-20 bg-zinc-900")
    expect(section).toHaveAttribute("id", "about")
    
    // Test grid layout responsiveness
    const grid = document.querySelector(".grid")
    expect(grid).toHaveClass("grid-cols-1 lg:grid-cols-2")
    
    // Test heading responsive classes
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveClass("text-3xl md:text-4xl")
  })

  it("meets accessibility requirements", () => {
    // Test image has alt text
    expect(screen.getByAltText("Photographer portrait")).toBeInTheDocument()
    
    // Test proper heading hierarchy
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument() // ABOUT ME
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument() // CLIENTS
    
    // Test section has proper id for navigation
    const section = document.querySelector("section")
    expect(section).toHaveAttribute("id", "about")
    
    // Test semantic structure - proper nesting of elements
    expect(document.querySelector("section")).toBeInTheDocument()
    expect(document.querySelector(".container")).toBeInTheDocument()
  })
}) 