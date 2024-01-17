import Orders from "../../../../../models/Orders";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";

/**
 * Retrieves orders based on the userId
 *
 * @param {Object} req - The request object.
 * @return {Promise} A promise that resolves to a JSON response containing the order.
 */
export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    const userId = req.user.id;

    const orders = await Orders.find({ userId });
    if (orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ status: "success", orders });
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
