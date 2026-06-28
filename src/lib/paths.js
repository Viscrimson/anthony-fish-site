const basePath = import.meta.env.BASE_URL;

export function withBase(path = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

export function normalizeContentSlug(value = "") {
  return value.replace(/\.(md|mdx)$/i, "");
}

export function fishImage(filename) {
  return withBase(`fish-images/${filename || "fish-placeholder.svg"}`);
}
