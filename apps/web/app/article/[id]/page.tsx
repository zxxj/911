import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicArticle } from "@/app/article/server";
import { PublicArticleContent } from "@/components/public-article-content";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" });

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getPublicArticle(id);
  if (!article) notFound();

  return (
    <main className="min-h-svh bg-black px-5 py-8 text-white sm:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-wide text-white/50 transition hover:text-white"><ArrowLeft className="size-4" /> 返回文章列表</Link>
        <header className="border-b border-white/10 py-16">
          <p className="font-mono text-xs tracking-wide text-emerald-300">{dateFormatter.format(new Date(article.publishedAt ?? article.updatedAt))} · {article.author.username}</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">{article.title}</h1>
          {article.excerpt && <p className="mt-6 text-lg leading-8 text-white/60">{article.excerpt}</p>}
        </header>
        <div className="py-12"><PublicArticleContent content={article.content} /></div>
      </article>
    </main>
  );
}
