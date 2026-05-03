"use client";

import { useAuthStore } from "@/src/lib/auth/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAuthStore((s) => s.accessToken);
  const ready = useAuthStore((s) => s.isAuthReady);

  useEffect(() => {
    console.log("ready "+ ready);
    console.log("token "+ token)
    if (ready && !token) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, token, router, pathname]); 

  if (!ready) return null;
  if (!token) return null;
  return <>{children}</>;
}
