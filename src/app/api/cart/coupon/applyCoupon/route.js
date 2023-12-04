import Coupon from "../../../../../../models/Coupon";
import Cart from "../../../../../../models/Cart";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import validateJwt from "../../../../../../utils/protect";
import customAPIError from "../../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    validateJwt(req);
    await connect();

    // Define Joi schema for coupon validation
    const schema = Joi.object({
      code: Joi.string()
        .regex(/^[a-z0-9]{8}/)
        .required(),
      cartId: Joi.string()
        .regex(/^[a-z0-9]{24}/)
        .required(),
    });

    const { code, cartId } = await req.json();

    // Joi validation
    const { error } = schema.validate({
      code,
      discountPercentage,
      expirationDate,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const userId = req.user.id;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new customAPIError.NotFoundError("Cart not found");
    }
    if (cart.appliedCoupon) {
      throw new customAPIError.BadRequestError(
        "A coupon has already been applied to this cart"
      );
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon || coupon.expirationDate < new Date()) {
      throw new customAPIError.BadRequestError("Invalid coupon code");
    }
    if (coupon.usedBy.some(usage => usage.user.toString() === userId)) {
      throw new customAPIError.BadRequestError(
        "Coupon already used by this user"
      );
    }

    // figure out tomorrow - discountPercentage is not defined
    // Calculate discount and update cart
    const discount = (cart.totalAmount * coupon.discountPercentage) / 100;
    cart.totalAmountDiscount = cart.totalAmountDiscount - discount;
    cart.appliedCoupon = coupon._id;
    await cart.save();

    // Record coupon usage
    coupon.usedBy.push({ user: userId });
    await coupon.save();

    return NextResponse.json({
      status: "success",
      message: "Coupon created successfully",
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
