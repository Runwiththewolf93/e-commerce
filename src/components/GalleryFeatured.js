/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryFeaturedSkeleton from "../subcomponents/GalleryFeaturedSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";
import StarRating from "../subcomponents/StarRating";
import { categoryToLink } from "../../utils/helper";
import { addToCart, openCartOverlay } from "../redux/slices/cartSlice";
import { useSession } from "next-auth/react";
import { useCloseCartOnRouteChange } from "../app/hooks/useCloseCartOnRouteChange";

/**
 * Renders the featured gallery.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function GalleryFeatured() {
  const dispatch = useDispatch();
  const { featured, isLoading, error } = useSelector(state => state.products);
  const { data: session } = useSession();
  const jwt = session?.customJwt;
  const [addingProductId, setAddingProductId] = useState(null);
  useCloseCartOnRouteChange();

  const handleAddToCart = async productId => {
    setAddingProductId(productId);
    await dispatch(addToCart({ productId, quantity: 1, jwt })).unwrap();
    setAddingProductId(null);
    dispatch(openCartOverlay());
  };

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
        {featured.map(product => {
          const discount = product.discount?.percentage;
          const discountedPrice = product.price * ((100 - discount) / 100);

          return (
            <div
              key={product._id}
              className="relative w-64 bg-white border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700"
            >
              {product.discount?.percentage ? (
                <div className="absolute bg-red-500 text-white text-xs font-bold rounded-full p-2 z-10">
                  -{product.discount?.percentage}%
                </div>
              ) : null}
              <Link
                href={`/categories/${categoryToLink(product.category)}/${
                  product._id
                }}`}
              >
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
                <Link
                  href={`/categories/${categoryToLink(product.category)}/${
                    product._id
                  }`}
                >
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3 truncate">
                    {product.name}
                  </h5>
                </Link>
                <p className="mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center mt-2.5 mb-3">
                  <StarRating aggregateRating={product.aggregateRating} />
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                    {product.aggregateRating}
                  </span>
                </div>
                <div
                  className={`grid grid-cols-2 ${
                    discount ? "items-center" : "pt-2"
                  }`}
                >
                  <div className="flex flex-col justify-center">
                    {discount ? (
                      <>
                        <del className="text-red-500 text-xl">
                          €{product.price.toFixed(2)}
                        </del>
                        <span className="text-green-500 text-xl font-bold">
                          €{discountedPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
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
                    )}
                  </div>
                  <div className="flex justify-end mt-0.5">
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[100px]"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      {addingProductId === product._id
                        ? "Adding..."
                        : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
