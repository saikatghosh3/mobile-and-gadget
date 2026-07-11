export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-neutral-200 h-16 animate-pulse" />

      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-100 rounded-3xl h-80 sm:h-96 animate-pulse" />
      </div>

      {/* Categories skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl animate-pulse" />
              <div className="w-14 h-3 bg-neutral-100 rounded mt-2 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="w-48 h-7 bg-neutral-100 rounded animate-pulse" />
            <div className="w-64 h-4 bg-neutral-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="w-20 h-4 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-neutral-100" />
              <div className="p-4 space-y-3">
                <div className="w-3/4 h-4 bg-neutral-100 rounded" />
                <div className="w-1/2 h-3 bg-neutral-100 rounded" />
                <div className="w-1/3 h-5 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="bg-neutral-900 h-64 mt-16 animate-pulse" />
    </div>
  );
}
