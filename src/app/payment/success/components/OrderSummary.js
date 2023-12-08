/* eslint-disable @next/next/no-img-element */
import OrderCart from "./OrderCart";
import OrderOutline from "./OrderOutline";
import OrderShipping from "./OrderShipping";
import OrderCustomer from "./OrderCustomer";

const OrderSummary = () => {
  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col ">
        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
          Order #13432
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          21st Mart 2021 at 10:34 PM
        </p>
      </div>
      <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <OrderCart />
          <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <OrderOutline />
            <OrderShipping />
          </div>
        </div>
        <OrderCustomer />
      </div>
    </div>
  );
};

export default OrderSummary;
