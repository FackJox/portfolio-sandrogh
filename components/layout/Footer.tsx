import Link from "next/link"
import { Instagram, Twitter, Mail } from "lucide-react"
import { CopyrightYear } from "@/components/ui/util/copyright-year"

export function Footer() {
  return (
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
              <span className="sr-only">Shutterstock</span>
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>

          <div className="text-sm text-gray-400">
            © <CopyrightYear /> Sandro Gromen-Hayes - High Altitude DoP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 