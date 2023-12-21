import Link from "next/link";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-800">Payment Canceled</h1>
      <p className="my-4 text-xl">
        Your payment process was not completed. You may have cancelled the
        payment, or an issue might have occurred during the transaction.
      </p>
      <Link
        href="/payment/order"
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Try Payment Again
      </Link>
      <Link
        href="/contact"
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Contact Support
      </Link>
      <Link
        href="/"
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
