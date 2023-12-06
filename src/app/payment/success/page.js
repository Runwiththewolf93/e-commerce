import Link from "next/link";

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-800">Payment Successful</h1>
      <p className="my-4 text-xl">Your payment was processed successfully.</p>
      <Link href="/">
        <a className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">
          Go to Homepage
        </a>
      </Link>
    </div>
  );
}
