/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCart from "./OrderCart";
import OrderOutline from "./OrderOutline";
import OrderShipping from "./OrderShipping";
import OrderCustomer from "./OrderCustomer";
import OrderSummarySkeleton from "./OrderSummarySkeleton";
import { getOrder, clearOrderError } from "../../../../redux/slices/orderSlice";
import { formatDate } from "../../../../../utils/helper";
import { Alert } from "flowbite-react";

const OrderSummary = ({ cartId, jwt }) => {
  const dispatch = useDispatch();
  const { isLoadingGetOrder, order, errorGetOrder } = useSelector(
    state => state.order
  );
  console.log("🚀 ~ file: OrderSummary.js:13 ~ OrderSummary ~ order:", order);

  useEffect(() => {
    if (cartId && (!order || Object.keys(order).length === 0) && jwt) {
      dispatch(getOrder({ cartId, jwt }));
    }
  }, [cartId, order, jwt, dispatch]);

  const formattedDate = order?.createdAt ? formatDate(order.createdAt) : "";
  const orderOutline = {
    totalAmount: order?.totalAmount,
    totalAmountDiscount: order?.totalAmountDiscount,
    shippingCost: order?.shippingCost,
    appliedCoupon: order?.appliedCoupon,
  };
  const orderShipping = {
    shippingCost: order?.shippingCost,
    deliveryTime: order?.deliveryTime,
  };
  const orderCustomer = {
    shippingAddress: order?.shippingAddress,
    userInfo: order?.userId,
    userOrderCount: order?.userOrderCount,
  };

  if (isLoadingGetOrder) {
    return <OrderSummarySkeleton />;
  }

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
              Order #{order?._id.slice(0, 5)}
            </h1>
            <p className="text-base font-medium leading-6 text-gray-600">
              {formattedDate}
            </p>
          </div>
          {errorGetOrder && (
            <Alert
              color="failure"
              className="text-lg gap-0"
              onDismiss={() => dispatch(clearOrderError())}
            >
              {errorGetOrder}
            </Alert>
          )}
        </div>
      </div>
      <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <OrderCart orderItems={order?.items} />
          <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <OrderOutline orderTotal={orderOutline} />
            <OrderShipping orderShipping={orderShipping} />
          </div>
        </div>
        <OrderCustomer orderCustomer={orderCustomer} />
      </div>
      {/* <button onClick={() => dispatch(getOrder({ cartId, jwt }))}>
        getOrder
      </button> */}
    </div>
  );
};

export default OrderSummary;
