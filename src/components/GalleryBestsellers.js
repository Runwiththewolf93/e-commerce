/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryBestSellersSkeleton from "../subcomponents/GalleryBestSellersSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";
import {
  fetchBestSellers,
  fetchFeatured,
  fetchNewArrivals,
} from "../redux/slices/productSlice";

export default function GalleryBestSellers() {
  const dispatch = useDispatch();
  const { bestSellers, isLoading, error, currentGallery } = useSelector(
    state => state.products
  );

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

  if (isLoading) {
    return <GalleryBestSellersSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  console.log(bestSellers);

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Bestsellers</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {bestSellers.map(product => {
          const discount = product.discount?.percentage;
          const discountedPrice = product.price * ((100 - discount) / 100);
          return (
            <Link key={product._id} href="#">
              <div className="relative w-64">
                {product.discount?.percentage ? (
                  <div className="absolute bg-red-500 text-white text-xs font-bold rounded-full p-2 z-10">
                    -{product.discount?.percentage}%
                  </div>
                ) : null}
                <div className="card card-compact w-64 bg-base-100 shadow-xl">
                  <figure className="relative h-32 w-full">
                    <div className="absolute inset-0 bg-gray-300">
                      <img
                        className="absolute inset-0 object-cover w-full h-full"
                        src={product.images[0]?.url}
                        alt={product.images[0]?.alt}
                      />
                    </div>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title truncate">{product.name}</h2>
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
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
