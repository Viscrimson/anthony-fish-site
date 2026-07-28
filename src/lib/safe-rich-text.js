import { markdownToHast } from "satteri";

const allowedTags = new Set([
  "a",
  "blockquote",
  "br",
  "del",
  "em",
  "h3",
  "h4",
  "hr",
  "li",
  "ol",
  "p",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const safeHref = (value) => {
  const href = String(value ?? "").trim();

  if (!href) return null;

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("./") ||
    href.startsWith("../")
  ) {
    return href;
  }

  try {
    const { protocol } = new URL(href);

    return ["http:", "https:", "mailto:"].includes(protocol) ? href : null;
  } catch {
    return null;
  }
};

const renderNodes = (nodes) => nodes.map(renderNode).join("");

const renderNode = (node) => {
  if (node.type === "text") return escapeHtml(node.value);
  if (node.type !== "element") return "";

  const content = renderNodes(node.children ?? []);

  // These care-note fields are prose, not code documentation. Older entries
  // contain indented paragraphs, which Markdown interprets as code blocks.
  // Render them as ordinary paragraphs instead of inheriting code styling.
  if (node.tagName === "pre") return `<p>${content}</p>`;
  if (node.tagName === "code") return content;

  if (!allowedTags.has(node.tagName)) return content;
  if (node.tagName === "br" || node.tagName === "hr") return `<${node.tagName}>`;

  if (node.tagName === "a") {
    const href = safeHref(node.properties?.href);

    if (!href) return content;

    const opensNewTab = /^https?:\/\//i.test(href);
    const externalAttributes = opensNewTab
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    return `<a href="${escapeHtml(href)}"${externalAttributes}>${content}</a>`;
  }

  return `<${node.tagName}>${content}</${node.tagName}>`;
};

export function renderSafeRichText(value) {
  const markdown = String(value ?? "").trim();

  if (!markdown) return "";

  try {
    return renderNodes(markdownToHast(markdown).children ?? []);
  } catch {
    return `<p>${escapeHtml(markdown)}</p>`;
  }
}
