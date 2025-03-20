import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/form/button"

export function Hero() {
  return (
    <section className="relative h-screen">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Action photography hero image"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="container text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            HIGH ALTITUDES <br /> HOSTILE ENVIRONMENTS
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200">
            Award-winning action and sports photographer based in New York
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="rounded-full text-lg px-8 py-6" size="lg">
              <Link href="/portfolio?filter=stills">STILLS</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full text-lg px-8 py-6" size="lg">
              <Link href="/portfolio?filter=motion">MOTION</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 