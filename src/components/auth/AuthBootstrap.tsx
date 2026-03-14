"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/lib/auth/authStore";

export default function AuthBootstrap() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        setAccessToken(data.accessToken);
        setAuth(data.accessToken, data.user);
      } catch {
        clearAuth();
      } finally {
        setAuthReady(true);
      }
    })();
  }, [setAccessToken, clearAuth]);

  return null;
}
