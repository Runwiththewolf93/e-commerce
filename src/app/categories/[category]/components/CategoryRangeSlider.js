import { memo } from "react";
import { Label, RangeSlider } from "flowbite-react";

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
