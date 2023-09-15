"use client";

import { Provider } from "react-redux";
import { store } from "./store";

/**
 * Renders a provider component with the given children.
 *
 * @param {Object} props - The properties for the Providers component.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {ReactNode} The rendered Provider component.
 */
function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
