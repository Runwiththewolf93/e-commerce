"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlistUser } from "../../../redux/slices/wishlistSlice";
import { Card, Button, Alert, Spinner, Breadcrumb } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import WishlistCheck from "./WishlistCheck";
import { HiHome } from "react-icons/hi";

export default function Wishlist({ session }) {
  const dispatch = useDispatch();
  const {
    isLoadingWishlistUser,
    wishlist,
    messageWishlistUser,
    errorWishlistUser,
    messageWishlist,
    messageWishlistDelete,
  } = useSelector(state => state.wishlist);
  console.log("🚀 ~ file: page.js:17 ~ Wishlist ~ wishlist:", wishlist);

  useEffect(() => {
    if (!wishlist || Object.keys(wishlist).length === 0) {
      dispatch(getWishlistUser(session.customJwt));
    }
  }, [dispatch, session.customJwt, wishlist]);

  const products = wishlist?.products;

  if (isLoadingWishlistUser) {
    return <Spinner />;
  }

  return (
    <div className="p-3">
      <Breadcrumb aria-label="Wishlist breadcrumb" className="mb-3">
        <Breadcrumb.Item href="/" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/profile">Profile</Breadcrumb.Item>
        <Breadcrumb.Item>Wishlist</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="font-bold text-2xl">Wishlist</h1>
      {messageWishlistUser && <Alert color="info">{messageWishlistUser}</Alert>}
      <div className="flex flex-wrap justify-start -mx-2">
        {products?.map(productItem => {
          const product = productItem?.productId;

          const discountedPrice = product.discount
            ? product.price -
              product.price * ((100 - product.discount.percentage) / 100)
            : product.price;

          return (
            <div key={product._id} className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
              <Card className="max-w-sm">
                <div className="h-64 w-full overflow-hidden relative">
                  {product.discount?.percentage ? (
                    <div className="absolute bg-red-500 text-white text-xs font-bold rounded-full p-2 z-10">
                      -{product.discount?.percentage}%
                    </div>
                  ) : null}
                  <WishlistCheck
                    productId={product._id}
                    jwt={session?.customJwt}
                  />
                  <Image
                    width={500}
                    height={500}
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    className="object-cover object-center w-full h-full rounded-2xl"
                  />
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {product.name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-sm">
                  {product?.discount ? (
                    <>
                      <del className="text-red-500 text-base">
                        Original Price: €{product.price.toFixed(2)}
                      </del>
                      <div className="text-green-500 text-base">
                        Discounted Price: €{discountedPrice.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-transparent text-base">
                        Discounted Price: €{product.price.toFixed(2)}
                      </div>
                      <div className="text-blue-500 text-base">
                        Price: €{product.price.toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
                <Link href="/cart">
                  <Button color="blue" className="w-full">
                    <span className="text-base">Add to cart</span>
                  </Button>
                </Link>
                {errorWishlistUser && (
                  <Alert color="failure">{errorWishlistUser}</Alert>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
