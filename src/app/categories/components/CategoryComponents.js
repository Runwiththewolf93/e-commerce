"use client";

import { Breadcrumb, Dropdown, Label, RangeSlider } from "flowbite-react";
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

export function DropDown() {
  return (
    <Dropdown label="Sort By" inline>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown>
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
  const [isMouseDown, setIsMouseDown] = useState(false);

  console.log(
    "🚀 ~ file: CategoryComponents.js:37 ~ uniquePrices:",
    uniquePrices
  );

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const tolerance = 5;

  const handleSliderChange = e => {
    if (!isMouseDown) return;

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
          onMouseDown={handleMouseDown}
          onMouseMove={handleSliderChange}
          onMouseUp={handleMouseUp}
          className="flex-1"
        />
        <span className="ml-1">€ {maxPrice}</span>
      </div>
    </div>
  );
};

export default memo(RangeSliderElement, areEqual);
