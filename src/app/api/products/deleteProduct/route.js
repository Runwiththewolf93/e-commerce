import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import checkAdmin from "../../../../../utils/checkAdmin";
import customAPIError from "../../errors";
import Joi from "joi";

export async function DELETE(req) {
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

    // Delete the product by name
    const result = await Product.deleteOne({
      name: { $regex: new RegExp(`^${productName}$`, "i") },
    });
    if (result.deletedCount === 0) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    return NextResponse.json({
      message: "Product deleted successfully!",
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
