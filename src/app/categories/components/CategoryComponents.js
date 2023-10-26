"use client";

import { Breadcrumb, Label, RangeSlider } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useState, memo } from "react";

export function BreadCrumb({ category }) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href="/" icon={HiHome}>
        <p>Home</p>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{category}</Breadcrumb.Item>
      {/* <Breadcrumb.Item>Flowbite React</Breadcrumb.Item> */}
    </Breadcrumb>
  );
}

export function DropDown({ setSortOption }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelection = value => {
    console.log("Dropdown value changed:", value);
    setSortOption(value);
    toggleDropdown();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sort By
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {dropdownVisible && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button
                onClick={() => handleSelection("Newest")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Newest
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelection("PriceLowToHigh")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Price (Low to High)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelection("PriceHighToLow")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Price (High to Low)
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

const areEqual = (prevProps, nextProps) => {
  return prevProps.lastCloseEnough === nextProps.lastCloseEnough;
};

const RangeSliderElement = ({
  setTriggerValue,
  minPrice,
  maxPrice,
  uniquePrices,
  lastCloseEnough,
  setLastCloseEnough,
}) => {
  console.log(
    "🚀 ~ file: CategoryComponents.js:37 ~ uniquePrices:",
    uniquePrices
  );

  const tolerance = 5;

  const handleSliderChange = e => {
    const value = parseInt(e.target.value, 10);

    const closeEnough = uniquePrices.find(
      price => Math.abs(price - value) <= tolerance
    );

    if (closeEnough !== undefined && closeEnough !== lastCloseEnough) {
      setLastCloseEnough(closeEnough);
      setTriggerValue(closeEnough);
    } else if (value === maxPrice) {
      setTriggerValue(null);
    }
  };

  return (
    <div>
      <div className="mb-1 block">
        <Label htmlFor="range" value="Price" className="text-md" />
      </div>
      <div className="flex items-center">
        <span className="mr-1">€ {minPrice}</span>
        <RangeSlider
          id="range"
          min={minPrice}
          max={maxPrice}
          onMouseMove={handleSliderChange}
          className="flex-1"
        />
        <span className="ml-1">€ {maxPrice}</span>
      </div>
    </div>
  );
};

export default memo(RangeSliderElement, areEqual);
