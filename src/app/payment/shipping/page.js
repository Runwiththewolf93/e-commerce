"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../../redux/slices/productSlice";
import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button } from "flowbite-react";

export default function Shipping() {
  const dispatch = useDispatch();

  // Calculate the shipping dates
  const calculateShippingDates = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    return `${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`;
  };

  const shippingDates = calculateShippingDates();

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
        <div>
          <div className="mt-5">
            <Alert color="info" icon={HiInformationCircle} className="mb-3">
              Parcel Zones can receive packages weighing up to 15 kg. Due to
              specific characteristics, some packages cannot be delivered in
              this way.
            </Alert>
            <Alert color="info" icon={HiInformationCircle}>
              Packages weighing up to 25 kg can be picked up from Parcel
              Lockers. Due to specific characteristics, some packages cannot be
              delivered in this way.
            </Alert>
          </div>
          <div className="space-y-3 mt-5">
            <Button className="w-full">Continue</Button>
            <Button className="w-full">Continue</Button>
            <Button className="w-full">Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// continue tomorrow
