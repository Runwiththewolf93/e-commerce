"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { PURGE } from "redux-persist";

export default function TokenValidator() {
  const [isValidToken, setIsValidToken] = useState(true);
  const [isSessionAvailable, setIsSessionAvailable] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const token = session?.customJwt;

  useEffect(() => {
    if (session) {
      setIsSessionAvailable(true);
    }
  }, [session]);

  useEffect(() => {
    const validateToken = () => {
      if (!isSessionAvailable) {
        localStorage.removeItem("persist:root");
        dispatch({ type: PURGE, key: "root", result: () => null });
        return;
      }

      if (!token) {
        setIsValidToken(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setIsValidToken(false);
      } else {
        setIsValidToken(true);
      }
    };

    validateToken();

    const intervalId = setInterval(() => {
      validateToken();
    }, 3600000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionAvailable, token]);

  useEffect(() => {
    if (!isValidToken && isSessionAvailable) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("persist:root");
      dispatch({ type: PURGE, key: "root", result: () => null });
      window.location.href = "/login";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidToken, isSessionAvailable]);
}
