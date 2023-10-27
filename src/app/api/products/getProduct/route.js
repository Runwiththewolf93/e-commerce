import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import checkAdmin from "../../../../../utils/checkAdmin";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    await connect();

    const { productName, search = false } = await req.json();

    // Early return if productName is empty and search is true
    if (search && !productName.trim()) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    if (!search) {
      await checkAdmin(req);
    }

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

    let product = null;
    let products = null;

    if (!search) {
      console.log("🚀 ~ file: route.js:13 ~ POST ~ productName:", productName);
      product = await Product.findOne({
        name: { $regex: new RegExp(`${productName}`, "i") },
      });
      if (!product) {
        throw new customAPIError.NotFoundError("Product not found");
      }
    }

    if (search) {
      products = await Product.find({
        name: { $regex: new RegExp(`${productName}`, "i") },
      })
        .sort({ name: 1 })
        .limit(5);
      if (products.length === 0) {
        return NextResponse.json(
          { products: [], message: "No products found" },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(search ? { products } : { product }, {
      status: 200,
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
