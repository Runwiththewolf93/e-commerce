interface OrderOutlineProps {
  totalAmount: number;
  totalAmountDiscount: number;
  shippingCost: number;
  appliedCoupon: string | null;
}

interface OrderTotalProps {
  orderTotal: OrderOutlineProps;
}

export default function OrderSummary({ orderTotal }: OrderTotalProps) {
  const { totalAmount, totalAmountDiscount, shippingCost, appliedCoupon } =
    orderTotal;

  const discountAmount = totalAmount - totalAmountDiscount;
  const discountPercentage =
    discountAmount > 0 ? ((discountAmount / totalAmount) * 100).toFixed(0) : 0;

  return (
    <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
      <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
      <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
        <div className="flex justify-between  w-full">
          <p className="text-base leading-4 text-gray-800">Subtotal</p>
          <p className="text-base leading-4 text-gray-600">
            €{totalAmount.toFixed(2)}
          </p>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center w-full">
            <p className="text-base leading-4 text-gray-800">
              Discount{" "}
              {appliedCoupon && (
                <span className="bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800">
                  COUPON
                </span>
              )}
            </p>
            <p className="text-base leading-4 text-gray-600">
              -€{discountAmount.toFixed(2)} ({discountPercentage}%)
            </p>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <p className="text-base leading-4 text-gray-800">Shipping</p>
          <p className="text-base leading-4 text-gray-600">
            €{shippingCost.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
        <p className="text-base font-semibold leading-4 text-gray-600">
          €{totalAmountDiscount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
