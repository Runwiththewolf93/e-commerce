import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "../../../redux/slices/cartSlice";
import { Alert } from "flowbite-react";

export default function CartCoupon({ cart, jwt }) {
  const dispatch = useDispatch();
  const { isLoadingApplyCoupon, errorApplyCoupon } = useSelector(
    state => state.cart
  );
  const [couponCode, setCouponCode] = useState("");

  const handleCouponCodeChange = e => {
    setCouponCode(e.target.value);
  };

  const handleApplyCoupon = e => {
    e.preventDefault();
    if (couponCode && cart?._id && jwt) {
      dispatch(applyCoupon({ code: couponCode, cartId: cart._id, jwt }));
    }
  };

  return (
    <div className="w-full px-4 mb-4 lg:w-1/2 ">
      <form
        onSubmit={handleApplyCoupon}
        className="flex flex-wrap items-center gap-4"
      >
        <span className="text-gray-700 dark:text-gray-400">Apply Coupon</span>
        <input
          type="text"
          className="w-full px-8 py-4 font-normal placeholder-gray-400 border lg:flex-1 dark:border-gray-700 dark:placeholder-gray-500 dark:text-gray-400 dark:bg-gray-800"
          placeholder="x304k45"
          value={couponCode}
          onChange={handleCouponCodeChange}
          required
        />
        <button
          type="submit"
          className="inline-block w-full px-8 py-4 font-bold text-center text-gray-100 bg-blue-500 rounded-md lg:w-32 hover:bg-blue-600"
          disabled={isLoadingApplyCoupon}
        >
          {isLoadingApplyCoupon ? "Applying..." : "Apply"}
        </button>
      </form>
      {errorApplyCoupon && (
        <Alert color="failure" className="mt-3">
          {errorApplyCoupon}
        </Alert>
      )}
    </div>
  );
}
