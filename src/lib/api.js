"use client";

import axios from "axios";
import axiosRetry from "axios-retry";
import { signOut } from "next-auth/react";

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
    alert("Your session has expired or is invalid. Please log in again.");

    await signOut({ callbackUrl: "http://localhost:3000/login" });
    localStorage.removeItem("persist:root");

    const event = new CustomEvent("purgeStore");
    window.dispatchEvent(event);

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
