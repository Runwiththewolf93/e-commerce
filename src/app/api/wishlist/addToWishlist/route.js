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

    // Check for concurrent wishlist updates
    if (wishlistUpdateLocks[userId]) {
      throw new customAPIError.BadRequestError("Wishlist update in progress");
    }
    wishlistUpdateLocks[userId] = true;

    // Fetch and check product existence
    const product = await Product.findById(productId);
    if (!product) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    // Find or create wishlist
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
    await wishlist.populate({
      path: "products.productId",
      model: "Product",
      select: "name description price discount images",
    });

    // Release lock after successful update
    wishlistUpdateLocks[userId] = false;

    // Respond with the updated product data
    const addedProduct = wishlist.products.find(
      p => p.productId._id.toString() === productId
    );
    console.log("🚀 ~ file: route.js:74 ~ POST ~ addedProduct:", addedProduct);

    return NextResponse.json({
      state: "success",
      message: "Product added to wishlist",
      addedProduct: addedProduct.productId,
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
