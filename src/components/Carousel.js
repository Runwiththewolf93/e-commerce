/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

export default function DefaultCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const images = [
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product1.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product2.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product3.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product4.png",
  ];

  const nextSlide = () => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % images.length);
      setOpacity(1);
    }, 300);
  };

  const prevSlide = () => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentSlide(
        prevSlide => (prevSlide - 1 + images.length) % images.length
      );
      setOpacity(1);
    }, 300);
  };

  return (
    <div className="carousel w-full h-96">
      <div id="slide1" className="carousel-item relative w-full">
        <img
          src={images[currentSlide]}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: opacity }}
          alt={`product image ${currentSlide + 1}`}
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button onClick={prevSlide} className="btn btn-circle">
            ❮
          </button>
          <button onClick={nextSlide} className="btn btn-circle">
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}
