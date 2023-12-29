import { useEffect } from "react";

export function usePagination(currentPage, filteredProducts) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const productsToDisplay = filteredProducts.slice(
    (currentPage - 1) * 16,
    currentPage * 16
  );

  return { productsToDisplay };
}
