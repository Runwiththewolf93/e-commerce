import { useState, useEffect, useMemo } from "react";

export function useProductFilteringAndSorting(
  productsCategory,
  triggerValue,
  sortOption,
  setCurrentPage,
  minPrice
) {
  // For testing purposes only
  const duplicatedProducts = useMemo(() => {
    const generateObjectID = () => {
      return Math.random().toString(16).substr(2, 24);
    };

    const formattedCurrentDate = new Date().toISOString();

    const duplicates = Array(15)
      .fill(productsCategory)
      .flat()
      .map(product => {
        const newProduct = { ...product, _id: generateObjectID() };

        // Set stock to 0 with a 20% chance
        if (Math.random() < 0.2) {
          newProduct.stock = 0;
        }

        // Set the createdAt date for all duplicates to the current date
        newProduct.createdAt = formattedCurrentDate;

        return newProduct;
      });

    // Combine the original and duplicated products
    return [...productsCategory, ...duplicates];
  }, [productsCategory]);
  // For testing purposes only

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(filteredProducts.length / 16)
  );

  useEffect(() => {
    let newFilteredProducts = [...duplicatedProducts];

    // Filtering
    if (triggerValue !== null) {
      newFilteredProducts = newFilteredProducts.filter(product => {
        return product.price >= minPrice && product.price <= triggerValue;
      });
    }

    // Sorting
    switch (sortOption) {
      case "Newest":
        newFilteredProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "PriceLowToHigh":
        newFilteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "PriceHighToLow":
        newFilteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(newFilteredProducts);
    setTotalPages(Math.ceil(newFilteredProducts.length / 16));
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerValue, sortOption]);

  return { filteredProducts, totalPages };
}
