/* eslint-disable @next/next/no-img-element */
export default function ConfirmationItems({ cart }) {
  return (
    <div className="w-full lg:w-8/12">
      <div className="px-10">
        {cart?.items?.map(item => (
          <div
            key={item._id}
            className="relative flex flex-wrap items-center pb-8 mb-8 -mx-4 border-b border-gray-200 dark:border-gray-700 xl:justify-between border-opacity-40"
          >
            <div className="w-full mb-2 lg:mb-0 h-96 md:h-44 md:w-44">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.images[0]?.alt}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-full px-4 mb-6 md:w-auto xl:mb-0">
              <a
                className="block mb-5 text-xl font-medium dark:text-gray-400 hover:underline"
                href="#"
              >
                {item.product.name}
              </a>
              <div className="flex flex-wrap">
                <p className="mr-4 text-sm font-medium">
                  <span className="dark:text-gray-400">Category:</span>
                  <span className="ml-2 text-gray-400 dark:text-gray-400">
                    {item.product.category}
                  </span>
                </p>
              </div>
            </div>
            <div className="w-full px-4 mt-6 mb-6 xl:w-auto xl:mb-0 xl:mt-0">
              <div className="flex items-center">
                <h4 className="mr-4 font-medium dark:text-gray-400">Qty:</h4>
                <p className="text-gray-500">{item.quantity}</p>
              </div>
            </div>
            <div className="w-full px-4 xl:w-auto">
              <span className="text-xl font-medium text-blue-500 dark:text-gray-400 ">
                <span className="text-sm">€</span>
                <span>{(item.product.price * item.quantity).toFixed(2)}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
