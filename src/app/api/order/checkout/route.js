import stripe from "stripe";
import connect from "../../../../../utils/db";
import validateJwt from "../../../../../utils/protect";
import { NextResponse } from "next/server";
import Cart from "../../../../../models/Cart";
import customAPIError from "../../errors";
import Joi from "joi";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    validateJwt(req);
    await connect();

    // Define Joi schema for cartId validation
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

    const cart = await Cart.findById(cartId).populate({
      path: "items.product",
      model: "Product",
      select: "name price stock discount images category",
    });
    if (!cart) {
      throw new customAPIError.NotFoundError("Cart not found");
    }

    // Calculate discount ratio
    const discountRatio =
      cart.totalAmountDiscount < cart.totalAmount
        ? (cart.totalAmount - cart.totalAmountDiscount) / cart.totalAmount
        : 0;

    // Construct line items with discounted prices
    const lineItems = cart.items.map(item => {
      const discountedPrice = item.product.price * (1 - discountRatio);
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // Create Checkout Session with Stripe
    const session = await stripeInstance.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    });

    return NextResponse.json({ status: "success", sessionId: session.id });
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
