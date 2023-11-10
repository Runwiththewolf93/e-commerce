import { Skeleton } from "../components/ProductComponents";

const BreadcrumbSkeleton = () => (
  <div className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-4 w-1/6" />
    <Skeleton className="h-4 w-1/8" />
  </div>
);

const ImageSkeleton = () => (
  <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
    <Skeleton className="h-64 lg:col-span-2" />
    <Skeleton className="h-64 lg:col-span-1" />
  </div>
);

const AggregateRatingSkeleton = () => (
  <div className="mt-5">
    <Skeleton className="h-6 w-1/4" />
  </div>
);

const ReviewSkeleton = () => (
  <div className="bg-white p-4 rounded shadow">
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-6 w-full mb-4" />
    <Skeleton className="h-6 w-5/6" />
  </div>
);

const ReviewListSkeleton = () => (
  <div className="space-y-4 col-span-2">
    <Skeleton className="h-20" />
    <Skeleton className="h-20" />
    <Skeleton className="h-20" />
  </div>
);

// Usage within the Product component
const ProductComponentSkeleton = () => {
  return (
    <div className="bg-white">
      <div className="pt-6">
        <BreadcrumbSkeleton />
        <ImageSkeleton />
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <Skeleton className="h-12 w-3/4 mb-6" />
          </div>
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <AggregateRatingSkeleton />
            <ReviewSkeleton />
            <Skeleton className="h-12 w-full mt-10" />
          </div>
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-12 lg:pr-8 lg:pt-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-16 mt-10" />
            <Skeleton className="h-36 mt-10" />
          </div>
          <ReviewListSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ProductComponentSkeleton;
