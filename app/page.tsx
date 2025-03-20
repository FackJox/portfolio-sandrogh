import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { MediaCategories } from "@/components/sections/MediaCategories"
import { FeaturedWorkCarousel } from "@/components/sections/featured-work-carousel"
import { About } from "@/components/sections/About"
import { Testimonials } from "@/components/sections/Testimonials"
import { Contact } from "@/components/sections/Contact"
import { InstagramFeed } from "@/components/sections/InstagramFeed"
import { Footer } from "@/components/layout/Footer"

export default function PhotographerPortfolio() {
  return (
    <div className="min-h-screen bg-black text-white" suppressHydrationWarning>
      <Header />
      <Hero />
      <MediaCategories />
      <FeaturedWorkCarousel />
      <About />
      <Testimonials />
      <Contact />
      <InstagramFeed />
      <Footer />
    </div>
  )
}

