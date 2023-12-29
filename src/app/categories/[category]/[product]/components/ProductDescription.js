export default function ProductDescription({ productDescription }) {
  return (
    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-12 lg:pr-8 lg:pt-6">
      <div>
        <h3 className="sr-only">Description</h3>
        <div className="space-y-6">
          <p className="text-base text-gray-900">{productDescription}</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

        <div className="mt-4">
          <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
            <li className="text-gray-400">
              <span className="text-gray-600">Lorem ipsum dolor sit amet.</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">Lorem ipsum dolor sit amet.</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">Lorem ipsum dolor sit amet.</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">Lorem ipsum dolor sit amet.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-gray-900">Details</h2>

        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600 line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
            nisi repudiandae consequuntur aut ipsum asperiores eveniet nesciunt
            vero hic distinctio assumenda, veritatis fugiat temporibus sint.
          </p>
        </div>
      </div>
    </div>
  );
}
