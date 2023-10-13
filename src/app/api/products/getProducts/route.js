import Products from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    await connect();

    const { type, fetchedIds = [] } = await req.json();

    const schema = Joi.object({
      type: Joi.string().max(100).required(),
      fetchedIds: Joi.array().items(Joi.string()),
    });

    // Validate the request data
    const { error } = schema.validate({
      type,
      fetchedIds,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Fetch 10 random products that are not in the already fetched IDs
    const products = await Products.aggregate([
      { $match: { _id: { $nin: fetchedIds } } },
      { $sample: { size: 10 } },
    ]);

    if (!products || products.length === 0) {
      throw new customAPIError.NotFoundError("Products not found");
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
