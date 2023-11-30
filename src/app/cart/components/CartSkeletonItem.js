export default function CartSkeletonItem() {
  return (
    <div className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8 animate-pulse">
      <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 mb-3 md:w-1/3">
            <div className="w-full h-24 bg-gray-300 md:h-24 md:w-24 rounded"></div>
          </div>
          <div className="w-2/3 px-4">
            <div className="mb-2 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      <div className="hidden px-4 lg:block lg:w-2/12">
        <div className="mb-1 h-6 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-auto px-4 md:w-1/6 lg:w-2/12 ">
        <div className="inline-flex items-center px-4 py-3 font-semibold text-gray-300 border border-gray-200 rounded-md dark:border-gray-700 ">
          <div className="h-4 bg-gray-300 rounded w-7"></div>
          <div className="mx-2 h-6 bg-gray-300 rounded w-14"></div>
          <div className="h-4 bg-gray-300 rounded w-7"></div>
        </div>
      </div>
      <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12 ">
        <div className="h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
