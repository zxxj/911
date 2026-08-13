"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Send, Trash2, Undo2 } from "lucide-react";
import { articleApi } from "@/app/article/api";
import type {
  ArticleContent,
  ArticleDetail,
  ArticleInput,
  ArticleItem,
} from "@/app/article/types";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { APIError } from "@/lib/api";

const emptyContent: ArticleContent = [{ type: "paragraph" }];

type ArticleForm = ArticleInput;

type ArticlesTableProps = {
  items: ArticleItem[];
};

function getErrorMessage(error: unknown) {
  return error instanceof APIError ? error.message : "操作失败，请稍后重试!";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: ArticleItem["status"] }) {
  return status === "PUBLISHED" ? (
    <Badge>已发布</Badge>
  ) : (
    <Badge variant="secondary">草稿</Badge>
  );
}

export function ArticlesTable({ items }: ArticlesTableProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ArticleDetail>();
  const [articleToDelete, setArticleToDelete] = useState<ArticleItem>();
  const [form, setForm] = useState<ArticleForm>({
    title: "",
    excerpt: "",
    content: emptyContent,
  });

  const refresh = () => router.refresh();

  const openCreate = () => {
    setError(undefined);
    setSelected(undefined);
    setForm({ title: "", excerpt: "", content: emptyContent });
    setEditorOpen(true);
  };

  const loadArticle = async (article: ArticleItem, mode: "view" | "edit") => {
    try {
      setBusy(true);
      setError(undefined);
      const detail = await articleApi.detail(article.id);
      setSelected(detail);

      if (mode === "view") {
        setDetailOpen(true);
      } else {
        setForm({
          title: detail.title,
          excerpt: detail.excerpt ?? "",
          content: detail.content,
        });
        setEditorOpen(true);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setBusy(true);
      setError(undefined);
      const input = {
        ...form,
        title: form.title.trim(),
        excerpt: form.excerpt?.trim() || undefined,
      };

      if (selected) {
        await articleApi.update(selected.id, input);
      } else {
        await articleApi.create(input);
      }

      setEditorOpen(false);
      refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (article: ArticleItem) => {
    try {
      setBusy(true);
      setError(undefined);
      await articleApi.updateStatus(
        article.id,
        article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
      );
      refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!articleToDelete) return;

    try {
      setBusy(true);
      setError(undefined);
      await articleApi.remove(articleToDelete.id);
      setDeleteOpen(false);
      refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">文章管理</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          新建文章
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>最后更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  暂无文章。
                </TableCell>
              </TableRow>
            ) : (
              items.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-80 truncate font-medium">
                    {article.title}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={article.status} />
                  </TableCell>
                  <TableCell>{article.author.username}</TableCell>
                  <TableCell>{formatDate(article.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => loadArticle(article, "view")}
                        aria-label="查看文章"
                        title="查看文章"
                        disabled={busy}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => loadArticle(article, "edit")}
                        aria-label="编辑文章"
                        title="编辑文章"
                        disabled={busy}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateStatus(article)}
                        aria-label={
                          article.status === "PUBLISHED"
                            ? "撤回文章"
                            : "发布文章"
                        }
                        title={
                          article.status === "PUBLISHED"
                            ? "撤回文章"
                            : "发布文章"
                        }
                        disabled={busy}
                      >
                        {article.status === "PUBLISHED" ? <Undo2 /> : <Send />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setArticleToDelete(article);
                          setDeleteOpen(true);
                        }}
                        aria-label="删除文章"
                        title="删除文章"
                        disabled={busy}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="flex max-h-[95vh]! max-w-[70vw]! flex-col gap-0 overflow-hidden p-0">
          <form
            id="article-form"
            onSubmit={save}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DialogHeader className="shrink-0 border-b px-6 py-5 pr-12">
              <DialogTitle>{selected ? "编辑文章" : "新建文章"}</DialogTitle>
              <DialogDescription className="sr-only">
                编辑文章内容
              </DialogDescription>
              <div className="space-y-2 pt-2">
                <Label htmlFor="article-title">标题</Label>
                <Input
                  id="article-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  maxLength={255}
                  required
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="article-excerpt">摘要</Label>
                <Textarea
                  id="article-excerpt"
                  value={form.excerpt}
                  onChange={(event) =>
                    setForm({ ...form, excerpt: event.target.value })
                  }
                  maxLength={500}
                />
              </div>
            </DialogHeader>

            <div className="flex min-h-0 flex-1 flex-col px-6 py-4">
              <SimpleEditor
                key={selected?.id ?? "new"}
                initialValue={form.content}
                onChange={(content) =>
                  setForm((current) => ({ ...current, content }))
                }
                scrollable
              />
            </div>

            <DialogFooter className="mx-0 mb-0 shrink-0">
              <Button type="submit" disabled={busy}>
                {busy ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.excerpt ?? "暂无摘要"}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <SimpleEditor
              key={selected.id}
              initialValue={selected.content}
              readOnly
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除文章？</AlertDialogTitle>
            <AlertDialogDescription>
              “{articleToDelete?.title}”将被永久删除，无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={remove}
              disabled={busy}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
