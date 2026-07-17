import { compactStrings, hasText } from "./content-display.js";
import { normalizeContentSlug, withBase } from "./paths.js";

const collator = new Intl.Collator("en", {
  sensitivity: "base",
});

const fishPublishFields = [
  "commonName",
  "scientificName",
  "origin",
  "temperatureRange",
  "adultSize",
  "tankSize",
  "foodRecommendation",
  "difficulty",
  "temperament",
  "mainImage",
  "juvenileImage",
  "maleImage",
  "femaleImage",
];

const fishSearchFields = [
  "commonName",
  "scientificName",
  "origin",
  "temperatureRange",
  "adultSize",
  "tankSize",
  "foodRecommendation",
  "difficulty",
  "temperament",
  "plantSafe",
  "invertebrateSafe",
  "juvenileAppearance",
  "adultMaleAppearance",
  "adultFemaleAppearance",
  "husbandryNotes",
  "qrSummary",
];

const noteSearchFields = [
  "title",
  "category",
  "summary",
  "quickAnswer",
  "visualNote",
  "illustrationsDataTechnique",
];

function toSearchIndex(values) {
  return compactStrings(values).join(" ").toLowerCase().replace(/\s+/g, " ").trim();
}

function isRenderableFish(entry) {
  return fishPublishFields.every((field) => hasText(entry.data[field]));
}

export function buildFishPages(entries) {
  return entries
    .filter((entry) => !entry.data.draft && isRenderableFish(entry))
    .map((entry) => {
      const slug = normalizeContentSlug(entry.id);

      return {
        ...entry.data,
        searchIndex: toSearchIndex([
          ...fishSearchFields.map((field) => entry.data[field]),
          ...compactStrings(entry.data.quickWarnings),
          entry.data.plantSafe ? "plant safe" : "",
          entry.data.invertebrateSafe ? "invertebrate safe" : "",
          entry.body,
        ]),
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
    .filter((entry) => entry.data.draft !== true)
    .map((entry) => {
      const slug = normalizeContentSlug(entry.id);

      return {
        ...entry.data,
        searchIndex: toSearchIndex([
          ...noteSearchFields.map((field) => entry.data[field]),
          ...compactStrings(entry.data.tags),
          ...compactStrings(entry.data.practicalSteps),
          ...compactStrings(entry.data.pictorialSteps),
          ...compactStrings(entry.data.sources),
          entry.body,
        ]),
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

export function resolveRelatedPages(entries, slugs, excludeSlug = "") {
  const wanted = compactStrings(slugs).map((slug) => normalizeContentSlug(slug));

  if (!wanted.length) {
    return [];
  }

  const relatedBySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const seen = new Set();
  const related = [];

  for (const slug of wanted) {
    if (!slug || slug === excludeSlug || seen.has(slug)) {
      continue;
    }

    const entry = relatedBySlug.get(slug);

    if (!entry) {
      continue;
    }

    related.push(entry);
    seen.add(slug);
  }

  return related;
}
