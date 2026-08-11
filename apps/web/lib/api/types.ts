export type QueryValue = string | number | boolean | null | undefined;

export type Options = Omit<RequestInit, "body" | "method" | "credentials"> & {
  params?: Record<string, QueryValue>;
};
