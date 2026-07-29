import { getCollection } from "astro:content";
import { buildFishPages, buildNotePages } from "../lib/content-pages.js";
import { withBase } from "../lib/paths.js";

const siteUrl = "https://aquatictreasuresoffortmyers.com";

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const fishPages = buildFishPages(await getCollection("fish"));
  const notePages = buildNotePages(await getCollection("notes"));
  const paths = [
    withBase(),
    withBase("fish/"),
    withBase("notes/"),
    ...fishPages.map((entry) => entry.url),
    ...notePages.map((entry) => entry.url),
  ];
  const urls = [...new Set(paths)].map((path) => {
    const location = escapeXml(new URL(path, siteUrl).toString());

    return `  <url><loc>${location}</loc></url>`;
  });
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
