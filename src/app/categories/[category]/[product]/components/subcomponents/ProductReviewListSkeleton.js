const ProductReviewListSkeleton = () => {
  return (
    <div className="space-y-4 col-span-2 mt-10 animate-pulse">
      {/* Header Placeholder */}
      <div className="flex justify-around items-center relative">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="flex-grow"></div>
        <div className="h-6 bg-gray-300 rounded w-1/6"></div>
        <div className="flex-grow"></div>
        <div className="h-6 bg-gray-300 rounded w-1/6"></div>
        <div className="flex-grow"></div>
      </div>

      {/* Review Placeholder */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="mt-2 h-4 bg-gray-300 rounded"></div>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewListSkeleton;
