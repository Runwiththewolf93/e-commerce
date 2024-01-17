import { FaCheck } from "react-icons/fa";

interface OrderPaymentProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoadingOrderCart: boolean;
  messageOrderCart: string;
  isLoadingPaymentCheckout: boolean;
  sessionId: string;
}

/**
 * Renders the OrderPayment component.
 *
 * @param {Object} props - The props object containing the following:
 *   - {function} handleSubmit: The submit handler function.
 *   - {boolean} isLoadingOrderCart: A flag indicating if the order cart is loading.
 *   - {string} messageOrderCart: The message for the order cart.
 *   - {boolean} isLoadingPaymentCheckout: A flag indicating if the payment checkout is loading.
 *   - {string} sessionId: The session ID.
 * @return {JSX.Element} The rendered OrderPayment component.
 */
export default function OrderPayment({
  handleSubmit,
  isLoadingOrderCart,
  messageOrderCart,
  isLoadingPaymentCheckout,
  sessionId,
}: OrderPaymentProps) {
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
