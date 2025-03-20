import Image from "next/image"
import { Instagram } from "lucide-react"

export function InstagramFeed() {
  return (
    <section className="py-12 bg-black">
      <div className="container px-4">
        <div className="flex items-center justify-center mb-8">
          <Instagram className="h-5 w-5 mr-2" />
          <h3 className="text-xl font-bold">INSTAGRAM</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative aspect-square">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 