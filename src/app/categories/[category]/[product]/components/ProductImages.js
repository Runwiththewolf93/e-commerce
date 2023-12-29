/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

export default function ProductImages({ productImages }) {
  const [zoom, setZoom] = useState(Array(productImages?.length).fill(false));

  const handleMouseOver = index => {
    const newZoom = [...zoom];
    newZoom[index] = true;
    setZoom(newZoom);
  };

  const handleMouseOut = index => {
    const newZoom = [...zoom];
    newZoom[index] = false;
    setZoom(newZoom);
  };

  const oneProductImage = productImages?.slice(-1);
  const fourProductImages = productImages?.concat(oneProductImage);

  if (fourProductImages?.length === 3) {
    return (
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        {fourProductImages.map((image, index) => (
          <div
            key={index}
            className={`aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:col-span-1 ${
              index !== 0 ? "mt-8 lg:mt-0" : ""
            }`}
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={() => handleMouseOut(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className={`h-full w-full object-cover object-center transition-all duration-300 ${
                zoom[index] ? "scale-125" : ""
              }`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (fourProductImages?.length === 4) {
    return (
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        <div
          className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:col-span-1"
          onMouseOver={() => handleMouseOver(0)}
          onMouseOut={() => handleMouseOut(0)}
        >
          <img
            src={fourProductImages[0].url}
            alt={fourProductImages[0].alt}
            className={`h-full w-full object-cover object-center transition-all duration-300 ${
              zoom[0] ? "scale-125" : ""
            }`}
          />
        </div>
        <div className="lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div
            className="aspect-h-4 aspect-w-3 lg:aspect-h-2 lg:aspect-w-3 overflow-hidden rounded-lg mt-8 lg:mt-0"
            onMouseOver={() => handleMouseOver(1)}
            onMouseOut={() => handleMouseOut(1)}
          >
            <img
              src={fourProductImages[1].url}
              alt={fourProductImages[1].alt}
              className={`h-full w-full object-cover object-center transition-all duration-300 ${
                zoom[1] ? "scale-125" : ""
              }`}
            />
          </div>
          <div
            className="aspect-h-4 aspect-w-3 lg:aspect-h-2 lg:aspect-w-3 overflow-hidden rounded-lg mt-8 lg:mt-0"
            onMouseOver={() => handleMouseOver(2)}
            onMouseOut={() => handleMouseOut(2)}
          >
            <img
              src={fourProductImages[2].url}
              alt={fourProductImages[2].alt}
              className={`h-full w-full object-cover object-center transition-all duration-300 ${
                zoom[2] ? "scale-125" : ""
              }`}
            />
          </div>
        </div>
        <div
          className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-8 lg:mt-0"
          onMouseOver={() => handleMouseOver(3)}
          onMouseOut={() => handleMouseOut(3)}
        >
          <img
            src={fourProductImages[3].url}
            alt={fourProductImages[3].alt}
            className={`h-full w-full object-cover object-center transition-all duration-300 ${
              zoom[3] ? "scale-125" : ""
            }`}
          />
        </div>
      </div>
    );
  }
}
