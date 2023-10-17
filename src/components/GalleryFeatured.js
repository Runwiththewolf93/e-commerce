/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryBestSellersSkeleton from "../subcomponents/GalleryBestSellersSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";
import { fetchFeatured } from "../redux/slices/productSlice";

export default function GalleryFeatured() {
  const dispatch = useDispatch();
  const { featured, isLoading, error, currentGallery } = useSelector(
    state => state.products
  );

  useEffect(() => {
    if (currentGallery === "featured") {
      dispatch(fetchFeatured());
    }
  }, [currentGallery, dispatch]);

  if (isLoading) {
    return <GalleryBestSellersSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  console.log(
    "🚀 ~ file: GalleryFeatured.js:35 ~ GalleryFeatured ~ featured:",
    featured
  );

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Our Bestsellers</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {featured.map((product, index) => (
          <div
            key={product._id}
            className="w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <Link href="#">
              <img
                className="rounded-t-lg"
                src={product.images[0]?.url}
                alt={product.images[0]?.alt}
              />
            </Link>
            <div className="px-5 pb-5">
              <Link href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3 truncate">
                  {product.name}
                </h5>
                <p className="mt-1 line-clamp-2">{product.description}</p>
              </Link>
              <div className="flex items-center mt-2.5 mb-3">
                {Array.from({ length: featured.length }, (_, index) => {
                  const ratingValue = index + 1;
                  const isHalfStar =
                    featured.aggregateRating >= ratingValue - 0.5 &&
                    featured.aggregateRating < ratingValue;
                })}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                  {product.aggregateRating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  €{product.price.toFixed(2)}
                </span>
                <Link
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add to cart
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
