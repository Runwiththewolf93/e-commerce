import Product from "../../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import customAPIError from "../../../errors";
import Joi from "joi";

export async function GET(req) {
  try {
    await connect();

    // Extract the id from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];
    console.log("🚀 ~ file: route.js:15 ~ GET ~ id:", id);

    // Validate the id using Joi
    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    });

    const { error } = schema.validate({ id });
    if (error) {
      throw new customAPIError.BadRequestError("Invalid Product ID");
    }

    // Fetch the product using mongoose
    const product = await Product.findById(id);
    if (!product) {
      throw new customAPIError.NotFoundError("Product not found");
    }

    // Return the fetched product
    return NextResponse.json({ product }, { status: 200 });
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
