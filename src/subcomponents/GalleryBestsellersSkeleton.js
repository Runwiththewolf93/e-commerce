export default function GalleryBestSellersSkeleton() {
  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Our Bestsellers</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="relative w-64 animate-pulse" key={index}>
            <div className="card card-compact w-64 bg-base-100 shadow-xl">
              <figure className="relative h-32 w-full">
                <div className="absolute inset-0 bg-gray-300"></div>
              </figure>
              <div className="card-body">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="text-sm mt-2">
                  <div className="h-2 bg-gray-300 rounded w-1/4 mb-1"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
