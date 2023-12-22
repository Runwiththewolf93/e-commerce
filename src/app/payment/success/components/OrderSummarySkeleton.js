export default function OrderSummarySkeleton() {
  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="mt-10 space-y-4 md:space-y-6">
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="h-24 bg-gray-300 rounded flex-1"></div>
          <div className="h-24 bg-gray-300 rounded flex-1"></div>
        </div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
