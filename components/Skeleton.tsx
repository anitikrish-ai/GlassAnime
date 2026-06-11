export function CardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="aspect-[2/3] w-full shimmer" />
      <div className="space-y-2 px-3 py-2.5">
        <div className="h-3 w-3/4 rounded shimmer" />
        <div className="h-2.5 w-1/2 rounded shimmer" />
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="glass relative h-[60vh] min-h-[360px] w-full overflow-hidden rounded-3xl">
      <div className="absolute inset-0 shimmer" />
    </div>
  )
}
