/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductIds, setCurrentGallery } from "../redux/slices/productSlice";
import axios from "axios";
import GalleryBestsellersSkeleton from "../subcomponents/GalleryBestsellersSkeleton";
import GalleryError from "../subcomponents/GalleryError";

export default function GalleryBestsellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const dispatch = useDispatch();
  const { productIds, currentGallery } = useSelector(state => state.products);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/products/getProducts", {
        type: "bestsellers",
        fetchedIds: productIds,
      });
      const productsWithRandomDiscount = data.products.map(product => ({
        ...product,
        randomDiscount: Math.floor(Math.random() * 50) + 1,
      }));
      setBestSellers(productsWithRandomDiscount);
      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("featured"));
      setError(null);
      setRetryCount(0);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setRetryCount(prevCount => prevCount + 1);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, productIds]);

  useEffect(() => {
    if (currentGallery === "bestsellers") {
      fetchData();
    }
  }, [currentGallery, fetchData]);

  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        fetchData();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, fetchData]);

  if (isLoading) {
    return <GalleryBestsellersSkeleton />;
  }

  if (error) {
    return <GalleryError error={error} />;
  }

  // console.log("🚀 ~ file: GalleryBestsellers.js:70 ~ GalleryBestsellers ~ bestSellers:", bestSellers)

  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Our Bestsellers</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {bestSellers.map(product => {
          const discount = product.randomDiscount;
          const discountedPrice = product.price * ((100 - discount) / 100);
          return (
            <div key={product._id} className="relative w-64">
              <div className="absolute bg-red-500 text-white text-xs font-bold rounded-full p-2 z-10">
                -{discount}%
              </div>
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
                    <del className="text-red-500">
                      Original Price: €{product.price.toFixed(2)}
                    </del>
                    <div className="text-green-500">
                      Discounted Price: €{discountedPrice.toFixed(2)}
                    </div>
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
