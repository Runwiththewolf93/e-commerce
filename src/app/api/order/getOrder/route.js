import Order from "../../../../../models/Orders";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

/**
 * Retrieves an order based on the provided cartId.
 *
 * @param {Object} req - The request object.
 * @return {Promise} A promise that resolves to a JSON response containing the order.
 */
export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const cartId = searchParams.get("cartId");

    // Joi validation
    const schema = Joi.object({
      cartId: Joi.string()
        .regex(/^[a-z0-9]{24}/)
        .required(),
    });

    const { error } = schema.validate({ cartId });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    const order = await Order.findOne({ cartId }).populate("userId", "email");
    if (!order) {
      throw new CustomAPIError.NotFoundError("Order not found");
    }

    // Fetch the number of orders for the user
    const orderCount = await Order.countDocuments({ userId: order.userId._id });

    // Append the order count to the response
    const response = {
      order: {
        ...order.toObject(),
        userOrderCount: orderCount,
      },
    };

    return NextResponse.json(response);
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
