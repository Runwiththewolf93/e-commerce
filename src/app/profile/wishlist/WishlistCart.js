import { useDispatch, useSelector } from "react-redux";
import { Button, Alert } from "flowbite-react";
import { deleteFromWishlist } from "@/redux/slices/wishlistSlice";
import {
  addToCart,
  clearErrorMessage as clearCartErrorMessages,
} from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function WishlistCart({
  jwt,
  productId,
  clearErrorMessages: clearWishlistErrorMessages,
}) {
  const dispatch = useDispatch();
  const { isLoadingWishlistDelete, errorWishlistDelete } = useSelector(
    state => state.wishlist
  );
  const { isLoadingAddCart, errorAddCart } = useSelector(state => state.cart);
  const router = useRouter();

  const handleAddToCartAndDeleteFromWishlist = async () => {
    await Promise.all([
      dispatch(addToCart({ jwt, productId, quantity: 1 })).unwrap(),
      dispatch(deleteFromWishlist({ jwt, productId })).unwrap(),
    ]);

    router.push("/cart");
  };

  return (
    <div>
      <Button
        color="blue"
        className="w-full"
        onClick={handleAddToCartAndDeleteFromWishlist}
        disabled={isLoadingWishlistDelete || isLoadingAddCart}
      >
        <span className="text-base">Add to cart</span>
      </Button>
      {(errorAddCart || errorWishlistDelete) && (
        <Alert
          color="failure"
          className="mt-2"
          onDismiss={() => {
            dispatch(clearWishlistErrorMessages());
            dispatch(clearCartErrorMessages());
          }}
        >
          {errorAddCart || errorWishlistDelete}
        </Alert>
      )}
    </div>
  );
}
