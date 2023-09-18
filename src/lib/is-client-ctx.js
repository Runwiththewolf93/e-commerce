"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const IsClientCtx = createContext(false);

export const IsClientCtxProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <IsClientCtx.Provider value={isClient}>{children}</IsClientCtx.Provider>
  );
};

export function useIsClient() {
  return useContext(IsClientCtx);
}
