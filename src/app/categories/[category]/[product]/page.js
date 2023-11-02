/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/slices/productSlice";
import { useSession } from "next-auth/react";
import { Spinner, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import ProductBreadcrumb from "../../components/ProductBreadcrumb";
import ProductImages from "../../components/ProductImages";
import StarRating from "../../../../subcomponents/StarRating";
import ProductCreateReview from "../../components/ProductCreateReview";

export default function Product() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();

  const pathSegments = pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  const { isLoadingProduct, product, errorProduct } = useSelector(
    state => state.products
  );

  useEffect(() => {
    if (!product || Object.keys(product).length === 0) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch, product]);

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
    return <Spinner />;
  }

  if (errorProduct) {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        {errorProduct}
      </Alert>
    );
  }

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
            {!productWithDiscount.discount ? (
              <p className="text-3xl tracking-tight text-gray-900">
                €{productWithDiscount.price}
              </p>
            ) : (
              <div className="flex items-center">
                <del className="text-3xl tracking-tight text-red-600 mr-3">
                  €{productWithDiscount.price}
                </del>
                <p className="text-3xl tracking-tight text-green-600">
                  €
                  {Math.round(
                    productWithDiscount.price *
                      (1 - productWithDiscount.discount.percentage / 100)
                  )}
                </p>
              </div>
            )}

            <div className="mt-5">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <StarRating aggregateRating={4.5} />
                </div>
                <p className="sr-only">4 out of 5 stars</p>
                <a
                  href="#"
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  117 reviews
                </a>
              </div>
            </div>

            <section>
              <ProductCreateReview
                productId={product._id}
                userId={session?.user?.id}
                jwt={session?.customJwt}
              />

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to cart
              </button>
            </section>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  <li className="text-gray-400">
                    <span className="text-gray-600">
                      Hand cut and sewn locally
                    </span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-600">
                      Dyed with our proprietary colors
                    </span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-600">
                      Pre-washed &amp; pre-shrunk
                    </span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-600">
                      Ultra-soft 100% cotton
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  The 6-Pack includes two black, two white, and two heather gray
                  Basic Tees. Sign up for our subscription service and be the
                  first to get new, exciting colors, like our upcoming
                  &quot;Charcoal Gray&quot; limited release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
