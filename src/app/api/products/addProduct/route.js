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

    const { name, description, price, stock, category, images } =
      await req.json();

    const schema = Joi.object({
      name: Joi.string().max(100).required(),
      description: Joi.string().max(1000).required(),
      price: Joi.number().greater(0).required(),
      stock: Joi.number().greater(0).required(),
      category: Joi.string()
        .valid(
          "Electronics",
          "Clothing",
          "Home & Garden",
          "Books",
          "Health & Beauty",
          "Sports",
          "Toys",
          "Cars & Motorcycles",
          "Groceries & Food",
          "Office Supplies & Stationery"
        )
        .required(),
      images: Joi.array()
        .items(
          Joi.object({
            url: Joi.string().required(),
            alt: Joi.string().max(100).required(),
          })
        )
        .min(1)
        .max(4)
        .required(),
    });

    // Validate the request data
    const { error } = schema.validate({
      name,
      description,
      price,
      stock,
      category,
      images,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      images,
    });

    // Save the product to the database
    await newProduct.save();

    return NextResponse.json({
      message: "Product added successfully!",
      product: newProduct,
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
