export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const getErrorMessage = (data: unknown) => {
  if (typeof data !== "object" || data === null || !("message" in data))
    return "请求失败!";

  if (typeof data.message === "string") return data.message;

  if (Array.isArray(data.message)) return data.message.join(",");

  return "请求失败!";
};
