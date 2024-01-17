/* eslint-disable @next/next/no-img-element */
import ConfirmationItems from "./ConfirmationItems";
import ConfirmationTotals from "./ConfirmationTotals";
import ConfirmationItemsSkeleton from "./ConfirmationItemsSkeleton";
import ConfirmationTotalsSkeleton from "./ConfirmationTotalsSkeleton";
import { CartType } from "@/redux/types/cartSliceTypes";

interface ConfirmationCartProps {
  cart: CartType;
  isLoadingGetCart: boolean;
}

/**
 * Renders the ConfirmationCart component.
 *
 * @param {object} props - The component properties.
 * @param {CartType} props.cart - The cart object.
 * @param {boolean} props.isLoadingGetCart - Flag indicating whether the cart is being loaded.
 * @return {JSX.Element} - The rendered ConfirmationCart component.
 */
export default function ConfirmationCart({
  cart,
  isLoadingGetCart,
}: ConfirmationCartProps) {
  return (
    <section className="flex items-center bg-gray-50 font-poppins dark:bg-gray-700 ">
      <div className="justify-center flex-1 px-1 py-6 mx-auto max-w-7xl lg:py-4 md:px-6">
        <h2 className="my-5 text-4xl font-bold text-center dark:text-gray-400">
          Confirmation Cart
        </h2>
        <p className="mb-10 text-2xl text-center">Please check your details</p>
        <div className="flex flex-wrap">
          {isLoadingGetCart ? (
            <ConfirmationItemsSkeleton />
          ) : (
            <ConfirmationItems cart={cart} />
          )}
          {isLoadingGetCart ? (
            <ConfirmationTotalsSkeleton />
          ) : (
            <ConfirmationTotals cart={cart} />
          )}
        </div>
      </div>
    </section>
  );
}
