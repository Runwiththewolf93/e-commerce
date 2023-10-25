/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../redux/slices/productSlice";
import Link from "next/link";
import { BreadCrumb, DropDown } from "../components/CategoryComponents";

export default function Category() {
  const dispatch = useDispatch();
  const { isLoadingCategory, productsCategory, errorCategory } = useSelector(
    state => state.products
  );

  // For testing purposes only
  const generateObjectID = () => {
    return Math.random().toString(16).substr(2, 24);
  };

  // Duplicate the products 15 times
  const duplicatedProducts = Array(15)
    .fill(productsCategory)
    .flat()
    .map((product, index) => {
      return { ...product, _id: generateObjectID() };
    });

  const pathname = usePathname();
  const link = pathname.split("/").pop();
  const category = productsCategory.map(p => p.category)[0];

  useEffect(() => {
    if (!productsCategory.length) {
      dispatch(fetchCategory(link));
    }
  }, [link, dispatch, productsCategory.length]);

  return (
    <div className="bg-white pt-5">
      <BreadCrumb category={category} />
      <div className="grid grid-cols-2 ml-3 pt-5 max-w-max">
        <div>
          <DropDown />
        </div>
        <div>
          <h1 className="font-bold text-2xl">{category}</h1>
          <p className="italic pt-5 ml-3">
            Browse our fine selection of {category} at your leisure:
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {duplicatedProducts.map(product => (
            <Link
              key={product._id}
              href={`/categories/${link}/${product._id}`}
              className="group"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                €{product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// See tomorrow about the filters
