/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../redux/slices/productSlice";
import Link from "next/link";
import RangeSliderElement, {
  BreadCrumb,
  DropDown,
  CategorySkeleton,
  CategoryError,
  CategoryPagination,
} from "../components/CategoryComponents";

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

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [triggerValue, setTriggerValue] = useState(null);
  const [lastCloseEnough, setLastCloseEnough] = useState(null);
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(filteredProducts.length / 16)
  );

  useEffect(() => {
    if (!productsCategory.length) {
      dispatch(fetchCategory(link));
    }
  }, [link, dispatch, productsCategory.length]);

  // For testing purposes only
  const duplicatedProducts = useMemo(() => {
    const generateObjectID = () => {
      return Math.random().toString(16).substr(2, 24);
    };

    const formattedCurrentDate = new Date().toISOString();

    const duplicates = Array(15)
      .fill(productsCategory)
      .flat()
      .map(product => {
        const newProduct = { ...product, _id: generateObjectID() };

        // Set stock to 0 with a 20% chance
        if (Math.random() < 0.2) {
          newProduct.stock = 0;
        }

        // Set the createdAt date for all duplicates to the current date
        newProduct.createdAt = formattedCurrentDate;

        return newProduct;
      });

    // Combine the original and duplicated products
    return [...productsCategory, ...duplicates];
  }, [productsCategory]);
  // For testing purposes only

  useEffect(() => {
    let newFilteredProducts = [...duplicatedProducts];

    // Filtering
    if (triggerValue !== null) {
      newFilteredProducts = newFilteredProducts.filter(product => {
        return product.price >= minPrice && product.price <= triggerValue;
      });
    }

    // Sorting
    switch (sortOption) {
      case "Newest":
        newFilteredProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "PriceLowToHigh":
        newFilteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "PriceHighToLow":
        newFilteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(newFilteredProducts);
    setTotalPages(Math.ceil(newFilteredProducts.length / 16));
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerValue, sortOption]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const productsToDisplay = filteredProducts.slice(
    (currentPage - 1) * 16,
    currentPage * 16
  );

  return (
    <div className="bg-white py-5">
      <BreadCrumb category={category} />
      <div className="grid grid-cols-3 pt-5 max-w-max mx-auto">
        <div>
          <h1 className="font-bold text-2xl">{category}</h1>
          <p className="italic pt-5">
            Browse our fine selection of {category} at your leisure:
          </p>
        </div>
        <div className="justify-self-center">
          <DropDown setSortOption={setSortOption} />
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
          {isLoadingCategory ? (
            <CategorySkeleton />
          ) : errorCategory ? (
            <CategoryError />
          ) : (
            productsToDisplay.map(product => (
              <Link
                key={product._id}
                href={
                  product.stock === 0
                    ? "#"
                    : `/categories/${link}/${product._id}`
                }
                className="group"
                onClick={e => {
                  if (product.stock === 0) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black opacity-70 flex items-center justify-center">
                      <span className="text-white text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                {product.discount?.percentage ? (
                  <div className="mt-1">
                    <del className="text-red-500 text-lg">
                      €{product.price.toFixed(2)}
                    </del>
                    <span className="text-green-500 text-lg font-medium ml-2">
                      €
                      {(
                        product.price *
                        (1 - product.discount.percentage / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    €{product.price.toFixed(2)}
                  </p>
                )}
              </Link>
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
