export default function CategorySkeleton() {
  return (
    <>
      {Array.from({ length: 16 }, (_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image placeholder */}
          <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
          {/* Title placeholder */}
          <div className="mt-4 h-4 bg-gray-300 rounded w-3/4"></div>
          {/* Price placeholder */}
          <div className="mt-1 h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </>
  );
}
