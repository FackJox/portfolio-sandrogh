import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/form/button"

export function MediaCategories() {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">WORK</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stills Category */}
          <div className="group relative overflow-hidden rounded-lg aspect-video">
            <Image
              src="/placeholder.svg?height=800&width=1200"
              alt="Photography stills"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-3xl font-bold mb-4">STILLS</h3>
                <p className="text-gray-200 mb-6">Capturing the decisive moment in sports and action photography</p>
                <Button asChild className="rounded-full">
                  <Link href="/portfolio?filter=stills">View Photography</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Motion Category */}
          <div className="group relative overflow-hidden rounded-lg aspect-video">
            <Image
              src="/placeholder.svg?height=800&width=1200"
              alt="Videography motion"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-3xl font-bold mb-4">MOTION</h3>
                <p className="text-gray-200 mb-6">Dynamic videography that brings action sports to life</p>
                <Button asChild className="rounded-full">
                  <Link href="/portfolio?filter=motion">View Videography</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 