"use client";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      console.log(`[Storage] Getting item with key: ${_key}`);
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      console.log(`[Storage] Setting item with key: ${_key}, value: ${value}`);
      return Promise.resolve(value);
    },
    removeItem(_key) {
      console.log(`[Storage] Removing item with key: ${_key}`);
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
