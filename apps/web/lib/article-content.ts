import type { ArticleContent } from "@/app/article/types";

type LegacyNode = {
  children?: LegacyNode[];
  indent?: number;
  listStyleType?: string;
  text?: string;
  type?: string;
  url?: string;
  [key: string]: unknown;
};

const legacyTypes = new Set(["p", "h1", "h2", "h3", "img", "code_block"]);

function convertNode(node: LegacyNode): LegacyNode {
  if (typeof node.text === "string") {
    const marks = [
      node.bold && { type: "bold" },
      node.italic && { type: "italic" },
      node.underline && { type: "underline" },
      node.strikethrough && { type: "strike" },
      node.code && { type: "code" },
    ].filter(Boolean);

    return { type: "text", text: node.text, ...(marks.length && { marks }) };
  }

  if (node.type === "img") {
    return { type: "image", attrs: { src: node.url ?? "" } };
  }

  if (node.type === "code_block") {
    return {
      type: "codeBlock",
      content: [{
        type: "text",
        text: node.children?.map((line) => line.children?.map((child) => child.text ?? "").join("") ?? "").join("\n") ?? "",
      }],
    };
  }

  const heading = /^h([1-6])$/.exec(node.type ?? "");
  const type = node.type === "p" ? "paragraph" : heading ? "heading" : node.type;
  const content = node.children?.map(convertNode);
  return {
    ...(type && { type }),
    ...(heading && { attrs: { level: Number(heading[1]) } }),
    ...(content?.length && { content }),
  };
}

function convertNodes(nodes: LegacyNode[]) {
  const content: LegacyNode[] = [];

  for (let index = 0; index < nodes.length; ) {
    const node = nodes[index];
    if (node.type !== "p" || !node.listStyleType || node.indent) {
      content.push(convertNode(node));
      index += 1;
      continue;
    }

    const listStyleType = node.listStyleType;
    const items: LegacyNode[] = [];
    while (
      index < nodes.length &&
      nodes[index].type === "p" &&
      nodes[index].listStyleType === listStyleType &&
      !nodes[index].indent
    ) {
      items.push({
        type: "listItem",
        content: [convertNode(nodes[index])],
      });
      index += 1;
    }

    content.push({
      type: listStyleType === "decimal" || listStyleType === "ol"
        ? "orderedList"
        : "bulletList",
      content: items,
    });
  }

  return content;
}

export function toTiptapContent(content: ArticleContent): ArticleContent {
  const nodes = content as LegacyNode[];
  if (!nodes.some((node) => legacyTypes.has(node.type ?? ""))) return content;

  return convertNodes(nodes) as ArticleContent;
}
