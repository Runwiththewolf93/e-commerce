const SkeletonCard = () => {
  return (
    <div className="p-3">
      <div className="flex flex-wrap justify-start -mx-2">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="p-2 w-1/2 md:w-1/3 lg:w-1/4 animate-pulse"
          >
            <div className="max-w-sm rounded-md border border-gray-300 shadow">
              <div className="h-64 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 mb-2"></div>
                <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
