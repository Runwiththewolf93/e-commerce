"use client";

import { useState, useEffect } from "react";
import { Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";
import ProductWishlist from "./ProductWishlist";
import ProductCart from "./ProductCart";

export default function ProductActions({ product, jwt }) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    if (jwt !== undefined) {
      setIsLoadingSession(false);
    }
  }, [jwt]);

  if (isLoadingSession) {
    return (
      <ProductSizeWrapper minHeight="200px" minWidth="350px">
        <Spinner size="xl" />
      </ProductSizeWrapper>
    );
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
    <div className="flex flex-col mt-12">
      <ProductCart product={product} jwt={jwt} />
      <ProductWishlist product={product} jwt={jwt} />
    </div>
  );
}