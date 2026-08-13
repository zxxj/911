import type { JSONContent } from "@tiptap/core";

export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type ArticleAuthor = {
  id: string;
  username: string;
};

export type ArticleItem = {
  id: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ArticleAuthor;
};

export type ArticleContent = JSONContent[];

export type ArticleDetail = ArticleItem & {
  authorId: string;
  content: ArticleContent;
};

export type ArticleInput = {
  title: string;
  excerpt?: string;
  content: ArticleContent;
};

export type ArticleListResponse = {
  items: ArticleItem[];
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListArticleInput = {
  status?: ArticleStatus;
  pageNumber?: number;
  pageSize?: number;
};
