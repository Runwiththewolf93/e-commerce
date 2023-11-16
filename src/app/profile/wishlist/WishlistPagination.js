"use client";

import { useDispatch } from "react-redux";
import { getWishlistUser } from "../../../redux/slices/wishlistSlice";

export default function WishlistPagination({
  jwt,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  console.log(
    "🚀 ~ file: WishlistPagination.js:10 ~ WishlistPagination ~ currentPage:",
    currentPage
  );
  const dispatch = useDispatch();

  const onPageChange = newPage => {
    setCurrentPage(newPage);
    dispatch(getWishlistUser({ jwt, page: newPage, limit: 8 }));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex overflow-x-auto sm:justify-center mt-3">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map(pageNumber => (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`px-4 h-10 leading-tight ${
                  currentPage === pageNumber
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-500 bg-white hover:bg-gray-100"
                } border border-gray-300`}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className="px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
