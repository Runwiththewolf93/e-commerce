import Products from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import customAPIError from "../../errors";

export async function GET(req) {
  try {
    await connect();

    const products = await Products.find({});
    if (!products) {
      throw new customAPIError.NotFoundError("No products found");
    }

    return NextResponse.json(
      {
        products,
      },
      { status: 200 }
    );
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
