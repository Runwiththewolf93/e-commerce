// SkeletonCartItem.js
const SkeletonCartItem = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <li className="flex py-6 animate-pulse" key={index}>
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-300"></div>

          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-200">
                <h3 className="bg-gray-300 h-4 w-3/4 rounded"></h3>
                <p className="bg-gray-300 h-4 w-1/4 rounded ml-4"></p>
              </div>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm mt-2">
              <p className="bg-gray-300 h-4 w-1/6 rounded"></p>
              <div className="flex">
                <div className="bg-gray-300 h-4 w-16 rounded"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default SkeletonCartItem;
