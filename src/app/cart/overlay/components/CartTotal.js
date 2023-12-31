export default function CartTotal({ cart }) {
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
