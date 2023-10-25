import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import customAPIError from "../../errors";
import Joi from "joi";

const linkToCategory = link => {
  const categoryMap = {
    electronics: "Electronics",
    clothing: "Clothing",
    "home-garden": "Home & Garden",
    books: "Books",
    "health-beauty": "Health & Beauty",
    sports: "Sports",
    toys: "Toys",
    "cars-motorcycles": "Cars & Motorcycles",
    "groceries-food": "Groceries & Food",
    "office-supplies-stationery": "Office Supplies & Stationery",
  };

  return categoryMap[link] || null;
};

export async function POST(req) {
  try {
    await connect();

    const { link } = await req.json();

    const category = linkToCategory(link);
    if (!category) {
      throw new customAPIError.BadRequestError("Invalid category link");
    }

    const schema = Joi.object({
      category: Joi.string().required(),
    });

    // Validate the request data
    const { error } = schema.validate({
      category,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const products = await Product.find({ category });
    if (products.length === 0) {
      throw new customAPIError.NotFoundError("Products not found");
    }

    return NextResponse.json({ products }, { status: 200 });
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
