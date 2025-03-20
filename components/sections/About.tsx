import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-20 bg-zinc-900">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=800"
              alt="Photographer portrait"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">ABOUT ME</h2>
            <p className="text-gray-300">
              Over the past decade I&apos;ve documented some of the biggest stories from the world of high altitude mountaineering. I stood on the highest peak in Afghanistan, Mt Noshaq as the first Afghan woman summited and the highest peak in Pakistan, K2 as the first Pakistani woman summited. I filmed Nirmal Purja as he set a blazing speed record on the 14 8,000ers and filmed Kristin Harila as she smashed it
            </p>
            <p className="text-gray-300">
              I filmed army expeds to Dhaulagiri in 2016 and Everest in 2017, began building a basecamp network and haven&apos;t really stopped carrying cameras up mountains since.
            </p>
            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4">CLIENTS</h3>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-zinc-800 h-16 rounded flex items-center justify-center">
                    <span className="text-sm text-gray-400">Client Logo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 