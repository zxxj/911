import { generateHTML } from "@tiptap/html/server";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { StarterKit } from "@tiptap/starter-kit";
import type { ArticleContent } from "@/app/article/types";
import { toTiptapContent } from "@/lib/article-content";
import { lowlight } from "@/lib/tiptap-lowlight";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "";

const extensions = [
  StarterKit.configure({ codeBlock: false }),
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: { class: "article-image" },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Typography,
  Highlight.configure({ multicolor: true }),
  Superscript,
  Subscript,
];

type HighlightNode = {
  children?: HighlightNode[];
  properties?: { className?: string[] };
  value?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

function highlightNodes(nodes: HighlightNode[]): string {
  return nodes
    .map((node) => {
      if (typeof node.value === "string") return escapeHtml(node.value);

      const content = highlightNodes(node.children ?? []);
      const className = node.properties?.className?.join(" ");
      return className ? `<span class="${className}">${content}</span>` : content;
    })
    .join("");
}

function getCodeBlocks(nodes: ArticleContent): ArticleContent {
  return nodes.flatMap((node) => [
    ...(node.type === "codeBlock" ? [node] : []),
    ...(node.content ? getCodeBlocks(node.content) : []),
  ]);
}

function getText(nodes: ArticleContent): string {
  return nodes
    .map((node) => `${node.text ?? ""}${node.content ? getText(node.content) : ""}`)
    .join("");
}

function highlightCodeBlocks(html: string, content: ArticleContent) {
  const codeBlocks = getCodeBlocks(content);
  let index = 0;

  return html.replace(/<pre><code(?: class="[^"]*")?>[\s\S]*?<\/code><\/pre>/g, (block) => {
    const codeBlock = codeBlocks[index++];
    if (!codeBlock) return block;

    const text = getText(codeBlock.content ?? []);
    const language = typeof codeBlock.attrs?.language === "string" ? codeBlock.attrs.language : "";
    const result = language && lowlight.registered(language)
      ? lowlight.highlight(language, text)
      : lowlight.highlightAuto(text);

    return block.replace(/<code([^>]*)>[\s\S]*?<\/code>/, (_, attributes) => {
      const className = /class="([^"]*)"/.exec(attributes)?.[1] ?? "";
      const classes = ["hljs", ...className.split(" ").filter(Boolean)].join(" ");

      return `<code${attributes.replace(/class="[^"]*"/, "")} class="${classes}">${highlightNodes(result.children as HighlightNode[])}<\/code>`;
    });
  });
}

function withApiOrigin(content: ArticleContent): ArticleContent {
  return content.map((node) => ({
    ...node,
    attrs:
      node.type === "image" && typeof node.attrs?.src === "string"
        ? {
            ...node.attrs,
            src: node.attrs.src.startsWith("http")
              ? node.attrs.src
              : `${apiOrigin}${node.attrs.src}`,
          }
        : node.attrs,
    content: node.content ? withApiOrigin(node.content) : node.content,
  }));
}

export function PublicArticleContent({ content }: { content: ArticleContent }) {
  const document = withApiOrigin(toTiptapContent(content));
  const html = highlightCodeBlocks(
    generateHTML(
      { type: "doc", content: document },
      extensions,
    ),
    document,
  );

  return (
    <div
      className="article-content tiptap"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
