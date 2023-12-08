export default function ConfirmationItemsSkeleton() {
  return (
    <div className="w-full lg:w-8/12 animate-pulse">
      <div className="px-10">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="relative flex flex-wrap items-center pb-8 mb-8 -mx-4 border-b border-gray-200 dark:border-gray-700 xl:justify-between border-opacity-40"
          >
            <div className="w-full mb-2 lg:mb-0 h-96 md:h-44 md:w-44 bg-gray-300 rounded"></div>
            <div className="w-full px-4 mb-6 md:w-auto xl:mb-0">
              <div className="block mb-5 h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="flex flex-wrap">
                <div className="mr-4 w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="w-full px-4 mt-6 mb-6 xl:w-auto xl:mb-0 xl:mt-0">
              <div className="flex items-center">
                <div className="w-12 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="w-full px-4 xl:w-auto">
              <div className="text-xl font-medium h-6 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
