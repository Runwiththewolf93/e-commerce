export default function FormSkeletonLoader() {
  return (
    <div className="max-w-xl mx-auto mt-6 animate-pulse">
      <h3 className="mb-3 h-4 bg-gray-300 rounded"></h3>
      <div className="grid md:grid-cols-2 md:gap-6">
        {/* Name and Surname */}
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 md:gap-6">
        {/* Street, Street Number, Phone Number */}
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 md:gap-6">
        {/* City, Municipality, Zip */}
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="block h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="block h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="w-full sm:w-auto h-8 bg-gray-200 rounded mt-4"></div>
    </div>
  );
}
