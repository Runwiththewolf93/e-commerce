"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../../redux/slices/orderSlice";
import OrderOverviewSkeleton from "./OrderOverviewSkeleton";
import { Alert } from "flowbite-react";

export default function OrderOverview({ session }) {
  const jwt = session?.customJwt;
  const dispatch = useDispatch();
  const { isLoadingGetOrders, orders, errorGetOrders } = useSelector(
    state => state.order
  );
  console.log(
    "🚀 ~ file: OrderOverview.js:8 ~ OrderOverview ~ orders:",
    orders
  );

  const [duplicatedOrders, setDuplicatedOrders] = useState([]);

  useEffect(() => {
    if (jwt) {
      const getDuplicates = async () => {
        await dispatch(getOrders(jwt)).then(() => {
          if (orders.length === 1) {
            const duplicatedOrders = Array.from({ length: 6 }, (_, i) => ({
              ...orders[0],
              _id: `${orders[0]._id}_${i}`,
            }));
            setDuplicatedOrders(duplicatedOrders);
          }
        });
      };
      getDuplicates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, dispatch]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = duplicatedOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Calculate page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(duplicatedOrders.length / ordersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Render pagination
  const renderPagination = () => (
    <nav>
      <ul className="flex justify-center space-x-5 mt-5">
        {pageNumbers.map(number => (
          <li key={number} className="list-none">
            <button
              onClick={() => paginate(number)}
              className={`py-2 px-4 rounded ${
                number === currentPage
                  ? "bg-blue-500 text-white hover:bg-blue-600" // Style for the current page
                  : "bg-gray-200 hover:bg-gray-300" // Style for other pages
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const getReadableDeliveryTime = deliveryTime => {
    const currentTime = new Date().getTime();
    const timeDiff = deliveryTime - currentTime;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (timeDiff < 0) {
      return "Delivered!";
    } else {
      return `approximately ${daysRemaining} days`;
    }
  };

  return (
    <div className="flex-grow bg-gray-100 rounded-md p-6 min-w-fit">
      <div>
        <p className="mb-3 text-5xl text-center font-semibold">
          Order Overview
        </p>
        {isLoadingGetOrders && orders.length === 0 ? (
          <OrderOverviewSkeleton />
        ) : errorGetOrders ? (
          <Alert color="failure">{errorGetOrders}</Alert>
        ) : (
          <>
            <div className="space-y-4">
              {currentOrders.map(order => (
                <div key={order._id} className="border p-4 rounded-md">
                  <p className="text-lg font-semibold">
                    Order #{order._id.slice(0, 5)}
                  </p>
                  <p>Status: {order.orderStatus}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    {order.items.map(item => (
                      <div key={item._id} className="flex justify-between">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold">
                    <p>Total: </p>
                    <p>${order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="mt-2">
                      Shipping to: {order.shippingAddress.city},{" "}
                      {order.shippingAddress.street}
                    </p>
                    <p>
                      Delivery time:{" "}
                      {getReadableDeliveryTime(order.deliveryTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
