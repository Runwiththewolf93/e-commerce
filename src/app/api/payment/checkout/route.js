import stripe from "stripe";
stripe(process.env.STRIPE_SECRET_KEY);
import connect from "../../../../../utils/db";
import validateJwt from "../../../../../utils/protect";
import Cart from "../../../../../models/Cart";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
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

    const cart = await Cart.findById(cartId).populate({
      path: "items.product",
      model: "Product",
      select: "name price stock discount images category",
    });
    if (!cart) {
      throw new customAPIError.NotFoundError("Cart not found");
    }

    // Construct line items from cart
    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    });

    return NextResponse.json({ sessionId: session.id });
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
