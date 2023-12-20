"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../../redux/slices/cartSlice";
import { useSession } from "next-auth/react";
import AlertComponent from "./components/AlertComponent";
import ButtonComponent from "./components/ButtonComponent";
import FormComponent from "./components/FormComponent";
import CartOrder from "../../cart/components/CartOrder";

export default function Shipping() {
  const dispatch = useDispatch();
  const { isLoadingGetCart, cart } = useSelector(state => state.cart);
  const { data: session } = useSession();
  const [selectedButton, setSelectedButton] = useState(null);
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  console.log("🚀 ~ file: page.js:14 ~ Shipping ~ cart:", cart);

  useEffect(() => {
    if ((!cart || Object.keys(cart).length === 0) && session?.customJwt) {
      dispatch(getUserCart(session?.customJwt));
    }
  }, [cart, dispatch, session?.customJwt]);

  // Calculate the shipping dates
  const calculateShippingDates = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    return `${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`;
  };
  const shippingDates = calculateShippingDates();

  const handleButtonClick = buttonId => {
    setSelectedButton(buttonId);
  };

  const handleAddressSubmission = () => {
    setIsAddressSubmitted(true);
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold">Delivery address</h1>
        <h2 className="mt-1 text-xl">
          To which address would you like for your order to be shipped?
        </h2>
        <div className="divider" />
        <div className="flex justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-1">Shipment 1</h2>|
            <span className="ml-1 mt-1">direct</span>
          </div>
          <div>
            <p>Your shipment will arrive between {shippingDates}</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div>
            <AlertComponent totalWeight={cart?.totalWeight} />
            <ButtonComponent
              totalWeight={cart?.totalWeight}
              selectedButton={selectedButton}
              handleButtonClick={handleButtonClick}
            />
            {selectedButton === 1 && (
              <FormComponent
                jwt={session?.customJwt}
                onAddressSubmit={handleAddressSubmission}
                cartId={cart?._id}
              />
            )}
          </div>
          <div className="flex justify-center mt-6 flex-1">
            <CartOrder
              cart={cart}
              isLoadingGetCart={isLoadingGetCart}
              isAddressSubmitted={isAddressSubmitted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
