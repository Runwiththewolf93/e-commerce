import Cart from "../../../../../models/Cart";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

export async function DELETE(req) {
  try {
    validateJWT(req);
    await connect();

    const { cartId } = await req.json();

    // Joi validation
    const schema = Joi.object({
      cartId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    });

    const { error } = schema.validate({ cartId });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new customAPIError.NotFoundError("Cart not found");
    }

    await Cart.findByIdAndDelete(cartId);

    return NextResponse.json({
      status: "success",
      message: "Cart removed successfully",
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
