"use client";

import { BiCategoryAlt } from "react-icons/bi";

export default function Drawer() {
  return (
    <div className="drawer relative z-50">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="flex-none">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <BiCategoryAlt className="w-6 h-6" />
          </label>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-white">
          <li>
            <a>Electronics</a>
          </li>
          <li>
            <a>Clothing</a>
          </li>
          <li>
            <a>Home & Garden</a>
          </li>
          <li>
            <a>Books</a>
          </li>
          <li>
            <a>Health and Beauty</a>
          </li>
          <li>
            <a>Sports</a>
          </li>
          <li>
            <a>Toys</a>
          </li>
          <li>
            <a>Cars & Motorcycles</a>
          </li>
          <li>
            <a>Groceries & Food</a>
          </li>
          <li>
            <a>Office Supplies & Stationery</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
