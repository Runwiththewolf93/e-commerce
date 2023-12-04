import Coupon from "../../../../../../models/Coupon";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import checkAdmin from "../../../../../../utils/checkAdmin";
import customAPIError from "../../../errors";
import Joi from "joi";

export async function DELETE(req) {
  try {
    await connect();
    await checkAdmin(req);

    const { code } = await req.json();

    // Define Joi schema for coupon code validation
    const schema = Joi.object({
      code: Joi.string()
        .regex(/^[a-z0-9]{8}$/)
        .required(),
    });

    // Joi validation
    const { error } = schema.validate({ code });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Attempt to delete the coupon
    const deletedCoupon = await Coupon.findOneAndDelete({ code });
    if (!deletedCoupon) {
      throw new customAPIError.NotFoundError("Coupon not found");
    }

    return NextResponse.json({
      status: "success",
      message: "Coupon deleted successfully",
      deletedCoupon,
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
