import Link from "next/link"
import { Button } from "@/components/ui/form/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/overlay/sheet"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          SANDRO GH
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/portfolio" className="text-sm hover:text-primary transition-colors">
            PORTFOLIO
          </Link>
          <Link href="#about" className="text-sm hover:text-primary transition-colors">
            ABOUT
          </Link>
          <Link href="#contact" className="text-sm hover:text-primary transition-colors">
            FOLLOW
          </Link>
          <Button variant="outline" className="rounded-full">
            CONNECT
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
              <Link href="#about" className="text-lg hover:text-primary transition-colors">
                ABOUT
              </Link>
              <Link href="#contact" className="text-lg hover:text-primary transition-colors">
                FOLLOW
              </Link>
              <Button variant="outline" className="rounded-full w-full">
                CONNECT
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 