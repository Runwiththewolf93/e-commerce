import Cart from "../../../../../models/Cart";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";

export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    const userId = req.user.id;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({
        status: "success",
        message: "No cart found",
        cart: {},
      });
    }

    // Populate product details
    await cart.populate({
      path: "items.product",
      model: "Product",
      select: "name price stock discount images category",
    });

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
