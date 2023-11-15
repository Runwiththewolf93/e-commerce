import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiHeart } from "react-icons/hi";
import { deleteFromWishlist } from "../../../redux/slices/wishlistSlice";

export default function WishlistCheck({ productId, jwt }) {
  const dispatch = useDispatch();
  const {
    isLoadingWishlistDelete,
    messageWishlistDelete,
    errorWishlistDelete,
  } = useSelector(state => state.wishlist);

  const deleteProductFromWishlistHandler = () => {
    dispatch(deleteFromWishlist({ productId, jwt }));
  };

  return (
    <div className="absolute right-0 top-0">
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-200 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:cursor-pointer"
        disabled={isLoadingWishlistDelete}
        onClick={deleteProductFromWishlistHandler}
      >
        <HiHeart className="text-red-600" />
      </button>
    </div>
  );
}
