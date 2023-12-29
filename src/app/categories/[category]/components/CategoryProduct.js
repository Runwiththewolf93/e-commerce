/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function CategoryProduct({ product, link }) {
  return (
    <Link
      key={product._id}
      href={product.stock === 0 ? "#" : `/categories/${link}/${product._id}`}
      className="group"
      onClick={e => {
        if (product.stock === 0) {
          e.preventDefault();
        }
      }}
    >
      <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black opacity-70 flex items-center justify-center">
            <span className="text-white text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      {product.discount?.percentage ? (
        <div className="mt-1">
          <del className="text-red-500 text-lg">
            €{product.price.toFixed(2)}
          </del>
          <span className="text-green-500 text-lg font-medium ml-2">
            €
            {(product.price * (1 - product.discount.percentage / 100)).toFixed(
              2
            )}
          </span>
        </div>
      ) : (
        <p className="mt-1 text-lg font-medium text-gray-900">
          €{product.price.toFixed(2)}
        </p>
      )}
    </Link>
  );
}
