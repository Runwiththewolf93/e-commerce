/* eslint-disable @next/next/no-img-element */
"use client";

import { useSelector } from "react-redux";
import GalleryNewArrivalsSkeleton from "../subcomponents/GalleryNewArrivalsSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";

export default function GalleryNewArrivals() {
  const { newArrivals, isLoading, error } = useSelector(
    state => state.products
  );

  if (isLoading) {
    return <GalleryNewArrivalsSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">New Arrivals</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {newArrivals.map(product => (
          <div
            key={product._id}
            className="w-64 bg-white border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <Link href="#">
              <figure className="relative h-40 w-full">
                <div className="absolute inset-0 bg-inherit">
                  <img
                    className="absolute inset-0 object-cover w-full h-full rounded-t-2xl overflow-hidden"
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt}
                  />
                </div>
              </figure>
            </Link>
            <div className="p-5">
              <Link href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                  {product.name}
                </h5>
              </Link>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
              <div className="mb-2">
                {product.stock <= 5 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Only {product.stock} items remaining!
                  </span>
                )}
                {product.stock > 5 && product.stock <= 20 && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                    Hurry, only {product.stock} items left!
                  </span>
                )}
                {product.stock > 20 && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    {product.stock} items in stock.
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-2xl font-bold text-gray-900 dark:text-white pt-1 ${
                    product.price > 999
                      ? "text-xl"
                      : product.price > 9999
                      ? "text-lg"
                      : ""
                  }`}
                >
                  €{product.price.toFixed(2)}
                </span>
                <Link
                  href="#"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[100px]"
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
