export default function ProfileOverviewSkeleton({ inputFields }) {
  return (
    <div>
      {/* User Image & Info Skeleton */}
      <div className="flex items-center gap-8">
        <div className="bg-gray-300 animate-pulse max-h-36 w-36"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded animate-pulse mb-3 w-48"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse mb-3 w-48"></div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-3 mt-4">
        <div className="bg-gray-300 animate-pulse h-8 w-32 rounded-md"></div>
        <div className="bg-gray-300 animate-pulse h-8 w-32 rounded-md"></div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-4 w-96 mx-auto mt-3 bg-slate-200 p-6 rounded-lg">
        <div className="text-center">
          <div className="h-4 bg-gray-300 rounded animate-pulse w-40 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-64 mx-auto"></div>
        </div>
        {inputFields.map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
        <div className="bg-gray-300 animate-pulse h-8 w-full rounded-md mt-4"></div>
      </div>
    </div>
  );
}
