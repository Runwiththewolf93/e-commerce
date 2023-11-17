import Cart from "../../../../../models/Cart";
import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    validateJWT(req);
    await connect();

    const schema = Joi.object({
      productId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      quantity: Joi.number().min(1).required(),
    });

    const { productId, quantity } = await req.json();

    // Joi validation
    const { error } = schema.validate({ productId, quantity });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Check if product exists
    const product = await Product.findById(productId).select("+__v");
    if (!product) {
      throw new customAPIError.NotFoundError("Product not found");
    }

    // Check stock availability
    if (quantity > product.stock) {
      throw new customAPIError.BadRequestError("Insufficient stock available");
    }

    const userId = req.user.id;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Add or update item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    // Prepare update for product
    const updatedStock = product.stock - quantity;
    console.log("🚀 ~ file: route.js:56 ~ POST ~ updatedStock:", updatedStock);
    const originalVersion = product.__v;
    console.log(
      "🚀 ~ file: route.js:58 ~ POST ~ originalVersion:",
      originalVersion
    );

    if (itemIndex > -1) {
      // Increase quantity in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }

    // Attempt to save the product with conditional check
    const updateResult = await Product.updateOne(
      {
        _id: productId,
        __v: originalVersion,
      },
      { stock: updatedStock, $inc: { __v: 1 } }
    );
    console.log("🚀 ~ file: route.js:79 ~ POST ~ updateResult:", updateResult);

    if (updateResult.modifiedCount === 0) {
      throw new customAPIError.BadRequestError(
        "Product was updated concurrently. Please try again."
      );
    }

    // Save the updated cart
    await cart.save();

    // Populate product details
    await cart.populate({
      path: "items.product",
      model: "Product",
      select: "name price stock discount images category",
    });
    console.log("🚀 ~ file: route.js:94 ~ POST ~ cart:", cart);

    // Find the updated item to return
    const updatedItem = cart.items.find(
      item => item.product._id.toString() === productId
    );
    console.log("🚀 ~ file: route.js:100 ~ POST ~ updatedItem:", updatedItem);

    return NextResponse.json({
      status: "success",
      cart,
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
