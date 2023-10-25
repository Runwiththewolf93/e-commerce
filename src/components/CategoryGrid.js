/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const categories = [
  {
    category: "Electronics",
    link: "electronics",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Electronics.png",
  },
  {
    category: "Clothing",
    link: "clothing",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Clothing.png",
  },
  {
    category: "Home & Garden",
    link: "home-garden",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Home-Garden.png",
  },
  {
    category: "Books",
    link: "books",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Books.png",
  },
  {
    category: "Health & Beauty",
    link: "health-beauty",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Health-Beauty.png",
  },
  {
    category: "Sports",
    link: "sports",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Sports.png",
  },
  {
    category: "Toys",
    link: "toys",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Toys.png",
  },
  {
    category: "Cars & Motorcycles",
    link: "cars-motorcycles",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Cars-Motorcycles.png",
  },
  {
    category: "Groceries & Food",
    link: "groceries-food",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Groceries-Food.png",
  },
  {
    category: "Office Supplies & Stationery",
    link: "office-supplies-stationery",
    url: "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/productCategories/Office-supplies-Stationery.png",
  },
];

export default function CategoryGrid() {
  return (
    <section className="overflow-x-auto pb-3">
      <h1 className="text-2xl font-bold mb-4 ml-4">Shop by Category</h1>
      <div className="grid grid-flow-col auto-cols-min gap-4 mx-4">
        {categories.map((item, index) => (
          <Link href={`/categories/${item.link}`} key={index}>
            <div className="card w-64 bg-base-100 shadow-xl image-full">
              <figure className="relative h-32 w-full">
                <img
                  className="absolute inset-0 object-cover w-full h-full"
                  src={item.url}
                  alt={item.category}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-white text-xl font-bold text-center z-10">
                    {item.category}
                  </h2>
                </div>
              </figure>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
