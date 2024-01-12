import Link from "next/link";

interface PaymentRedirectProps {
  isCartEmpty: boolean;
}

export default function PaymentRedirect({ isCartEmpty }: PaymentRedirectProps) {
  return (
    <section className="flex items-start h-screen bg-gray-100 font-poppins dark:bg-gray-900 ">
      <div className="justify-center flex-1 max-w-4xl px-4 py-4 mx-auto lg:py-10 ">
        <div
          className="relative p-6 text-red-700 bg-red-100 border-l-4 border-red-500 dark:border-red-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="w-6 h-6 mr-4 text-red-500 dark:text-red-400 bi bi-exclamation-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
            </div>
            {isCartEmpty ? (
              <div>
                <p className="mb-1 text-lg font-bold dark:text-gray-300">
                  Your cart is empty!
                </p>
                <p className="text-base dark:text-gray-400">
                  Browse our products{" "}
                  <Link href="/" className="underline font-bold">
                    here
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-1 text-lg font-bold dark:text-gray-300">
                  You are not logged in!
                </p>
                <p className="text-base dark:text-gray-400">
                  Please{" "}
                  <Link href="/register" className="underline font-bold">
                    sign up
                  </Link>{" "}
                  or{" "}
                  <Link href="/login" className="underline font-bold">
                    log in
                  </Link>{" "}
                  to view your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
