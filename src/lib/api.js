"use client";

import axios from "axios";
import axiosRetry from "axios-retry";
import { signOut } from "next-auth/react";
import { store } from "../redux/store";
import { PURGE } from "redux-persist";

// Optional request interceptor
const requestInterceptor = (config, token) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor
const responseInterceptor = async error => {
  if (error.response && error.response.status === 401) {
    await signOut({ callbackUrl: "http://localhost:3000/login" });
    localStorage.removeItem("persist:root");
    store.dispatch({ type: PURGE, key: "root", result: () => null });
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

const customAxios = (token = null) => {
  const instance = axios.create({
    baseURL: "http://localhost:3000",
  });

  axiosRetry(instance, { retries: 3 });

  instance.interceptors.request.use(
    config => requestInterceptor(config, token),
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response,
    error => responseInterceptor(error)
  );

  return instance;
};

export default customAxios;
