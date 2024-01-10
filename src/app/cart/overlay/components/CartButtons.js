import Link from "next/link";

/**
 * Renders the CartButtons component.
 *
 * @param {function} handleClose - The function to handle the closing of the component.
 * @return {JSX.Element} The rendered CartButtons component.
 */
export default function CartButtons({ handleClose }) {
  return (
    <>
      <p className="mt-0.5 text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>
      <div className="mt-3">
        <Link
          href="/cart"
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      </div>
      <div className="mt-3">
        <Link
          href="/payment/shipping"
          className="flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700"
        >
          Proceed to Payment
        </Link>
      </div>
      <div className="mt-3 flex justify-center text-center text-sm text-gray-500">
        <p>
          or
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            onClick={handleClose}
          >
            Continue Shopping
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </p>
      </div>
    </>
  );
}
