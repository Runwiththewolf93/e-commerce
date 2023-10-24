"use client";

export default function DefaultTimeline() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
        <dl className="grid max-w-screen-xl gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">1M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              total customers
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">10k+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              customers browsing
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">3M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              items sold
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
