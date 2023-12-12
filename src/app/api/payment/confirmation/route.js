import stripe from "stripe";
import connect from "../../../../../utils/db";
import validateJwt from "../../../../../utils/protect";
import { NextResponse } from "next/server";
import customAPIError from "../../errors";
import Joi from "joi";
import Payment from "../../../../../models/Payment";

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    validateJwt(req);
    await connect();
    const { sessionId } = await req.json();

    // format of the stripeId. cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u

    // Joi validation
    const { error } = Joi.string().required().validate(sessionId);
    if (error) {
      throw new customAPIError.BadRequestError("Invalid session ID");
    }

    const session = await Stripe.checkout.sessions.retrieve(sessionId);

    const paymentStatus = session.payment_status;
    const paymentData = {
      userId: req.user.id,
      orderId: session.metadata.orderId, // Adjust as needed
      stripeSessionId: sessionId,
      paymentStatus: paymentStatus,
      transactionId: session.payment_intent,
      amount: session.amount_total / 100,
    };

    // Find existing payment or create new one
    const existingPayment = await Payment.findOne({
      stripeSessionId: sessionId,
    });
    if (existingPayment) {
      // Update existing payment record with latest data
      existingPayment.set(paymentData);
      await existingPayment.save();
    } else {
      const newPayment = new Payment(paymentData);
      await newPayment.save();
    }

    return NextResponse.json({
      status: "success",
      message: `Payment ${paymentStatus}`,
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
