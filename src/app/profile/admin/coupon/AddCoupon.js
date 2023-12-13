/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "flowbite-react";
import {
  addCoupon,
  clearCartMessage,
  clearCouponError,
} from "../../../../redux/slices/cartSlice";

export default function AddCoupon({ token }) {
  const dispatch = useDispatch();
  const { isLoadingAddCoupon, couponAddMessage, errorAddCoupon, coupon } =
    useSelector(state => state.cart);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(
      addCoupon({ jwt: token, code, discountPercentage, expirationDate })
    ).then(() => {
      setCode("");
      setDiscountPercentage("");
      setExpirationDate("");
    });
  };

  return (
    <section className="w-[60%] px-4 py-4 mx-auto mt-5 mb-10 bg-white border shadow-sm dark:border-gray-900 dark:bg-gray-900 lg:py-4 md:px-6 rounded-lg">
      <div className="mb-6">
        <h2 className="pb-2 mb-2 text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-300 text-center">
          Add Coupon
        </h2>
        {couponAddMessage && (
          <Alert color="success" onDismiss={() => dispatch(clearCartMessage())}>
            {couponAddMessage}
          </Alert>
        )}
        {errorAddCoupon && (
          <Alert color="failure" onDismiss={() => dispatch(clearCouponError())}>
            {errorAddCoupon}
          </Alert>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="coupon"
            className="block mb-2 text-sm font-medium dark:text-gray-400"
          >
            Code
          </label>
          <input
            name="coupon"
            type="text"
            className="block w-full px-4 py-3 mb-2 text-sm bg-gray-100 border rounded dark:placeholder-gray-400 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800"
            placeholder="Coupon code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="discount"
            className="block mb-2 text-sm font-medium dark:text-gray-400"
          >
            Discount %
          </label>
          <input
            name="discount"
            type="number"
            placeholder="Discount %"
            className="block w-full px-4 py-3 mb-3 leading-tight placeholder-gray-400 bg-gray-100 border rounded ark:border-gray-800 dark:bg-gray-800 dark:placeholder-gray-500 dark:text-gray-400 dark:border-gray-800"
            value={discountPercentage}
            onChange={e => setDiscountPercentage(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-6">
          <label
            className="block mb-2 text-sm font-medium dark:text-gray-400"
            htmlFor="date"
          >
            Expiration Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              name="date"
              type="date"
              className="border rounded text-gray-900 sm:text-sm focus:outline-none dark:text-gray-400 dark:placeholder-gray-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-800"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
              required
              placeholder="Select date"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-base text-gray-100 bg-blue-600 rounded hover:bg-blue-500 w-1/3"
          disabled={isLoadingAddCoupon}
        >
          {isLoadingAddCoupon ? "Adding..." : "Send"}
        </button>
      </form>
    </section>
  );
}
