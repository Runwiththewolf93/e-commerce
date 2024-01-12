import { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reactReduxHooks";
import { applyCoupon, excludeCoupon } from "../../../redux/slices/cartSlice";
import { Alert } from "flowbite-react";
import { CartType } from "../../../redux/types/cartSliceTypes";

interface CartCouponProps {
  cart: CartType;
  jwt: string;
}

/**
 * Renders a component for applying and excluding coupons in the cart.
 *
 * @param {Object} cart - The cart object.
 * @param {string} jwt - The JSON Web Token.
 * @return {JSX.Element} The rendered component.
 */
export default function CartCoupon({ cart, jwt }: CartCouponProps) {
  const dispatch = useAppDispatch();
  const {
    isLoadingApplyCoupon,
    errorApplyCoupon,
    isLoadingExcludeCoupon,
    errorExcludeCoupon,
  } = useAppSelector(state => state.cart);
  const [couponCode, setCouponCode] = useState("");

  const handleCouponCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCouponCode(event.target.value);
  };

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (couponCode && cart?._id && jwt) {
      dispatch(applyCoupon({ code: couponCode, cartId: cart._id, jwt }));
    }
    setCouponCode("");
  };

  const handleRemoveCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart?._id && jwt) {
      dispatch(excludeCoupon({ cartId: cart._id, jwt }));
    }
    setCouponCode("");
  };

  return (
    <div className="w-full px-4 mb-4 lg:w-1/2 ">
      {cart?.appliedCoupon ? (
        <form
          onSubmit={handleRemoveCoupon}
          className="flex flex-wrap items-center gap-4"
        >
          <span className="text-gray-700 dark:text-gray-400">
            Exclude Coupon
          </span>
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
            disabled={isLoadingExcludeCoupon}
          >
            {isLoadingExcludeCoupon ? "Excluding..." : "Exclude"}
          </button>
        </form>
      ) : (
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
      )}
      {errorApplyCoupon ||
        (errorExcludeCoupon && (
          <Alert color="failure" className="mt-3">
            {errorApplyCoupon || errorExcludeCoupon}
          </Alert>
        ))}
    </div>
  );
}
