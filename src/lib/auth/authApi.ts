
import { LoginFormValues, RegisterFormValues } from "@/src/lib/auth/authValidation";
import { apiFetch } from "../apiClients";

type RegisterResponse = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  access_token: string;
  user: any;
};

export async function registerUser(
  data: RegisterFormValues
): Promise<RegisterResponse> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: data,
  });
}

export async function loginUser(
  data: LoginFormValues
): Promise<LoginResponse> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: data,
    credentials : 'include'
  });
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return apiFetch("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
}

export async function logoutUser(): Promise<{ message: string }> {
  return apiFetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}