/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DefaultCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [opacity, setOpacity] = useState(1);

  const images = [
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product1.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product2.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product3.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/dall-e/product4.png",
  ];

  const categoryLinks = [
    "/clothing",
    "/cars-motorcycles",
    "/home-garden",
    "/toys",
  ];

  const catchyTexts = [
    "Step up your style with our latest sneakers",
    "Drive your dreams with our latest cars and motorcycles",
    "Make your house a home with our stylish and affordable home and garden products",
    "Let your kids' imaginations run wild with our fun and educational toys",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentSlide(prevSlide => {
          const newSlide = (prevSlide + 1) % images.length;
          setNextSlide((newSlide + 1) % images.length);
          setOpacity(1);
          return newSlide;
        });
      }, 1000);
    }, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="carousel w-full h-72 lg:h-96 relative z-0">
      <div id="slide1" className="carousel-item relative w-full">
        <Link
          href={categoryLinks[currentSlide]}
          className="w-full h-full relative"
        >
          <img
            src={images[currentSlide]}
            className="absolute w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: opacity }}
            alt={`product image ${currentSlide + 1}`}
          />
          <img
            src={images[nextSlide]}
            className="absolute w-full h-full object-cover transition-opacity duration-1000"
            alt={`product image ${nextSlide + 1}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center font-semibold text-xl">
            <p>{catchyTexts[currentSlide]}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
