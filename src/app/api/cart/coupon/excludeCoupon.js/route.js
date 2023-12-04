import Coupon from "../../../../../../models/Coupon";
import Cart from "../../../../../../models/Cart";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import validateJwt from "../../../../../../utils/protect";
import customAPIError from "../../../errors";
import Joi from "joi";

export async function DELETE(req) {
  try {
    validateJwt(req);
    await connect();

    // Define Joi schema for coupon validation
    const schema = Joi.object({
      cartId: Joi.string()
        .regex(/^[a-z0-9]{24}/)
        .required(),
    });

    const { cartId } = await req.json();

    // Joi validation
    const { error } = schema.validate({
      cartId,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const userId = req.user.id;
    const cart = await Cart.findById(cartId);

    if (!cart || !cart.appliedCoupon) {
      throw new customAPIError.NotFoundError("No coupon applied to this cart");
    }

    // Revert discount
    const coupon = await Coupon.findById(cart.appliedCoupon);
    const discount = (cart.totalAmount * coupon.discountPercentage) / 100;
    cart.totalAmountDiscount += discount; // Reverting the discount

    // Remove user from coupon's usedBy array
    coupon.usedBy = coupon.usedBy.filter(
      usage => usage.user.toString() !== userId
    );
    await coupon.save();

    // Remove applied coupon from cart
    cart.appliedCoupon = null;
    await cart.save();

    return NextResponse.json({
      status: "success",
      message: "Coupon removed successfully",
      cart,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

// apply this properly and test in frontend
