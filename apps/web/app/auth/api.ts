import { api } from "@/lib/api";
import { AuthUser, LoginInput } from "./types";

export const login = (input: LoginInput) => {
  return api.post<AuthUser>("/auth/login", input);
};

export const getCurrentUser = () => {
  return api.get<AuthUser>("/auth/me");
};

export const logout = () => {
  return api.post<void>("/auth/logout");
};
