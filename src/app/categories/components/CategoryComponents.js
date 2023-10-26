"use client";

import {
  Breadcrumb,
  Label,
  RangeSlider,
  Alert,
  Pagination,
} from "flowbite-react";
import { HiHome, HiInformationCircle } from "react-icons/hi";
import { useState, memo, useEffect } from "react";

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

export function CategorySkeleton() {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setSkeletonCount(prevCount => prevCount + 1);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: skeletonCount }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
          <div className="mt-4 h-4 bg-gray-300 rounded"></div>
          <div className="mt-1 h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function CategoryError({ errorCategory }) {
  return (
    <Alert color="failure" icon={HiInformationCircle}>
      <span>
        <p>
          <span className="font-medium">{errorCategory}</span>
        </p>
      </span>
    </Alert>
  );
}

export function CategoryPagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginationDefault =
    "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const paginationActive =
    "flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";

  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex -space-x-px text-base h-10">
        <li>
          <button
            className={paginationDefault}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              className={
                currentPage === number ? paginationActive : paginationDefault
              }
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            className={paginationDefault}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
