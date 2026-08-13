import { serverFetch } from "@/lib/api/server";
import type {
  ArticleDetail,
  ArticleListResponse,
  ListArticleInput,
} from "./types";

const getArticles = async (path: string, input: ListArticleInput) => {
  const params = new URLSearchParams();

  if (input.status) {
    params.set("status", input.status);
  }

  params.set("pageNumber", String(input.pageNumber ?? 1));
  params.set("pageSize", String(input.pageSize ?? 10));

  const response = await serverFetch(`${path}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("无法加载文章列表!");
  }

  return response.json() as Promise<ArticleListResponse>;
};

export const getAdminArticles = (input: ListArticleInput) =>
  getArticles("/admin/articles", input);

export const getPublicArticles = (input: Omit<ListArticleInput, "status">) =>
  getArticles("/articles", input);

export const getPublicArticle = async (id: string) => {
  const response = await serverFetch(`/articles/${id}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("无法加载文章!");
  }

  return response.json() as Promise<ArticleDetail>;
};
