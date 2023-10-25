/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../redux/slices/productSlice";
import Link from "next/link";
import { BreadCrumb, DropDown } from "../components/CategoryComponents";
import RangeSliderElement from "../components/CategoryComponents";

export default function Category() {
  const dispatch = useDispatch();
  const { isLoadingCategory, productsCategory, errorCategory } = useSelector(
    state => state.products
  );
  const pathname = usePathname();
  const link = pathname.split("/").pop();
  const category = productsCategory.map(p => p.category)[0];
  const minPrice = Math.min(...productsCategory.map(p => p.price));
  const maxPrice = Math.max(...productsCategory.map(p => p.price));
  const uniquePrices = [...new Set(productsCategory.map(p => p.price))];
  // console.log(
  //   "🚀 ~ file: page.js:18 ~ Category ~ productsCategory:",
  //   productsCategory
  // );

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [triggerValue, setTriggerValue] = useState(null);
  const [lastCloseEnough, setLastCloseEnough] = useState(null);

  useEffect(() => {
    if (!productsCategory.length) {
      dispatch(fetchCategory(link));
    }
  }, [link, dispatch, productsCategory.length]);

  // For testing purposes only
  const generateObjectID = () => {
    return Math.random().toString(16).substr(2, 24);
  };
  const duplicatedProducts = Array(15)
    .fill(productsCategory)
    .flat()
    .map(product => {
      return { ...product, _id: generateObjectID() };
    });
  // For testing purposes only

  useEffect(() => {
    if (triggerValue !== null) {
      console.log("when does this trigger? useEffect");
      const newFilteredProducts = duplicatedProducts.filter(product => {
        return product.price >= minPrice && product.price <= triggerValue;
      });
      setFilteredProducts(newFilteredProducts);
    } else {
      setFilteredProducts(duplicatedProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerValue]);

  return (
    <div className="bg-white pt-5">
      <BreadCrumb category={category} />
      <div className="grid grid-cols-3 pt-5 max-w-max mx-auto">
        <div>
          <h1 className="font-bold text-2xl">{category}</h1>
          <p className="italic pt-5">
            Browse our fine selection of {category} at your leisure:
          </p>
        </div>
        <div className="justify-self-center">
          <DropDown />
        </div>
        <div>
          <RangeSliderElement
            setTriggerValue={setTriggerValue}
            minPrice={minPrice}
            maxPrice={maxPrice}
            uniquePrices={uniquePrices}
            lastCloseEnough={lastCloseEnough}
            setLastCloseEnough={setLastCloseEnough}
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map(product => (
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
