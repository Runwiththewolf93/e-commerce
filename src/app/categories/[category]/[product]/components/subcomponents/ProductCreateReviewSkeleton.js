const ProductCreateReviewSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded shadow animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
      <div className="h-10 bg-gray-400 rounded w-1/4"></div>
    </div>
  );
};

export default ProductCreateReviewSkeleton;
