import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublicArticles } from "@/app/article/server";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function Home() {
  const { items } = await getPublicArticles({ pageNumber: 1, pageSize: 20 });

  return (
    <main className="min-h-svh bg-black px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="py-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-serif text-3xl">Articles</h2>
            <span className="font-mono text-xs text-white/35">
              {items.length} POSTS
            </span>
          </div>
          <div className="border-y border-white/10">
            {items.length === 0 ? (
              <p className="py-16 text-sm text-white/45">
                还没有已发布的文章。
              </p>
            ) : (
              items.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="group flex items-start justify-between gap-6 border-b border-white/10 py-6 last:border-0"
                >
                  <div>
                    <h3 className="font-serif text-2xl transition group-hover:text-emerald-300">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                        {article.excerpt}
                      </p>
                    )}
                    <p className="mt-4 font-mono text-[11px] tracking-wide text-white/35">
                      {dateFormatter.format(
                        new Date(article.publishedAt ?? article.updatedAt),
                      )}{" "}
                      · {article.author.username}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-white/40 transition group-hover:text-emerald-300" />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
