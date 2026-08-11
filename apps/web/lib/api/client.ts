import { APIError, getErrorMessage } from "./error";
import { Options } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) throw new Error("缺少NEXT_PUBLIC_API_URL环境变量!");

const request = async <T>(
  path: string,
  method: string,
  body?: unknown,
  options: Options = {},
) => {
  const { params, headers, cache, ...init } = options;
  const url = new URL(path, baseURL);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const requestHeaders = new Headers(headers);

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...init,
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    cache: cache ?? "no-cache",
  });

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) throw new APIError(response.status, getErrorMessage(data));

  return data as T;
};

export const api = {
  get<T>(path: string, options?: Options) {
    return request<T>(path, "GET", undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: Options) {
    return request<T>(path, "POST", body, options);
  },

  patch<T>(path: string, body?: unknown, options?: Options) {
    return request<T>(path, "PATCH", body, options);
  },

  delete<T>(path: string, options?: Options) {
    return request<T>(path, "DELETE", undefined, options);
  },
};
