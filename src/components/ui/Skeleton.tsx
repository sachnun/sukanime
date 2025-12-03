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

export function AnimeDetailSkeleton() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[70vh]">
        <div className="absolute inset-0 skeleton" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-48 md:w-64 aspect-[2/3] rounded-lg skeleton" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="h-10 w-3/4 mx-auto md:mx-0 rounded skeleton mb-2" />
              <div className="h-5 w-1/2 mx-auto md:mx-0 rounded skeleton mb-4" />

              {/* Meta */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="h-6 w-16 rounded skeleton" />
                <div className="h-6 w-20 rounded skeleton" />
                <div className="h-6 w-24 rounded skeleton" />
                <div className="h-6 w-20 rounded skeleton" />
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-7 w-20 rounded-full skeleton" />
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="h-12 w-32 rounded skeleton" />
                <div className="h-12 w-12 rounded skeleton" />
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 w-40 rounded skeleton" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis & Episodes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="h-8 w-32 rounded skeleton mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-3/4 rounded skeleton" />
          </div>
        </div>

        <div>
          <div className="h-8 w-48 rounded skeleton mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg skeleton" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
