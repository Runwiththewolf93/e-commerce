import { FaCheck } from "react-icons/fa";

export default function OrderPayment({
  handleSubmit,
  isLoadingOrderCart,
  messageOrderCart,
  isLoadingPaymentCheckout,
  sessionId,
}) {
  return (
    <div className="w-full flex justify-center items-center mb-14">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div>
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg leading-4 text-white font-bold"
            type="submit"
            role="link"
            disabled={isLoadingOrderCart || isLoadingPaymentCheckout}
          >
            {isLoadingOrderCart || isLoadingPaymentCheckout ? (
              "Processing..."
            ) : (
              <div className="flex justify-center">
                Proceed to Payment
                {(messageOrderCart || sessionId) && (
                  <FaCheck className="ml-2" />
                )}
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
