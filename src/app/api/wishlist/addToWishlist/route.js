import Wishlist from "../../../../../models/WishList";
import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

const wishlistUpdateLocks = {};

export async function POST(req) {
  try {
    validateJWT(req);
    await connect();

    const { productId } = await req.json();

    const schema = Joi.object({
      productId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    });

    const { error } = schema.validate({ productId });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const userId = req.user.id;

    if (wishlistUpdateLocks[userId]) {
      throw new customAPIError.BadRequestError("Wishlist update in progress");
    }
    wishlistUpdateLocks[userId] = true;

    const product = await Product.findById(productId);
    if (!product) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    // Find wishlist of user or create new one
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId }] });
    } else {
      // Check if product is in wishlist
      const isProductInWishList = wishlist.products.some(
        p => p.productId.toString() === productId
      );
      if (isProductInWishList) {
        throw new customAPIError.BadRequestError("Product already in wishlist");
      } else {
        wishlist.products.push({ productId });
      }
    }

    await wishlist.save();

    // Release lock after successful update
    wishlistUpdateLocks[userId] = false;

    return NextResponse.json({
      state: "success",
      message: "Product added to wishlist",
    });
  } catch (error) {
    // Release lock in case of error
    const userId = req.user.id;
    wishlistUpdateLocks[userId] = false;

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: error.statusCode || 500 }
    );
  }
}
