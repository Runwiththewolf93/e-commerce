import stripe from "stripe";
import connect from "../../../../../utils/db";
import validateJwt from "../../../../../utils/protect";
import { NextResponse } from "next/server";
import customAPIError from "../../errors";
import Joi from "joi";
import Payment from "../../../../../models/Payment";
import Order from "../../../../../models/Orders";

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    validateJwt(req);
    await connect();
    const { sessionId, cartId } = await req.json();

    // format of our sessionId:      cs_test_b1XOQxWRZEpgcoufVNK6GDpTxzO5LXyYN6znZ5DE054pyfHYY0rDNIZ1Gl
    // cs_test_b1i2sKmRINzUq7ruWzsNjiDpj078w1C0dlso7J8IViOtOFSk21WzWqV1rI

    const schema = Joi.object({
      sessionId: Joi.string().required(),
      cartId: Joi.string().required().length(24).required(),
    });

    // Joi validation
    const { error } = schema.validate({ sessionId, cartId });
    if (error) {
      throw new customAPIError.BadRequestError("Invalid session ID");
    }

    const order = await Order.findOne({ cartId });
    if (!order) {
      throw new customAPIError.NotFoundError("Order not found");
    }

    const session = await Stripe.checkout.sessions.retrieve(sessionId);
    console.log("🚀 ~ file: route.js:36 ~ POST ~ session:", session);

    const paymentStatus = session.payment_status;
    const paymentData = {
      userId: req.user.id,
      orderId: order._id,
      stripeSessionId: sessionId,
      paymentStatus: paymentStatus,
      transactionId: session.payment_intent,
      amount: session.amount_total / 100,
    };
    console.log("🚀 ~ file: route.js:48 ~ POST ~ paymentData:", paymentData);

    // If document is found update it, otherwise create a new one
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    // Find an existing payment and update it, or insert a new one
    const updatedOrNewPayment = await Payment.findOneAndUpdate(
      {
        stripeSessionId: sessionId,
      },
      { $set: paymentData },
      options
    );
    console.log(
      "🚀 ~ file: route.js:61 ~ POST ~ updatedOrNewPayment:",
      updatedOrNewPayment
    );

    if (!updatedOrNewPayment) {
      throw new customAPIError.BadRequestError(
        "Failed to create or update the payment record"
      );
    }

    return NextResponse.json({
      status: "success",
      message: `Payment ${updatedOrNewPayment.paymentStatus}`,
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
