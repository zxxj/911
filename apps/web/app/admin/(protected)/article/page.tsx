import Link from "next/link";
import { getAdminArticles } from "@/app/article/server";
import { ArticlesTable } from "@/components/articles-table";
import { Button } from "@/components/ui/button";

const pageSize = 10;

function getPageNumber(page: string | undefined) {
  const value = Number(page);

  return Number.isSafeInteger(value) && value > 0 ? value : 1;
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = getPageNumber(page);
  const { items, total, totalPages } = await getAdminArticles({
    pageNumber,
    pageSize,
  });

  return (
    <main className="space-y-6 p-6">
      <ArticlesTable items={items} />
      <p className="text-sm text-muted-foreground">共 {total} 篇文章</p>
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={pageNumber === 1}
            render={<Link href={`/admin/article?page=${pageNumber - 1}`} />}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {pageNumber} / {totalPages} 页
          </span>
          <Button
            variant="outline"
            disabled={pageNumber === totalPages}
            render={<Link href={`/admin/article?page=${pageNumber + 1}`} />}
          >
            下一页
          </Button>
        </div>
      )}
    </main>
  );
}
