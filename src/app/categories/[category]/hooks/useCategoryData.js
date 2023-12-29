import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../../redux/slices/productSlice";
import { usePathname } from "next/navigation";

export function useCategoryData() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const link = pathname.split("/").pop();
  const { isLoadingCategory, productsCategory, errorCategory } = useSelector(
    state => state.products
  );

  const category =
    productsCategory.length > 0 ? productsCategory[0].category : "";
  const minPrice =
    productsCategory.length > 0
      ? Math.min(...productsCategory.map(p => p.price))
      : 0;
  const maxPrice =
    productsCategory.length > 0
      ? Math.max(...productsCategory.map(p => p.price))
      : 0;
  const uniquePrices = [...new Set(productsCategory.map(p => p.price))];

  useEffect(() => {
    if (!productsCategory.length) {
      dispatch(fetchCategory(link));
    }
  }, [link, dispatch, productsCategory.length]);

  return {
    isLoadingCategory,
    productsCategory,
    errorCategory,
    link,
    category,
    minPrice,
    maxPrice,
    uniquePrices,
  };
}
