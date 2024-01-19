/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryBestSellersSkeleton from "../subcomponents/GalleryBestSellersSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";
import {
  fetchBestSellers,
  fetchFeatured,
  fetchNewArrivals,
} from "../redux/slices/productSlice";
import { categoryToLink } from "../../utils/helper";
import { addToCart, openCartOverlay } from "../redux/slices/cartSlice";
import { useSession } from "next-auth/react";
import { useCloseCartOnRouteChange } from "../app/hooks/useCloseCartOnRouteChange";

/**
 * Renders the GalleryBestSellers component.
 *
 * @returns {JSX.Element} The rendered GalleryBestSellers component.
 */
export default function GalleryBestSellers() {
  const dispatch = useDispatch();
  const { bestSellers, isLoading, error, currentGallery } = useSelector(
    state => state.products
  );
  const { data: session } = useSession();
  const jwt = session?.customJwt;
  const [addingProductId, setAddingProductId] = useState(null);
  useCloseCartOnRouteChange();
  // console.log(
  //   "🚀 ~ file: GalleryBestSellers.js:18 ~ GalleryBestSellers ~ bestSellers:",
  //   bestSellers
  // );

  useEffect(() => {
    if (currentGallery === "bestSellers") {
      dispatch(fetchBestSellers()).then(resultAction => {
        if (fetchBestSellers.fulfilled.match(resultAction)) {
          const newIds = resultAction.payload.map(p => p._id);
          dispatch(fetchFeatured(newIds)).then(resultAction => {
            if (fetchFeatured.fulfilled.match(resultAction)) {
              const newIds = resultAction.payload.map(p => p._id);
              dispatch(fetchNewArrivals(newIds));
            }
          });
        }
      });
    }
  }, [dispatch, currentGallery]);

  const handleAddToCart = async productId => {
    setAddingProductId(productId);
    await dispatch(addToCart({ productId, quantity: 1, jwt })).unwrap();
    setAddingProductId(null);
    dispatch(openCartOverlay());
  };

  if (isLoading) {
    return <GalleryBestSellersSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Bestsellers</h1>
      <button onClick={() => dispatch(openCartOverlay())}>Open overlay</button>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {bestSellers.map(product => {
          const discount = product.discount?.percentage;
          const discountedPrice = product.price * ((100 - discount) / 100);
          return (
            <div className="relative w-64" key={product._id}>
              {product.discount?.percentage ? (
                <div className="absolute bg-red-500 text-white text-xs font-bold rounded-full p-2 z-10">
                  -{product.discount?.percentage}%
                </div>
              ) : null}
              <div className="card card-compact w-64 bg-base-100 shadow-xl">
                <figure className="relative h-32 w-full">
                  <div className="absolute inset-0 bg-gray-300">
                    <Link
                      href={`/categories/${categoryToLink(product.category)}/${
                        product._id
                      }`}
                    >
                      <img
                        className="absolute inset-0 object-cover w-full h-full"
                        src={product.images[0]?.url}
                        alt={product.images[0]?.alt}
                      />
                    </Link>
                  </div>
                </figure>
                <div className="card-body">
                  <Link
                    href={`/categories/${categoryToLink(product.category)}/${
                      product._id
                    }`}
                  >
                    <h2 className="card-title truncate">{product.name}</h2>
                  </Link>
                  <div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 max-w-max">
                      Fast delivery
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 max-w-max">
                      Free shipping
                    </span>
                  </div>
                  <p className="line-clamp-2">{product.description}</p>
                  <div className="text-sm">
                    {discount ? (
                      <>
                        <del className="text-red-500">
                          Original Price: €{product.price.toFixed(2)}
                        </del>
                        <div className="text-green-500">
                          Discounted Price: €{discountedPrice.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-transparent">
                          Discounted Price: €{product.price.toFixed(2)}
                        </div>
                        <div className="text-blue-500">
                          Price: €{product.price.toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[100px] w-full"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    {addingProductId === product._id
                      ? "Adding..."
                      : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
