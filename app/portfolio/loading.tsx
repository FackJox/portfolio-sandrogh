import { Skeleton } from "@/components/ui/feedback/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container px-4">
        <Skeleton className="h-12 w-48 mx-auto mb-6 bg-zinc-800" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-12 bg-zinc-800" />

        <div className="flex justify-center mb-16 space-x-4">
          <Skeleton className="h-10 w-20 rounded-full bg-zinc-800" />
          <Skeleton className="h-10 w-20 rounded-full bg-zinc-800" />
          <Skeleton className="h-10 w-20 rounded-full bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg bg-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  )
}

