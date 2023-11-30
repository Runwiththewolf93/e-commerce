import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../../redux/slices/cartSlice";

export default function CartQuantity({ cartItem, jwt }) {
  const dispatch = useDispatch();
  const { isLoadingAddCart, isLoadingDeleteCart } = useSelector(
    state => state.cart
  );
  console.log(
    "🚀 ~ file: CartQuantity.js:2 ~ CartQuantity ~ cartItem:",
    cartItem
  );

  const handleQuantityChange = newQuantity => {
    if (newQuantity > 0 && newQuantity <= cartItem.product.stock) {
      // Product from props, use addToCart or deleteFromCart
      if (newQuantity > cartItem.quantity) {
        dispatch(
          addToCart({
            productId: cartItem.product._id,
            quantity: newQuantity - cartItem.quantity,
            jwt,
          })
        );
      } else {
        dispatch(
          deleteFromCart({
            productId: cartItem.product._id,
            quantity: cartItem.quantity - newQuantity,
            jwt,
          })
        );
      }
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(cartItem.quantity + 1);
  };

  const decrementQuantity = () => {
    console.log("is this being called?");
    handleQuantityChange(cartItem.quantity - 1);
  };

  return (
    <div className="inline-flex items-center px-4 font-semibold text-gray-500 border border-gray-200 rounded-md dark:border-gray-700 ">
      <button
        className="py-2 hover:text-gray-700 dark:text-gray-400"
        disabled={isLoadingAddCart || isLoadingDeleteCart}
        onClick={decrementQuantity}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-dash"
          viewBox="0 0 16 16"
        >
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
        </svg>
      </button>
      <input
        type="number"
        className="w-12 px-2 py-4 text-center border-0 rounded-md dark:bg-gray-800 bg-gray-50 dark:text-gray-400 md:text-right"
        placeholder="1"
        value={cartItem.quantity}
        onChange={e => handleQuantityChange(parseInt(e.target.value, 10))}
        min="1"
        max={cartItem.product.stock}
        disabled
      />
      <button
        className="py-2 hover:text-gray-700 dark:text-gray-400"
        disabled={
          cartItem.quantity === cartItem.product.stock ||
          isLoadingAddCart ||
          isLoadingDeleteCart
        }
        onClick={incrementQuantity}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </button>
    </div>
  );
}
