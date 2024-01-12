import { CartType } from "@/redux/types/cartSliceTypes";

interface CartTotalProps {
  cart: CartType;
}

/**
 * Renders the total amount and subtotal of the cart with or without a discount.
 *
 * @param {Object} cart - The cart object containing the total amount and the total amount with discount.
 * @return {JSX.Element} - The JSX element displaying the total amount and subtotal of the cart.
 */
export default function CartTotal({ cart }: CartTotalProps) {
  return (
    <div className="flex flex-col">
      {cart.totalAmount === cart.totalAmountDiscount ? (
        <>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>${cart.totalAmount}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${cart.totalAmount}</p>
          </div>
          <div className="h-0.5 bg-slate-800"></div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p className="font-bold">Total with discount</p>
            <p className="font-bold">${cart.totalAmountDiscount}</p>
          </div>
        </>
      )}
    </div>
  );
}
