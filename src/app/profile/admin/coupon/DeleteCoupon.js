import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "flowbite-react";
import {
  deleteCoupon,
  clearCouponError,
  clearCartMessage,
} from "../../../../redux/slices/cartSlice";

export default function DeleteCoupon({ token }) {
  const dispatch = useDispatch();
  const { isLoadingDeleteCoupon, errorDeleteCoupon, couponDeleteMessage } =
    useSelector(state => state.cart);
  const [code, setCode] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(deleteCoupon({ code, jwt: token })).then(() => {
      setCode("");
    });
  };

  return (
    <section className="w-[60%] px-4 py-4 mx-auto mt-5 mb-10 bg-white border shadow-sm dark:border-gray-900 dark:bg-gray-900 lg:py-4 md:px-6 rounded-lg">
      <div className="mb-6">
        <h2 className="pb-2 mb-2 text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-300 text-center">
          Delete Coupon
        </h2>
        {couponDeleteMessage && (
          <Alert color="success" onDismiss={() => dispatch(clearCartMessage())}>
            {couponDeleteMessage}
          </Alert>
        )}
        {errorDeleteCoupon && (
          <Alert color="failure" onDismiss={() => dispatch(clearCouponError())}>
            {errorDeleteCoupon}
          </Alert>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="coupon-code"
            className="block mb-2 text-sm font-medium dark:text-gray-400"
          >
            Code
          </label>
          <input
            id="coupon-code"
            type="text"
            className="block w-full px-4 py-3 mb-2 text-sm bg-gray-100 border rounded dark:placeholder-gray-400 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800"
            placeholder="Coupon code to delete"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-base text-gray-100 bg-blue-600 rounded hover:bg-blue-500 w-1/3"
          disabled={isLoadingDeleteCoupon}
        >
          {isLoadingDeleteCoupon ? "Deleting..." : "Delete"}
        </button>
      </form>
    </section>
  );
}
