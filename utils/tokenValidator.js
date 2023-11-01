"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";

export default function TokenValidator() {
  const [isValidToken, setIsValidToken] = useState(true);
  const [isSessionAvailable, setIsSessionAvailable] = useState(false);
  const { data: session } = useSession();

  const token = session?.customJwt;

  useEffect(() => {
    if (session) {
      setIsSessionAvailable(true);
    }
  }, [session]);

  useEffect(() => {
    const validateToken = () => {
      if (!isSessionAvailable) {
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
  }, [isSessionAvailable, token]);

  useEffect(() => {
    if (!isValidToken && isSessionAvailable) {
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidToken, isSessionAvailable]);
}
