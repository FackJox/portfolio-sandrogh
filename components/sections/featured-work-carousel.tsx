"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/form/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from "@/components/ui/media/carousel";

// Sample featured work data
const featuredWorks = [
  {
    id: 1,
    title: "Red Bull Cliff Diving Series",
    description: "An exclusive behind-the-scenes look at the world's most daring cliff divers as they push the boundaries of their sport.",
    image: "/placeholder.svg?height=800&width=1200",
    tags: ["Sports", "Extreme", "Editorial"],
  },
  {
    id: 2,
    title: "Olympic Sprinters Documentary",
    description: "A powerful documentary following elite sprinters from around the world as they prepare for the Olympic Games.",
    image: "/placeholder.svg?height=800&width=1200",
    tags: ["Documentary", "Olympics", "Athletics"],
  },
  {
    id: 3,
    title: "Mountain Biking Challenge",
    description: "An immersive photo series documenting extreme mountain bikers tackling some of the world's most challenging terrain.",
    image: "/placeholder.svg?height=800&width=1200",
    tags: ["Extreme", "Biking", "Nature"],
  },
];

export function FeaturedWorkCarousel() {
  return (
    <section className="py-20 bg-black">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">FEATURED WORK</h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredWorks.map((work) => (
              <CarouselItem key={work.id} className="md:basis-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold">{work.title}</h3>
                    <p className="text-gray-300">
                      {work.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm">{tag}</span>
                      ))}
                    </div>
                    <Button asChild className="rounded-full">
                      <Link href="#">View Project</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}