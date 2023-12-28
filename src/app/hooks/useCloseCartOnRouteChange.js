import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCartOverlay } from "../../redux/slices/cartSlice";
import { usePathname } from "next/navigation";

export const useCloseCartOnRouteChange = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isCartOpen = useSelector(state => state.cart.isCartOpen);

  useEffect(() => {
    if (isCartOpen) {
      dispatch(closeCartOverlay());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
};
