"use client";

import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PURGE } from "redux-persist";

const PurgeContext = createContext();

export const PurgeProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePurge = () => {
      console.log("Purge event handled");
      dispatch({
        type: PURGE,
        key: "root",
        result: () => console.log("Purge successful"),
      });
    };

    window.addEventListener("purgeStore", handlePurge);

    return () => {
      window.removeEventListener("purgeStore", handlePurge);
    };
  }, [dispatch]);

  return <PurgeContext.Provider value={{}}>{children}</PurgeContext.Provider>;
};
