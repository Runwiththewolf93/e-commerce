import Products from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import customAPIError from "../../errors";
import Joi from "joi";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connect();

    const { fetchedIds = [] } = await req.json();
    console.log("🚀 ~ file: route.js:12 ~ POST ~ fetchedIds:", fetchedIds);

    const schema = Joi.object({
      fetchedIds: Joi.array().items(Joi.string()),
    });

    // Validate the request data
    const { error } = schema.validate({
      fetchedIds,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const objectIds = fetchedIds.map(id => new mongoose.Types.ObjectId(id));

    // Fetch 10 random products that are not in the already fetched IDs
    const products = await Products.aggregate([
      { $match: { _id: { $nin: objectIds } } },
      { $sample: { size: 10 } },
    ]);
    console.log(
      "🚀 ~ file: route.js:31 ~ POST ~ products:",
      products.map(p => p._id)
    );

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
