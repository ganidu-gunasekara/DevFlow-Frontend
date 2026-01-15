import { useAuthStore } from "./auth/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: any;
  retry?: boolean;
};

export async function apiFetch(path: string, options: ApiOptions) {
  const { headers, body, retry = true, ...rest } = options;

  const token = useAuthStore.getState().accessToken;
  const apiHeaders = new Headers(headers);
  if (token) {
    apiHeaders.set("Authorization", `Bearer ${token}`);
  }
  if (rest.method != "GET") {
    apiHeaders.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: apiHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: rest.credentials ?? "include",
  });

  if (res.status === 401 && retry) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        useAuthStore.getState().setAccessToken(refreshData.access_token);
        useAuthStore.getState().setAuth(refreshData.access_token, refreshData.user);
        return apiFetch(path, { ...options, retry: false });
      } else {
        useAuthStore.getState().clearAuth();
        throw new Error("UNAUTHENTICATED");
      }
    } catch {
      useAuthStore.getState().clearAuth();
      throw new Error("UNAUTHENTICATED");
    }
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
}
