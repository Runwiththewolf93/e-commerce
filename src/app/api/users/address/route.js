import User from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

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

    // Find user by ID
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      throw new CustomAPIError.NotFoundError("User not found");
    }

    // Update address fields
    if (name) user.address.name = name;
    if (surname) user.address.surname = surname;
    if (street) user.address.street = street;
    if (streetNumber) user.address.streetNumber = streetNumber;
    if (city) user.address.city = city;
    if (municipality) user.address.municipality = municipality;
    if (zip) user.address.zip = zip;
    if (phoneNumber) user.address.phoneNumber = phoneNumber;

    await user.save();

    return NextResponse.json({ message: "User address successfully updated!" });
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
