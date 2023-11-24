"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./customStorage";
import productReducer from "./slices/productSlice";
import reviewReducer from "./slices/reviewSlice";
import wishlistReducer from "./slices/wishlistSlice";
import cartReducer from "./slices/cartSlice";
import rehydrationReducer from "./rehydrationReducer";

const persistConfig = {
  key: "root",
  storage,
  debug: true,
};

const rootReducer = combineReducers({
  _rehydrationLog: rehydrationReducer,
  products: productReducer,
  reviews: reviewReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
});
console.log(
  "Initial combined state:",
  rootReducer(undefined, { type: "@@INIT" })
);

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rehydrationLogMiddleware = store => next => action => {
  if (action.type === REHYDRATE) {
    console.log("Rehydrating entire state:", action.payload);
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(rehydrationLogMiddleware),
});
console.log("Initial state of the store:", store.getState());

// Hot Module Replacement
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./slices", () => {
    // Replace the reducers
    const newRootReducer = combineReducers({
      _rehydrationLog: require("./rehydrationReducer").default,
      products: require("./slices").default,
      reviews: require("./slices").default,
      wishlist: require("./slices").default,
      cart: require("./slices").default,
    });
    store.replaceReducer(persistReducer(persistConfig, newRootReducer));
  });
}
