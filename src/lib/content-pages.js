import { normalizeContentSlug, withBase } from "./paths.js";

const collator = new Intl.Collator("en", {
  sensitivity: "base",
});

export function buildFishPages(entries) {
  return entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => {
      const slug = normalizeContentSlug(entry.id);

      return {
        ...entry.data,
        label: entry.data.commonName,
        slug,
        url: withBase(`fish/${slug}/`),
      };
    })
    .sort((left, right) => {
      const nameOrder = collator.compare(left.commonName, right.commonName);

      return nameOrder || left.slug.localeCompare(right.slug);
    });
}

export function buildNotePages(entries) {
  return entries
    .map((entry) => {
      const slug = normalizeContentSlug(entry.id);

      return {
        ...entry.data,
        label: entry.data.title,
        slug,
        url: withBase(`notes/${slug}/`),
      };
    })
    .sort((left, right) => {
      const dateOrder = right.date.getTime() - left.date.getTime();

      return dateOrder || collator.compare(left.title, right.title) || left.slug.localeCompare(right.slug);
    });
}

export function getCollectionNeighbors(entries, slug) {
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index < 0) {
    return {
      previous: null,
      next: null,
    };
  }

  return {
    previous: entries[index - 1] ?? null,
    next: entries[index + 1] ?? null,
  };
}
