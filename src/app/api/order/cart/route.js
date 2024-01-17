import Order from "../../../../../models/Orders";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

/**
 * Updates the items, amount, totalAmount, shippingCost of an order
 *
 * @param {object} req - The request object.
 * @return {object} The updated order address or an error message.
 */
export async function PATCH(req) {
  try {
    validateJWT(req);
    await connect();

    const { cartObject } = await req.json();
    console.log("🚀 ~ file: route.js:20 ~ PATCH ~ cartObject:", cartObject);

    // Joi validation
    const imageSchema = Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().required(),
      _id: Joi.string().hex().length(24).required(),
    });

    const discountSchema = Joi.object({
      percentage: Joi.number().min(0).max(100).optional(),
      startDate: Joi.date().allow(null).optional(),
      endDate: Joi.date().allow(null).optional(),
    });

    const productSchema = Joi.object({
      discount: discountSchema,
      _id: Joi.string().hex().length(24).required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      stock: Joi.number().optional(),
      category: Joi.string().required(),
      images: Joi.array().items(imageSchema).required(),
    });

    const itemSchema = Joi.object({
      product: productSchema,
      quantity: Joi.number().min(1).required(),
      _id: Joi.string().hex().length(24).required(),
    });

    const cartSchema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      user: Joi.string().hex().length(24).required(),
      items: Joi.array().items(itemSchema).required(),
      totalAmountDiscount: Joi.number().required(),
      totalAmount: Joi.number().required(),
      appliedCoupon: Joi.string().hex().length(24).allow(null).optional(),
      shippingCost: Joi.number().required(),
    }).unknown();

    const { error } = cartSchema.validate(cartObject);
    if (error) {
      console.log("🚀 ~ file: route.js:67 ~ PATCH ~ error:", error);
      const detailedErrorMessage = `${error.details[0].message} at ${error.details[0].path}`;
      throw new CustomAPIError.BadRequestError(detailedErrorMessage);
    }

    // Retrieve the order by cartId
    const order = await Order.findOne({ cartId: cartObject._id });
    if (!order) {
      throw new CustomAPIError.NotFoundError("Order not found");
    }

    // Transform cart items to order items format
    const orderItems = cartObject.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      discount: item.product.discount,
      images: item.product.images,
      quantity: item.quantity,
    }));

    // Update order with cart details
    order.items = orderItems;
    order.totalAmount = cartObject.totalAmount;
    order.totalAmountDiscount = cartObject.totalAmountDiscount;
    order.appliedCoupon = cartObject.appliedCoupon;
    order.shippingCost = cartObject.shippingCost;

    // Save the updated order
    await order.save();

    return NextResponse.json({
      status: "success",
      message: "Order successfully updated with cart details!",
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
