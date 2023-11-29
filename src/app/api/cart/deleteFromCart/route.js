import Cart from "../../../../../models/Cart";
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

    const { productId, quantity, removeCartItem } = await req.json();
    console.log("🚀 ~ file: route.js:22 ~ POST ~ productId:", productId);
    console.log("🚀 ~ file: route.js:22 ~ POST ~ quantity:", quantity);
    console.log(
      "🚀 ~ file: route.js:22 ~ DELETE ~ removeCartItem:",
      removeCartItem
    );

    // Build schema dynamically
    let schemaFields = {
      productId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    };

    if (removeCartItem !== undefined) {
      schemaFields.removeCartItem = Joi.boolean().required();
    } else {
      schemaFields.quantity = Joi.number().min(1).required();
    }

    const schema = Joi.object(schemaFields);

    // Joi validation
    const validationObject = { productId };
    if (removeCartItem !== undefined) {
      validationObject.removeCartItem = removeCartItem;
    } else {
      validationObject.quantity = quantity;
    }

    const { error } = schema.validate(validationObject);
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Check if product exists
    const product = await Product.findById(productId).select("+__v");
    if (!product) {
      throw new customAPIError.NotFoundError("Product not found");
    }

    const userId = req.user.id;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new customAPIError.NotFoundError("Cart not found");
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      throw new customAPIError.NotFoundError("Item not found in cart");
    }

    let updatedStock;
    if (removeCartItem) {
      // Remove item and update stock
      const itemQuantity = cart.items[itemIndex].quantity;
      cart.items.splice(itemIndex, 1);
      updatedStock = product.stock + itemQuantity;
    } else {
      // Decrease quantity and update stock
      cart.items[itemIndex].quantity -= quantity;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
      updatedStock = product.stock + quantity;
    }

    // Attempt to save the product with conditional check
    const updateResult = await Product.updateOne(
      {
        _id: productId,
        __v: product.__v,
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

    // Populate  details
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
    // console.log("🚀 ~ file: route.js:99 ~ POST ~ updatedItem:", updatedItem);

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
