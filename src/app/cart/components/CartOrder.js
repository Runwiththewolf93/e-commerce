/* eslint-disable @next/next/no-img-element */
import CartOrderSkeleton from "./CartOrderSkeleton";
import Link from "next/link";

// CARTORDER COMPONENT
export default function CartOrder({ cart, isLoadingGetCart }) {
  return isLoadingGetCart ? (
    <CartOrderSkeleton />
  ) : (
    <div className="w-full px-4 mb-4 lg:w-1/2 ">
      <div className="p-6 border border-blue-100 dark:bg-gray-900 dark:border-gray-900 bg-gray-50 md:p-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-700 dark:text-gray-400">
          Order Summary
        </h2>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 ">
          <span className="text-gray-700 dark:text-gray-400">Subtotal</span>
          <span className="text-xl font-bold text-gray-700 dark:text-gray-400 ">
            €{cart.totalAmount?.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4 ">
          <span className="text-gray-700 dark:text-gray-400 ">Shipping</span>
          <span className="text-xl font-bold text-gray-700 dark:text-gray-400 ">
            €{cart.shippingCost?.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4 ">
          <span className="text-gray-700 dark:text-gray-400 ">You save</span>
          <span className="text-xl font-bold text-gray-700 dark:text-gray-400 ">
            €
            {(
              cart?.totalAmount -
              cart?.totalAmountDiscount -
              cart?.shippingCost
            )?.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pb-4 mb-4 ">
          <span className="text-gray-700 dark:text-gray-400">Order Total</span>
          <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
            €{(cart?.totalAmountDiscount + cart?.shippingCost).toFixed(2)}
          </span>
        </div>
        <h2 className="text-lg text-gray-500 dark:text-gray-400">We offer:</h2>
        <div className="flex items-center gap-2 mb-4 ">
          <img
            src="https://i.postimg.cc/g22HQhX0/70599-visa-curved-icon.png"
            alt=""
            className="object-cover h-16 w-26"
          />
          <img
            src="https://i.postimg.cc/HW38JkkG/38602-mastercard-curved-icon.png"
            alt=""
            className="object-cover h-16 w-26"
          />
          <img
            src="https://i.postimg.cc/HL57j0V3/38605-paypal-straight-icon.png"
            alt=""
            className="object-cover h-16 w-26"
          />
        </div>
        <div className="flex items-center justify-between ">
          <Link href="/payment/shipping" className="w-full">
            <button className="block w-full py-4 font-bold text-center text-gray-100 uppercase bg-blue-500 rounded-md hover:bg-blue-600">
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
