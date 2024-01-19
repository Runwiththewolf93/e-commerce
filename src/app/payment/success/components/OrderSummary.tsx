/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reactReduxHooks";
import OrderCart from "./OrderCart";
import OrderOutline from "./OrderOutline";
import OrderShipping from "./OrderShipping";
import OrderCustomer from "./OrderCustomer";
import OrderSummarySkeleton from "./OrderSummarySkeleton";
import {
  getOrder,
  clearOrderError,
  setIsAddressSubmitted,
} from "../../../../redux/slices/orderSlice";
import {
  removeCart,
  clearErrorMessage as clearCartError,
} from "../../../../redux/slices/cartSlice";
import { formatDate } from "../../../../../utils/helper";
import { Alert } from "flowbite-react";

interface OrderSummaryProps {
  cartId: string;
  jwt: string;
}

/**
 * Render the order summary component.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {string} jwt - The JSON Web Token.
 * @returns {JSX.Element} The JSX element representing the order summary.
 */
const OrderSummary = ({ cartId, jwt }: OrderSummaryProps) => {
  const dispatch = useAppDispatch();
  const { isLoadingGetOrder, order, errorGetOrder } = useAppSelector(
    state => state.order
  );
  const { isLoadingRemoveCart, errorRemoveCart } = useAppSelector(
    state => state.cart
  );
  console.log("🚀 ~ file: OrderSummary.js:13 ~ OrderSummary ~ order:", order);

  useEffect(() => {
    const fetchAndRemoveCart = async () => {
      if (cartId && jwt) {
        console.log("FETCHANDREMOVECART");
        try {
          // Fetch order details
          await dispatch(getOrder({ cartId, jwt })).unwrap();

          // Reset isAddressSubmitted state for new orders
          dispatch(setIsAddressSubmitted(false));

          // Remove the cart after successfully fetching the order
          dispatch(removeCart({ cartId, jwt }));
        } catch (error) {
          console.error("Error fetching order:", error);
          // Error handling logic for getOrder
        }
      }
    };

    fetchAndRemoveCart();
  }, [cartId, jwt, dispatch, order?.cartId]);

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
    userInfo:
      typeof order?.userId === "string"
        ? { _id: order.userId, email: "" }
        : order?.userId,
    userOrderCount: order?.userOrderCount,
  };

  if (
    isLoadingGetOrder ||
    Object.keys(order).length === 0 ||
    isLoadingRemoveCart
  ) {
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
          {(errorGetOrder || errorRemoveCart) && (
            <Alert
              color="failure"
              className="text-lg gap-0"
              onDismiss={() => {
                dispatch(clearOrderError());
                dispatch(clearCartError());
              }}
            >
              {errorGetOrder || errorRemoveCart}
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
