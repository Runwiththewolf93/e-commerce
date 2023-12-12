import Order from "../../../../../models/Orders";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

/**
 * PATCH function to update order model.
 *
 * @param {Object} req - the request object
 * @return {Object} the response object
 */
export async function PATCH(req) {
  try {
    validateJWT(req);
    await connect();

    const { orderId, address } = await req.json();

    const {
      name,
      surname,
      street,
      streetNumber,
      city,
      municipality,
      zip,
      phoneNumber,
    } = address;

    // Joi validation
    const schema = Joi.object({
      name: Joi.string().max(100).optional(),
      surname: Joi.string().max(100).optional(),
      street: Joi.string().max(100).optional(),
      streetNumber: Joi.number().optional(),
      city: Joi.string().max(100).optional(),
      municipality: Joi.string().max(100).optional(),
      zip: Joi.string().pattern(new RegExp("^[0-9]{5}$")).optional(),
      phoneNumber: Joi.string()
        .pattern(/^\+\d{11,12}$/)
        .messages({
          "string.pattern.base":
            "'phoneNumber' must be in the format of +381XXXXXXXX or +381XXXXXXXXX",
        })
        .optional(),
    });

    const { error } = schema.validate({
      name,
      surname,
      street,
      streetNumber,
      city,
      municipality,
      zip,
      phoneNumber,
    });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    let order;
    if (orderId) {
      // Find existing order by orderId
      order = await Order.findById(orderId);
      if (!order) {
        throw new CustomAPIError.NotFoundError("Order not found");
      }

      // Update the shipping address in the existing order
      order.shippingAddress = {
        name,
        surname,
        street,
        streetNumber,
        city,
        municipality,
        zip,
        phoneNumber,
      };
    } else {
      // Create a new order if orderId is not provided
      order = new Order({
        userId: req.user.id,
        shippingAddress: {
          name,
          surname,
          street,
          streetNumber,
          city,
          municipality,
          zip,
          phoneNumber,
        },
      });
    }

    await order.save();

    return NextResponse.json({
      message: "Order address successfully updated!",
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
