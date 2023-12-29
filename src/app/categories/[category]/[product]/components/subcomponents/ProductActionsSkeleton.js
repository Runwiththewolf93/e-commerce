const ProductActionsSkeleton = () => {
  return (
    <div className="flex flex-col mt-5 animate-pulse">
      {/* Skeleton for Product Cart */}
      <div className="mb-5">
        <div className="flex items-center justify-evenly">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-gray-400 rounded w-full mt-3"></div>
      </div>

      {/* Skeleton for Product Wishlist */}
      <div className="flex flex-col">
        <div className="h-10 bg-gray-400 rounded w-full mt-3"></div>
      </div>
    </div>
  );
};

export default ProductActionsSkeleton;
