import Coupon from "../../../../../../models/Coupon";
import Cart from "../../../../../../models/Cart";
import Product from "../../../../../../models/Products";
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
      cartId,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const userId = req.user.id;

    let cart = await Cart.findById(cartId);
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

    // Calculate discount and update cart
    const discount = (cart.totalAmount * coupon.discountPercentage) / 100;
    const newTotalAmountDiscount = cart.totalAmountDiscount - discount;

    await Cart.updateOne(
      { _id: cart._id },
      {
        $set: {
          totalAmountDiscount: newTotalAmountDiscount.toFixed(2),
          appliedCoupon: coupon._id,
        },
      }
    );

    // Record coupon usage
    coupon.usedBy.push({ user: userId });
    await coupon.save();
    console.log("🚀 ~ file: route.js:81 ~ POST ~ coupon:", coupon);

    // Fetch the updated cart
    cart = await Cart.findById(cart._id);

    // Manually populate product details
    const populatedCartItems = await Promise.all(
      cart.items.map(async item => {
        const product = await Product.findById(item.product).select(
          "name price stock discount images category"
        );
        return { ...item.toObject(), product };
      })
    );
    console.log(
      "🚀 ~ file: route.js:79 ~ DELETE ~ populatedCartItems:",
      populatedCartItems
    );

    const populatedCart = {
      ...cart.toObject(),
      items: populatedCartItems,
    };
    console.log(
      "🚀 ~ file: route.js:70 ~ DELETE ~ populatedCart:",
      populatedCart
    );

    return NextResponse.json({
      status: "success",
      message: "Coupon created successfully",
      cart: populatedCart,
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
