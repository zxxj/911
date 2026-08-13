import { api } from "@/lib/api";
import type {
  ArticleDetail,
  ArticleInput,
  ArticleStatus,
} from "./types";

export const articleApi = {
  detail: (id: string) => api.get<ArticleDetail>(`/admin/articles/${id}`),
  create: (input: ArticleInput) => api.post("/admin/articles", input),
  update: (id: string, input: Partial<ArticleInput>) =>
    api.patch(`/admin/articles/${id}`, input),
  updateStatus: (id: string, status: ArticleStatus) =>
    api.patch(`/admin/articles/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/admin/articles/${id}`),
  uploadImage: (file: File) => {
    const data = new FormData();
    data.set("file", file);

    return api.post<{ path: string }>("/admin/uploads/images", data);
  },
};
