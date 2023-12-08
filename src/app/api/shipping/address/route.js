import Shipping from "../../../../../models/Shipping";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";
import mongoose from "mongoose";

/**
 * PATCH function to update user model.
 *
 * @param {Object} req - the request object
 * @return {Object} the response object
 */
export async function PATCH(req) {
  try {
    validateJWT(req);
    await connect();

    const {
      name,
      surname,
      street,
      streetNumber,
      city,
      municipality,
      zip,
      phoneNumber,
    } = await req.json();

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

    // Find or create Shipping document for the user
    let shipping = await Shipping.findOne({ _id: req.user.id });
    if (!shipping) {
      // we are using placeholder values here, CHANGE LATER
      shipping = new Shipping({
        userId: req.user.id,
        orderId: new mongoose.Types.ObjectId(),
        trackingNumber: "Z 999 AA1 01 2345 6784",
        carrier: "DHL",
        estimatedDelivery: new Date(),
        shippingStatus: "Pending",
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
    } else {
      // Update address fields
      shipping.shippingAddress = {
        name,
        surname,
        street,
        streetNumber,
        city,
        municipality,
        zip,
        phoneNumber,
      };
    }

    await shipping.save();
    console.log("🚀 ~ file: route.js:74 ~ PATCH ~ shipping:", shipping);

    return NextResponse.json({
      message: "Shipping address successfully updated!",
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
