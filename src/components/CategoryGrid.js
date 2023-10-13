/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Health & Beauty",
  "Sports",
  "Toys",
  "Cars & Motorcycles",
  "Groceries & Food",
  "Office Supplies & Stationery",
];

export default function CategoryGrid() {
  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Shop by Category</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {categories.map((category, index) => (
          <Link
            href={`/category/${category}`}
            key={index}
            className="relative w-64"
          >
            <div className="card card-compact w-64 bg-base-100 shadow-xl relative">
              <figure className="relative h-32 w-full">
                <div className="absolute inset-0 bg-gray-300">
                  <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src={`/${category}.jpg`}
                    alt={category}
                  />
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-xl font-bold">{category}</h2>
                  </div>
                </div>
              </figure>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
