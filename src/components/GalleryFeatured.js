/* eslint-disable @next/next/no-img-element */
"use client";

import { useSelector } from "react-redux";
import GalleryFeaturedSkeleton from "../subcomponents/GalleryFeaturedSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";
import StarRating from "../subcomponents/StarRating";

export default function GalleryFeatured() {
  const { featured, isLoading, error } = useSelector(state => state.products);

  if (isLoading) {
    return <GalleryFeaturedSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Featured</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {featured.map(product => (
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
            <div className="px-5 pb-5">
              <Link href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3 truncate">
                  {product.name}
                </h5>
                <p className="mt-1 line-clamp-2">{product.description}</p>
              </Link>
              <div className="flex items-center mt-2.5 mb-3">
                <StarRating aggregateRating={product.aggregateRating} />
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                  {product.aggregateRating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-2xl font-bold text-gray-900 dark:text-white pt-1 ${
                    product.price > 999 ? "text-xl" : ""
                  }`}
                >
                  €{product.price.toFixed(2)}
                </span>
                <Link
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[100px]"
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
