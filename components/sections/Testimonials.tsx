import Image from "next/image"

export function Testimonials() {
  return (
    <section className="py-20 bg-black">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">TESTIMONIALS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-800 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/placeholder.svg?height=200&width=200" alt="Client" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">Client Name</h3>
                  <p className="text-sm text-gray-400">Position, Company</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                &ldquo;Sandro has an incredible eye for capturing the perfect moment. His work for our campaign exceeded all
                expectations and delivered exactly what our brand needed.&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 