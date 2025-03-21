"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/form/button"
import { Instagram, Twitter, Mail, Menu, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/overlay/sheet"
import { CopyrightYear } from "@/components/ui/util/copyright-year"

// Sample portfolio data
const portfolioItems = [
  {
    id: 1,
    title: "Mountain Biking Championship",
    category: "stills",
    image: "/placeholder.svg?height=800&width=600",
    description: "Extreme sports photography",
  },
  {
    id: 2,
    title: "Ocean Surfing Series",
    category: "stills",
    image: "/placeholder.svg?height=800&width=800",
    description: "Water sports photography",
  },
  {
    id: 3,
    title: "Urban Skateboarding",
    category: "stills",
    image: "/placeholder.svg?height=800&width=800",
    description: "Street sports photography",
  },
  {
    id: 4,
    title: "Red Bull Cliff Diving",
    category: "motion",
    image: "/placeholder.svg?height=800&width=600",
    description: "Extreme sports videography",
    duration: "3:24",
  },
  {
    id: 5,
    title: "Formula 1 Racing Highlights",
    category: "motion",
    image: "/placeholder.svg?height=800&width=800",
    description: "Motorsport videography",
    duration: "5:12",
  },
  {
    id: 6,
    title: "Snowboarding Documentary",
    category: "motion",
    image: "/placeholder.svg?height=800&width=800",
    description: "Winter sports videography",
    duration: "12:45",
  },
  {
    id: 7,
    title: "Rock Climbing Expedition",
    category: "stills",
    image: "/placeholder.svg?height=800&width=600",
    description: "Adventure photography",
  },
  {
    id: 8,
    title: "Marathon Finish Line",
    category: "stills",
    image: "/placeholder.svg?height=800&width=800",
    description: "Running event photography",
  },
  {
    id: 9,
    title: "Parkour in Paris",
    category: "motion",
    image: "/placeholder.svg?height=800&width=800",
    description: "Urban sports videography",
    duration: "4:18",
  },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredItems =
    activeFilter === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)
    
  const handleLoadMore = () => {
    console.log("Load more clicked")
    // Implementation would be added here
  }

  return (
    <div className="min-h-screen bg-black text-white" suppressHydrationWarning>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SANDRO GROMEN-HAYES
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/portfolio" className="text-sm hover:text-primary transition-colors">
              PORTFOLIO
            </Link>
            <Link href="/#about" className="text-sm hover:text-primary transition-colors">
              ABOUT
            </Link>
            <Link href="/#contact" className="text-sm hover:text-primary transition-colors">
              CONTACT
            </Link>
            <Button variant="outline" className="rounded-full">
              BOOK A SHOOT
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white">
              <nav className="flex flex-col space-y-6 pt-10">
                <Link href="/portfolio" className="text-lg hover:text-primary transition-colors">
                  PORTFOLIO
                </Link>
                <Link href="/#about" className="text-lg hover:text-primary transition-colors">
                  ABOUT
                </Link>
                <Link href="/#contact" className="text-lg hover:text-primary transition-colors">
                  CONTACT
                </Link>
                <Button variant="outline" className="rounded-full w-full">
                  BOOK A SHOOT
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Portfolio Header */}
      <section className="pt-32 pb-12 bg-black">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">PORTFOLIO</h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
            Explore my collection of action photography and videography, capturing the most intense moments in sports
            and adventure.
          </p>

          {/* Categories */}
          <div className="flex justify-center mb-16 space-x-4 overflow-x-auto pb-4">
            <Button
              variant={activeFilter === "all" ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "stills" ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => setActiveFilter("stills")}
            >
              Stills
            </Button>
            <Button
              variant={activeFilter === "motion" ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => setActiveFilter("motion")}
            >
              Motion
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 bg-black" aria-label="Portfolio gallery" role="region">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="portfolio-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]" data-testid="portfolio-item">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.category === "motion" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/30 rounded-full p-3">
                      <Play className="h-8 w-8 text-white" data-testid="play-icon" />
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-xs">
                      {item.duration}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" data-testid="item-overlay">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                    <div className="mt-4">
                      <Button size="sm" className="rounded-full">
                        View {item.category === "stills" ? "Photo" : "Video"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="rounded-full" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-zinc-800">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold tracking-tight">
              SANDRO GROMEN-HAYES
              </Link>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>

            <div className="text-sm text-gray-400">
              © <CopyrightYear /> Sandro Gromen-Hayes - Film & Photo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

