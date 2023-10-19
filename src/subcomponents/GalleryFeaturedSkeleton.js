export default function GalleryFeaturedSkeleton() {
  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Featured</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="relative w-64 animate-pulse" key={index}>
            <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700">
              <figure className="relative h-40 w-full">
                <div className="absolute inset-0 bg-gray-300 rounded-t-2xl"></div>
              </figure>
              <div className="px-5 pb-5">
                <div className="h-4 bg-gray-300 rounded w-3/4 mt-3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="flex items-center mt-2.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="h-4 w-4 bg-gray-300 rounded-full mr-1"
                      key={i}
                    ></div>
                  ))}
                  <div className="h-2 w-6 bg-blue-300 rounded ml-3"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-blue-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
