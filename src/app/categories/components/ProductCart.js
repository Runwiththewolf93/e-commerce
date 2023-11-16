"use client";

import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import styles from "./ProductCart.module.css";

export default function ProductCart({ product, jwt }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = newQuantity => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  return (
    <div>
      <div className="flex items-center p-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-2 text-gray-600 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={quantity === 1}
        >
          <HiMinusSm />
        </button>
        <input
          type="number"
          className={`w-12 text-center border-t border-b ${styles["quantity-input"]}`}
          value={quantity}
          onChange={e => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          max={product.stock}
        />
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 text-gray-600 border rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={quantity === product.stock}
        >
          <HiPlusSm />
        </button>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={addToCart}
      >
        Add to cart
      </button>
    </div>
  );
}
