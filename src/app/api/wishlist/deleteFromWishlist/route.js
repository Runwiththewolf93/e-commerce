import Wishlist from "../../../../../models/WishList";
import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

export async function DELETE(req) {
  try {
    validateJWT(req);
    await connect();

    const { searchParams } = req.nextUrl;
    const productId = searchParams.get("productId");

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

    const product = await Product.findById(productId);
    if (!product) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return NextResponse.json({
        status: "success",
        message: "No wishlist for user",
      });
    }

    // Check if product is in wishlist
    const isProductInWishlist = wishlist.products.some(
      p => p.productId.toString() === productId
    );

    if (isProductInWishlist) {
      // Filter out the product from the products array
      const updatedProducts = wishlist.products.filter(
        p => p.productId.toString() !== productId
      );

      // Update the wishlist in the database with the new products array
      const updateResult = await Wishlist.findByIdAndUpdate(
        wishlist._id,
        { $set: { products: updatedProducts } },
        { new: true }
      );

      if (!updateResult) {
        throw new customAPIError.BadRequestError("Failed to update wishlist");
      }
    }

    return NextResponse.json({
      state: "success",
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: error.statusCode || 500 }
    );
  }
}
