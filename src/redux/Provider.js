"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useIsClient } from "../lib/is-client-ctx";

/**
 * Renders a provider component with the given children.
 *
 * @param {Object} props - The properties for the Providers component.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {ReactNode} The rendered Provider component.
 */
function ReduxProvider({ children }) {
  const isClient = useIsClient();
  let persistor = isClient ? persistStore(store) : null;

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}

export default ReduxProvider;
