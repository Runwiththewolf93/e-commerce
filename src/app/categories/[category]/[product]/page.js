/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/slices/productSlice";
import { fetchReviews } from "../../../../redux/slices/reviewSlice";
import { useSession } from "next-auth/react";
import { Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import ProductBreadcrumb from "../../components/ProductBreadcrumb";
import ProductImages from "../../components/ProductImages";
import ProductCreateReview from "../../components/ProductCreateReview";
import ProductReviewList from "../../components/ProductReviewList";
import ProductAggregateRating from "../../components/ProductAggregateRating";
import ProductActions from "../../components/ProductActions";
import ProductDescription from "../../components/ProductDescription";

export default function Product() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();
  // console.log("🚀 ~ file: page.js:21 ~ Product ~ session:", session);

  const pathSegments = pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  // console.log("🚀 ~ file: page.js:26 ~ Product ~ id:", id);

  const { isLoadingProduct, product, errorProduct } = useSelector(
    state => state.products
  );
  // console.log("🚀 ~ file: page.js:30 ~ Product ~ product:", product);

  useEffect(() => {
    if (Object.keys(product).length === 0 || product._id !== id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, product, id]);

  const { reviews, isLoadingFetch } = useSelector(state => state.reviews);

  useEffect(() => {
    if (product && product._id && session?.user?.id && !reviews.length) {
      dispatch(
        fetchReviews({ productId: product._id, userId: session.user.id })
      );
    }
  }, [dispatch, product, session?.user?.id, reviews.length]);

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
  // console.log(
  //   "🚀 ~ file: page.js:30 ~ Product ~ productWithDiscount:",
  //   productWithDiscount
  // );
  // testing purposes

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (errorProduct) {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        {errorProduct}
      </Alert>
    );
  }

  const isLoadingProductReviewList =
    product && product._id && session?.user?.id;
  const isEverythingLoaded = isLoadingProductReviewList && !isLoadingFetch;

  return (
    <div className="bg-white">
      <div className="pt-6">
        <ProductBreadcrumb product={product} />
        {product && <ProductImages productImages={product.images} />}

        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            {!productWithDiscount?.discount ? (
              <p className="text-3xl tracking-tight text-gray-900">
                €{productWithDiscount?.price}
              </p>
            ) : (
              <div className="flex items-center">
                <del className="text-3xl tracking-tight text-red-600 mr-3">
                  €{productWithDiscount?.price}
                </del>
                <p className="text-3xl tracking-tight text-green-600">
                  €
                  {Math.round(
                    productWithDiscount?.price *
                      (1 - productWithDiscount?.discount?.percentage / 100)
                  )}
                </p>
              </div>
            )}

            <ProductAggregateRating productId={product?._id} />

            <section>
              <ProductCreateReview
                productId={product?._id}
                userId={session?.user?.id}
                jwt={session?.customJwt}
              />
              <ProductActions
                productId={product?._id}
                jwt={session?.customJwt}
              />
            </section>
          </div>

          <ProductDescription productDescription={product?.description} />

          {isEverythingLoaded ? (
            <ProductReviewList
              productId={product._id}
              userId={session.user.id}
              reviews={reviews}
            />
          ) : (
            <div className="flex justify-center">
              <Spinner size="xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798
