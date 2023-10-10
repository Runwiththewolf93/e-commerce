import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import checkAdmin from "../../../../../utils/checkAdmin";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    await connect();
    await checkAdmin(req);

    const { productName } = await req.json();

    const schema = Joi.object({
      productName: Joi.string().max(100).required(),
    });

    // Validate the request data
    const { error } = schema.validate({
      productName,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${productName}$`, "i") },
    });
    if (!product) {
      throw new customAPIError.NotFoundError("Product not found");
    }

    return NextResponse.json(
      {
        product,
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
