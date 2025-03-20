import { Button } from "@/components/ui/form/button"
import { Mail, Instagram, Twitter } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-zinc-900">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">LET&apos;S CONNECT</h2>
          <p className="text-gray-300 mb-8">
            Have a project in mind or want to discuss a potential collaboration? I&apos;m always open to new and exciting
            opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-800 p-8 rounded-lg text-center">
              <Mail className="mx-auto mb-4 h-8 w-8" />
              <h3 className="font-bold mb-2">Email Me</h3>
              <p className="text-gray-300">hello@sandrogh.com</p>
            </div>
            <div className="bg-zinc-800 p-8 rounded-lg text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <Instagram className="h-8 w-8" />
                <Twitter className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Follow Me</h3>
              <p className="text-gray-300">@sandro.gh</p>
            </div>
          </div>

          <Button className="rounded-full text-lg px-8 py-6" size="lg">
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  )
} 