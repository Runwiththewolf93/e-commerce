export default function ConfirmationTotalsSkeleton() {
  return (
    <div className="w-full lg:w-4/12 animate-pulse">
      <div className="px-6 mb-14">
        <div>
          <h2 className="mb-6 text-3xl font-bold dark:text-gray-400">
            <div className="h-8 bg-gray-300 rounded"></div>
          </h2>
          <div className="flex items-center justify-between px-10 py-4 mb-3 font-medium leading-8 bg-gray-100 bg-opacity-50 border dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="h-6 bg-gray-300 rounded w-14"></div>
            </div>
          </div>
          <div className="flex items-center justify-between px-10 py-4 mb-3 font-medium leading-8 bg-gray-100 bg-opacity-50 border dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="h-6 bg-gray-300 rounded w-14"></div>
            </div>
          </div>
          <div className="flex items-center justify-between px-10 py-4 mb-6 font-medium leading-8 bg-gray-100 border dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="h-6 bg-gray-300 rounded w-14 text-blue-500 dark:text-blue-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
