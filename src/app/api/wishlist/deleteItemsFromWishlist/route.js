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

    const { productIds } = await req.json();

    const schema = Joi.array().items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    );

    const { error } = schema.validate(productIds);
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    if (productIds.length === 0) {
      return NextResponse.json({
        status: "success",
        message: "No products to remove from wishlist",
        deletedProductIds: [],
      });
    }

    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return NextResponse.json({
        status: "success",
        message: "No wishlist for user",
      });
    }

    // Check if all product IDs exist in the database
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      throw new customAPIError.BadRequestError(
        "One or more products not found"
      );
    }

    // Filter out products from the wishlist
    const updatedProducts = wishlist.products.filter(
      p => !productIds.includes(p.productId.toString())
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

    return NextResponse.json({
      state: "success",
      message: "Products removed from wishlist",
      deletedProductIds: productIds,
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
