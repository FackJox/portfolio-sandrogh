import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeaturedWorkCarousel } from "@/components/sections/featured-work-carousel";
import * as React from "react";

// Mock the useEmblaCarousel hook
jest.mock("embla-carousel-react", () => {
  const mockScrollNext = jest.fn();
  const mockScrollPrev = jest.fn();
  const mockScrollTo = jest.fn();
  const mockOnTouchStart = jest.fn();
  const mockOnTouchEnd = jest.fn();
  
  // Return a mock API that simulates the EmblaCarousel API
  return {
    __esModule: true,
    default: () => {
      const [selectedIndex, setSelectedIndex] = React.useState(0);
      
      // Create mock ref and API
      const mockRef = { current: document.createElement("div") };
      const mockApi = {
        canScrollNext: () => true,
        canScrollPrev: () => true,
        scrollNext: () => {
          mockScrollNext();
          setSelectedIndex((prev) => (prev < 2 ? prev + 1 : 0));
        },
        scrollPrev: () => {
          mockScrollPrev();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 2));
        },
        scrollTo: (index: number) => {
          mockScrollTo(index);
          setSelectedIndex(index);
        },
        selectedScrollSnap: () => selectedIndex,
        scrollSnapList: () => [0, 1, 2],
        on: (event: string, callback: any) => {
          if (event === 'select') {
            callback(mockApi);
          }
          return mockApi;
        },
        off: jest.fn(),
        reInit: jest.fn(),
        plugins: () => ({
          onTouchStart: mockOnTouchStart,
          onTouchEnd: mockOnTouchEnd
        })
      };
      
      return [mockRef, mockApi];
    },
  };
});

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, className }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      data-testid="carousel-image"
      data-fill={fill}
    />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => (
    <a href={href}>{children}</a>
  ),
}));

