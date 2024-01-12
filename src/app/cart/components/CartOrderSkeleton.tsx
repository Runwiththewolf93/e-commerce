const CartOrderSkeleton = () => {
  return (
    <div className="w-full px-4 mb-4 lg:w-1/2 animate-pulse">
      <div className="p-6 border border-blue-100 dark:bg-gray-900 dark:border-gray-900 bg-gray-50 md:p-8">
        <div className="h-8 mb-8 bg-gray-300 rounded dark:bg-gray-700 w-3/4"></div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700">
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
        <div className="h-4 mb-4 bg-gray-300 rounded w-1/3 dark:bg-gray-700"></div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="h-16 bg-gray-300 rounded dark:bg-gray-700"></div>
          <div className="h-16 bg-gray-300 rounded dark:bg-gray-700"></div>
          <div className="h-16 bg-gray-300 rounded dark:bg-gray-700"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default CartOrderSkeleton;
