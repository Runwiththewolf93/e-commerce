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

// const persistConfig = {
//   key: "root",
//   storage,
//   debug: true,
// };

const productPersistConfig = {
  key: "products",
  storage,
  debug: true,
};

const reviewPersistConfig = {
  key: "reviews",
  storage,
  debug: true,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  debug: true,
};

const cartPersistConfig = {
  key: "products",
  storage,
  debug: true,
};

const persistedProductReducer = persistReducer(
  productPersistConfig,
  productReducer
);
const persistedReviewReducer = persistReducer(
  reviewPersistConfig,
  reviewReducer
);
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const rootReducer = combineReducers({
  products: persistedProductReducer,
  reviews: persistedReviewReducer,
  wishlist: persistedWishlistReducer,
  cart: persistedCartReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
