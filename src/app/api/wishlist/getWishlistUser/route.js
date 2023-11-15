import Wishlist from "../../../../../models/WishList";
import Product from "../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";

export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    const userId = req.user.id;
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 8;

    // Find wishlist of user
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return NextResponse.json({ message: "No wishlist found" });
    }

    const skip = (page - 1) * limit;
    const totalCount = wishlist.products.length;

    // Manually paginate the products array
    const paginatedProductIds = wishlist.products
      .slice(skip, skip + limit)
      .map(item => item.productId);

    // Populate the details of the paginated products
    const populatedProducts = await Product.find({
      _id: { $in: paginatedProductIds },
    }).select("name description price discount images");

    // Reconstruct the products array to nest populated products under productId
    const reconstructedProducts = paginatedProductIds.map(productId => {
      const productDetails = populatedProducts.find(p =>
        p._id.equals(productId)
      );
      return { productId: productDetails };
    });

    return NextResponse.json({
      status: "success",
      wishlist: { ...wishlist.toObject(), products: reconstructedProducts },
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
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