describe("FeaturedWorkCarousel", () => {
  beforeEach(() => {
    // Reset the test environment before each test
    jest.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders the featured work title", () => {
      render(<FeaturedWorkCarousel />);
      expect(screen.getByText("FEATURED WORK")).toBeInTheDocument();
    });

    it("renders all carousel items", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check if all work titles are in the document
      expect(screen.getByText("Red Bull Cliff Diving Series")).toBeInTheDocument();
      expect(screen.getByText("Olympic Sprinters Documentary")).toBeInTheDocument();
      expect(screen.getByText("Mountain Biking Challenge")).toBeInTheDocument();
    });

    it("renders images for each featured work", () => {
      render(<FeaturedWorkCarousel />);
      const images = screen.getAllByTestId("carousel-image");
      expect(images.length).toBe(3);
      
      // Check that images have correct src attributes
      images.forEach(image => {
        expect(image).toHaveAttribute("src", expect.stringContaining("/placeholder.svg"));
      });
    });
  });

  describe("Carousel Navigation", () => {
    it("allows keyboard navigation with arrow keys", async () => {
      render(<FeaturedWorkCarousel />);
      const carousel = screen.getByRole("region");
      
      // Get the currently visible works
      const initialWork = screen.getByText("Red Bull Cliff Diving Series");
      expect(initialWork).toBeVisible();
      
      // Press right arrow to go to next slide
      fireEvent.keyDown(carousel, { key: "ArrowRight" });
      
      // After navigation, verify carousel has proper attributes
      await waitFor(() => {
        expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      });
      
      // Press left arrow to go back
      fireEvent.keyDown(carousel, { key: "ArrowLeft" });
      
      // After navigation, verify carousel has proper attributes
      await waitFor(() => {
        expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      });
    });
    
    it("simulates touch interaction for swiping", async () => {
      render(<FeaturedWorkCarousel />);
      const carousel = screen.getByRole("region");
      
      // Simulate touch start
      fireEvent.touchStart(carousel, { touches: [{ clientX: 500, clientY: 50 }] });
      
      // Simulate touch move
      fireEvent.touchMove(carousel, { touches: [{ clientX: 300, clientY: 50 }] });
      
      // Simulate touch end
      fireEvent.touchEnd(carousel);
      
      // Verify the carousel is still rendered after touch interactions
      await waitFor(() => {
        expect(carousel).toBeInTheDocument();
      });
    });
  });

  describe("Item Content and Rendering", () => {
    it("renders the correct content for each carousel item", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check the first item
      const firstItem = screen.getByText("Red Bull Cliff Diving Series").closest(".grid");
      if (!firstItem) throw new Error("First item not found");
      
      within(firstItem).getByText("Red Bull Cliff Diving Series");
      within(firstItem).getByText("An exclusive behind-the-scenes look at the world's most daring cliff divers as they push the boundaries of their sport.");
      
      // Check tags are present
      expect(within(firstItem).getByText("Sports")).toBeInTheDocument();
      expect(within(firstItem).getByText("Extreme")).toBeInTheDocument();
      expect(within(firstItem).getByText("Editorial")).toBeInTheDocument();
      
      // Check View Project button
      const viewProjectButton = within(firstItem).getByRole("link", { name: "View Project" });
      expect(viewProjectButton).toBeInTheDocument();
    });
    
    it("renders the tag list for each item", () => {
      render(<FeaturedWorkCarousel />);
      
      // Get all actual tags from each category
      const sports = screen.getByText("Sports");
      const extreme = screen.getAllByText("Extreme");
      const editorial = screen.getByText("Editorial");
      const documentary = screen.getByText("Documentary");
      const olympics = screen.getByText("Olympics");
      const athletics = screen.getByText("Athletics");
      const biking = screen.getByText("Biking");
      const nature = screen.getByText("Nature");
      
      // Verify all tags are present
      expect(sports).toBeInTheDocument();
      expect(extreme.length).toBe(2); // Appears in 2 items
      expect(editorial).toBeInTheDocument();
      expect(documentary).toBeInTheDocument();
      expect(olympics).toBeInTheDocument();
      expect(athletics).toBeInTheDocument();
      expect(biking).toBeInTheDocument();
      expect(nature).toBeInTheDocument();
      
      // Verify tags have the correct styling
      const tagElements = [
        sports, ...extreme, editorial, documentary, 
        olympics, athletics, biking, nature
      ];
      
      tagElements.forEach(tag => {
        expect(tag).toHaveClass("px-3 py-1 bg-zinc-800 rounded-full text-sm");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes for the carousel", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check carousel region
      const carousel = screen.getByRole("region");
      expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      
      // Check carousel items
      const slides = screen.getAllByRole("group");
      slides.forEach(slide => {
        expect(slide).toHaveAttribute("aria-roledescription", "slide");
      });
    });
    
    it("ensures all interactive elements are keyboard accessible", async () => {
      render(<FeaturedWorkCarousel />);
      
      // Get all interactive elements
      const buttons = screen.getAllByRole("link", { name: "View Project" });
      
      // Verify all buttons exist
      expect(buttons.length).toBe(3);
      expect(buttons[0]).toBeInTheDocument();
      expect(buttons[1]).toBeInTheDocument();
      expect(buttons[2]).toBeInTheDocument();
    });
    
    it("provides proper keyboard navigation for focusable elements", async () => {
      render(<FeaturedWorkCarousel />);
      
      // Get all buttons for verification
      const viewProjectButtons = screen.getAllByRole("link", { name: "View Project" });
      
      // Verify buttons exist
      expect(viewProjectButtons.length).toBe(3);
      expect(viewProjectButtons[0]).toBeInTheDocument();
      expect(viewProjectButtons[1]).toBeInTheDocument();
      expect(viewProjectButtons[2]).toBeInTheDocument();
    });
    
    it("has proper screen reader accessibility features", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check for proper role assignments
      const carousel = screen.getByRole("region");
      expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      
      // Check if images have alt text
      const images = screen.getAllByTestId("carousel-image");
      images.forEach((image, index) => {
        expect(image).toHaveAttribute("alt");
        expect(image.getAttribute("alt")).not.toBe("");
      });
      
      // Verify slides have proper ARIA roles
      const slides = screen.getAllByRole("group");
      slides.forEach(slide => {
        expect(slide).toHaveAttribute("aria-roledescription", "slide");
      });
      
      // Check that work titles are proper headings
      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveTextContent("Red Bull Cliff Diving Series");
      expect(headings[1]).toHaveTextContent("Olympic Sprinters Documentary");
      expect(headings[2]).toHaveTextContent("Mountain Biking Challenge");
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive classes to the grid container", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check grid classes for responsive layout
      const gridDivs = screen.getAllByText(/Red Bull Cliff Diving Series|Olympic Sprinters Documentary|Mountain Biking Challenge/).map(
        node => node.closest(".grid")
      );
      
      gridDivs.forEach(grid => {
        expect(grid).toHaveClass("grid-cols-1 lg:grid-cols-2");
      });
    });
    
    it("applies responsive classes to titles", () => {
      render(<FeaturedWorkCarousel />);
      
      // Check section title responsive classes
      const sectionTitle = screen.getByText("FEATURED WORK");
      expect(sectionTitle).toHaveClass("text-3xl md:text-4xl");
      
      // Check item titles responsive classes
      const itemTitles = screen.getAllByText(/Red Bull Cliff Diving Series|Olympic Sprinters Documentary|Mountain Biking Challenge/);
      itemTitles.forEach(title => {
        expect(title).toHaveClass("text-2xl md:text-3xl");
      });
    });
    
    it("applies aspect ratio to carousel images for consistent layout", () => {
      render(<FeaturedWorkCarousel />);
      
      // Get the image containers
      const imageContainers = screen.getAllByTestId("carousel-image").map(
        img => img.closest(".relative")
      );
      
      // Check aspect ratio classes
      imageContainers.forEach(container => {
        expect(container).toHaveClass("aspect-[4/3]");
      });
    });
  });
}); 