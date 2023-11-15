import Wishlist from "../../../../../models/WishList";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";

export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    const userId = req.user.id;

    // Find wishlist of user
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "products.productId",
      model: "Product",
      select: "name description price discount images",
    });

    if (!wishlist) {
      return NextResponse.json({ message: "No wishlist found" });
    }

    return NextResponse.json({ status: "success", wishlist });
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
