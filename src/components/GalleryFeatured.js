/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductIds, setCurrentGallery } from "../redux/slices/productSlice";
import axios from "axios";
import GalleryBestsellersSkeleton from "../subcomponents/GalleryBestsellersSkeleton";
import GalleryError from "../subcomponents/GalleryError";
import Link from "next/link";

export default function GalleryFeatured() {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const dispatch = useDispatch();
  const { productIds, currentGallery } = useSelector(state => state.products);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/products/getProducts", {
        fetchedIds: productIds,
      });
      const productsWithRandomReviews = data.products.map(product => ({
        ...product,
        randomReviews: Array.from(
          { length: Math.floor(Math.random() * 10) + 1 },
          () => Math.floor(Math.random() * 5) + 1
        ),
      }));
      const productsWithAggregateRating = productsWithRandomReviews.map(
        product => {
          const totalRating = product.randomReviews.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const avgRating = (
            totalRating / product.randomReviews.length
          ).toFixed(1);
          return {
            ...product,
            aggregateRating: avgRating,
          };
        }
      );
      setFeatured(productsWithAggregateRating);
      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("newArrivals"));
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
    if (currentGallery === "featured") {
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

  // check if featured is working and if the component works
  console.log(featured);

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
