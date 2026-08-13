import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api/server";
import type { AuthUser } from "./types";

export async function requireAdmin(): Promise<AuthUser> {
  const response = await serverFetch("/auth/me");

  if (response.status === 401 || response.status === 403) {
    redirect("/admin/login");
  }

  if (!response.ok) {
    throw new Error("无法验证登录状态!");
  }

  const user = (await response.json()) as AuthUser;

  if (user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
}
