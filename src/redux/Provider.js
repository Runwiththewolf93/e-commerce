"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

/**
 * Renders a provider component with the given children.
 *
 * @param {Object} props - The properties for the Providers component.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {ReactNode} The rendered Provider component.
 */
function ReduxProvider({ children }) {
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default ReduxProvider;
