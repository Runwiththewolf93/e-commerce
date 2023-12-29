"use client";

import { useState, useEffect } from "react";
import { Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";
import ProductWishlist from "./ProductWishlist";
import ProductCart from "./ProductCart";
import ProductActionsSkeleton from "./subcomponents/ProductActionsSkeleton";

export default function ProductActions({ productId, jwt }) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    if (jwt !== undefined) {
      setIsLoadingSession(false);
    }
  }, [jwt]);

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

  // continue checking how the other error states work!
  return (
    <div className="flex flex-col mt-5">
      <ProductCart productId={productId} jwt={jwt} />
      <ProductWishlist productId={productId} jwt={jwt} />
    </div>
  );
}
