/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/slices/productSlice";
import { fetchReviews } from "../../../../redux/slices/reviewSlice";
import { useSession } from "next-auth/react";
import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductImages from "./components/ProductImages";
import ProductCreateReview from "./components/ProductCreateReview";
import ProductReviewList from "./components/ProductReviewList";
import ProductAggregateRating from "./components/ProductAggregateRating";
import ProductActions from "./components/ProductActions";
import ProductDescription from "./components/ProductDescription";
import ProductPrice from "./components/ProductPrice";
import ProductReviewListSkeleton from "./components/subcomponents/ProductReviewListSkeleton";
import ProductError from "./components/ProductError";
import ProductSpinner from "./components/ProductSpinner";

/**
 * Renders the Product component.
 *
 * @returns {JSX.Element} The rendered Product component.
 */
export default function Product() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const jwt = session?.customJwt;
  const userId = session?.user?.id;

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  const { isLoadingProduct, product, errorProduct } = useSelector(
    state => state.products
  );

  useEffect(() => {
    if (Object.keys(product).length === 0 || product._id !== id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, product, id]);

  const { reviews, isLoadingFetch } = useSelector(state => state.reviews);

  useEffect(() => {
    // Check if product is loaded
    if (product && product._id) {
      // If user is authenticated, fetch reviews only when userId is available
      if (isAuthenticated && userId) {
        dispatch(fetchReviews({ productId: product._id, userId }));
      }
      // If user is not authenticated, fetch reviews without userId
      else if (!isAuthenticated) {
        dispatch(fetchReviews({ productId: product._id }));
      }
    }
  }, [dispatch, product, isAuthenticated, userId]);

  // testing purposes
  const productWithDiscount = { ...product };
  if (productWithDiscount && productWithDiscount.discount) {
    productWithDiscount.discount = {
      ...productWithDiscount.discount,
      percentage: 20,
    };
  } else {
    productWithDiscount.discount = { percentage: 20 };
  }
  // testing purposes

  if (isLoadingProduct) {
    return <ProductSpinner />;
  }

  if (errorProduct) {
    return (
      <ProductError errorMessage={errorProduct} productId={product?._id} />
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <ProductBreadcrumb product={product} />
        <ProductImages productImages={product.images} />

        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <ProductPrice productWithDiscount={productWithDiscount} />
            <ProductAggregateRating productId={product?._id} />

            <section>
              <ProductCreateReview
                productId={product?._id}
                userId={userId}
                jwt={jwt}
                isAuthenticated={isAuthenticated}
              />
              <ProductActions
                productId={product?._id}
                jwt={jwt}
                isAuthenticated={isAuthenticated}
              />
            </section>
          </div>

          <ProductDescription productDescription={product?.description} />

          {!isLoadingFetch ? (
            <ProductReviewList
              productId={product._id}
              userId={userId}
              reviews={reviews}
            />
          ) : (
            <ProductReviewListSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}

// http://localhost:3000/categories/clothing/65256fd44e6d44d34b3767b3
