/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import CategoryBreadcrumb from "./components/CategoryBreadcrumb";
import CategoryDropdown from "./components/CategoryDropdown";
import CategoryRangeSlider from "./components/CategoryRangeSlider";
import CategorySkeleton from "./components/CategorySkeleton";
import CategoryError from "./components/CategoryError";
import CategoryPagination from "./components/CategoryPagination";
import CategoryProduct from "./components/CategoryProduct";
import { useCategoryData } from "./hooks/useCategoryData";
import { useProductFilteringAndSorting } from "./hooks/useProductFilteringAndSorting";
import { usePagination } from "./hooks/usePagination";

/**
 * Renders the Category component.
 *
 * @return {JSX.Element} The Category component.
 */
export default function Category() {
  const [triggerValue, setTriggerValue] = useState(null);
  const [lastCloseEnough, setLastCloseEnough] = useState(null);
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoadingCategory,
    productsCategory,
    errorCategory,
    link,
    category,
    minPrice,
    maxPrice,
    uniquePrices,
  } = useCategoryData();

  const { filteredProducts, totalPages } = useProductFilteringAndSorting(
    productsCategory,
    triggerValue,
    sortOption,
    setCurrentPage,
    minPrice
  );

  const { productsToDisplay } = usePagination(currentPage, filteredProducts);

  return (
    <div className="bg-white py-5">
      <CategoryBreadcrumb category={category} />
      <div className="grid grid-cols-3 pt-5 max-w-max mx-auto">
        <div>
          <h1 className="font-bold text-2xl">{category}</h1>
          <p className="italic pt-5">
            Browse our fine selection of {category} at your leisure:
          </p>
        </div>
        <div className="justify-self-center">
          <CategoryDropdown setSortOption={setSortOption} />
        </div>
        <div>
          <CategoryRangeSlider
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
          {isLoadingCategory || productsToDisplay.length === 0 ? (
            <CategorySkeleton />
          ) : errorCategory ? (
            <CategoryError errorCategory={errorCategory} link={link} />
          ) : (
            productsToDisplay.map(product => (
              <CategoryProduct
                key={product._id}
                product={product}
                link={link}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={newPage => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}
