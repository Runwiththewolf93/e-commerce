export default function ProductPrice({ productWithDiscount }) {
  return (
    <>
      <h2 className="sr-only">Product information</h2>
      {!productWithDiscount?.discount ? (
        <p className="text-3xl tracking-tight text-gray-900">
          €{productWithDiscount?.price}
        </p>
      ) : (
        <div className="flex items-center">
          <del className="text-3xl tracking-tight text-red-600 mr-3">
            €{productWithDiscount?.price}
          </del>
          <p className="text-3xl tracking-tight text-green-600">
            €
            {Math.round(
              productWithDiscount?.price *
                (1 - productWithDiscount?.discount?.percentage / 100)
            )}
          </p>
        </div>
      )}
    </>
  );
}
