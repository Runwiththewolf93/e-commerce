/* eslint-disable @next/next/no-img-element */
export default function OrderCart({ orderItems }) {
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount || discount.percentage === 0) return price;
    return (price - (price * discount.percentage) / 100).toFixed(2);
  };

  return (
    <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
      <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
        Customer’s Cart
      </p>
      {orderItems.map(item => (
        <div
          className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
          key={item._id}
        >
          <div className="pb-4 md:pb-8 w-full md:w-40">
            <div className="w-full h-32 md:h-40 bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover object-center"
                src={item.images[0].url}
                alt={item.images[0].alt}
              />
            </div>
          </div>
          <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
            <div className="w-full flex flex-col justify-start items-start space-y-8">
              <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                {item.name}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 place-items-center w-full">
              <p className="text-base xl:text-lg leading-6">
                €{calculateDiscountedPrice(item.price, item.discount)}
                {item.discount && item.discount.percentage > 0 && (
                  <span className="text-red-300 line-through ml-2">
                    €{item.price.toFixed(2)}
                  </span>
                )}
              </p>
              <p className="text-base xl:text-lg leading-6 text-gray-800">
                {item.quantity}
              </p>
              <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                €
                {(
                  item.quantity *
                  calculateDiscountedPrice(item.price, item.discount)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
