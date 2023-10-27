import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import checkAdmin from "../../../../../utils/checkAdmin";
import customAPIError from "../../errors";
import Joi from "joi";

export async function PATCH(req) {
  try {
    await connect();
    await checkAdmin(req);

    const { name, description, price, stock, category, discount, images } =
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
      discount: Joi.object({
        percentage: Joi.number().min(0).max(100),
        startDate: Joi.date(),
        endDate: Joi.date().greater(Joi.ref("startDate")),
      }).optional(),
      images: Joi.array()
        .items(
          Joi.object({
            url: Joi.string().required(),
            alt: Joi.string().max(100).required(),
            _id: Joi.string().optional(),
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
      discount,
      images,
    });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    // Find existing product by name
    const existingProduct = await Product.findOne({ name });
    if (!existingProduct) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    // Update the product properties
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.stock = stock;
    existingProduct.category = category;
    existingProduct.discount = discount;
    existingProduct.images = images;

    // Save the updated product
    await existingProduct.save();

    return NextResponse.json({
      message: "Product updated successfully!",
      product: existingProduct,
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
