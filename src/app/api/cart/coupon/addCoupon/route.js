import Coupon from "../../../../../../models/Coupon";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import checkAdmin from "../../../../../../utils/checkAdmin";
import customAPIError from "../../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    await connect();
    await checkAdmin(req);

    // Define Joi schema for coupon validation
    const schema = Joi.object({
      code: Joi.string()
        .regex(/^[a-z0-9]{8}/)
        .required(),
      discountPercentage: Joi.number().min(0).max(100).required(),
      expirationDate: Joi.date().required(),
    });

    const { code, discountPercentage, expirationDate } = await req.json();

    // Joi validation
    const { error } = schema.validate({
      code,
      discountPercentage,
      expirationDate,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new customAPIError.BadRequestError("Coupon code already exists");
    }

    // Create new coupon
    const coupon = new Coupon({ code, discountPercentage, expirationDate });
    await coupon.save();

    return NextResponse.json({
      status: "success",
      message: "Coupon created successfully",
      coupon,
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
