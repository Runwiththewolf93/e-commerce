"use client";

import { useState, useEffect } from "react";
import { Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";
import ProductWishlist from "./ProductWishlist";
import ProductCart from "./ProductCart";
import ProductActionsSkeleton from "./subcomponents/ProductActionsSkeleton";

/**
 * Generates the product actions for the given product.
 *
 * @param {object} param - The parameter object.
 * @param {string} param.productId - The ID of the product.
 * @param {string} param.jwt - The JWT token for authentication.
 * @param {boolean} param.isAuthenticated - Indicates if the user is authenticated.
 * @return {JSX.Element} The JSX element representing the product actions.
 */
export default function ProductActions({ productId, jwt, isAuthenticated }) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    if (jwt !== undefined || !isAuthenticated) {
      setIsLoadingSession(false);
    }
  }, [jwt, isAuthenticated]);

  if (isLoadingSession) {
    return <ProductActionsSkeleton />;
  }

  if (!jwt) {
    return (
      <ProductSizeWrapper minHeight="200px" minWidth="350px">
        <Alert color="info" className="mt-3">
          You are not logged in! Please log in to add items to cart or wishlist.
          Click{" "}
          <Link href="/register" className="underline">
            here
          </Link>{" "}
          to create an account, or{" "}
          <Link href="/login" className="underline">
            here
          </Link>{" "}
          to login.
        </Alert>
      </ProductSizeWrapper>
    );
  }

  return (
    <div className="flex flex-col mt-5">
      <ProductCart productId={productId} jwt={jwt} />
      <ProductWishlist productId={productId} jwt={jwt} />
    </div>
  );
}
