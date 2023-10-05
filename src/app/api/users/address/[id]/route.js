import User from "../../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import validateJWT from "../../../../../../utils/protect";
import CustomAPIError from "../../../errors";
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
    console.log(req.user);

    const { street, city, state, zip, country } = await req.json();

    // Joi validation
    const schema = Joi.object({
      street: Joi.string().max(100).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      zip: Joi.string().pattern(new RegExp("^[0-9]{5}$")).optional(),
      country: Joi.string().max(100).optional(),
    });

    const { error } = schema.validate({ street, city, state, zip, country });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    // Find user by ID
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      throw new CustomAPIError.NotFoundError("User not found");
    }

    // Update address fields
    if (street) user.address.street = street;
    if (city) user.address.city = city;
    if (state) user.address.state = state;
    if (zip) user.address.zip = zip;
    if (country) user.address.country = country;

    await user.save();

    return NextResponse.json({ message: "Address successfully updated!" });
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
