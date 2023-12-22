import Order from "../../../../../models/Orders";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

/**
 * PATCH function to update order model with order status or shipping.
 *
 * @param {Object} req - the request object
 * @return {Object} the response object
 */
export async function PATCH(req) {
  try {
    validateJWT(req);
    await connect();

    const { orderStatus, isDelivered, cartId } = await req.json();

    // Joi validation
    const schema = Joi.object({
      cartId: Joi.string()
        .regex(/^[a-z0-9]{24}/)
        .required(),
      orderStatus: Joi.string().valid(
        "Pending",
        "Processed",
        "Delivered",
        "Cancelled"
      ),
      isDelivered: Joi.boolean(),
    }).xor("orderStatus", "isDelivered");

    const { error } = schema.validate({
      orderStatus,
      isDelivered,
      cartId,
    });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    const order = await Order.findOne({ cartId });
    if (!order) {
      throw new CustomAPIError.NotFoundError("Order not found");
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    } else if (isDelivered) {
      order.isDelivered = isDelivered;
      order.deliveredAt = Date.now();
      order.orderStatus = "Delivered";
    }

    if (orderStatus === "Processed") {
      // Randomize delivery time between 10 and 60 days
      const randomDays = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
      const deliveryTimeInMs = randomDays * 24 * 60 * 60 * 1000;
      order.deliveryTime = new Date(Date.now() + deliveryTimeInMs);
    }

    await order.save();

    console.log("Just before returning response...");
    return NextResponse.json({
      message: "Order status successfully updated!",
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
