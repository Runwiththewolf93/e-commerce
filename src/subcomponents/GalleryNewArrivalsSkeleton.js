export default function GalleryNewArrivalsSkeleton() {
  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">New Arrivals</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="relative w-64 animate-pulse" key={index}>
            <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700">
              <figure className="relative h-40 w-full">
                <div className="absolute inset-0 bg-gray-300 rounded-t-2xl"></div>
              </figure>
              <div className="p-5">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-2 bg-gray-300 rounded w-1/4 mb-2"></div>{" "}
                {/* For stock */}
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
