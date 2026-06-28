const basePath = import.meta.env.BASE_URL;

export function withBase(path = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

export function normalizeContentSlug(value = "") {
  return value.replace(/\.(md|mdx)$/i, "");
}

function publicImage(folder, filename, fallback) {
  const value = (filename || fallback)
    .replace(/^\/+/, "")
    .replace(/^public\//i, "");
  const imagePath = value.startsWith(`${folder}/`) ? value : `${folder}/${value}`;

  return withBase(imagePath);
}

export function fishImage(filename) {
  return publicImage("fish-images", filename, "fish-placeholder.svg");
}

export function noteImage(filename) {
  return publicImage("note-images", filename, "note-placeholder.svg");
}
