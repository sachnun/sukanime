export default function AnimeCardSkeleton() {
  return (
    <div className="block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden skeleton" />
      <div className="mt-2 h-4 w-3/4 rounded skeleton" />
      <div className="mt-1 h-3 w-1/2 rounded skeleton" />
    </div>
  );
}

export function AnimeRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <section className="py-4">
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="h-7 w-40 rounded skeleton" />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-3 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
              <AnimeCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative h-[70vh] sm:h-[80vh] w-full skeleton">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl space-y-4">
            <div className="h-6 w-20 rounded skeleton" />
            <div className="h-12 w-full rounded skeleton" />
            <div className="h-12 w-3/4 rounded skeleton" />
            <div className="flex space-x-4">
              <div className="h-12 w-32 rounded skeleton" />
              <div className="h-12 w-32 rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}
