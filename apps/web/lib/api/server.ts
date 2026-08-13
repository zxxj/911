import { headers } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("缺少 NEXT_PUBLIC_API_URL 环境变量!");
}

export const serverFetch = async (path: string, init: RequestInit = {}) => {
  const requestHeaders = new Headers(init.headers);
  const cookie = (await headers()).get("cookie");

  if (cookie) {
    requestHeaders.set("cookie", cookie);
  }

  return fetch(new URL(path, baseURL), {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });
};
