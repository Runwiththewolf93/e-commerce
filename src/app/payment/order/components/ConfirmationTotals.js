/**
 * Renders the confirmation totals component.
 *
 * @param {Object} cart - The cart object containing totalAmountDiscount and shippingCost.
 * @return {JSX.Element} The rendered confirmation totals component.
 */
export default function ConfirmationTotals({ cart }) {
  return (
    <div className="w-full lg:w-4/12">
      <div className="px-6 mb-14">
        <div>
          <h2 className="mb-6 text-3xl font-bold dark:text-gray-400">
            Cart totals
          </h2>
          <div className="flex items-center justify-between px-10 py-4 mb-3 font-medium leading-8 bg-gray-100 bg-opacity-50 border dark:text-gray-400 dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <span>Subtotal</span>
            <span className="flex items-center text-xl">
              <span className="mr-2 text-base">€</span>
              <span>{cart?.totalAmountDiscount}</span>
            </span>
          </div>
          <div className="flex items-center justify-between px-10 py-4 mb-3 font-medium leading-8 bg-gray-100 bg-opacity-50 border dark:text-gray-400 dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <span>Shipping</span>
            <span className="flex items-center text-xl">
              <span className="mr-2 text-base">€</span>
              <span>{cart?.shippingCost}</span>
            </span>
          </div>
          <div className="flex items-center justify-between px-10 py-4 mb-6 font-medium leading-8 bg-gray-100 border dark:text-gray-400 dark:bg-gray-800 dark:border-gray-800 rounded-xl">
            <span>Total</span>
            <span className="flex items-center text-xl text-blue-500 dark:text-blue-400">
              <span className="mr-2 text-base">€</span>
              <span>
                {(cart?.totalAmountDiscount + cart?.shippingCost).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
