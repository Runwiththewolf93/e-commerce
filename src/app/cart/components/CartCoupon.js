export default function CartCoupon() {
  return (
    <div className="w-full px-4 mb-4 lg:w-1/2 ">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-gray-700 dark:text-gray-400">Apply Coupon</span>
        <input
          type="text"
          className="w-full px-8 py-4 font-normal placeholder-gray-400 border lg:flex-1 dark:border-gray-700 dark:placeholder-gray-500 dark:text-gray-400 dark:bg-gray-800"
          placeholder="x304k45"
          required
        />
        <button className="inline-block w-full px-8 py-4 font-bold text-center text-gray-100 bg-blue-500 rounded-md lg:w-32 hover:bg-blue-600">
          Apply
        </button>
      </div>
    </div>
  );
}
